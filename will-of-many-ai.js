(function (root) {
  'use strict';

  var weights = { g: 1, f: 7, e: 42, d: 210, c: 840, b: 2520, a: 5040 };
  var strongestToWeakest = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  var opposite = { orange: 'blue', blue: 'orange' };

  function object(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
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
      var entry = object(neighbors[code] || object(regions[code]).neighbors);
      var result = [];
      ['left', 'right', 'superior', 'inferior'].forEach(function (direction) {
        var value = entry[direction];
        if (Array.isArray(value)) result = result.concat(value);
        else if (typeof value === 'string') result.push(value);
      });
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
    codes.forEach(function (code) {
      var number = layer(code);
      if (!number) return;
      layerTotals[number] = layerTotals[number] || { ai: 0, human: 0 };
      layerTotals[number].ai += force(code, team);
      layerTotals[number].human += force(code, human);
    });

    function keepsLayerBalance(code, loss) {
      var totals = layerTotals[layer(code)] || { ai: 0, human: 0 };
      return totals.ai - loss >= totals.human * 0.5;
    }

    var points = snapshot.points;
    if (points === undefined) points = object(snapshot.pointsByTeam)[team];
    if (points === undefined) points = object(snapshot.turnPoints)[team];
    if (points === undefined) points = object(snapshot.pontosDoTurn)[team];
    points = Number(points);
    var moveCosts = { 8: 1, 7: 4, 6: 16, 5: 64, 4: 256, 3: 1024, 2: 4096 };
    var promotionCosts = { 8: 3, 7: 9, 6: 27, 5: 81, 4: 243, 3: 729, 2: 2197 };

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
          return {
            type: 'promote',
            source: candidates[0].source,
            target: candidates[0].target,
            amount: candidates[0].amount
          };
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
        if (owns(target, human)) continue;
        var targetOwner = object(regions[target]).dominator || object(regions[target]).owner;
        if (targetOwner && targetOwner !== 'free' && targetOwner !== team) continue;
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

    function getPurchaseAction(code, stage) {
      if (!owns(code, team) || owns(code, human)) return null;
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
      if (stage === 'g' && currentCounts.f >= 2 && nextCounts.g > currentCounts.g) {
        followUp = findGFollowUp(code, nextCounts, cost);
        if (!followUp) return null;
      }
      return { type: 'buy', source: code, stage: stage, followUp: followUp };
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

    var recycleThresholdByLayer = { 8: 25, 7: 80, 6: 400, 5: 800 };
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
            return {
              type: 'promote',
              source: promotionRoute[0].source,
              target: promotionRoute[0].target,
              amount: weights[recycleCandidate.stage]
            };
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
      return {
        type: compactionTransfer.type,
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
      return {
        type: 'promote',
        source: capacityPromotion.source,
        target: capacityPromotion.target,
        amount: capacityPromotion.amount
      };
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
      return {
        type: threeFAndGTransfer.type,
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
      return {
        type: repair.type,
        source: repair.source,
        target: repair.target,
        amount: repair.amount
      };
    }

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
        if (targetLayer === layer(source)) {
          if (!isReverseMoveBlocked(source, target, 1) &&
              points >= (moveCosts[layer(source)] || Infinity) &&
              transferPreservesComposition(source, target, team, 1)) {
            freeMoves.push({ source: source, target: target, force: sourceForce });
          }
        } else if (targetLayer === layer(source) - 1) {
          if (points >= (promotionCosts[layer(source)] || Infinity) &&
              transferPreservesComposition(source, target, team, 1)) {
            freePromotions.push({ source: source, target: target, force: sourceForce });
          }
        }
      });
    });
    if (freeMoves.length) {
      freeMoves.sort(function (a, b) { return b.force - a.force; });
      return { type: 'move', source: freeMoves[0].source, target: freeMoves[0].target };
    }
    if (freePromotions.length) {
      freePromotions.sort(function (a, b) { return b.force - a.force; });
      return { type: 'promote', source: freePromotions[0].source, target: freePromotions[0].target };
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
    var threatenedHumanRegions = codes
      .filter(function (code) {
        return finalForce(code, human) > finalForce(code, team);
      })
      .sort(function (a, b) {
        return finalForce(b, human) - finalForce(a, human) ||
           finalForce(a, team) - finalForce(b, team) || a.localeCompare(b);
      });
    if (threatenedHumanRegions.length) {
      var targetRegion = threatenedHumanRegions[0];
      var requiredOuterSoldiers = outerSoldiersForTargetLayer(layer(targetRegion));
      var rankedPurchaseRegions = purchaseRegions.map(function (code) {
        return {
           code: code,
           distance: distanceToRegion(code, targetRegion),
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
        outerForce.ai < outerForce.human * 0.5) {
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
      return { type: 'promote', source: promotions[0].source, target: promotions[0].target };
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

  root.WillOfManyAI = { chooseAction: chooseAction };
})(typeof window !== 'undefined' ? window : globalThis);
