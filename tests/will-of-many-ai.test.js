'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
require('../will-of-many-ai');
const ai = globalThis.WillOfManyAI;
const aiConfig = require('../will-of-many-ai-config.json');

function makeSnapshot(candidates, { totalSoldiers = 100, finalForceBySource = {} } = {}) {
  const regions = {};
  const regionPiecesByRegion = {};
  const regionForceStats = {};
  const sourceSoldiers = new Map();
  candidates.forEach((candidate) => {
    sourceSoldiers.set(candidate.source, Number(candidate.soldiersBefore));
  });
  let committedSoldiers = 0;
  sourceSoldiers.forEach((soldiers, source) => {
    committedSoldiers += soldiers;
    regions[source] = { dominator: 'blue' };
    regionPiecesByRegion[source] = {
      blue: { g: soldiers },
      orange: { g: 0 }
    };
    const finalForce = finalForceBySource[source] ?? soldiers;
    regionForceStats[source] = { byTeam: { blue: { forca_final: finalForce } } };
  });
  const remainingSoldiers = Math.max(0, totalSoldiers - committedSoldiers);
  regions['L8-99'] = { dominator: 'blue' };
  regionPiecesByRegion['L8-99'] = {
    blue: { g: remainingSoldiers },
    orange: { g: 0 }
  };
  regionForceStats['L8-99'] = {
    byTeam: { blue: { forca_final: remainingSoldiers } }
  };
  return {
    aiTeam: 'blue',
    upgradeDowngradeEnabled: true,
    regions,
    regionPiecesByRegion,
    regionForceStats,
    rankChangeCandidates: candidates
  };
}

function option(source, type, neighborLayers, overrides = {}) {
  const sourceLayer = Number(/^L(\d+)-/.exec(source)[1]);
  return {
    source,
    sourceLayer,
    target: `${type === 'upgrade' ? 'L' + (sourceLayer - 1) : 'L' + (sourceLayer + 1)}-1`,
    type,
    soldiersBefore: 5,
    soldiersAfter: 2,
    cost: 1,
    neighborLayers,
    ...overrides
  };
}

test.beforeEach(() => {
  ai.setConfig(aiConfig);
});

test('rank-change AI only selects unstable regions and prefers the stabilizing direction', () => {
  const source = 'L5-1';
  const snapshot = makeSnapshot([
    option(source, 'upgrade', [3, 5]),
    option(source, 'downgrade', [3, 5])
  ]);

  assert.deepEqual(ai.chooseRankChangeAction(snapshot), {
    type: 'rankChange',
    rankChangeType: 'upgrade',
    source,
    target: 'L4-1'
  });

  snapshot.rankChangeCandidates[0].neighborLayers = [4, 6];
  snapshot.rankChangeCandidates[1].neighborLayers = [4, 6];
  assert.equal(ai.chooseRankChangeAction(snapshot), null);
});

test('rank-change AI prioritizes downgrade when neither direction stabilizes', () => {
  const source = 'L5-1';
  const snapshot = makeSnapshot([
    option(source, 'upgrade', [4]),
    option(source, 'downgrade', [4])
  ]);

  assert.deepEqual(ai.chooseRankChangeAction(snapshot), {
    type: 'rankChange',
    rankChangeType: 'downgrade',
    source,
    target: 'L6-1'
  });
});

test('rank-change AI prioritizes extremely unstable regions', () => {
  const ordinary = 'L5-1';
  const extreme = 'L5-2';
  const snapshot = makeSnapshot([
    option(ordinary, 'downgrade', [4]),
    option(extreme, 'downgrade', [])
  ], { totalSoldiers: 200 });

  assert.equal(ai.chooseRankChangeAction(snapshot).source, extreme);
});

test('rank-change AI does not exceed either five-percent commitment limit', () => {
  const source = 'L5-1';
  const excessiveSoldiers = makeSnapshot([
    option(source, 'downgrade', [], { soldiersBefore: 6 })
  ], { totalSoldiers: 100 });
  assert.equal(ai.chooseRankChangeAction(excessiveSoldiers), null);

  const excessiveFinalForce = makeSnapshot([
    option(source, 'downgrade', [])
  ], { totalSoldiers: 100, finalForceBySource: { [source]: 6 } });
  assert.equal(ai.chooseRankChangeAction(excessiveFinalForce), null);
});

test('rank-change AI aggressiveness is controlled by configured priority weights', () => {
  const source = 'L5-1';
  const snapshot = makeSnapshot([
    option(source, 'downgrade', [4])
  ]);
  ai.setConfig({ rankChange: { minimumPriority: 2 } });
  assert.equal(ai.chooseRankChangeAction(snapshot), null);
});

test('rank 8 can upgrade when downgrade is not a legal rank', () => {
  const source = 'L8-1';
  const snapshot = makeSnapshot([
    option(source, 'upgrade', [])
  ]);

  assert.deepEqual(ai.chooseRankChangeAction(snapshot), {
    type: 'rankChange',
    rankChangeType: 'upgrade',
    source,
    target: 'L7-1'
  });
});

test('desirability values reachable villages using discounted income and estimated arrival', () => {
  const snapshot = {
    aiTeam: 'blue',
    humanTeam: 'orange',
    wheatEnabled: false,
    regions: {
      'L8-1': { layer: 8, dominator: 'blue', blue: 100, orange: 0 },
      'L8-2': { layer: 8, dominator: 'free', blue: 0, orange: 0, villageBuildingLevel: 1 },
      'L8-3': { layer: 8, dominator: 'free', blue: 0, orange: 0, villageBuildingLevel: 5 },
      'L8-4': { layer: 8, dominator: 'free', blue: 0, orange: 0 }
    },
    regionNeighborCache: {
      'L8-1': { right: ['L8-2'] },
      'L8-2': { left: ['L8-1'], right: ['L8-3'] },
      'L8-3': { left: ['L8-2'], right: ['L8-4'] },
      'L8-4': { left: ['L8-3'] }
    }
  };
  const result = ai.calculateDesirability(snapshot, aiConfig.desirability);
  const villageBonus = (code) => result.regions[code].internalBreakdown
    .find((entry) => entry.label.includes('valor econômico descontado'))?.value || 0;

  assert.ok(villageBonus('L8-2') > 0);
  assert.ok(villageBonus('L8-3') > villageBonus('L8-2'),
    'the higher-yield village is more desirable even when one graph step farther away');
  assert.ok(villageBonus('L8-3') <= aiConfig.povoados.maxDesirabilityBonus);
  assert.equal(villageBonus('L8-4'), 0, 'regions without a settlement get no settlement bonus');
});

test('resource route arrival uses estimated actions and available coin income, not one turn per step', () => {
  const settings = aiConfig.resourceRoutes;

  assert.equal(ai.estimateResourceRouteArrivalTurns(
    { steps: 8, travelCost: 8 },
    { points: 8, coinsPerTurn: 8 },
    settings
  ), 1, 'eight affordable route actions can fit in one estimated turn');
  assert.equal(ai.estimateResourceRouteArrivalTurns(
    { steps: 8, travelCost: 32 },
    { points: 8, coinsPerTurn: 8 },
    settings
  ), 4, 'movement cost delays the route when it exceeds the available income');
});

test('resource routes choose cheaper outer-rank access and price enemy capture risk', () => {
  const snapshot = {
    aiTeam: 'blue',
    humanTeam: 'orange',
    wheatEnabled: false,
    points: 8,
    coinsPerTurn: 8,
    regions: {
      'L8-1': { layer: 8, dominator: 'blue', blue: 3, orange: 0 },
      'L7-1': { layer: 7, dominator: 'blue', blue: 3, orange: 0 },
      'L7-2': {
        layer: 7,
        dominator: 'free',
        blue: 0,
        orange: 0,
        farmBuildingLevel: 5
      }
    },
    regionNeighborCache: {
      'L8-1': { inferior: ['L7-2'] },
      'L7-1': { sameRank: ['L7-2'] },
      'L7-2': { superior: ['L8-1'], sameRank: ['L7-1'] }
    }
  };
  const freeRoute = ai.calculateDesirability(
    snapshot,
    aiConfig.desirability
  ).regions['L7-2'].resourceRoute.route;

  assert.equal(freeRoute.source, 'L8-1',
    'the lower-cost outer-rank promotion is preferred over inner-rank movement');
  assert.equal(freeRoute.travelCost, 3);
  snapshot.regions['L7-2'].dominator = 'orange';
  const enemyRoute = ai.calculateDesirability(
    snapshot,
    aiConfig.desirability
  ).regions['L7-2'].resourceRoute.route;

  assert.equal(enemyRoute.cost - freeRoute.cost, aiConfig.povoados.enemyCaptureCostPerStep -
    aiConfig.povoados.captureCostPerStep);
});

test('farms attract the first legal route step even without a wheat deficit', () => {
  const snapshot = {
    aiTeam: 'blue',
    humanTeam: 'orange',
    wheatEnabled: false,
    points: 8,
    coinsPerTurn: 8,
    regions: {
      'L8-1': { layer: 8, dominator: 'blue', blue: 3, orange: 0 },
      'L8-2': { layer: 8, dominator: 'free', blue: 0, orange: 0 },
      'L8-3': {
        layer: 8,
        dominator: 'free',
        blue: 0,
        orange: 0,
        farmBuildingLevel: 5
      },
      'L8-4': { layer: 8, dominator: 'free', blue: 0, orange: 0 }
    },
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 3 }, orange: { g: 0 } }
    },
    regionPieceLimits: {
      'L8-1': 8,
      'L8-2': 8,
      'L8-3': 8,
      'L8-4': 8
    },
    regionNeighborCache: {
      'L8-1': { sameRank: ['L8-2', 'L8-4'] },
      'L8-2': { sameRank: ['L8-1', 'L8-3'] },
      'L8-3': { sameRank: ['L8-2'] },
      'L8-4': { sameRank: ['L8-1'] }
    }
  };

  const analysis = ai.calculateDesirability(snapshot, aiConfig.desirability);
  assert.equal(analysis.regions['L8-2'].resourceRoute.target, 'L8-3');
  assert.ok(analysis.regions['L8-2'].resourceRoute.bonus > 0);
  assert.equal(analysis.regions['L8-2'].resourceRoute.arrivalTurns, 1);
  assert.equal(ai.chooseAction(snapshot).target, 'L8-2',
    'the resource route first step outranks an equally accessible ordinary region');
});

test('a free farm takes priority when the AI has no farms and a wheat deficit', () => {
  const originalConfig = ai.getConfig();
  ai.setConfig({
    ...aiConfig,
    desirability: {
      ...aiConfig.desirability,
      baseScoreByLayer: {
        ...aiConfig.desirability.baseScoreByLayer,
        8: { free: 10000, allied: 30, enemy: 150 }
      }
    }
  });
  try {
    const action = ai.chooseAction({
      aiTeam: 'blue',
      humanTeam: 'orange',
      wheatEnabled: true,
      wheatBalances: { blue: 1000 },
      wheatTotalsByTeam: {
        blue: { production: 0, consumption: 1 }
      },
      points: 8,
      regions: {
        'L8-12': { dominator: 'blue' },
        'L8-11': { dominator: 'free', farmBuildingLevel: 1 },
        'L8-13': { dominator: 'free' }
      },
      regionPiecesByRegion: {
        'L8-12': { blue: { g: 4 }, orange: {} }
      },
      regionPieceLimits: {
        'L8-12': 8,
        'L8-11': 8,
        'L8-13': 8
      },
      regionNeighborCache: {
        'L8-12': { left: ['L8-11'], right: ['L8-13'] },
        'L8-11': { right: ['L8-12'] },
        'L8-13': { left: ['L8-12'] }
      }
    });

    assert.deepEqual(action, {
      type: 'move',
      source: 'L8-12',
      target: 'L8-11',
      amount: 1
    });
  } finally {
    ai.setConfig(originalConfig);
  }
});

test('wheat urgency increases the farm route attraction as reserves approach depletion', () => {
  const snapshot = {
    aiTeam: 'blue',
    humanTeam: 'orange',
    wheatEnabled: true,
    points: 8,
    coinsPerTurn: 8,
    wheatBalances: { blue: 0 },
    wheatTotalsByTeam: {
      blue: { production: 0, consumption: 100 }
    },
    regions: {
      'L8-1': { layer: 8, dominator: 'blue', blue: 3, orange: 0 },
      'L8-2': {
        layer: 8,
        dominator: 'free',
        blue: 0,
        orange: 0,
        farmBuildingLevel: 2
      }
    },
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 3 }, orange: { g: 0 } }
    },
    regionNeighborCache: {
      'L8-1': { sameRank: ['L8-2'] },
      'L8-2': { sameRank: ['L8-1'] }
    }
  };

  const urgentAnalysis = ai.calculateDesirability(snapshot, aiConfig.desirability);
  snapshot.wheatEnabled = false;
  const stableAnalysis = ai.calculateDesirability(snapshot, aiConfig.desirability);
  const getRouteBonus = (analysis) => analysis.regions['L8-2'].resourceRoute.bonus;

  assert.ok(getRouteBonus(urgentAnalysis) > getRouteBonus(stableAnalysis));
});

test('wheat planner starts before projected reserves are exhausted', () => {
  const deficit = { production: 0, consumption: 100, balance: -100 };

  assert.equal(ai.shouldSeekFarmForWheat({ wheatBalances: { blue: 201 } }, 'blue', deficit, 2), false);
  assert.equal(ai.shouldSeekFarmForWheat({ wheatBalances: { blue: 200 } }, 'blue', deficit, 2), true);
  assert.equal(ai.shouldSeekFarmForWheat({ wheatBalances: { blue: 0 } }, 'blue', deficit, 2), true);
  assert.equal(ai.shouldSeekFarmForWheat({}, 'blue', deficit, 2), true,
    'legacy snapshots without a stock value retain immediate deficit handling');
  assert.equal(ai.shouldSeekFarmForWheat({ wheatBalances: { blue: 0 } }, 'blue', {
    production: 100,
    consumption: 100,
    balance: 0
  }, 2), false);
});
