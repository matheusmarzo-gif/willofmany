(function (root, factory) {
  const rules = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = rules;
  } else {
    root.WillOfManyRules = rules;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const soldierWeights = Object.freeze({
    g: 1,
    f: 7,
    e: 42,
    d: 210,
    c: 840,
    b: 2520,
    a: 5040
  });
  const stageOrder = Object.freeze(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
  const ascendingStages = Object.freeze(['g', 'f', 'e', 'd', 'c', 'b', 'a']);
  const mergeThresholds = Object.freeze({ g: 7, f: 6, e: 5, d: 4, c: 3, b: 2 });
  const promotionCostBySourceLayer = Object.freeze({
    8: 3,
    7: 9,
    6: 27,
    5: 81,
    4: 243,
    3: 729,
    2: 2197
  });

  function mergeTeamCounts(counts) {
    for (const stage of ascendingStages.slice(0, -1)) {
      while (Number(counts[stage] || 0) >= mergeThresholds[stage]) {
        counts[stage] = Number(counts[stage] || 0) - mergeThresholds[stage];
        const nextStage = ascendingStages[ascendingStages.indexOf(stage) + 1];
        counts[nextStage] = Number(counts[nextStage] || 0) + 1;
      }
    }
    return counts;
  }

  function getFinalPieceCountForTeam(teamCounts) {
    const counts = {};
    ascendingStages.forEach((stage) => {
      counts[stage] = Number(teamCounts[stage] || 0);
    });
    mergeTeamCounts(counts);
    return ascendingStages.reduce((sum, stage) => sum + Number(counts[stage] || 0), 0);
  }

  function buildStageCountsFromSoldierTotal(totalSoldiers) {
    const counts = Object.fromEntries(ascendingStages.map((stage) => [stage, 0]));
    let remaining = Math.max(0, Math.floor(Number(totalSoldiers) || 0));
    for (const stage of stageOrder) {
      const weight = soldierWeights[stage] || 1;
      counts[stage] = Math.floor(remaining / weight);
      remaining %= weight;
    }
    return mergeTeamCounts(counts);
  }

  function getSoldierCount(teamCounts) {
    return ascendingStages.reduce((total, stage) => {
      return total + (Number(teamCounts[stage] || 0) * (soldierWeights[stage] || 0));
    }, 0);
  }

  function getPieceCount(teamCounts) {
    return ascendingStages.reduce((total, stage) => total + Number(teamCounts[stage] || 0), 0);
  }

  function getRegionLayer(regionCode) {
    if (!regionCode) return 0;
    const match = String(regionCode).match(/^L(\d+)-/);
    return match ? Number(match[1]) : 0;
  }

  function getRecruitmentCost(targetLayer, stage) {
    if (!Object.prototype.hasOwnProperty.call(soldierWeights, stage)) return Infinity;
    if (!targetLayer) return Infinity;
    let promotionCost = 0;
    for (let sourceLayer = 8; sourceLayer > targetLayer; sourceLayer -= 1) {
      promotionCost += promotionCostBySourceLayer[sourceLayer] || 0;
    }
    return soldierWeights[stage] * (promotionCost + 1);
  }

  function getRelegationRefund(sourceCost, targetCost) {
    return Math.max(0, sourceCost / 2 - targetCost);
  }

  function getRecycleRefund(cost) {
    return Math.floor(cost / 2);
  }

  return Object.freeze({
    soldierWeights,
    stageOrder,
    promotionCostBySourceLayer,
    mergeTeamCounts,
    getFinalPieceCountForTeam,
    buildStageCountsFromSoldierTotal,
    getSoldierCount,
    getPieceCount,
    getRegionLayer,
    getRecruitmentCost,
    getRelegationRefund,
    getRecycleRefund
  });
});
