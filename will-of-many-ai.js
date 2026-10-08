(function (root, rules) {
  'use strict';

  if (!rules || !rules.farmProductionByLevel) {
    throw new Error('WillOfManyRules.farmProductionByLevel must be loaded before the AI.');
  }
  var farmProductionByLevel = rules.farmProductionByLevel;
  var weights = { g: 1, f: 7, e: 42, d: 210, c: 840, b: 2520, a: 5040 };
  var strongestToWeakest = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  var opposite = { orange: 'blue', blue: 'orange' };

  // Tunable strategy weights/priorities, overridable via will-of-many-ai-config.json
  // (loaded by the game client and applied through WillOfManyAI.setConfig). These only
  // affect AI decision preferences, never the game's real economy (piece/move/promotion
  // costs), which remain fixed game rules defined further below.
  var DEFAULT_CONFIG = {
    maxActionsPerTurn: 35,
    layerBalanceMinRatio: 0.5,
    weakOuterLayerBuyRatio: 0.5,
    recycleCoinThresholdByLayer: { 8: 25, 7: 80, 6: 400, 5: 800 },
    highBalanceTurnRule: {
      enabled: true,
      minimumStartingCoins: 800,
      recycleByLayer: { 8: ['g', 'f'], 7: ['g'] },
      prohibitPurchasesByLayer: { 8: ['g', 'f'], 7: ['g'] }
    },
    conquestPriority: { baseWeight: 1.0, weightPerRegionDeficit: 0.5, maxWeight: 6.0 },
    conquestCostHeuristic: { freeRegionCost: 2, sufficientForceRatioCost: 4 },
    wheat: { seekFarmsWhenDeficit: true },
    desirability: {
      baseScoreByLayer: {
      8: { free: 50, allied: 30, enemy: 150 },
      7: { free: 40, allied: 25, enemy: 105 },
      6: { free: 35, allied: 20, enemy: 75 },
      5: { free: 25, allied: 15, enemy: 55 },
      4: { free: 20, allied: 10, enemy: 35 },
      3: { free: 15, allied: 8, enemy: 25 },
      2: { free: 10, allied: 5, enemy: 20 },
      1: { free: 5, allied: 2, enemy: 10 }
      },
      relativeStrengthBands: [
        { maxPercent: 4, allied: 50, enemy: 0 },
        { maxPercent: 25, allied: 40, enemy: 0 },
        { maxPercent: 50, allied: 20, enemy: 5 },
        { maxPercent: 75, allied: 10, enemy: 10 },
        { maxPercent: 100, allied: 0, enemy: 20 },
        { maxPercent: 130, allied: -10, enemy: 40 },
        { maxPercent: 170, allied: -20, enemy: 60 },
        { maxPercent: 230, allied: -40, enemy: 80 },
        { maxPercent: 300, allied: -60, enemy: 90 },
        { maxPercent: 400, allied: -80, enemy: 100 },
        { maxPercent: 600, allied: -100, enemy: 200 },
        { maxPercent: 800, allied: -150, enemy: 300 },
        { maxPercent: 1200, allied: -250, enemy: 400 },
        { maxPercent: null, allied: -400, enemy: 600 }
      ],
      farmBonusByLevel: { 1: 30, 2: 50, 3: 80, 4: 100, 5: 150 },
      wheatDeficitFarmBonus: 100,
      unsupportedNeighborBonus: 40,
      troopRatioByOuterLayer: { 8: 8, 7: 7, 6: 6, 5: 5, 4: 4, 3: 3, 2: 2 },
      troopDeficitBonus: 100,
      external: { logBase: 2, offset: 2, distanceScale: 1, exponent: 2 },
      penalties: {
        inaccessible: {
          amount: 20,
          durationTurns: 5,
          label: 'Inacessibilidade',
          description: 'Sem vizinhos de rank igual ou imediatamente adjacente.'
        },
        unavailableAction: {
          amount: 20,
          durationTurns: 5,
          label: 'Ação temporariamente inviável',
          description: 'Há vizinhos de rank elegível, mas nenhuma ação legal e viável no momento.'
        }
      }
    },
    recycling: { availableCoinFraction: 0.01, minimumStageGap: 2 }
  };
  var config = mergeConfig(DEFAULT_CONFIG, {});
  var desirabilityPenalties = Object.create(null);
  var previousPenaltyTurn = null;

  function object(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  }

  function mergeConfig(base, overrides) {
    var merged = {};
    Object.keys(object(base)).forEach(function (key) {
      var baseValue = base[key];
      var overrideValue = object(overrides)[key];
      merged[key] = (baseValue && typeof baseValue === 'object' && !Array.isArray(baseValue))
        ? mergeConfig(baseValue, overrideValue)
        : (overrideValue !== undefined ? overrideValue : baseValue);
    });
    return merged;
  }

  function setConfig(overrides) {
    config = mergeConfig(DEFAULT_CONFIG, overrides);
    return config;
  }

  function getConfig() {
    return config;
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function getRegionLayer(code) {
    var match = /^L(\d+)-\d+$/.exec(String(code));
    return match ? Number(match[1]) : 0;
  }

  function getRegionOwner(snapshot, code, team, human) {
    var region = object(object(snapshot.regions)[code]);
    var owner = region.dominator || region.owner;
    if (owner === team || owner === human || owner === 'free') return owner;
    var pieces = object(object(snapshot.regionPiecesByRegion)[code]);
    if (Number(object(pieces[team]).g) > 0 ||
        Number(object(pieces[team]).f) > 0 ||
        Number(object(pieces[team]).e) > 0 ||
        Number(object(pieces[team]).d) > 0 ||
        Number(object(pieces[team]).c) > 0 ||
        Number(object(pieces[team]).b) > 0 ||
        Number(object(pieces[team]).a) > 0) return team;
    if (Number(object(pieces[human]).g) > 0 ||
        Number(object(pieces[human]).f) > 0 ||
        Number(object(pieces[human]).e) > 0 ||
        Number(object(pieces[human]).d) > 0 ||
        Number(object(pieces[human]).c) > 0 ||
        Number(object(pieces[human]).b) > 0 ||
        Number(object(pieces[human]).a) > 0) return human;
    return owner || 'free';
  }

  function getSnapshotSoldiers(snapshot, code, side) {
    var piecesByRegion = object(snapshot.regionPiecesByRegion);
    var region = object(piecesByRegion[code] || object(snapshot.regions)[code]);
    var pieces = object(region.pieces || region.pieceCounts || region);
    var sidePieces = object(pieces[side]);
    var total = Object.keys(weights).reduce(function (sum, stage) {
      return sum + Math.max(0, Number(sidePieces[stage]) || 0) * weights[stage];
    }, 0);
    if (total > 0) return total;
    var regionData = object(object(snapshot.regions)[code]);
    return Math.max(0, Number(regionData[side + 'Force'] !== undefined
      ? regionData[side + 'Force']
      : regionData[side]) || 0);
  }

  function getSnapshotNeighbors(snapshot, code) {
    var cache = object(snapshot.regionNeighborCache || snapshot.regionNeighbors ||
      snapshot.neighbors);
    var entry = object(cache[code] || object(object(snapshot.regions)[code]).neighbors);
    var result = [];
    ['left', 'right', 'sameRank', 'superior', 'inferior'].forEach(function (key) {
      var value = entry[key];
      if (Array.isArray(value)) result = result.concat(value);
      else if (typeof value === 'string') result.push(value);
    });
    return result.filter(function (neighbor, index) {
      return typeof neighbor === 'string' && neighbor !== code &&
        result.indexOf(neighbor) === index;
    });
  }

  function getSnapshotFreeUnits(snapshot, code, side) {
    var forceStats = object(object(snapshot.regionForceStats)[code]);
    var teamStats = object(object(forceStats.byTeam)[side]);
    var value = teamStats.unidades_livres_temp;
    if (value !== undefined) return Math.max(0, Number(value) || 0);
    return Math.max(0, Number(forceStats.unidades_livres_temp) || 0);
  }

  function getSnapshotWheatBalance(snapshot, team) {
    var totals = object(snapshot.wheatTotalsByTeam)[team] ||
      object(snapshot.wheatTotals)[team];
    if (totals && Number.isFinite(Number(totals.production)) &&
        Number.isFinite(Number(totals.consumption))) {
      return Number(totals.production) - Number(totals.consumption);
    }
    return 0;
  }

  function getFarmLevel(region) {
    var explicitLevel = Number(region.farmLevel);
    if (Number.isFinite(explicitLevel) && explicitLevel > 0) {
      return Math.min(5, Math.floor(explicitLevel));
    }
    var production = Math.max(0, Number(region.farmProductionPerTurn) || 0);
    if (!production) return 0;
    return Object.keys(farmProductionByLevel).map(Number).sort(function (first, second) {
      return first - second;
    }).find(function (level) {
      return production <= Number(farmProductionByLevel[level]);
    }) || 5;
  }

  function getActivePenaltyEntries(snapshot) {
    snapshot = object(snapshot);
    var turn = Number.isFinite(Number(snapshot.currentTurn))
      ? Number(snapshot.currentTurn)
      : 0;
    if (previousPenaltyTurn !== null && turn < previousPenaltyTurn) {
      desirabilityPenalties = Object.create(null);
    }
    previousPenaltyTurn = turn;
    var active = {};
    Object.keys(desirabilityPenalties).forEach(function (code) {
      desirabilityPenalties[code] = desirabilityPenalties[code].filter(function (entry) {
        return entry.expiresTurn > turn;
      });
      active[code] = desirabilityPenalties[code].map(function (entry) {
        return {
          type: entry.type,
          label: entry.label,
          description: entry.description,
          amount: entry.amount
        };
      });
      if (!desirabilityPenalties[code].length) delete desirabilityPenalties[code];
    });
    return active;
  }

  function getPenaltyTotals(entriesByRegion) {
    var totals = {};
    Object.keys(entriesByRegion).forEach(function (code) {
      totals[code] = entriesByRegion[code].reduce(function (sum, entry) {
        return sum + entry.amount;
      }, 0);
    });
    return totals;
  }

  function calculateCurrentDesirability(snapshot, settings) {
    var activePenalties = getActivePenaltyEntries(snapshot);
    return calculateDesirability(
      snapshot,
      settings,
      getPenaltyTotals(activePenalties),
      activePenalties
    );
  }

  function calculateDesirability(snapshot, settings, penaltyTotals, penaltyEntries) {
    snapshot = object(snapshot);
    settings = object(settings || config.desirability);
    penaltyTotals = object(penaltyTotals);
    penaltyEntries = object(penaltyEntries);
    var team = snapshot.aiTeam || snapshot.aiPlayer || snapshot.team || snapshot.currentTeam;
    var human = snapshot.humanTeam === opposite[team] ? snapshot.humanTeam : opposite[team];
    var regions = object(snapshot.regions);
    var codes = Object.keys(regions);
    Object.keys(object(snapshot.regionPiecesByRegion)).forEach(function (code) {
      if (codes.indexOf(code) === -1) codes.push(code);
    });
    Object.keys(object(snapshot.allRegionMasks)).forEach(function (layerKey) {
      Object.keys(object(snapshot.allRegionMasks[layerKey])).forEach(function (regionKey) {
        var code = 'L' + layerKey + '-' + regionKey;
        if (codes.indexOf(code) === -1) codes.push(code);
      });
    });

    var relativeBands = Array.isArray(settings.relativeStrengthBands)
      ? settings.relativeStrengthBands
      : [];
    var baseScores = object(settings.baseScoreByLayer);
    var rankTotals = {};
    var occupiedCounts = {};
    var teamRankTotals = {};
    var scores = {};
    codes.forEach(function (code) {
      var rank = getRegionLayer(code);
      if (!rank) return;
      var aiSoldiers = getSnapshotSoldiers(snapshot, code, team);
      var humanSoldiers = getSnapshotSoldiers(snapshot, code, human);
      var troopTotal = aiSoldiers + humanSoldiers;
      var owner = getRegionOwner(snapshot, code, team, human);
      rankTotals[rank] = (rankTotals[rank] || 0) + troopTotal;
      if (owner === team || owner === human) {
        occupiedCounts[rank] = (occupiedCounts[rank] || 0) + 1;
      }
      teamRankTotals[rank] = teamRankTotals[rank] || { ai: 0, human: 0 };
      teamRankTotals[rank].ai += aiSoldiers;
      teamRankTotals[rank].human += humanSoldiers;
      scores[code] = {
        code: code,
        layer: rank,
        owner: owner,
        soldiers: troopTotal,
        internal: Number(object(baseScores[rank])[owner === team
          ? 'allied'
          : owner === human ? 'enemy' : 'free']) || 0,
        internalBreakdown: [],
        external: 0,
        externalContributions: {},
        total: 0
      };
      var ownershipLabel = owner === team
        ? 'aliada'
        : owner === human ? 'inimiga' : 'livre';
      scores[code].internalBreakdown.push({
        label: 'Base L' + rank + ' ' + ownershipLabel,
        value: scores[code].internal
      });
    });

    var rankDeficits = {};
    var ratios = object(settings.troopRatioByOuterLayer);
    Object.keys(ratios).map(Number).forEach(function (outerLayer) {
      var innerLayer = outerLayer - 1;
      var ratio = Number(ratios[outerLayer]);
      var outerTotal = Number(object(teamRankTotals[outerLayer]).ai) || 0;
      var innerTotal = Number(object(teamRankTotals[innerLayer]).ai) || 0;
      var shortfall = Math.max(0, ratio * innerTotal - outerTotal);
      if (ratio > 0 && shortfall > 0) {
        rankDeficits[outerLayer] = shortfall;
      }
    });

    var wheatDeficit = snapshot.wheatEnabled === true &&
      getSnapshotWheatBalance(snapshot, team) < 0;
    var farmBonuses = object(settings.farmBonusByLevel);
    var wheatFarmBonus = Number(settings.wheatDeficitFarmBonus) || 0;
    var unsupportedBonus = Number(settings.unsupportedNeighborBonus) || 0;
    var rankDeficitBonus = Number(settings.troopDeficitBonus) || 0;
    Object.keys(scores).forEach(function (code) {
      var score = scores[code];
      var count = Number(occupiedCounts[score.layer]) || 0;
      var total = Number(rankTotals[score.layer]) || 0;
      if ((score.owner === team || score.owner === human) && count > 0 && total > 0) {
        var relativePercent = score.soldiers * count / total * 100;
        var band = relativeBands.find(function (entry) {
          return entry.maxPercent === null ||
            relativePercent <= Number(entry.maxPercent);
        });
        if (band) {
          var relativeAdjustment = Number(band[score.owner === team ? 'allied' : 'enemy']) || 0;
          score.internal += relativeAdjustment;
          if (relativeAdjustment !== 0) {
            score.internalBreakdown.push({
              label: 'Força relativa do rank (' + Number(relativePercent.toFixed(2)) + '%)',
              value: relativeAdjustment
            });
          }
        }
      }

      var region = object(regions[code]);
      var farmProduction = Math.max(0, Number(region.farmProductionPerTurn) || 0);
      if (farmProduction > 0) {
        var farmLevel = getFarmLevel(region);
        var farmBonus = Number(farmBonuses[farmLevel]) || 0;
        score.internal += farmBonus;
        if (farmBonus !== 0) {
          score.internalBreakdown.push({
            label: 'Fazenda nível ' + farmLevel,
            value: farmBonus
          });
        }
        if (wheatDeficit) {
          score.internal += wheatFarmBonus;
          if (wheatFarmBonus !== 0) {
            score.internalBreakdown.push({
              label: 'Déficit de trigo',
              value: wheatFarmBonus
            });
          }
        }
      }
      if (rankDeficits[score.layer]) {
        score.internal += rankDeficitBonus;
        if (rankDeficitBonus !== 0) {
          score.internalBreakdown.push({
            label: 'Déficit de tropas no rank L' + score.layer +
              ' (' + Number(rankDeficits[score.layer].toFixed(2)) + ' unidades)',
            value: rankDeficitBonus
          });
        }
      }
      var supportNeighbors = getSnapshotNeighbors(snapshot, code).filter(function (neighbor) {
        return getRegionLayer(neighbor) === score.layer - 1 &&
          getSnapshotFreeUnits(snapshot, neighbor, team) > 0;
      });
      var supportBonus = supportNeighbors.length * unsupportedBonus;
      score.internal += supportBonus;
      if (supportBonus !== 0) {
        score.internalBreakdown.push({
          label: 'Falta de suporte (' + supportNeighbors.length + ' vizinhos)',
          value: supportBonus
        });
      }
      var penalty = Number(penaltyTotals[code]) || 0;
      score.internal += penalty;
      if (penalty !== 0) {
      (Array.isArray(penaltyEntries[code]) ? penaltyEntries[code] : []).forEach(function (entry) {
          score.internalBreakdown.push({
            type: entry.type,
            label: 'Penalidade: ' + entry.label,
            description: entry.description,
            value: entry.amount
          });
        });
      }
    });

    var points = codes.map(function (code) {
      var region = object(regions[code]);
      return {
        code: code,
        x: Number(region.centerX),
        y: Number(region.centerY)
      };
    }).filter(function (point) {
      return Number.isFinite(point.x) && Number.isFinite(point.y);
    });
    Object.keys(scores).forEach(function (code) {
    scores[code].total = scores[code].internal;
    });
    var maxDistance = 0;
    for (var first = 0; first < points.length; first += 1) {
      for (var second = first + 1; second < points.length; second += 1) {
        maxDistance = Math.max(maxDistance, Math.hypot(
          points[first].x - points[second].x,
          points[first].y - points[second].y
        ));
      }
    }
    var externalSettings = object(settings.external);
    var logBase = Number(externalSettings.logBase) || 2;
    var logDenominator = Math.log(logBase);
    var offset = Number(externalSettings.offset) || 2;
    var distanceScale = Number(externalSettings.distanceScale) || 1;
    var exponent = Number(externalSettings.exponent) || 2;
    if (maxDistance > 0 && logDenominator > 0 && distanceScale > 0) {
      var pointsByCode = {};
      points.forEach(function (point) { pointsByCode[point.code] = point; });
      Object.keys(scores).forEach(function (targetCode) {
        var targetPoint = pointsByCode[targetCode];
        if (!targetPoint) return;
        scores[targetCode].external = Object.keys(scores).reduce(function (sum, sourceCode) {
          if (sourceCode === targetCode) return sum;
          var sourcePoint = pointsByCode[sourceCode];
          if (!sourcePoint) {
            scores[targetCode].externalContributions[sourceCode] = 0;
            return sum;
          }
          var distance = Math.hypot(
            sourcePoint.x - targetPoint.x,
            sourcePoint.y - targetPoint.y
          );
          var normalizedDistance = Math.min(1, distance / maxDistance);
          var logArgument = offset - normalizedDistance / distanceScale;
          var contribution = logArgument <= 0
            ? 0
            : Math.pow(Math.log(logArgument) / logDenominator, exponent) *
              scores[sourceCode].internal;
          scores[targetCode].externalContributions[sourceCode] = contribution;
          return sum + contribution;
        }, 0);
        scores[targetCode].total =
          scores[targetCode].internal + scores[targetCode].external;
      });
    } else {
      Object.keys(scores).forEach(function (code) {
        scores[code].total = scores[code].internal;
      });
    }
    return {
      regions: scores,
      rankTotals: rankTotals,
      occupiedCounts: occupiedCounts,
      teamRankTotals: teamRankTotals,
      rankDeficits: rankDeficits,
      maxDistance: maxDistance
    };
  }

  function chooseAction(snapshot) {
    snapshot = object(snapshot);
    var team = snapshot.aiTeam || snapshot.aiPlayer || snapshot.team || snapshot.currentTeam;
    if (team !== 'orange' && team !== 'blue') return { type: 'pass' };
    var human = snapshot.humanTeam === opposite[team] ? snapshot.humanTeam : opposite[team];
    var piecesByRegion = object(snapshot.regionPiecesByRegion);
    var regions = object(snapshot.regions);
    var neighbors = object(snapshot.regionNeighborCache || snapshot.regionNeighbors || snapshot.neighbors);
    var blockedMoves = Array.isArray(snapshot.blockedMoves) ? snapshot.blockedMoves : [];
    var createdPieces = Array.isArray(snapshot.createdPieces) ? snapshot.createdPieces : [];
    var regionForceStats = object(snapshot.regionForceStats);
    var regionForceBonusFactors = object(snapshot.regionForceBonusFactors);
    var codes = Object.keys(piecesByRegion);

    Object.keys(regions).forEach(function (code) {
      if (codes.indexOf(code) === -1) codes.push(code);
    });
    Object.keys(object(snapshot.allRegionMasks)).forEach(function (layerKey) {
      Object.keys(object(snapshot.allRegionMasks[layerKey])).forEach(function (regionKey) {
        var code = 'L' + layerKey + '-' + regionKey;
        if (codes.indexOf(code) === -1) codes.push(code);
      });
    });

    function teamPieces(code, side) {
      var region = object(piecesByRegion[code] || regions[code]);
      var contents = object(region.pieces || region.pieceCounts || region);
      return object(contents[side]);
    }

    function force(code, side) {
      var pieces = teamPieces(code, side);
      var total = Object.keys(weights).reduce(function (sum, stage) {
        var amount = Number(pieces[stage]);
        return sum + (Number.isFinite(amount) && amount > 0 ? amount * weights[stage] : 0);
      }, 0);
      if (total) return total;
      var stats = object(object(snapshot.regionStats)[code] || regions[code]);
      var fallback = Number(stats[side]);
      return Number.isFinite(fallback) && fallback > 0 ? fallback : 0;
    }

    function stageCounts(code, side) {
      var contents = teamPieces(code, side);
      var result = {};
      Object.keys(weights).forEach(function (stage) {
        var amount = Number(contents[stage]);
        result[stage] = Number.isFinite(amount) && amount > 0 ? amount : 0;
      });
      return result;
    }

    function mergeStageCounts(counts) {
      var thresholds = { g: 7, f: 6, e: 5, d: 4, c: 3, b: 2 };
      var order = ['g', 'f', 'e', 'd', 'c', 'b'];
      order.forEach(function (stage) {
        while (counts[stage] >= thresholds[stage]) {
          counts[stage] -= thresholds[stage];
          var nextStage = stage === 'g' ? 'f' : stage === 'f' ? 'e' :
            stage === 'e' ? 'd' : stage === 'd' ? 'c' : stage === 'c' ? 'b' : 'a';
          counts[nextStage] += 1;
        }
      });
      return counts;
    }

    function buildStageCounts(total) {
      var result = { g: 0, f: 0, e: 0, d: 0, c: 0, b: 0, a: 0 };
      var remaining = Math.max(0, Math.floor(Number(total) || 0));
      strongestToWeakest.forEach(function (stage) {
        result[stage] = Math.floor(remaining / weights[stage]);
        remaining %= weights[stage];
      });
      return mergeStageCounts(result);
    }

    function compositionGap(counts) {
      var presentRanks = strongestToWeakest
        .map(function (stage, rank) { return counts[stage] > 0 ? rank : -1; })
        .filter(function (rank) { return rank >= 0; });
      return presentRanks.length > 1
        ? Math.max.apply(null, presentRanks) - Math.min.apply(null, presentRanks)
        : 0;
    }

    function hasValidComposition(counts) {
      return compositionGap(counts) <= 1;
    }

    function hasForbiddenThreeFAndG(counts) {
      return Number(counts.f) >= 3 && Number(counts.g) > 0;
    }

    function pieceCount(counts) {
      var merged = mergeStageCounts(Object.assign({}, counts));
      return Object.keys(weights).reduce(function (total, stage) {
        return total + merged[stage];
      }, 0);
    }

    function regionPieceLimit(code) {
      var limits = object(snapshot.regionPieceLimits);
      var limit = Number(limits[code]);
      return Number.isFinite(limit) && limit >= 0 ? limit : (layer(code) === 8 ? 8 : 0);
    }

    function compositionAfterPurchase(code, side, stage) {
      var counts = stageCounts(code, side);
      counts[stage] += 1;
      return mergeStageCounts(counts);
    }

    function compositionAfterTransfer(code, side, amount, adding) {
      var total = force(code, side) + (adding ? amount : -amount);
      return buildStageCounts(total);
    }

    function transferPreservesComposition(source, target, side, amount) {
      var currentSource = stageCounts(source, side);
      var currentTarget = stageCounts(target, side);
      var nextSource = compositionAfterTransfer(source, side, amount, false);
      var nextTarget = compositionAfterTransfer(target, side, amount, true);
      var sourceRemovesForbiddenG = hasForbiddenThreeFAndG(currentSource) &&
        nextSource.g < currentSource.g;
      var targetCompactsForbiddenG = hasForbiddenThreeFAndG(currentTarget) &&
        nextTarget.g < currentTarget.g &&
        nextTarget.f > currentTarget.f;
      return (hasValidComposition(currentSource) || sourceRemovesForbiddenG) &&
        (hasValidComposition(nextSource) || sourceRemovesForbiddenG) &&
        hasValidComposition(nextTarget) &&
        (!hasForbiddenThreeFAndG(nextTarget) || targetCompactsForbiddenG) &&
        (currentTarget.f < 3 || targetCompactsForbiddenG);
    }

    function layer(code) {
      var match = /^L(\d+)-(\d+)$/.exec(code);
      return match ? Number(match[1]) : 0;
    }

    function getMaxMovableSoldiers(source, target) {
      var available = force(source, team);
      var reverseMoves = blockedMoves.filter(function (move) {
        return move && move.source === target && move.target === source;
      });
      if (!reverseMoves.length) return available;

      var lockedSoldiers = 0;
      for (var index = 0; index < reverseMoves.length; index += 1) {
        var amount = reverseMoves[index].amount;
        if (!Number.isInteger(amount) || amount < 1) return 0;
        lockedSoldiers += amount;
      }
      return Math.max(0, available - lockedSoldiers);
    }

    function isReverseMoveBlocked(source, target, amount) {
      return (Number(amount) || 1) > getMaxMovableSoldiers(source, target);
    }

    function wasPieceCreatedThisTurn(source, stage) {
      return createdPieces.some(function (piece) {
        return piece && piece.source === source && piece.stage === stage;
      });
    }

    function adjacent(code) {
      // The real game's regionNeighborCache (built in index.html via recomputeNeighborCacheForLayer)
      // stores same-layer geometry under "sameRank", not "left"/"right". Those legacy keys are kept
      // for backward compatibility with any snapshot that still provides them.
      var entry = object(neighbors[code] || object(regions[code]).neighbors);
      var result = [];
      var hasExplicitSameLayerData = false;
      ['left', 'right', 'sameRank', 'superior', 'inferior'].forEach(function (direction) {
        var value = entry[direction];
        if (Array.isArray(value)) {
          result = result.concat(value);
          // A key that is *present* (even as an empty array) means the snapshot already
          // computed real geometry for that direction, so an empty sameRank legitimately
          // means "no same-layer neighbors" and must not trigger the ring fallback below.
          if (direction !== 'superior' && direction !== 'inferior') hasExplicitSameLayerData = true;
        } else if (typeof value === 'string') {
          result.push(value);
          if (direction !== 'superior' && direction !== 'inferior') hasExplicitSameLayerData = true;
        }
      });
      // Only fall back to a code-suffix "ring" guess when the snapshot provides no real same-layer
      // geometry at all (e.g. simplified/synthetic snapshots used in tests).
      if (!hasExplicitSameLayerData) {
        var sameLayer = codes.filter(function (candidate) {
          return layer(candidate) === layer(code);
        }).sort(function (a, b) {
          return Number(a.split('-')[1]) - Number(b.split('-')[1]);
        });
        var index = sameLayer.indexOf(code);
        if (sameLayer.length > 1 && index >= 0) {
          result.push(sameLayer[(index + sameLayer.length - 1) % sameLayer.length]);
          result.push(sameLayer[(index + 1) % sameLayer.length]);
        }
      }
      return result.filter(function (candidate, index) {
        return typeof candidate === 'string' && codes.indexOf(candidate) !== -1 &&
          candidate !== code && result.indexOf(candidate) === index;
      });
    }

    function owns(code, side) {
      var entry = object(regions[code]);
      var owner = entry.dominator || entry.owner;
      return force(code, side) > 0 || owner === side;
    }

    function finalForce(code, side) {
      var teamState = object(object(regionForceStats[code]).byTeam)[side];
      var reportedFinalForce = Number(object(teamState).forca_final);
      if (Number.isFinite(reportedFinalForce)) return reportedFinalForce;
      var bonusFactor = Number(regionForceBonusFactors[layer(code)]);
      return force(code, side) * (Number.isFinite(bonusFactor) ? bonusFactor : 1);
    }

    function distanceToRegion(source, destination) {
      if (source === destination) return 0;
      var queue = [{ code: source, distance: 0 }];
      var visited = {};
      visited[source] = true;
      for (var index = 0; index < queue.length; index += 1) {
        var current = queue[index];
        var nextRegions = adjacent(current.code).filter(function (target) {
          return layer(target) === layer(current.code) ||
            layer(target) === layer(current.code) - 1;
        });
        for (var nextIndex = 0; nextIndex < nextRegions.length; nextIndex += 1) {
          var target = nextRegions[nextIndex];
          if (visited[target]) continue;
          if (target === destination) return current.distance + 1;
          visited[target] = true;
          queue.push({ code: target, distance: current.distance + 1 });
        }
      }
      return Infinity;
    }

    function outerSoldiersForTargetLayer(targetLayer) {
      var requiredSoldiers = 1;
      for (var sourceLayer = 8; sourceLayer > targetLayer; sourceLayer -= 1) {
        requiredSoldiers *= sourceLayer + 1;
      }
      return requiredSoldiers;
    }

    var layerTotals = {};
    var teamRegionCount = 0;
    var humanRegionCount = 0;
    codes.forEach(function (code) {
      var number = layer(code);
      if (!number) return;
      layerTotals[number] = layerTotals[number] || { ai: 0, human: 0 };
      layerTotals[number].ai += force(code, team);
      layerTotals[number].human += force(code, human);
      if (owns(code, team)) teamRegionCount += 1;
      if (owns(code, human)) humanRegionCount += 1;
    });

    function keepsLayerBalance(code, loss) {
      var totals = layerTotals[layer(code)] || { ai: 0, human: 0 };
      return totals.ai - loss >= totals.human * config.layerBalanceMinRatio;
    }

    // Find wheat regions and closest path to them
    function findFarmRegions() {
      var farms = [];
      codes.forEach(function (code) {
        var regionData = object(regions[code]);
        var production = Number(regionData.farmProductionPerTurn);
        if (Number.isFinite(production) && production > 0) {
          farms.push({ code: code, production: production });
        }
      });
      return farms;
    }

    // Calculate current wheat balance. Prefer the engine's own totals (wheatTotals), since
    // the engine weighs consumption per stage (g:1, f:4, e:16, d:48, c:144, b:288, a:576 —
    // see wheatConsumptionByStage in index.html), not 1 per piece regardless of stage.
    function getWheatBalance() {
      var engineTotals = object(snapshot.wheatTotals)[team] || object(snapshot.wheatTotalsByTeam)[team];
      if (engineTotals && Number.isFinite(Number(engineTotals.production)) &&
          Number.isFinite(Number(engineTotals.consumption))) {
        var enginProduction = Number(engineTotals.production);
        var engineConsumption = Number(engineTotals.consumption);
        return {
          production: enginProduction,
          consumption: engineConsumption,
          balance: enginProduction - engineConsumption
        };
      }
      // Fallback for snapshots that don't provide wheatTotals (e.g. simplified/synthetic
      // snapshots used in tests): approximate using the same per-stage weights as the engine.
      var wheatWeights = { g: 1, f: 4, e: 16, d: 48, c: 144, b: 288, a: 576 };
      var production = 0;
      var consumption = 0;
      codes.forEach(function (code) {
        if (owns(code, team)) {
          var regionData = object(regions[code]);
          var farmProd = Number(regionData.farmProductionPerTurn);
          if (Number.isFinite(farmProd) && farmProd > 0) production += farmProd;

          var stageCnts = stageCounts(code, team);
          Object.keys(wheatWeights).forEach(function (stage) {
            consumption += stageCnts[stage] * wheatWeights[stage];
          });
        }
      });
      return { production: production, consumption: consumption, balance: production - consumption };
    }

    // Straight-line (x,y) distance between two regions' centers, as explicitly requested:
    // a "burro mas eficiente" way to estimate real proximity to a farm, since the board's
    // promotion/move adjacency graph does not represent physical closeness (it only models
    // which layer a region can advance toward, always inward).
    function euclideanDistance(sourceCode, targetCode) {
      var source = object(regions[sourceCode]);
      var target = object(regions[targetCode]);
      var sx = Number(source.centerX);
      var sy = Number(source.centerY);
      var tx = Number(target.centerX);
      var ty = Number(target.centerY);
      if (!Number.isFinite(sx) || !Number.isFinite(sy) || !Number.isFinite(tx) || !Number.isFinite(ty)) {
        return Infinity;
      }
      return Math.sqrt((sx - tx) * (sx - tx) + (sy - ty) * (sy - ty));
    }

    // Distance to a farm: prefer real (x,y) proximity (works across layers/quadrants, which
    // the inward-only BFS distanceToRegion cannot represent); fall back to the BFS hop-count
    // only when coordinates are unavailable.
    function distanceToFarm(sourceCode, farmCode) {
      var euclidean = euclideanDistance(sourceCode, farmCode);
      if (Number.isFinite(euclidean)) return euclidean;
      return distanceToRegion(sourceCode, farmCode);
    }

    // Find closest farm to owned regions
    function findClosestFarm() {
      var farms = findFarmRegions();
      if (!farms.length) return null;

      var ownedRegions = codes.filter(function (code) { return owns(code, team); });
      if (!ownedRegions.length) return null;

      var closest = null;
      var closestDistance = Infinity;

      farms.forEach(function (farm) {
        ownedRegions.forEach(function (ownedCode) {
          var dist = distanceToFarm(ownedCode, farm.code);
          if (dist < closestDistance && !owns(farm.code, team)) {
            closestDistance = dist;
            closest = { farm: farm.code, distance: dist, nearestOwned: ownedCode };
          }
        });
      });

      return closest;
    }

    // Calculate conquest priority weight based on region count difference
    function getConquestPriorityWeight() {
      var diff = humanRegionCount - teamRegionCount;
      var settings = config.conquestPriority;
      if (diff <= 0) return settings.baseWeight;
      var weight = settings.baseWeight + settings.weightPerRegionDeficit * diff;
      return Math.min(weight, settings.maxWeight);
    }

    // Calculate cost to conquer a neighbor region
    function calculateConquestCost(targetCode, sourceCode) {
      var targetOwner = object(regions[targetCode]).dominator || object(regions[targetCode]).owner;
      var isFree = !targetOwner || targetOwner === 'free';
      var costSettings = config.conquestCostHeuristic;

      if (isFree) {
        return costSettings.freeRegionCost;
      }

      var aiForce = force(sourceCode, team);
      var enemyForce = force(targetCode, human);

      if (enemyForce === 0) return costSettings.freeRegionCost;

      var sourceLayer = layer(sourceCode);
      var ratio = aiForce / enemyForce;
      // The required force ratio mirrors the engine's own promotion-budget rule
      // (promotionBudget / hasDirectRecruitmentPromotionCapacity): a region needs
      // sourceLayer times the superior-layer force before it can safely advance.
      var requiredRatio = sourceLayer;

      if (ratio >= requiredRatio) {
        return costSettings.sufficientForceRatioCost;
      }
      // Need to buy enough force to reach the required ratio, then add the flat extra cost
      var neededForce = (enemyForce * requiredRatio) - aiForce;
      var stageCost = weights.g;
      return Math.ceil(neededForce / stageCost) + costSettings.sufficientForceRatioCost;
    }

    // Sum of this team's force across every region of a given layer (same definition the
    // engine itself uses in promotionBudget/hasDirectRecruitmentPromotionCapacity).
    function layerForce(layerNumber, side) {
      return codes.reduce(function (sum, code) {
        return sum + (layer(code) === layerNumber && owns(code, side) ? force(code, side) : 0);
      }, 0);
    }

    // Find the single best next step (an owned region's neighbor) toward the wheat
    // emergency target: the one that most reduces distance-to-farm, tie-broken by
    // preferring the outer (cheaper) layer, exactly as described for the manual plan.
    function findNextWheatHop(farmTarget) {
      var best = null;
      codes.forEach(function (source) {
        if (!owns(source, team)) return;
        var sourceLayer = layer(source);
        adjacent(source).forEach(function (target) {
          if (owns(target, team)) return;
          var targetLayer = layer(target);
          var isMove = targetLayer === sourceLayer;
          var isPromotion = targetLayer === sourceLayer - 1;
          if (!isMove && !isPromotion) return;
          var distance = distanceToFarm(target, farmTarget);
          if (!Number.isFinite(distance)) return;
          if (!best || distance < best.distance ||
              (distance === best.distance && targetLayer > best.targetLayer)) {
            best = { source: source, target: target, distance: distance, targetLayer: targetLayer, isMove: isMove };
          }
        });
      });
      return best;
    }

    // Step-by-step wheat emergency planner: while wheat is in deficit, buy/advance toward
    // the closest reachable farm one action at a time (the AI turn loop re-invokes
    // chooseAction after every action, so this naturally chains into a full campaign as
    // force and territory are recomputed on each call).
    function planWheatEmergencyAction() {
      if (!config.wheat.seekFarmsWhenDeficit) return null;
      var balanceInfo = getWheatBalance();
      if (balanceInfo.balance >= 0) return null;

      var farms = findFarmRegions().filter(function (farm) { return !owns(farm.code, team); });
      if (!farms.length) return null;
      var ownedRegions = codes.filter(function (code) { return owns(code, team); });
      if (!ownedRegions.length) return null;

      var farmDistances = farms.map(function (farm) {
        var minDistance = Infinity;
        ownedRegions.forEach(function (ownedCode) {
          var distance = distanceToFarm(ownedCode, farm.code);
          if (distance < minDistance) minDistance = distance;
        });
        return { code: farm.code, distance: minDistance };
      }).filter(function (farm) { return Number.isFinite(farm.distance); });
      if (!farmDistances.length) return null;

      var minFarmDistance = Math.min.apply(null, farmDistances.map(function (farm) { return farm.distance; }));
      var closestFarms = farmDistances.filter(function (farm) { return farm.distance === minFarmDistance; });
      var farmTarget = randomItem(closestFarms).code;

      var hop = findNextWheatHop(farmTarget);
      if (!hop) return null;

      var source = hop.source;
      var target = hop.target;
      var sourceLayer = layer(source);
      var targetOwner = object(regions[target]).dominator || object(regions[target]).owner;
      var isFree = !targetOwner || targetOwner === 'free';
      var cost = hop.isMove ? moveCosts[sourceLayer] : promotionCosts[sourceLayer];

      if (!isFree) {
        // Enemy-occupied: the AI needs enough layer-wide force to both (a) satisfy the
        // engine's own promotion-budget gate and (b) have the safety ratio over the
        // defender used elsewhere (requiredRatio === sourceLayer, same as calculateConquestCost).
        var enemyForce = force(target, human);
        var requiredRatio = sourceLayer;
        var ownLayerForce = layerForce(sourceLayer, team);
        var superiorLayerForce = layerForce(sourceLayer - 1, team);
        var neededForBudget = sourceLayer * superiorLayerForce + (sourceLayer + 1);
        var neededForWarSafety = enemyForce * requiredRatio;
        var neededOwnLayerForce = Math.max(neededForBudget, neededForWarSafety);
        if (ownLayerForce < neededOwnLayerForce) {
          // Buy the strongest affordable denomination at the source region (cheapest in
          // time, matching "comprar unidades mais caras primeiro" to reach the goal sooner).
          var buildupPurchase = strongestToWeakest.map(function (stage) {
            return getPurchaseAction(source, stage);
          }).find(function (action) { return action !== null; });
          return buildupPurchase || null;
        }
      }

      if (force(source, team) < 2 || !keepsLayerBalance(source, 1) ||
          !transferPreservesComposition(source, target, team, 1) ||
          (hop.isMove && isReverseMoveBlocked(source, target, 1)) ||
          (!hop.isMove && promotionBudget(source) < 1)) {
        // Force is layer-sufficient but this specific source can't issue the transfer yet
        // (e.g. local composition/budget constraints) - buy one more unit here to unlock it.
        var unlockPurchase = strongestToWeakest.map(function (stage) {
          return getPurchaseAction(source, stage);
        }).find(function (action) { return action !== null; });
        return unlockPurchase || null;
      }

      if (!Number.isFinite(Number(points)) || Number(points) < cost) return null;
      return hop.isMove
        ? { type: 'move', source: source, target: target, amount: 1 }
        : getPromotionPurchaseAction(source, target, 1);
    }

    var points = snapshot.points;
    if (points === undefined) points = object(snapshot.pointsByTeam)[team];
    if (points === undefined) points = object(snapshot.turnPoints)[team];
    if (points === undefined) points = object(snapshot.pontosDoTurn)[team];
    points = Number(points);
    var highBalanceRule = object(config.highBalanceTurnRule);
    var turnStartingPoints = snapshot.aiTurnStartingPoints === undefined
      ? points
      : Number(snapshot.aiTurnStartingPoints);
    var highBalanceTurn = highBalanceRule.enabled !== false &&
      Number.isFinite(turnStartingPoints) &&
      turnStartingPoints > Number(highBalanceRule.minimumStartingCoins);
    var moveCosts = { 8: 1, 7: 4, 6: 16, 5: 64, 4: 256, 3: 1024, 2: 4096 };
    var promotionCosts = { 8: 3, 7: 9, 6: 27, 5: 81, 4: 243, 3: 729, 2: 2197 };

    function isPurchaseForbidden(code, stage) {
      if (!highBalanceTurn) return false;
      var forbiddenStages = object(highBalanceRule.prohibitPurchasesByLayer)[layer(code)];
      return Array.isArray(forbiddenStages) && forbiddenStages.indexOf(stage) !== -1;
    }

    function directRecruitmentCost(code, stage) {
      var targetLayer = layer(code);
      var promotionCost = 0;
      for (var sourceLayer = 8; sourceLayer > targetLayer; sourceLayer -= 1) {
        promotionCost += promotionCosts[sourceLayer] || 0;
      }
      return weights[stage] * (promotionCost + 1);
    }

    function hasDirectRecruitmentPromotionCapacity(targetLayer, requiredSoldiers) {
      var minimumSoldiers = Number(requiredSoldiers);
      if (!Number.isFinite(minimumSoldiers) || minimumSoldiers <= 0) return false;
      if (targetLayer >= 8) return true;
      var sourceLayer = targetLayer + 1;
      var lowerSoldiers = codes.reduce(function (total, code) {
        return total + (layer(code) === sourceLayer && owns(code, team)
          ? force(code, team)
          : 0);
      }, 0);
      var upperSoldiers = codes.reduce(function (total, code) {
        return total + (layer(code) === targetLayer && owns(code, team)
          ? force(code, team)
          : 0);
      }, 0);
      var availableSoldiers =
        (lowerSoldiers - sourceLayer * upperSoldiers) / sourceLayer;
      return availableSoldiers >= minimumSoldiers;
    }

    function promotionBudget(source) {
      var sourceLayer = layer(source);
      if (sourceLayer <= 1) return 0;
      var ownLayerForce = codes.reduce(function (sum, code) {
        return sum + (layer(code) === sourceLayer && owns(code, team) ? force(code, team) : 0);
      }, 0);
      var superiorLayerForce = codes.reduce(function (sum, code) {
        return sum + (layer(code) === sourceLayer - 1 && owns(code, team) ? force(code, team) : 0);
      }, 0);
      var layerBudget = Math.max(0, Math.floor(
        (ownLayerForce - (sourceLayer * superiorLayerForce)) / (sourceLayer + 1)
      ));
      return Math.min(layerBudget, Math.max(0, force(source, team) - 1));
    }

    function canReceivePromotionUnit(target) {
      if (owns(target, human)) return false;
      var targetOwner = object(regions[target]).dominator || object(regions[target]).owner;
      if (targetOwner && targetOwner !== 'free' && targetOwner !== team) return false;
      var currentTarget = stageCounts(target, team);
      var nextTarget = compositionAfterTransfer(target, team, 1, true);
      var targetCompactsForbiddenG = hasForbiddenThreeFAndG(currentTarget) &&
        nextTarget.g < currentTarget.g && nextTarget.f > currentTarget.f;
      return hasValidComposition(nextTarget) &&
        (!hasForbiddenThreeFAndG(nextTarget) || targetCompactsForbiddenG) &&
        (currentTarget.f < 3 || targetCompactsForbiddenG) &&
        pieceCount(nextTarget) <= regionPieceLimit(target);
    }

    function isTargetLayerFrontier(code) {
      return adjacent(code).some(function (neighbor) {
        return layer(neighbor) === layer(code) && owns(neighbor, human);
      });
    }

    function findPathToTargetLayer(source, targetLayer, visited, frontierOnly) {
      var sourceLayer = layer(source);
      if (sourceLayer === targetLayer) {
        return !frontierOnly || isTargetLayerFrontier(source) ? [] : null;
      }
      if (sourceLayer < targetLayer || visited[source]) return null;
      visited[source] = true;
      var nextRegions = adjacent(source)
        .filter(function (target) {
          return layer(target) === sourceLayer - 1 && canReceivePromotionUnit(target);
        })
        .sort();
      for (var index = 0; index < nextRegions.length; index += 1) {
        var target = nextRegions[index];
        var remainingPath = findPathToTargetLayer(target, targetLayer, visited, frontierOnly);
        if (remainingPath) return [target].concat(remainingPath);
      }
      delete visited[source];
      return null;
    }

    function getPriorityConquestPromotion() {
      var targetLayers = {};
      codes.forEach(function (code) {
        var regionLayer = layer(code);
        if (regionLayer < 1 || regionLayer > 7) return;
        targetLayers[regionLayer] = targetLayers[regionLayer] || { ai: 0, human: 0 };
        targetLayers[regionLayer].ai += force(code, team);
        targetLayers[regionLayer].human += force(code, human);
      });
      var conquestLayers = Object.keys(targetLayers).map(Number)
        .filter(function (regionLayer) {
          return targetLayers[regionLayer].human > 0 && targetLayers[regionLayer].ai === 0;
        })
        .sort(function (a, b) { return b - a; });

      for (var layerIndex = 0; layerIndex < conquestLayers.length; layerIndex += 1) {
        var targetLayer = conquestLayers[layerIndex];
        var candidates = [];
        codes.forEach(function (source) {
          var sourceLayer = layer(source);
          var sourceForce = force(source, team);
          if (sourceLayer <= targetLayer || !owns(source, team) || owns(source, human) ||
              sourceForce <= 1 || !keepsLayerBalance(source, 1)) return;
          var path = findPathToTargetLayer(source, targetLayer, {}, true) ||
            findPathToTargetLayer(source, targetLayer, {}, false);
          if (!path || !path.length) return;
          var target = path[0];
          var maxPromotions = Math.min(
            promotionBudget(source),
            Math.floor(points / (promotionCosts[sourceLayer] || Infinity)),
            sourceForce - 1
          );
          for (var amount = maxPromotions; amount >= 1; amount -= 1) {
            if (!keepsLayerBalance(source, amount) ||
                !transferPreservesComposition(source, target, team, amount) ||
                pieceCount(compositionAfterTransfer(target, team, amount, true)) >
                  regionPieceLimit(target)) continue;
            candidates.push({
              source: source,
              target: target,
              amount: amount,
              pathLength: path.length,
              cost: amount * promotionCosts[sourceLayer],
              force: sourceForce
            });
            break;
          }
        });
        if (candidates.length) {
          candidates.sort(function (a, b) {
            return a.pathLength - b.pathLength || b.amount - a.amount ||
              a.cost - b.cost || b.force - a.force;
          });
          return getPromotionPurchaseAction(
            candidates[0].source,
            candidates[0].target,
            candidates[0].amount
          );
        }
      }
      return null;
    }

    function findGFollowUp(source, countsAfterPurchase, purchaseCost) {
      var oldCounts = stageCounts(source, team);
      if (countsAfterPurchase.g <= oldCounts.g) return null;
      var sourceLayer = layer(source);
      var sourceForce = force(source, team) + 1;
      if (sourceForce < 2 || !keepsLayerBalance(source, 1)) return null;
      var remainingPoints = points - purchaseCost;
      var targets = adjacent(source);
      for (var index = 0; index < targets.length; index += 1) {
        var target = targets[index];
        // A G purchase only jumps the normal "buy the strongest affordable stage" priority
        // when it immediately expands into a region the AI does not already control — plain
        // reinforcement of an already-owned region is not an expansion and must not count.
        if (owns(target, human) || owns(target, team)) continue;
        var targetOwner = object(regions[target]).dominator || object(regions[target]).owner;
        if (targetOwner && targetOwner !== 'free') continue;
        var targetLayer = layer(target);
        var type = targetLayer === sourceLayer ? 'move'
          : targetLayer === sourceLayer - 1 ? 'promote' : null;
        if (!type) continue;
        if (type === 'move' && isReverseMoveBlocked(source, target, 1)) continue;
        var cost = (type === 'move' ? moveCosts[sourceLayer] : promotionCosts[sourceLayer]) || Infinity;
        if (remainingPoints < cost || (type === 'promote' && promotionBudget(source) < 1)) continue;
        var sourceAfter = buildStageCounts(sourceForce - 1);
        var targetAfter = compositionAfterTransfer(target, team, 1, true);
        if (!hasValidComposition(sourceAfter) || !hasValidComposition(targetAfter) ||
            pieceCount(targetAfter) > regionPieceLimit(target)) continue;
        return { type: type, source: source, target: target, amount: 1 };
      }
      return null;
    }

    function getPurchaseAction(code, stage, allowStandaloneG) {
      if (isPurchaseForbidden(code, stage) || !owns(code, team) || owns(code, human)) return null;
      var recycledPieces = Array.isArray(snapshot.recycledPieces) ? snapshot.recycledPieces : [];
      if (recycledPieces.some(function (piece) {
        return piece && piece.source === code && piece.stage === stage;
      })) return null;
      var cost = directRecruitmentCost(code, stage);
      if (!Number.isFinite(Number(points)) || points < cost) return null;
      if (!hasDirectRecruitmentPromotionCapacity(layer(code), weights[stage])) return null;
      var currentCounts = stageCounts(code, team);
      if (stage === 'g' && currentCounts.f >= 3) return null;
      var nextCounts = compositionAfterPurchase(code, team, stage);
      if (!hasValidComposition(nextCounts) || hasForbiddenThreeFAndG(nextCounts) ||
          pieceCount(nextCounts) > regionPieceLimit(code)) return null;
      var followUp = null;
      if (!allowStandaloneG && stage === 'g' && currentCounts.f >= 2 &&
          nextCounts.g > currentCounts.g) {
        followUp = findGFollowUp(code, nextCounts, cost);
        if (!followUp) return null;
      }
      return { type: 'buy', source: code, stage: stage, followUp: followUp };
    }

    function getPromotionPurchaseAction(source, target, requestedAmount) {
      var stage = strongestToWeakest.find(function (candidate) {
        return weights[candidate] <= Number(requestedAmount);
      });
      if (!stage || layer(source) !== layer(target) + 1) return null;

      var amount = weights[stage];
      var sourceLayer = layer(source);
      var purchaseCost = directRecruitmentCost(source, stage);
      var promotionCost = (promotionCosts[sourceLayer] || Infinity) * amount;
      if (!Number.isFinite(purchaseCost + promotionCost) ||
          Number(points) < purchaseCost + promotionCost) return null;

      var targetOwner = object(regions[target]).dominator || object(regions[target]).owner;
      if (owns(target, human) ||
          (targetOwner && targetOwner !== 'free' && targetOwner !== team)) return null;
      if (!transferPreservesComposition(source, target, team, amount)) return null;
      var targetCounts = stageCounts(target, team);
      var targetAfter = compositionAfterTransfer(target, team, amount, true);
      var targetCompactsForbiddenG = hasForbiddenThreeFAndG(targetCounts) &&
        targetAfter.g < targetCounts.g && targetAfter.f > targetCounts.f;
      if (!hasValidComposition(targetAfter) ||
          (!targetCompactsForbiddenG && hasForbiddenThreeFAndG(targetAfter)) ||
          (!targetCompactsForbiddenG && targetCounts.f >= 3) ||
          pieceCount(targetAfter) > regionPieceLimit(target)) return null;

      var purchase = getPurchaseAction(source, stage, true);
      if (!purchase) {
        if (pieceCount(stageCounts(source, team)) >= regionPieceLimit(source)) {
          return recycleForPurchase(source);
        }
        return null;
      }

      var sourceLayerTotals = layerTotals[sourceLayer] || { ai: 0, human: 0 };
      var superiorLayerTotals = layerTotals[sourceLayer - 1] || { ai: 0, human: 0 };
      var promotionBudgetAfterPurchase = Math.max(0, Math.floor(
        (sourceLayerTotals.ai + amount - sourceLayer * superiorLayerTotals.ai) /
          (sourceLayer + 1)
      ));
      if (force(source, team) <= 0 || promotionBudgetAfterPurchase < amount) return purchase;

      purchase.followUp = {
        type: 'promote',
        source: source,
        target: target,
        amount: amount
      };
      return purchase;
    }

    var pendingFollowUp = object(snapshot.pendingAiFollowUp);
    if (pendingFollowUp.type === 'move' || pendingFollowUp.type === 'promote') {
      var pendingLayer = layer(pendingFollowUp.source);
      var pendingTargetLayer = layer(pendingFollowUp.target);
      var pendingCost = pendingFollowUp.type === 'move'
        ? moveCosts[pendingLayer]
        : promotionCosts[pendingLayer];
      var pendingAmount = Number(pendingFollowUp.amount) || 1;
      var pendingTargetOwner = object(regions[pendingFollowUp.target]).dominator ||
        object(regions[pendingFollowUp.target]).owner;
      if (pendingLayer && pendingCost && points >= pendingCost * pendingAmount &&
          !(pendingFollowUp.type === 'move' &&
            isReverseMoveBlocked(pendingFollowUp.source, pendingFollowUp.target, pendingAmount)) &&
          !owns(pendingFollowUp.target, human) &&
          (!pendingTargetOwner || pendingTargetOwner === 'free' || pendingTargetOwner === team) &&
          (pendingFollowUp.type === 'move'
            ? pendingTargetLayer === pendingLayer
            : pendingTargetLayer === pendingLayer - 1) &&
          force(pendingFollowUp.source, team) > pendingAmount &&
          keepsLayerBalance(pendingFollowUp.source, pendingAmount) &&
          (pendingFollowUp.type !== 'promote' || promotionBudget(pendingFollowUp.source) >= pendingAmount) &&
          transferPreservesComposition(pendingFollowUp.source, pendingFollowUp.target, team, pendingAmount) &&
          pieceCount(compositionAfterTransfer(pendingFollowUp.target, team, pendingAmount, true)) <=
            regionPieceLimit(pendingFollowUp.target)) {
        return {
          type: pendingFollowUp.type,
          source: pendingFollowUp.source,
          target: pendingFollowUp.target,
          amount: pendingAmount
        };
      }
    }

    function addDesirabilityPenalty(code, turn, type) {
      var settings = object(object(config.desirability.penalties)[type]);
      var duration = Math.max(1, Number(settings.durationTurns) || 5);
      var amount = -Math.abs(Number(settings.amount) || 20);
      desirabilityPenalties[code] = desirabilityPenalties[code] || [];
      desirabilityPenalties[code].push({
        type: type,
        label: String(settings.label || type),
        description: String(settings.description || ''),
        amount: amount,
        expiresTurn: turn + duration
      });
    }

    function recycleForPurchase(code) {
      var counts = stageCounts(code, team);
      if (pieceCount(counts) < 2) return null;
      var stagesPresent = strongestToWeakest.filter(function (stage) {
        return counts[stage] > 0;
      });
      if (!stagesPresent.length) return null;
      var weakestIndex = strongestToWeakest.indexOf(stagesPresent[stagesPresent.length - 1]);
      var strongestIndex = strongestToWeakest.indexOf(stagesPresent[0]);
      var hasWideRankGap = strongestIndex >= 0 && weakestIndex - strongestIndex >=
        Math.max(1, Number(config.recycling.minimumStageGap) || 2);
      var cheapThreshold = Math.max(0, Number(points) || 0) *
        Math.max(0, Number(config.recycling.availableCoinFraction) || 0.01);
      var recycledPieces = Array.isArray(snapshot.recycledPieces) ? snapshot.recycledPieces : [];
      for (var index = stagesPresent.length - 1; index >= 0; index -= 1) {
        var stage = stagesPresent[index];
        if (wasPieceCreatedThisTurn(code, stage) ||
            recycledPieces.some(function (piece) {
              return piece && piece.source === code && piece.stage === stage;
            })) continue;
        var cheap = directRecruitmentCost(code, stage) < cheapThreshold;
        if (!cheap && !(hasWideRankGap && index === stagesPresent.length - 1)) continue;
        var projected = Object.assign({}, counts);
        projected[stage] -= 1;
        projected = mergeStageCounts(projected);
        if (!hasValidComposition(projected)) continue;
        return { type: 'recycle', source: code, stage: stage };
      }
      return null;
    }

    function desiredPurchase(code, soldiersNeeded) {
      var needed = Number(soldiersNeeded);
      var candidates = strongestToWeakest.filter(function (stage) {
        return (!Number.isFinite(needed) || needed <= 0 || weights[stage] <= needed) &&
          weights[stage] <= Number(points);
      });
      for (var index = 0; index < candidates.length; index += 1) {
        var action = getPurchaseAction(code, candidates[index], true);
        if (action) return action;
      }
      var pieceCountAtRegion = pieceCount(stageCounts(code, team));
      if (pieceCountAtRegion >= regionPieceLimit(code)) return recycleForPurchase(code);
      return null;
    }

    function getRecruitmentPlan(code, soldiersNeeded) {
      var remaining = Math.max(0, Math.ceil(Number(soldiersNeeded) || 0));
      var stages = [];
      var totalCost = 0;
      strongestToWeakest.forEach(function (stage) {
        var count = Math.floor(remaining / weights[stage]);
        if (!count) return;
        stages.push({ stage: stage, count: count });
        totalCost += count * directRecruitmentCost(code, stage);
        remaining -= count * weights[stage];
      });
      if (remaining > 0) {
        stages.push({ stage: 'g', count: remaining });
        totalCost += remaining * directRecruitmentCost(code, 'g');
      }
      return { stages: stages, totalCost: totalCost };
    }

    function buyForTransfer(code, soldiersNeeded, transferCost, followUp) {
      var plan = getRecruitmentPlan(code, soldiersNeeded);
      var followUpStage = plan.stages.length === 1 && plan.stages[0].count === 1
        ? plan.stages[0].stage
        : null;
      var followUpMatchesPurchase = followUp && followUp.type === 'promote'
        ? followUpStage && weights[followUpStage] === followUp.amount
        : true;
      var effectiveTransferCost = followUpMatchesPurchase && followUp &&
        followUp.type === 'promote'
        ? (promotionCosts[layer(code)] || Infinity) * weights[followUpStage]
        : transferCost;
      if (!plan.stages.length ||
          Number(points) < plan.totalCost + effectiveTransferCost) return null;
      for (var index = 0; index < plan.stages.length; index += 1) {
        var purchase = getPurchaseAction(code, plan.stages[index].stage, true);
        if (purchase) {
          if (plan.stages.length === 1 && plan.stages[index].count === 1 && followUp &&
              followUpMatchesPurchase) {
            purchase.followUp = followUp;
          }
          return purchase;
        }
        if (pieceCount(stageCounts(code, team)) >= regionPieceLimit(code)) {
          return recycleForPurchase(code);
        }
        return null;
      }
      return null;
    }

    function promotionSoldierShortfall(sourceLayer) {
      var currentLayer = layerTotals[sourceLayer] || { ai: 0, human: 0 };
      var innerLayer = layerTotals[sourceLayer - 1] || { ai: 0, human: 0 };
      return Math.max(0,
        sourceLayer * innerLayer.ai + sourceLayer + 1 - currentLayer.ai);
    }

    function layerBalanceSoldierShortfall(sourceLayer) {
      var totals = layerTotals[sourceLayer] || { ai: 0, human: 0 };
      var minimumRatio = Math.max(0, Number(config.layerBalanceMinRatio) || 0);
      return Math.max(0,
        Math.ceil(totals.human * minimumRatio + 1 - totals.ai));
    }

    function bestAvailableRotation(code) {
      var rotations = object(snapshot.rotationTargetsByRegion)[code];
      if (!Array.isArray(rotations)) return null;
      var available = rotations.flatMap(function (target) {
        var options = [];
        if (target.localAvailable) {
          options.push(Object.assign({}, target, { passType: 'local' }));
        }
        if (target.globalAvailable) {
          options.push(Object.assign({}, target, { passType: 'global' }));
        }
        return options;
      });
      if (!available.length) return null;
      var target = randomItem(available);
      return {
        type: 'rotate',
        regionCode: code,
        layer: Number(target.layer) || layer(code),
        rotationTargetKey: target.key,
        rotationPassType: target.passType,
        blockName: target.blockName,
        disco: target.disco,
        direction: Math.random() < 0.5 ? 'left' : 'right'
      };
    }

    function hasEligibleRankNeighbor(code) {
      var targetLayer = layer(code);
      return adjacent(code).some(function (neighbor) {
        var rankDifference = Math.abs(layer(neighbor) - targetLayer);
        return rankDifference <= 1;
      });
    }

    function desiredTransfer(target, source) {
      var sourceLayer = layer(source);
      var targetLayer = layer(target);
      var owner = object(regions[target]).dominator || object(regions[target]).owner;
      if (owner === human || owns(target, human)) {
        // Enemy regions are fought automatically at turn resolution; move/promotion/
        // relegation into them is rejected by the game engine, so reinforce the frontier.
        return desiredPurchase(source, Infinity);
      }

      if (sourceLayer === targetLayer) {
        if (force(source, team) > 1 && getMaxMovableSoldiers(source, target) > 0 &&
            keepsLayerBalance(source, 1) &&
            transferPreservesComposition(source, target, team, 1) &&
            pieceCount(compositionAfterTransfer(target, team, 1, true)) <=
              regionPieceLimit(target) && Number(points) >= (moveCosts[sourceLayer] || Infinity)) {
          return { type: 'move', source: source, target: target, amount: 1 };
        }
        var moveCost = moveCosts[sourceLayer] || Infinity;
        var missingForMove = Math.max(1, layerBalanceSoldierShortfall(sourceLayer));
        return buyForTransfer(source, missingForMove, moveCost, {
          type: 'move', source: source, target: target, amount: 1
        });
      }

      if (sourceLayer === targetLayer + 1) {
        var promotionShortfall = Math.max(
          promotionSoldierShortfall(sourceLayer),
          layerBalanceSoldierShortfall(sourceLayer)
        );
        var missingForPromotion = Math.max(
          promotionShortfall,
          force(source, team) > 1 ? 0 : 1
        );
        if (missingForPromotion > 0) {
          return buyForTransfer(source, missingForPromotion,
            promotionCosts[sourceLayer] || Infinity, {
              type: 'promote', source: source, target: target, amount: 1
            });
        }
        if (canReceivePromotionUnit(target) && force(source, team) > 1 &&
            promotionBudget(source) > 0 && keepsLayerBalance(source, 1) &&
            transferPreservesComposition(source, target, team, 1) &&
            Number(points) >= (promotionCosts[sourceLayer] || Infinity)) {
          return getPromotionPurchaseAction(source, target, 1);
        }
        return null;
      }

      if (sourceLayer === targetLayer - 1 && sourceLayer < 8 &&
          (!owner || owner === 'free' || owner === team)) {
        var sourceCounts = stageCounts(source, team);
        var stages = strongestToWeakest.slice().reverse();
        for (var stageIndex = 0; stageIndex < stages.length; stageIndex += 1) {
          var stage = stages[stageIndex];
          if (sourceCounts[stage] <= 0 || pieceCount(sourceCounts) < 2 ||
              pieceCount(compositionAfterTransfer(target, team, weights[stage], true)) >
                regionPieceLimit(target)) continue;
          var relegateTarget = adjacent(source).indexOf(target) !== -1 &&
            !owns(target, human);
          if (relegateTarget) {
            return { type: 'relegate', source: source, target: target, stage: stage };
          }
        }
        var relegatePurchase = buyForTransfer(source, 1, 0, null);
        if (relegatePurchase) return relegatePurchase;
      }
      return null;
    }

    function chooseByDesirability() {
      var penaltyEntries = getActivePenaltyEntries(snapshot);
      var penaltyTotals = getPenaltyTotals(penaltyEntries);
      var penaltyTurn = Number.isFinite(Number(snapshot.currentTurn))
        ? Number(snapshot.currentTurn)
        : 0;
      var visitedTargets = {};
      var rankSettings = object(config.desirability.troopRatioByOuterLayer);
      var candidateLimit = Math.max(1, codes.length);

      for (var attempt = 0; attempt < candidateLimit; attempt += 1) {
        var analysis = calculateDesirability(
          snapshot,
          config.desirability,
          penaltyTotals,
          penaltyEntries
        );
        var candidatesByCode = {};
        codes.forEach(function (code) {
          if (!owns(code, team)) return;
          candidatesByCode[code] = true;
          adjacent(code).forEach(function (neighbor) {
            candidatesByCode[neighbor] = true;
          });
        });
        var candidates = Object.keys(candidatesByCode)
          .filter(function (code) { return !visitedTargets[code] && analysis.regions[code]; })
          .sort(function (first, second) {
            return analysis.regions[second].total - analysis.regions[first].total ||
              first.localeCompare(second);
          });
        if (!candidates.length) return { type: 'pass' };

        var target = candidates[0];
        var targetLayer = layer(target);
        if (owns(target, team) && !owns(target, human)) {
          var supportNeeds = adjacent(target).filter(function (neighbor) {
            return layer(neighbor) === targetLayer - 1 &&
              getSnapshotFreeUnits(snapshot, neighbor, team) > 0;
          }).map(function (neighbor) {
            return {
              code: neighbor,
              units: getSnapshotFreeUnits(snapshot, neighbor, team)
            };
          }).sort(function (first, second) { return second.units - first.units; });
          var desiredAction = null;
          if (supportNeeds.length) {
            desiredAction = desiredPurchase(target, supportNeeds[0].units);
          }
          var layerShortfall = Number(analysis.rankDeficits[targetLayer]) || 0;
          if (!desiredAction && layerShortfall > 0) {
            desiredAction = desiredPurchase(target, layerShortfall);
          }
          if (!desiredAction) desiredAction = desiredPurchase(target, Infinity);
          if (desiredAction) return desiredAction;
          visitedTargets[target] = true;
          continue;
        }

        var sourceCandidates = adjacent(target).filter(function (source) {
          return owns(source, team) && !owns(source, human);
        }).sort(function (first, second) {
          function rankPreference(source) {
            var sourceLayer = layer(source);
            if (sourceLayer === targetLayer + 1) return 0;
            if (sourceLayer === targetLayer) return 1;
            if (sourceLayer === targetLayer - 1) return 2;
            return 3;
          }
          return rankPreference(first) - rankPreference(second) ||
            force(second, team) - force(first, team) || first.localeCompare(second);
        });
        codes.forEach(function (source) {
          if (!owns(source, team) || owns(source, human) ||
              adjacent(source).indexOf(target) === -1 ||
              sourceCandidates.indexOf(source) !== -1) return;
          sourceCandidates.push(source);
        });
        sourceCandidates.sort(function (first, second) {
          var firstLayer = layer(first);
          var secondLayer = layer(second);
          function preference(sourceLayer) {
            if (sourceLayer === targetLayer + 1) return 0;
            if (sourceLayer === targetLayer) return 1;
            if (sourceLayer === targetLayer - 1) return 2;
            return 3;
          }
          return preference(firstLayer) - preference(secondLayer) ||
            force(second, team) - force(first, team) || first.localeCompare(second);
        });
        for (var sourceIndex = 0; sourceIndex < sourceCandidates.length; sourceIndex += 1) {
          desiredAction = desiredTransfer(target, sourceCandidates[sourceIndex]);
          if (desiredAction) return desiredAction;
        }

        // Temporary heuristic: choose a random direction for an available rotation pass,
        // then let the client recompute neighbors and desirabilities from the new geometry.
        var rotationAction = bestAvailableRotation(target);
        if (rotationAction) return rotationAction;

        var penaltyType = hasEligibleRankNeighbor(target)
          ? 'unavailableAction'
          : 'inaccessible';
        addDesirabilityPenalty(target, penaltyTurn, penaltyType);
        penaltyTotals[target] = (Number(penaltyTotals[target]) || 0) -
          Math.abs(Number(object(object(config.desirability.penalties)[penaltyType]).amount) || 20);
        penaltyEntries[target] = penaltyEntries[target] || [];
        var penaltySettings = object(object(config.desirability.penalties)[penaltyType]);
        penaltyEntries[target].push({
          type: penaltyType,
          label: String(penaltySettings.label || penaltyType),
          description: String(penaltySettings.description || ''),
          amount: -Math.abs(Number(penaltySettings.amount) || 20)
        });
        visitedTargets[target] = true;
      }
      return { type: 'pass' };
    }

    if (highBalanceTurn) {
      var forcedRecycleByLayer = object(highBalanceRule.recycleByLayer);
      var forcedRecycleLayers = Object.keys(forcedRecycleByLayer)
        .sort(function (first, second) { return Number(second) - Number(first); });
      for (var forcedLayerIndex = 0; forcedLayerIndex < forcedRecycleLayers.length; forcedLayerIndex += 1) {
        var forcedLayer = Number(forcedRecycleLayers[forcedLayerIndex]);
        var forcedStages = forcedRecycleByLayer[forcedRecycleLayers[forcedLayerIndex]];
        if (!Array.isArray(forcedStages)) continue;
        var forcedRegions = codes.filter(function (code) {
          return layer(code) === forcedLayer;
        }).sort(function (first, second) {
          return Number(first.split('-')[1]) - Number(second.split('-')[1]);
        });
        for (var forcedStageIndex = 0; forcedStageIndex < forcedStages.length; forcedStageIndex += 1) {
          var forcedStage = forcedStages[forcedStageIndex];
          for (var forcedRegionIndex = 0; forcedRegionIndex < forcedRegions.length; forcedRegionIndex += 1) {
            var forcedRegion = forcedRegions[forcedRegionIndex];
            if (!owns(forcedRegion, team) || owns(forcedRegion, human) ||
                pieceCount(stageCounts(forcedRegion, team)) < 2) continue;
            var forcedCounts = stageCounts(forcedRegion, team);
            if (!Object.prototype.hasOwnProperty.call(weights, forcedStage) ||
                forcedCounts[forcedStage] <= 0 ||
                (snapshot.campaignLevelId !== 'tabuleiro-02' &&
                  wasPieceCreatedThisTurn(forcedRegion, forcedStage))) continue;
            return { type: 'recycle', source: forcedRegion, stage: forcedStage };
          }
        }
      }
    }

    return chooseByDesirability();

    function hasStageUpgrade(counts, stage, candidateCounts) {
      var stageIndex = strongestToWeakest.indexOf(stage);
      return strongestToWeakest.slice(0, stageIndex).some(function (strongerStage) {
        return candidateCounts[strongerStage] > counts[strongerStage];
      });
    }

    function getPurchaseUpgradeForRecycle(source, stage) {
      if (layer(source) !== 8) return null;
      var counts = stageCounts(source, team);
      var upgradeThresholds = { g: 7, f: 6, e: 5, d: 4, c: 3, b: 2 };
      var threshold = upgradeThresholds[stage];
      if (!threshold || counts[stage] <= 0 || counts[stage] >= threshold) return null;
      var purchasesNeeded = threshold - counts[stage];
      if (points < purchasesNeeded * weights[stage]) return null;

      var projected = Object.assign({}, counts);
      for (var purchaseIndex = 0; purchaseIndex < purchasesNeeded; purchaseIndex += 1) {
        projected[stage] += 1;
        projected = mergeStageCounts(projected);
        if (!hasValidComposition(projected) || hasForbiddenThreeFAndG(projected) ||
            pieceCount(projected) > regionPieceLimit(source)) return null;
      }
      if (!hasStageUpgrade(counts, stage, projected)) return null;
      return getPurchaseAction(source, stage);
    }

    function findPromotionUpgradeForRecycle(target, stage) {
      var targetLayer = layer(target);
      var amount = weights[stage];
      if (targetLayer < 1 || targetLayer >= 8 || !amount) return null;

      var initialState = { forces: {}, totals: {} };
      codes.forEach(function (code) {
        var regionLayer = layer(code);
        var teamForce = force(code, team);
        var humanForce = force(code, human);
        initialState.forces[code] = teamForce;
        initialState.totals[regionLayer] = initialState.totals[regionLayer] ||
          { ai: 0, human: 0 };
        initialState.totals[regionLayer].ai += teamForce;
        initialState.totals[regionLayer].human += humanForce;
      });

      function visit(source, state, path, visited, spent) {
        var sourceLayer = layer(source);
        if (sourceLayer <= targetLayer || visited[source]) return null;
        visited[source] = true;
        var sourceForce = state.forces[source] || 0;
        var sourceCounts = buildStageCounts(sourceForce);
        if (sourceCounts[stage] <= 0 || sourceForce <= amount) return null;

        var layerState = state.totals[sourceLayer] || { ai: 0, human: 0 };
        var promotionBudgetForSource = Math.min(
          Math.max(0, Math.floor(
            (layerState.ai - sourceLayer * (state.totals[sourceLayer - 1]?.ai || 0)) /
              (sourceLayer + 1)
          )),
          Math.max(0, sourceForce - 1)
        );
        var promotionCost = amount * (promotionCosts[sourceLayer] || Infinity);
        if (promotionBudgetForSource < amount || spent + promotionCost > points ||
            layerState.ai - amount < layerState.human * 0.5) return null;

        var nextRegions = adjacent(source).filter(function (candidate) {
          return layer(candidate) === sourceLayer - 1;
        });
        for (var index = 0; index < nextRegions.length; index += 1) {
          var next = nextRegions[index];
          if (owns(next, human)) continue;
          var owner = object(regions[next]).dominator || object(regions[next]).owner;
          if (owner && owner !== 'free' && owner !== team) continue;
          var targetForce = state.forces[next] || 0;
          var nextSourceCounts = buildStageCounts(sourceForce - amount);
          var nextTargetCounts = buildStageCounts(targetForce + amount);
          var sourceRemovesForbiddenG = hasForbiddenThreeFAndG(sourceCounts) &&
            nextSourceCounts.g < sourceCounts.g;
          var targetCompactsForbiddenG = hasForbiddenThreeFAndG(buildStageCounts(targetForce)) &&
            nextTargetCounts.g < buildStageCounts(targetForce).g &&
            nextTargetCounts.f > buildStageCounts(targetForce).f;
          if ((!hasValidComposition(sourceCounts) && !sourceRemovesForbiddenG) ||
              (!hasValidComposition(nextSourceCounts) && !sourceRemovesForbiddenG) ||
              !hasValidComposition(nextTargetCounts) ||
              (hasForbiddenThreeFAndG(nextTargetCounts) && !targetCompactsForbiddenG) ||
              (buildStageCounts(targetForce).f >= 3 && !targetCompactsForbiddenG) ||
              pieceCount(nextTargetCounts) > regionPieceLimit(next)) continue;

          var destinationUpgrade = next === target &&
            hasStageUpgrade(buildStageCounts(targetForce), stage, nextTargetCounts);
          var nextState = {
            forces: Object.assign({}, state.forces),
            totals: Object.assign({}, state.totals)
          };
          nextState.forces[source] = sourceForce - amount;
          nextState.forces[next] = targetForce + amount;
          nextState.totals[sourceLayer] = {
            ai: layerState.ai - amount,
            human: layerState.human
          };
          var nextLayerState = state.totals[sourceLayer - 1] || { ai: 0, human: 0 };
          nextState.totals[sourceLayer - 1] = {
            ai: nextLayerState.ai + amount,
            human: nextLayerState.human
          };

          var nextPath = path.concat([{ source: source, target: next }]);
          if (destinationUpgrade) return nextPath;
          var continuation = visit(
            next, nextState, nextPath, Object.assign({}, visited), spent + promotionCost
          );
          if (continuation) return continuation;
        }
        return null;
      }

      for (var sourceIndex = 0; sourceIndex < codes.length; sourceIndex += 1) {
        var source = codes[sourceIndex];
        if (layer(source) <= targetLayer || stageCounts(source, team)[stage] <= 0 ||
            owns(source, human) || !owns(source, team)) continue;
        var route = visit(source, initialState, [], {}, 0);
        if (route) return route;
      }
      return null;
    }

    // Wheat deficit is treated as the dominant priority: keep advancing toward the closest
    // farm (buying/promoting/moving step by step) before considering generic conquest,
    // recycling/upgrade, or composition-repair strategy. This must run before
    // directPurchaseRegions/recycleCandidates/compactionTransfers/capacityPromotions/
    // threeFAndGTransfers below, since those blocks would otherwise intercept available
    // coins (e.g. recycling idle 'g' pieces into upgrades) before the wheat plan gets a
    // chance to advance toward a farm.
    var wheatEmergencyAction = planWheatEmergencyAction();
    if (wheatEmergencyAction) return wheatEmergencyAction;

    var directPurchaseRegions = codes
      .filter(function (code) {
        return layer(code) < 8 && layer(code) >= 1 &&
          owns(code, team) && !owns(code, human);
      })
      .sort(function (a, b) {
        return layer(b) - layer(a) ||
          force(b, team) - force(a, team) ||
          a.localeCompare(b);
      });
    for (var directRegionIndex = 0;
      directRegionIndex < directPurchaseRegions.length;
      directRegionIndex += 1) {
      var directRegion = directPurchaseRegions[directRegionIndex];
      for (var directStageIndex = 0; directStageIndex < strongestToWeakest.length; directStageIndex += 1) {
        var directStage = strongestToWeakest[directStageIndex];
        var directPurchase = getPurchaseAction(directRegion, directStage);
        if (directPurchase) return directPurchase;
      }
    }

    var recycleThresholdByLayer = config.recycleCoinThresholdByLayer;
    var recycleCandidates = [];
    if (Number.isFinite(Number(points))) {
      codes.slice().sort(function (a, b) {
        return layer(b) - layer(a) || Number(a.split('-')[1]) - Number(b.split('-')[1]);
      }).forEach(function (code) {
        var regionLayer = layer(code);
        var thresholdFactor = recycleThresholdByLayer[regionLayer];
        if (!thresholdFactor || !owns(code, team) || owns(code, human)) return;
        var counts = stageCounts(code, team);
        if (pieceCount(counts) < 2) return;
        ['g', 'f', 'e', 'd', 'c', 'b', 'a'].some(function (stage) {
          if (counts[stage] <= 0 || wasPieceCreatedThisTurn(code, stage) ||
              Number(points) <= weights[stage] * thresholdFactor) return false;
          recycleCandidates.push({ source: code, stage: stage });
          return true;
        });
      });
    }
    if (recycleCandidates.length) {
      for (var recycleIndex = 0; recycleIndex < recycleCandidates.length; recycleIndex += 1) {
        var recycleCandidate = recycleCandidates[recycleIndex];
        var purchaseUpgrade = getPurchaseUpgradeForRecycle(
          recycleCandidate.source, recycleCandidate.stage
        );
        if (purchaseUpgrade) return purchaseUpgrade;
        if (layer(recycleCandidate.source) < 8) {
          var promotionRoute = findPromotionUpgradeForRecycle(
            recycleCandidate.source, recycleCandidate.stage
          );
          if (promotionRoute && promotionRoute.length) {
            return getPromotionPurchaseAction(
              promotionRoute[0].source,
              promotionRoute[0].target,
              weights[recycleCandidate.stage]
            );
          }
        }
      }
      return {
        type: 'recycle',
        source: recycleCandidates[0].source,
        stage: recycleCandidates[0].stage
      };
    }

    var compactionTransfers = [];
    codes.forEach(function (source) {
      var sourceLayer = layer(source);
      var sourceForce = force(source, team);
      if (!owns(source, team) || owns(source, human) || sourceForce <= 1 ||
          !keepsLayerBalance(source, 1)) return;
      adjacent(source).forEach(function (target) {
        var targetCounts = stageCounts(target, team);
        if (targetCounts.f < 3 || targetCounts.g <= 0 || owns(target, human)) return;
        var targetOwner = object(regions[target]).dominator || object(regions[target]).owner;
        if (targetOwner && targetOwner !== 'free' && targetOwner !== team) return;
        var targetLayer = layer(target);
        var isMove = targetLayer === sourceLayer;
        var isPromotion = targetLayer === sourceLayer - 1;
        if ((!isMove && !isPromotion) ||
            (isMove && isReverseMoveBlocked(source, target, 1)) ||
            !transferPreservesComposition(source, target, team, 1)) return;
        var compactedTarget = compositionAfterTransfer(target, team, 1, true);
        if (compactedTarget.g >= targetCounts.g ||
            pieceCount(compactedTarget) > regionPieceLimit(target)) return;
        var cost = (isMove ? moveCosts[sourceLayer] : promotionCosts[sourceLayer]) || Infinity;
        if (points < cost || (isPromotion && promotionBudget(source) < 1)) return;
        compactionTransfers.push({
          type: isMove ? 'move' : 'promote',
          source: source,
          target: target,
          amount: 1,
          force: sourceForce,
          cost: cost
        });
      });
    });
    if (compactionTransfers.length) {
      compactionTransfers.sort(function (a, b) {
        return a.cost - b.cost || b.force - a.force;
      });
      var compactionTransfer = compactionTransfers[0];
      if (compactionTransfer.type === 'promote') {
        return getPromotionPurchaseAction(
          compactionTransfer.source,
          compactionTransfer.target,
          compactionTransfer.amount
        );
      }
      return {
        type: 'move',
        source: compactionTransfer.source,
        target: compactionTransfer.target,
        amount: compactionTransfer.amount
      };
    }

    var capacityPromotions = [];
    codes.forEach(function (source) {
      var sourceLayer = layer(source);
      var sourceCounts = stageCounts(source, team);
      var sourceForce = force(source, team);
      if (sourceLayer <= 1 || !owns(source, team) || owns(source, human) ||
          pieceCount(sourceCounts) < regionPieceLimit(source)) return;
      var weakestStage = strongestToWeakest.slice().reverse().find(function (stage) {
        return sourceCounts[stage] > 0;
      });
      if (!weakestStage) return;
      var amount = weights[weakestStage];
      var cost = amount * (promotionCosts[sourceLayer] || Infinity);
      if (sourceForce <= amount || points < cost || promotionBudget(source) < amount ||
          !keepsLayerBalance(source, amount)) return;

      adjacent(source).forEach(function (target) {
        if (layer(target) !== sourceLayer - 1 || !transferPreservesComposition(source, target, team, amount)) return;
        var targetOwner = object(regions[target]).dominator || object(regions[target]).owner;
        if (targetOwner && targetOwner !== 'free' && targetOwner !== team) return;
        if (pieceCount(compositionAfterTransfer(target, team, amount, true)) >
            regionPieceLimit(target)) return;
        capacityPromotions.push({
          source: source,
          target: target,
          amount: amount,
          cost: cost,
          force: sourceForce
        });
      });
    });
    if (capacityPromotions.length) {
      capacityPromotions.sort(function (a, b) {
        return a.cost - b.cost || b.force - a.force;
      });
      var capacityPromotion = capacityPromotions[0];
      return getPromotionPurchaseAction(
        capacityPromotion.source,
        capacityPromotion.target,
        capacityPromotion.amount
      );
    }

    var threeFAndGTransfers = [];
    codes.forEach(function (source) {
      var sourceCounts = stageCounts(source, team);
      var sourceForce = force(source, team);
      if (sourceCounts.f < 3 || sourceCounts.g <= 0 || sourceForce <= 1 || !owns(source, team) ||
          owns(source, human)) return;
      var sourceLayer = layer(source);
      adjacent(source).forEach(function (target) {
        var targetLayer = layer(target);
        var isMove = targetLayer === sourceLayer;
        var isPromotion = targetLayer === sourceLayer - 1;
        if ((!isMove && !isPromotion) || owns(target, human)) return;
        if (isMove && isReverseMoveBlocked(source, target, 1)) return;
        var targetOwner = object(regions[target]).dominator || object(regions[target]).owner;
        if (targetOwner && targetOwner !== 'free' && targetOwner !== team) return;
        var costPerUnit = isMove ? moveCosts[sourceLayer] : promotionCosts[sourceLayer];
        if (!costPerUnit || points < costPerUnit ||
            (isPromotion && promotionBudget(source) < 1) ||
            !transferPreservesComposition(source, target, team, 1)) return;
        threeFAndGTransfers.push({
          type: isMove ? 'move' : 'promote',
          source: source,
          target: target,
          amount: 1,
          force: sourceForce,
          cost: costPerUnit
        });
      });
    });
    if (threeFAndGTransfers.length) {
      threeFAndGTransfers.sort(function (a, b) {
        return a.cost - b.cost || b.force - a.force;
      });
      var threeFAndGTransfer = threeFAndGTransfers[0];
      if (threeFAndGTransfer.type === 'promote') {
        return getPromotionPurchaseAction(
          threeFAndGTransfer.source,
          threeFAndGTransfer.target,
          threeFAndGTransfer.amount
        );
      }
      return {
        type: 'move',
        source: threeFAndGTransfer.source,
        target: threeFAndGTransfer.target,
        amount: threeFAndGTransfer.amount
      };
    }

    var priorityConquestPromotion = getPriorityConquestPromotion();
    if (priorityConquestPromotion) return priorityConquestPromotion;

    var repairCandidates = [];
    codes.forEach(function (source) {
      var sourceCounts = stageCounts(source, team);
      var sourceGap = compositionGap(sourceCounts);
      var sourceForce = force(source, team);
      if (sourceGap <= 1 || sourceForce < 2 || !owns(source, team)) return;
      var weakestStage = strongestToWeakest.slice().reverse().find(function (stage) {
        return sourceCounts[stage] > 0;
      });
      if (!weakestStage) return;
      var weakestUnits = sourceCounts[weakestStage] * weights[weakestStage];
      var sourceLayer = layer(source);
      var moveCost = moveCosts[sourceLayer] || Infinity;
      var promoteCost = promotionCosts[sourceLayer] || Infinity;
      var maxPromotion = promotionBudget(source);
      var candidateAmounts = [1, weights[weakestStage], weakestUnits];

      adjacent(source).forEach(function (target) {
        var targetLayer = layer(target);
        var isMove = targetLayer === sourceLayer;
        var isPromotion = targetLayer === sourceLayer - 1;
        if ((!isMove && !isPromotion) || owns(target, human)) return;
        var targetOwner = object(regions[target]).dominator || object(regions[target]).owner;
        if (targetOwner && targetOwner !== 'free' && targetOwner !== team) return;
        var costPerUnit = isMove ? moveCost : promoteCost;
        var maxByPoints = Number.isFinite(Number(points)) && costPerUnit > 0
          ? Math.floor(Number(points) / costPerUnit)
          : 0;
        if (isPromotion) maxByPoints = Math.min(maxByPoints, maxPromotion);
        var seenAmounts = {};
        candidateAmounts.forEach(function (amount) {
          if (amount <= 0 || amount >= sourceForce || amount > weakestUnits ||
              (isMove && isReverseMoveBlocked(source, target, amount)) ||
              amount > maxByPoints || seenAmounts[amount] ||
              !keepsLayerBalance(source, amount)) return;
          seenAmounts[amount] = true;
          var nextSource = compositionAfterTransfer(source, team, amount, false);
          var nextTarget = compositionAfterTransfer(target, team, amount, true);
          var nextGap = compositionGap(nextSource);
          if (!hasValidComposition(nextTarget) || nextGap >= sourceGap) return;
          repairCandidates.push({
            type: isMove ? 'move' : 'promote',
            source: source,
            target: target,
            amount: amount,
            gapReduction: sourceGap - nextGap,
            fullyRepaired: nextGap <= 1,
            cost: amount * costPerUnit,
            force: sourceForce
          });
        });
      });
    });
    if (repairCandidates.length) {
      repairCandidates.sort(function (a, b) {
        return Number(b.fullyRepaired) - Number(a.fullyRepaired) ||
          b.gapReduction - a.gapReduction || a.cost - b.cost || b.force - a.force;
      });
      var repair = repairCandidates[0];
      if (repair.type === 'promote') {
        return getPromotionPurchaseAction(
          repair.source,
          repair.target,
          repair.amount
        );
      }
      return {
        type: 'move',
        source: repair.source,
        target: repair.target,
        amount: repair.amount
      };
    }

    // Check wheat emergency - when losing wheat, prefer advancing toward the closest farm.
    // The farm itself may be free or enemy-held; only free regions can be entered directly
    // (entering enemy territory is handled by the game's automatic war resolution, not by
    // a direct "move"), so this only influences which free neighbor the AI advances into.
    var wheatStatus = getWheatBalance();
    var needsFarmConquest = config.wheat.seekFarmsWhenDeficit && wheatStatus.balance < 0;
    var farmTargetCode = needsFarmConquest ? (findClosestFarm() || {}).farm : null;

    var freeMoves = [];
    var freePromotions = [];
    codes.forEach(function (source) {
      var sourceForce = force(source, team);
      if (!owns(source, team) || sourceForce < 2 || !keepsLayerBalance(source, 1) ||
          !hasValidComposition(stageCounts(source, team))) return;
      adjacent(source).forEach(function (target) {
        var targetLayer = layer(target);
        var targetIsFree = !owns(target, team) && !owns(target, human);
        if (!targetIsFree) return;
        var farmDistance = farmTargetCode ? distanceToRegion(target, farmTargetCode) : Infinity;
        if (targetLayer === layer(source)) {
          if (!isReverseMoveBlocked(source, target, 1) &&
              points >= (moveCosts[layer(source)] || Infinity) &&
              transferPreservesComposition(source, target, team, 1)) {
            freeMoves.push({ source: source, target: target, force: sourceForce, farmDistance: farmDistance });
          }
        } else if (targetLayer === layer(source) - 1) {
          if (points >= (promotionCosts[layer(source)] || Infinity) &&
              transferPreservesComposition(source, target, team, 1)) {
            freePromotions.push({ source: source, target: target, force: sourceForce, farmDistance: farmDistance });
          }
        }
      });
    });
    if (freeMoves.length) {
      freeMoves.sort(function (a, b) { return a.farmDistance - b.farmDistance || b.force - a.force; });
      return { type: 'move', source: freeMoves[0].source, target: freeMoves[0].target };
    }
    if (freePromotions.length) {
      freePromotions.sort(function (a, b) { return a.farmDistance - b.farmDistance || b.force - a.force; });
      return getPromotionPurchaseAction(
        freePromotions[0].source,
        freePromotions[0].target,
        1
      );
    }
    var affordableStages = Object.keys(weights)
      .filter(function (stage) { return weights[stage] <= Number(points); })
      .sort(function (a, b) { return weights[b] - weights[a]; });
    var purchaseRegions = codes
      .filter(function (code) { return layer(code) >= 1 && owns(code, team) && !owns(code, human); })
      .sort(function (a, b) {
        return Number(owns(b, team)) - Number(owns(a, team)) ||
          force(b, team) - force(a, team);
      });

    // Dynamic conquest priority based on region count difference
    var conquestPriorityWeight = getConquestPriorityWeight();
    var threatenedHumanRegions = codes
      .filter(function (code) {
        var humanForce = finalForce(code, human);
        var aiForce = finalForce(code, team);

        // Apply dynamic weight to make AI more aggressive when behind
        var adjustedAiForce = aiForce * conquestPriorityWeight;
        return humanForce > adjustedAiForce;
      })
      .sort(function (a, b) {
        return finalForce(b, human) - finalForce(a, human) ||
           finalForce(a, team) - finalForce(b, team) || a.localeCompare(b);
      });

    // Fallback conquest-direction finder: score every frontier neighbor (of regions we
    // already own) by estimated conquest cost, scaled down by how far behind in region
    // count the AI currently is (conquestPriorityWeight), and prefer the cheapest one.
    function getBestConquestTarget() {
      var weight = conquestPriorityWeight;
      var best = null;
      var bestScore = Infinity;
      codes.forEach(function (source) {
        if (!owns(source, team)) return;
        adjacent(source).forEach(function (target) {
          if (owns(target, team)) return;
          var score = calculateConquestCost(target, source) / weight;
          if (score < bestScore) {
            bestScore = score;
            best = target;
          }
        });
      });
      return best;
    }

    // A wheat deficit is an emergency: prioritize buying units closest to the nearest
    // farm over the usual "most threatened human region" target.
    var purchaseTargetRegion = needsFarmConquest && farmTargetCode ? farmTargetCode :
      (threatenedHumanRegions.length ? threatenedHumanRegions[0] : getBestConquestTarget());
    if (purchaseTargetRegion) {
      var requiredOuterSoldiers = outerSoldiersForTargetLayer(layer(purchaseTargetRegion));
      var rankedPurchaseRegions = purchaseRegions.map(function (code) {
        return {
           code: code,
           distance: distanceToRegion(code, purchaseTargetRegion),
           soldierShortfall: Math.max(0, requiredOuterSoldiers - force(code, team))
        };
      }).sort(function (a, b) {
        return a.distance - b.distance ||
           a.soldierShortfall - b.soldierShortfall ||
           Number(owns(b.code, team)) - Number(owns(a.code, team)) ||
           force(b.code, team) - force(a.code, team) ||
           a.code.localeCompare(b.code);
      });
      purchaseRegions = rankedPurchaseRegions.map(function (entry) { return entry.code; });
    }
    var purchase = null;
    purchaseRegions.some(function (code) {
      var candidate = affordableStages.map(function (candidateStage) {
        return getPurchaseAction(code, candidateStage);
      }).find(function (action) {
        return action !== null;
      });
      if (!candidate) return false;
      purchase = candidate;
      return true;
    });
    if (purchase) {
      return purchase;
    }
    var outerForce = layerTotals[8] || { ai: 0, human: 0 };
    if (Number.isFinite(Number(points)) && Number(points) >= 1 &&
        outerForce.ai < outerForce.human * config.weakOuterLayerBuyRatio) {
      var buyAction = purchaseRegions.map(function (code) {
        return getPurchaseAction(code, 'g');
      }).find(function (action) {
        return action !== null;
      });
      if (buyAction) return buyAction;
    }

    var enemyMoves = [];
    codes.forEach(function (source) {
      var sourceForce = force(source, team);
      if (!owns(source, team) || sourceForce < 2 || !keepsLayerBalance(source, 1) ||
          !hasValidComposition(stageCounts(source, team))) return;
      adjacent(source).forEach(function (target) {
        if (owns(target, human) || isReverseMoveBlocked(source, target, 1) ||
            !transferPreservesComposition(source, target, team, 1)) return;
        enemyMoves.push({ source: source, target: target, force: sourceForce });
      });
    });

    if (enemyMoves.length) {
      var strongestEnemyFront = Math.max.apply(null, enemyMoves.map(function (move) { return move.force; }));
      var front = enemyMoves.filter(function (move) { return move.force === strongestEnemyFront; });
      var attack = randomItem(front);
      return { type: 'move', source: attack.source, target: attack.target };
    }

    var promotions = [];
    codes.forEach(function (source) {
      var sourceLayer = layer(source);
      if (sourceLayer <= 1 || !owns(source, team) || force(source, team) < 2 ||
          !keepsLayerBalance(source, 1) || !hasValidComposition(stageCounts(source, team))) return;
      adjacent(source).forEach(function (target) {
        if (layer(target) === sourceLayer - 1 && !owns(target, human) &&
            (owns(target, team) || force(target, human) === 0)) {
          if (!transferPreservesComposition(source, target, team, 1)) return;
          promotions.push({ source: source, target: target, force: force(source, team) });
        }
      });
    });
    if (promotions.length) {
      promotions.sort(function (a, b) { return b.force - a.force; });
      return getPromotionPurchaseAction(promotions[0].source, promotions[0].target, 1);
    }

    var rotatingLayers = {};
    var fallbackRotatingLayers = {};
    if (snapshot.hasRotatedThisTurn !== true) {
      codes.forEach(function (code) {
        var number = layer(code);
        if (number >= 2 && number <= 8) {
          if (owns(code, team)) {
            fallbackRotatingLayers[number] = (fallbackRotatingLayers[number] || 0) + 1;
          }
          if (owns(code, human)) {
            rotatingLayers[number] = (rotatingLayers[number] || 0) + force(code, human);
          }
        }
      });
    }
    var rotationCandidates = Object.keys(rotatingLayers).map(Number).sort(function (a, b) {
      return rotatingLayers[b] - rotatingLayers[a];
    });
    if (!rotationCandidates.length) {
      rotationCandidates = Object.keys(fallbackRotatingLayers).map(Number);
      for (var candidateIndex = rotationCandidates.length - 1; candidateIndex > 0; candidateIndex -= 1) {
        var randomIndex = Math.floor(Math.random() * (candidateIndex + 1));
        var swap = rotationCandidates[candidateIndex];
        rotationCandidates[candidateIndex] = rotationCandidates[randomIndex];
        rotationCandidates[randomIndex] = swap;
      }
    }
    if (rotationCandidates.length) {
      return {
        type: 'rotate',
        layer: rotationCandidates[0],
        layers: rotationCandidates,
        direction: Math.random() < 0.5 ? 'left' : 'right'
      };
    }

    if (Number.isFinite(Number(points)) && Number(points) >= 1) {
      var fallbackBuyAction = purchaseRegions.map(function (code) {
        return getPurchaseAction(code, 'g');
      }).find(function (action) {
        return action !== null;
      });
      if (fallbackBuyAction) return fallbackBuyAction;
    }
    return { type: 'pass' };
  }

  root.WillOfManyAI = {
    chooseAction: chooseAction,
    calculateDesirability: calculateDesirability,
    calculateCurrentDesirability: calculateCurrentDesirability,
    setConfig: setConfig,
    getConfig: getConfig
  };
})(
  typeof window !== 'undefined' ? window : globalThis,
  typeof module === 'object' && module.exports
    ? require('./game-rules.js')
    : (typeof window !== 'undefined' ? window.WillOfManyRules : globalThis.WillOfManyRules)
);
