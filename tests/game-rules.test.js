'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const rules = require('../game-rules.js');
const aiConfig = require('../will-of-many-ai-config.json');
const circularBoard = require('../regioes-will-of-many-circular.json');
const levelFiveBoard = require('../tabuleiro-05.json');
require('../will-of-many-ai.js');
const gameAI = globalThis.WillOfManyAI;

test('piece stage weights preserve the current soldier values', () => {
  assert.deepEqual(rules.soldierWeights, {
    g: 1,
    f: 7,
    e: 42,
    d: 210,
    c: 840,
    b: 2520,
    a: 5040
  });
  assert.deepEqual(rules.stageOrder, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
});

test('AI turn action limit is configurable and defaults to 35', () => {
  const configuredLimit = Number(aiConfig.maxActionsPerTurn);
  assert.ok(Number.isInteger(configuredLimit) && configuredLimit > 0);

  const originalConfig = gameAI.getConfig();
  try {
    gameAI.setConfig(aiConfig);
    assert.equal(gameAI.getConfig().maxActionsPerTurn, configuredLimit);
    gameAI.setConfig({ maxActionsPerTurn: 12 });
    assert.equal(gameAI.getConfig().maxActionsPerTurn, 12);
  } finally {
    gameAI.setConfig(originalConfig);
  }
});

test('AI base desirability scores match the editable strategy configuration', () => {
  const expectedScores = {
    8: { free: 50, allied: 30, enemy: 150 },
    7: { free: 40, allied: 25, enemy: 105 },
    6: { free: 35, allied: 20, enemy: 75 },
    5: { free: 25, allied: 15, enemy: 55 },
    4: { free: 20, allied: 10, enemy: 35 },
    3: { free: 15, allied: 8, enemy: 25 },
    2: { free: 10, allied: 5, enemy: 20 },
    1: { free: 5, allied: 2, enemy: 10 }
  };

  assert.deepEqual(aiConfig.desirability.baseScoreByLayer, expectedScores);
  assert.deepEqual(gameAI.getConfig().desirability.baseScoreByLayer, expectedScores);
});

test('high starting coin strategy is configurable and recycles configured pieces first', () => {
  assert.deepEqual(aiConfig.highBalanceTurnRule, {
    enabled: true,
    minimumStartingCoins: 800,
    recycleByLayer: { 8: ['g', 'f'], 7: ['g'] },
    prohibitPurchasesByLayer: { 8: ['g', 'f'], 7: ['g'] }
  });
  assert.deepEqual(gameAI.getConfig().highBalanceTurnRule, aiConfig.highBalanceTurnRule);

  const snapshot = {
    aiTeam: 'blue',
    humanTeam: 'orange',
    points: 801,
    aiTurnStartingPoints: 801,
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 1, f: 1, e: 1 }, orange: {} },
      'L8-2': { blue: { g: 1, f: 1, e: 1 }, orange: {} },
      'L7-1': { blue: { g: 1, f: 1, e: 1 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L8-2': { dominator: 'blue' },
      'L7-1': { dominator: 'blue' }
    },
    regionPieceLimits: { 'L8-1': 8, 'L8-2': 8, 'L7-1': 7 }
  };
  const expectedRecycles = [
    { type: 'recycle', source: 'L8-1', stage: 'g' },
    { type: 'recycle', source: 'L8-2', stage: 'g' },
    { type: 'recycle', source: 'L8-1', stage: 'f' },
    { type: 'recycle', source: 'L8-2', stage: 'f' },
    { type: 'recycle', source: 'L7-1', stage: 'g' }
  ];

  expectedRecycles.forEach((expected) => {
    assert.deepEqual(gameAI.chooseAction(snapshot), expected);
    snapshot.regionPiecesByRegion[expected.source].blue[expected.stage] -= 1;
  });
});

test('high-balance turn threshold is strict and purchase bans use the starting balance', () => {
  const snapshot = {
    aiTeam: 'blue',
    humanTeam: 'orange',
    points: 900,
    aiTurnStartingPoints: 800,
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 1 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' }
    },
    regionPieceLimits: { 'L8-1': 8 }
  };

  assert.equal(gameAI.chooseAction(snapshot).type, 'buy');

  snapshot.aiTurnStartingPoints = 801;
  const action = gameAI.chooseAction(snapshot);
  assert.notEqual(action.type, 'recycle');
  assert.ok(action.type !== 'buy' ||
    !(action.source.startsWith('L8-') && ['g', 'f'].includes(action.stage)));
});

test('high-balance turn still permits unbanned purchases on L7', () => {
  const originalConfig = gameAI.getConfig();
  gameAI.setConfig({
    highBalanceTurnRule: {
      enabled: true,
      minimumStartingCoins: 800,
      recycleByLayer: { 8: ['g', 'f'], 7: ['g'] },
      prohibitPurchasesByLayer: {
        8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        7: ['a', 'b', 'c', 'd', 'e', 'f']
      }
    }
  });
  try {
    const action = gameAI.chooseAction({
      aiTeam: 'blue',
      humanTeam: 'orange',
      points: 900,
      aiTurnStartingPoints: 801,
      regionPiecesByRegion: {
        'L8-1': { blue: { e: 1 }, orange: {} },
        'L7-1': { blue: { g: 1 }, orange: {} }
      },
      regions: {
        'L8-1': { dominator: 'blue' },
        'L7-1': { dominator: 'blue' }
      },
      regionPieceLimits: { 'L8-1': 8, 'L7-1': 7 }
    });

    assert.deepEqual(action, {
      type: 'buy',
      source: 'L7-1',
      stage: 'g',
      followUp: null
    });
  } finally {
    gameAI.setConfig(originalConfig);
  }
});

test('farm production tiers are shared and map 250 wheat per turn to level 1', () => {
  assert.deepEqual(rules.farmProductionByLevel, {
    1: 250,
    2: 1000,
    3: 4000,
    4: 16000,
    5: 50000
  });
  const analysis = gameAI.calculateDesirability({
    regions: {
      'L8-1': { dominator: 'free', farmProductionPerTurn: 250 }
    }
  });

  assert.deepEqual(analysis.regions['L8-1'].internalBreakdown, [
    { label: 'Base L8 livre', value: 50 },
    { label: 'Fazenda nível 1', value: 30 }
  ]);
});

test('annular sector centroid matches the geometric center of circular regions', () => {
  const block = circularBoard.blocks[0];
  const region = block.regions.find((entry) => entry.code === 'L8-1');
  const centroid = rules.getAnnularSectorCentroid({
    centerX: block.center.x,
    centerY: block.center.y,
    innerRadius: region.r1,
    outerRadius: region.r2,
    startAngle: region.g1,
    endAngle: region.g2
  });

  assert.ok(Math.abs(centroid.x - 297.1) < 0.1);
  assert.ok(Math.abs(centroid.y - 75.2) < 0.1);
});

test('circular board desirability distances use the centroid of every annular sector', () => {
  const regions = Object.fromEntries(circularBoard.blocks.flatMap((block) =>
    block.regions.map((region) => {
      const centroid = rules.getAnnularSectorCentroid({
        centerX: block.center.x,
        centerY: block.center.y,
        innerRadius: region.r1,
        outerRadius: region.r2,
        startAngle: region.g1,
        endAngle: region.g2
      });
      return [region.code, {
        dominator: 'free',
        centerX: centroid.x,
        centerY: centroid.y
      }];
    })));
  const analysis = gameAI.calculateDesirability({ aiTeam: 'blue', regions });
  const points = Object.values(regions);
  const expectedMaximumDistance = points.reduce((maximum, first, firstIndex) =>
    points.slice(firstIndex + 1).reduce((pairMaximum, second) =>
      Math.max(pairMaximum, Math.hypot(
        first.centerX - second.centerX,
        first.centerY - second.centerY
      )), maximum), 0);

  assert.ok(analysis.maxDistance > 0);
  assert.equal(analysis.maxDistance, expectedMaximumDistance);
});

test('merging seven G pieces creates one F piece in place', () => {
  const counts = { g: 7, f: 0, e: 0, d: 0, c: 0, b: 0, a: 0 };

  const result = rules.mergeTeamCounts(counts);

  assert.strictEqual(result, counts);
  assert.deepEqual(counts, { g: 0, f: 1, e: 0, d: 0, c: 0, b: 0, a: 0 });
});

test('merging cascades through higher ranks', () => {
  assert.deepEqual(
    rules.mergeTeamCounts({ g: 42, f: 0, e: 0, d: 0, c: 0, b: 0, a: 0 }),
    { g: 0, f: 0, e: 1, d: 0, c: 0, b: 0, a: 0 }
  );
});

test('final piece count evaluates a merged copy without mutating the source', () => {
  const counts = { g: 7, f: 1, e: 0, d: 0, c: 0, b: 0, a: 0 };

  assert.equal(rules.getFinalPieceCountForTeam(counts), 2);
  assert.deepEqual(counts, { g: 7, f: 1, e: 0, d: 0, c: 0, b: 0, a: 0 });
});

test('soldier totals can be represented as canonical stage counts', () => {
  const counts = rules.buildStageCountsFromSoldierTotal(42);

  assert.deepEqual(counts, { g: 0, f: 0, e: 1, d: 0, c: 0, b: 0, a: 0 });
  assert.equal(rules.getSoldierCount(counts), 42);
  assert.equal(rules.getPieceCount(counts), 1);
});

test('stage-count conversion floors fractional totals and clamps negative totals', () => {
  assert.deepEqual(
    rules.buildStageCountsFromSoldierTotal(7.9),
    { g: 0, f: 1, e: 0, d: 0, c: 0, b: 0, a: 0 }
  );
  assert.deepEqual(
    rules.buildStageCountsFromSoldierTotal(-2),
    { g: 0, f: 0, e: 0, d: 0, c: 0, b: 0, a: 0 }
  );
});

test('AI prefers an affordable F purchase across regions over a non-expansion G purchase', () => {
  const action = gameAI.chooseAction({
    aiTeam: 'blue',
    humanTeam: 'orange',
    points: 35,
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 1, f: 2 }, orange: {} },
      'L8-2': { blue: { g: 1 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L8-2': { dominator: 'blue' }
    },
    regionPieceLimits: { 'L8-1': 8, 'L8-2': 8 }
  });

  assert.deepEqual(action, {
    type: 'buy',
    source: 'L8-2',
    stage: 'f',
    followUp: null
  });
});

test('AI prefers F at an upper layer over a cheaper direct G purchase at a lower layer', () => {
  const action = gameAI.chooseAction({
    aiTeam: 'blue',
    humanTeam: 'orange',
    points: 35,
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 8 }, orange: {} },
      'L7-1': { blue: {}, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L7-1': { dominator: 'blue' }
    },
    createdPieces: [{ source: 'L8-1', stage: 'g' }],
    regionPieceLimits: { 'L8-1': 8, 'L7-1': 7 }
  });

  assert.deepEqual(action, {
    type: 'buy',
    source: 'L8-1',
    stage: 'f',
    followUp: null
  });
});

test('AI still buys a useful F when only 24 coins remain', () => {
  const action = gameAI.chooseAction({
    aiTeam: 'blue',
    humanTeam: 'orange',
    points: 24,
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 1, f: 1 }, orange: {} },
      'L8-2': { blue: { g: 1 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L8-2': { dominator: 'blue' }
    },
    regionPieceLimits: { 'L8-1': 8, 'L8-2': 8 }
  });

  assert.deepEqual(action, {
    type: 'buy',
    source: 'L8-2',
    stage: 'f',
    followUp: null
  });
});

test('AI prioritizes buying G when it can immediately expand into a free region', () => {
  const action = gameAI.chooseAction({
    aiTeam: 'blue',
    humanTeam: 'orange',
    points: 35,
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 1 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L8-2': { dominator: 'free' }
    },
    regionNeighborCache: {
      'L8-1': { right: ['L8-2'] },
      'L8-2': { left: ['L8-1'] }
    },
    regionPieceLimits: { 'L8-1': 8, 'L8-2': 8 }
  });

  assert.deepEqual(action, {
    type: 'buy',
    source: 'L8-1',
    stage: 'g',
    followUp: { type: 'move', source: 'L8-1', target: 'L8-2', amount: 1 }
  });
});

test('AI buys F instead of G when no free region can be conquered with the G', () => {
  const action = gameAI.chooseAction({
    aiTeam: 'blue',
    humanTeam: 'orange',
    points: 35,
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 1 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L8-2': { dominator: 'orange' }
    },
    regionNeighborCache: {
      'L8-1': { right: ['L8-2'] },
      'L8-2': { left: ['L8-1'] }
    },
    regionPieceLimits: { 'L8-1': 8, 'L8-2': 8 }
  });

  assert.deepEqual(action, {
    type: 'buy',
    source: 'L8-1',
    stage: 'f',
    followUp: null
  });
});

test('AI prioritizes the nearest wheat field when its ongoing wheat balance is negative', () => {
  const action = gameAI.chooseAction({
    aiTeam: 'blue',
    humanTeam: 'orange',
    wheatEnabled: true,
    wheatTotalsByTeam: {
      blue: { production: 0, consumption: 6 }
    },
    points: 35,
    regionPiecesByRegion: {
      'L8-1': { blue: { f: 1, g: 2 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L7-1': { dominator: 'free', farmProductionPerTurn: 25 },
      'L7-2': { dominator: 'free', farmProductionPerTurn: 100 }
    },
    regionNeighborCache: {
      'L8-1': { inferior: ['L7-1'] },
      'L7-1': { superior: ['L8-1'], right: ['L7-2'] },
      'L7-2': { left: ['L7-1'] }
    },
    regionPieceLimits: { 'L8-1': 8, 'L7-1': 7, 'L7-2': 7 }
  });

  assert.deepEqual(action, {
    type: 'buy',
    source: 'L8-1',
    stage: 'g',
    followUp: { type: 'promote', source: 'L8-1', target: 'L7-1', amount: 1 }
  });
});

test('AI buys a G before promoting one unit instead of dismantling an existing F', () => {
  const snapshot = {
    aiTeam: 'blue',
    humanTeam: 'orange',
    points: 100,
    regionPiecesByRegion: {
      'L8-1': { blue: { f: 1 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L7-1': { dominator: 'free' }
    },
    regionNeighborCache: {
      'L8-1': { inferior: ['L7-1'] },
      'L7-1': { superior: ['L8-1'] }
    },
    regionPieceLimits: { 'L8-1': 8, 'L7-1': 7 }
  };
  const preparationAction = gameAI.chooseAction(snapshot);

  assert.deepEqual(preparationAction, {
    type: 'buy',
    source: 'L8-1',
    stage: 'g',
    followUp: null
  });

  const promotionAction = gameAI.chooseAction({
    ...snapshot,
    points: 99,
    regionPiecesByRegion: {
      'L8-1': { blue: { f: 1, g: 1 }, orange: {} }
    }
  });

  assert.deepEqual(promotionAction, {
    type: 'buy',
    source: 'L8-1',
    stage: 'g',
    followUp: { type: 'promote', source: 'L8-1', target: 'L7-1', amount: 1 }
  });
});

test('AI buys a G in the wheat-route frontier when that enables an immediate move to a field', () => {
  const action = gameAI.chooseAction({
    aiTeam: 'blue',
    humanTeam: 'orange',
    wheatEnabled: true,
    wheatTotalsByTeam: {
      blue: { production: 0, consumption: 1 }
    },
    points: 35,
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 1 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L8-2': { dominator: 'free', farmProductionPerTurn: 250 }
    },
    regionNeighborCache: {
      'L8-1': { right: ['L8-2'] },
      'L8-2': { left: ['L8-1'] }
    },
    regionPieceLimits: { 'L8-1': 8, 'L8-2': 8 }
  });

  assert.deepEqual(action, {
    type: 'buy',
    source: 'L8-1',
    stage: 'g',
    followUp: { type: 'move', source: 'L8-1', target: 'L8-2', amount: 1 }
  });
});

test('AI buys the strongest denomination that still fits its promotion requirement', () => {
  const action = gameAI.chooseAction({
    aiTeam: 'blue',
    humanTeam: 'orange',
    wheatEnabled: true,
    wheatTotalsByTeam: {
      blue: { production: 0, consumption: 1 }
    },
    points: 35,
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 1 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L7-1': { dominator: 'free', farmProductionPerTurn: 250 }
    },
    regionNeighborCache: {
      'L8-1': { inferior: ['L7-1'] },
      'L7-1': { superior: ['L8-1'] }
    },
    regionPieceLimits: { 'L8-1': 8, 'L7-1': 7 }
  });

  assert.deepEqual(action, {
    type: 'buy',
    source: 'L8-1',
    stage: 'f',
    followUp: null
  });

  const nextAction = gameAI.chooseAction({
    aiTeam: 'blue',
    humanTeam: 'orange',
    wheatEnabled: true,
    wheatTotalsByTeam: {
      blue: { production: 0, consumption: 1 }
    },
    points: 28,
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 1, f: 1 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L7-1': { dominator: 'free', farmProductionPerTurn: 250 }
    },
    regionNeighborCache: {
      'L8-1': { inferior: ['L7-1'] },
      'L7-1': { superior: ['L8-1'] }
    },
    regionPieceLimits: { 'L8-1': 8, 'L7-1': 7 }
  });

  assert.deepEqual(nextAction, {
    type: 'buy',
    source: 'L8-1',
    stage: 'g',
    followUp: { type: 'promote', source: 'L8-1', target: 'L7-1', amount: 1 }
  });
});

test('AI keeps its normal priorities when wheat production covers consumption', () => {
  const action = gameAI.chooseAction({
    aiTeam: 'blue',
    humanTeam: 'orange',
    wheatEnabled: true,
    wheatTotalsByTeam: {
      blue: { production: 10, consumption: 2 }
    },
    points: 35,
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 2 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue', farmProductionPerTurn: 10 },
      'L8-2': { dominator: 'free', farmProductionPerTurn: 100 },
      'L8-3': { dominator: 'free' }
    },
    regionNeighborCache: {
      'L8-1': { left: ['L8-3'], right: ['L8-2'] },
      'L8-2': { left: ['L8-1'] },
      'L8-3': { right: ['L8-1'] }
    },
    regionPieceLimits: { 'L8-1': 8, 'L8-2': 8, 'L8-3': 8 }
  });

  assert.deepEqual(action, {
    type: 'move',
    source: 'L8-1',
    target: 'L8-2',
    amount: 1
  });
});

test('AI follows explicit same-rank neighbors instead of inventing numeric wraparound links', () => {
  const action = gameAI.chooseAction({
    aiTeam: 'blue',
    humanTeam: 'orange',
    points: 20,
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 2 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L8-2': { dominator: 'free' },
      'L8-3': { dominator: 'free' },
      'L8-4': { dominator: 'free' }
    },
    regionNeighborCache: {
      'L8-1': { sameRank: ['L8-3'] }
    },
    regionPieceLimits: {
      'L8-1': 8,
      'L8-2': 8,
      'L8-3': 8,
      'L8-4': 8
    }
  });

  assert.deepEqual(action, {
    type: 'move',
    source: 'L8-1',
    target: 'L8-3',
    amount: 1
  });
});

test('desirability applies relative troop share using occupied regions of the rank', () => {
  const analysis = gameAI.calculateDesirability({
    aiTeam: 'blue',
    humanTeam: 'orange',
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 1 }, orange: {} },
      'L8-2': { blue: { g: 9 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L8-2': { dominator: 'blue' }
    }
  });

  assert.equal(analysis.regions['L8-1'].internal, 70);
  assert.equal(analysis.regions['L8-2'].internal, -10);
});

test('external desirability uses squared base-two distance falloff', () => {
  const analysis = gameAI.calculateDesirability({
    aiTeam: 'blue',
    humanTeam: 'orange',
    regions: {
      'L8-1': { dominator: 'free', centerX: 0, centerY: 0 },
      'L8-2': { dominator: 'free', centerX: 50, centerY: 0 },
      'L8-3': { dominator: 'free', centerX: 100, centerY: 0 }
    }
  });
  const expectedContribution = Math.pow(Math.log2(1.5), 2) * 50;

  assert.equal(analysis.maxDistance, 100);
  assert.ok(Math.abs(analysis.regions['L8-2'].external - 2 * expectedContribution) < 1e-9);
  assert.ok(Math.abs(analysis.regions['L8-1'].external - expectedContribution) < 1e-9);
  assert.ok(Math.abs(
    analysis.regions['L8-2'].externalContributions['L8-1'] - expectedContribution
  ) < 1e-9);
  assert.ok(Math.abs(
    analysis.regions['L8-2'].externalContributions['L8-3'] - expectedContribution
  ) < 1e-9);
});

test('current desirability analysis is available to the Level 8 debug viewer', () => {
  const snapshot = {
    aiTeam: 'blue',
    humanTeam: 'orange',
    currentTurn: 1,
    regions: {
      'L8-99': { dominator: 'free', centerX: 0, centerY: 0 }
    }
  };

  assert.deepEqual(
    gameAI.calculateCurrentDesirability(snapshot),
    gameAI.calculateDesirability(snapshot)
  );
});

test('farms get level and wheat-deficit bonuses; unsupported and deficient ranks gain priority', () => {
  const analysis = gameAI.calculateDesirability({
    aiTeam: 'blue',
    humanTeam: 'orange',
    wheatEnabled: true,
    wheatTotalsByTeam: { blue: { production: 0, consumption: 1 } },
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 5 }, orange: {} },
      'L7-1': { blue: { g: 1 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L7-1': { dominator: 'blue', farmProductionPerTurn: 250 }
    },
    regionNeighborCache: {
      'L8-1': { inferior: ['L7-1'] },
      'L7-1': { superior: ['L8-1'] }
    },
    regionForceStats: {
      'L7-1': { byTeam: { blue: { unidades_livres_temp: 3 } } }
    }
  });

  assert.equal(analysis.rankDeficits[8], 3);
  assert.equal(analysis.regions['L8-1'].internal, 170);
  assert.equal(analysis.regions['L7-1'].internal, 155);
});

test('desirability analysis explains each internal score factor', () => {
  const analysis = gameAI.calculateDesirability({
    aiTeam: 'blue',
    humanTeam: 'orange',
    wheatEnabled: true,
    wheatTotalsByTeam: { blue: { production: 0, consumption: 1 } },
    regions: {
      'L8-1': { dominator: 'free', farmProductionPerTurn: 1 }
    }
  });
  const score = analysis.regions['L8-1'];

  assert.equal(score.internal, 180);
  assert.deepEqual(score.internalBreakdown, [
    { label: 'Base L8 livre', value: 50 },
    { label: 'Fazenda nível 1', value: 30 },
    { label: 'Déficit de trigo', value: 100 }
  ]);
});

test('inaccessible desirability penalty requires no equal or adjacent-rank neighbor', () => {
  const snapshot = {
    aiTeam: 'blue',
    humanTeam: 'orange',
    currentTurn: 300,
    points: 0,
    regionPiecesByRegion: {
      'L6-91': { blue: { g: 2 }, orange: {} }
    },
    regions: {
      'L6-91': { dominator: 'blue' },
      'L8-93': { dominator: 'free' }
    },
    regionNeighborCache: {
      'L6-91': { sameRank: [], inferior: ['L8-93'] },
      'L8-93': { sameRank: [], superior: ['L6-91'] }
    },
    regionPieceLimits: {
      'L6-91': 8,
      'L8-93': 8
    }
  };

  assert.equal(gameAI.chooseAction(snapshot).type, 'pass');
  const score = gameAI.calculateCurrentDesirability(snapshot).regions['L8-93'];
  const penalty = score.internalBreakdown.find((factor) => factor.type === 'inaccessible');

  assert.deepEqual(penalty, {
    type: 'inaccessible',
    label: 'Penalidade: Inacessibilidade',
    description: 'Sem vizinhos de rank igual ou imediatamente adjacente.',
    value: -20
  });
});

test('eligible neighboring ranks receive a typed unavailable-action penalty, not inaccessible', () => {
  const snapshot = {
    aiTeam: 'blue',
    humanTeam: 'orange',
    currentTurn: 301,
    points: 0,
    regionPiecesByRegion: {
      'L8-92': { blue: { g: 2 }, orange: {} }
    },
    regions: {
      'L8-92': { dominator: 'blue' },
      'L7-94': { dominator: 'free' }
    },
    regionNeighborCache: {
      'L8-92': { sameRank: [], inferior: ['L7-94'] },
      'L7-94': { sameRank: [], superior: ['L8-92'] }
    },
    regionPieceLimits: {
      'L8-92': 8,
      'L7-94': 8
    }
  };

  assert.equal(gameAI.chooseAction(snapshot).type, 'pass');
  const score = gameAI.calculateCurrentDesirability(snapshot).regions['L7-94'];

  assert.ok(score.internalBreakdown.some((factor) =>
    factor.type === 'unavailableAction' &&
    factor.label === 'Penalidade: Ação temporariamente inviável' &&
    factor.description.includes('Há vizinhos de rank elegível')
  ));
  assert.ok(!score.internalBreakdown.some((factor) => factor.type === 'inaccessible'));
});

test('AI plans a purchase and promotion toward the highest-desirability free region', () => {
  const action = gameAI.chooseAction({
    aiTeam: 'blue',
    humanTeam: 'orange',
    points: 35,
    regionPiecesByRegion: {
      'L8-1': { blue: { g: 1 }, orange: {} }
    },
    regions: {
      'L8-1': { dominator: 'blue' },
      'L7-1': { dominator: 'free', farmProductionPerTurn: 250 }
    },
    regionNeighborCache: {
      'L8-1': { inferior: ['L7-1'] },
      'L7-1': { superior: ['L8-1'] }
    },
    regionPieceLimits: { 'L8-1': 8, 'L7-1': 7 }
  });

  assert.deepEqual(action, {
    type: 'buy',
    source: 'L8-1',
    stage: 'f',
    followUp: null
  });
});

test('AI requests a temporary random rotation when the selected region has no usable adjacent rank', () => {
  const action = gameAI.chooseAction({
    aiTeam: 'blue',
    humanTeam: 'orange',
    currentTurn: 1,
    points: 10,
    regionPiecesByRegion: { 'L6-1': { blue: { g: 2 }, orange: {} } },
    regions: {
      'L6-1': { dominator: 'blue' },
      'L8-1': { dominator: 'free' }
    },
    regionNeighborCache: { 'L6-1': { inferior: ['L8-1'] } },
    regionPieceLimits: { 'L6-1': 6, 'L8-1': 8 },
    rotationTargetsByRegion: {
      'L8-1': [{
        key: 'quadrilateral:block:ring:1',
        layer: 8,
        kind: 'quadrilateral',
        blockName: 'block',
        globalAvailable: true,
        localAvailable: false
      }]
    }
  });

  assert.equal(action.type, 'rotate');
  assert.equal(action.regionCode, 'L8-1');
  assert.equal(action.rotationPassType, 'global');
  assert.ok(['left', 'right'].includes(action.direction));
});

test('region layer parsing preserves invalid-code behavior', () => {
  assert.equal(rules.getRegionLayer('L8-3'), 8);
  assert.equal(rules.getRegionLayer('L1-center'), 1);
  assert.equal(rules.getRegionLayer('region-8'), 0);
  assert.equal(rules.getRegionLayer(null), 0);
});

test('war visits higher ranks first, descending region number within each rank', () => {
  assert.deepEqual(rules.getWarRegionOrder([
    'L2-1', 'L1-1', 'L2-2', 'L1-2', 'L8-1', 'L8-16', 'L2-4', 'L2-3'
  ]), [
    'L1-2', 'L1-1', 'L2-4', 'L2-3', 'L2-2', 'L2-1', 'L8-16', 'L8-1'
  ]);
});

test('war groups all unspent adjacent armies and skips a region after it fought', () => {
  const regionOrder = rules.getWarRegionOrder([
    'L8-10', 'L8-11', 'L8-9'
  ]);
  const conflicts = rules.buildWarConflicts(regionOrder, {
    'L8-11': ['L8-10'],
    'L8-10': ['L8-11', 'L8-9'],
    'L8-9': ['L8-10']
  }, {
    'L8-11': 'orange',
    'L8-10': 'orange',
    'L8-9': 'blue'
  });

  assert.deepEqual(conflicts, [{
    regionCode: 'L8-10',
    alliedRegions: ['L8-10', 'L8-11'],
    enemyRegions: ['L8-9'],
    attacker: 'orange'
  }]);
});

test('war conflict flags are fresh for every new iteration', () => {
  const regionOrder = rules.getWarRegionOrder(['L8-1', 'L8-2']);
  const neighbors = { 'L8-1': ['L8-2'], 'L8-2': ['L8-1'] };
  const dominators = { 'L8-1': 'orange', 'L8-2': 'blue' };

  assert.deepEqual(
    rules.buildWarConflicts(regionOrder, neighbors, dominators),
    rules.buildWarConflicts(regionOrder, neighbors, dominators)
  );
});

test('quadrilateral cells are neighbors across blocks when rotated edges touch', () => {
  const levelThreeL8OneAtThreeThree = { x: 1250, y: 375, width: 500, height: 150 };
  const levelThreeL8SevenAtOneOne = { x: 1750, y: 375, width: 500, height: 150 };

  assert.equal(
    rules.areAxisAlignedCellsNeighbors(
      levelThreeL8OneAtThreeThree,
      levelThreeL8SevenAtOneOne
    ),
    true
  );
  assert.equal(
    rules.areAxisAlignedCellsNeighbors(
      levelThreeL8OneAtThreeThree,
      { ...levelThreeL8SevenAtOneOne, y: 525 }
    ),
    false,
    'corner-only contact is not a move neighbor'
  );
  assert.equal(
    rules.areAxisAlignedCellsNeighbors(
      levelThreeL8OneAtThreeThree,
      { ...levelThreeL8SevenAtOneOne, y: 525 },
      1,
      true
    ),
    true,
    'battle adjacency can include corner-only contact when the board enables it'
  );
  assert.equal(
    rules.areAxisAlignedCellsNeighbors(
      levelThreeL8OneAtThreeThree,
      { ...levelThreeL8SevenAtOneOne, x: 1752 }
    ),
    false,
    'a real gap between cells is not a neighbor'
  );
});

test('BQ04 rotates its configured 2x2 area without moving regions into another block', () => {
  const initial = [
    [null, null, null, null],
    ['L8-10', 'L8-11', null, null],
    [null, null, null, null],
    [null, null, null, null]
  ];
  const expectedRight = [
    ['L8-10', null, null, null],
    ['L8-11', null, null, null],
    [null, null, null, null],
    [null, null, null, null]
  ];
  const area = { row: 1, column: 1, size: 2 };

  assert.deepEqual(rules.rotateQuadrilateralMatrix(initial, 'right', area), expectedRight);
  assert.deepEqual(
    rules.rotateQuadrilateralMatrix(
      rules.rotateQuadrilateralMatrix(initial, 'right', area),
      'left',
      area
    ),
    initial,
    'rotating right then left restores the original block'
  );
  assert.deepEqual(initial[1], ['L8-10', 'L8-11', null, null],
    'rotation does not mutate the source matrix');
});

test('quadrilateral blocks without a custom area keep recursive ring rotation', () => {
  assert.deepEqual(
    rules.rotateQuadrilateralMatrix([
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'i']
    ], 'right'),
    [
      ['d', 'a', 'b'],
      ['g', 'e', 'c'],
      ['h', 'i', 'f']
    ]
  );
});

test('quadrilateral rotation path cycles only its ordered cells in either direction', () => {
  const initial = [
    ['a', 'b', 'c'],
    ['d', 'e', 'f'],
    ['g', 'h', 'i']
  ];
  const path = [[1, 2], [2, 2], [3, 2]];
  assert.deepEqual(
    rules.rotateQuadrilateralMatrixPath(initial, 'right', path),
    [
      ['a', 'h', 'c'],
      ['d', 'b', 'f'],
      ['g', 'e', 'i']
    ]
  );
  assert.deepEqual(
    rules.rotateQuadrilateralMatrixPath(
      rules.rotateQuadrilateralMatrixPath(initial, 'right', path),
      'left',
      path
    ),
    initial,
    'rotating the same path in opposite directions restores the original matrix'
  );
  assert.deepEqual(initial[1], ['d', 'e', 'f'],
    'path rotation does not mutate the source matrix');
  assert.throws(
    () => rules.rotateQuadrilateralMatrixPath(initial, 'right', [[2, 1], [2, 1]]),
    RangeError
  );
});

test('quadrilateral ring paths rotate only the selected ring and leave the fixed center alone', () => {
  const initial = [
    ['a', 'b', 'c'],
    ['d', 'e', 'f'],
    ['g', 'h', 'i']
  ];
  const ringPath = rules.getQuadrilateralMatrixRingPath(initial, [1, 2]);
  assert.deepEqual(ringPath, [
    [1, 1], [1, 2], [1, 3], [2, 3],
    [3, 3], [3, 2], [3, 1], [2, 1]
  ]);
  assert.equal(rules.getQuadrilateralMatrixRingPath(initial, [2, 2]), null);
  const rotated = rules.rotateQuadrilateralMatrixPath(initial, 'right', ringPath);
  assert.equal(rotated[1][1], 'e');
  assert.deepEqual(
    rotated.flat().sort(),
    initial.flat().sort(),
    'rotating a ring preserves every region exactly once'
  );
});

test('quadrilateral rotation groups follow matrix positions and overlap at the enabled center cross', () => {
  const matrix = [
    ['L8-9', null, null],
    ['L8-10', 'L7-1', null],
    ['L8-11', null, null]
  ];
  assert.deepEqual(
    rules.getQuadrilateralMatrixRotationGroups(matrix, 'L8-10', true),
    [{ type: 'ring', index: 1 }, { type: 'linear', index: 2 }]
  );
  const rotatedMatrix = rules.rotateQuadrilateralMatrixPath(
    matrix,
    'right',
    rules.getQuadrilateralMatrixRingPath(matrix, [1, 1])
  );
  assert.deepEqual(
    rules.getQuadrilateralMatrixRotationGroups(rotatedMatrix, 'L8-9', true),
    [{ type: 'ring', index: 1 }, { type: 'linear', index: 2 }],
    'a region gains linear membership after rotating into the central cross'
  );
  assert.deepEqual(
    rules.getQuadrilateralMatrixRotationGroups(matrix, 'L7-1', true),
    [{ type: 'linear', index: 2 }]
  );
  assert.deepEqual(
    rules.getQuadrilateralMatrixRotationGroups(matrix, 'L8-9', false),
    [{ type: 'ring', index: 1 }]
  );
  assert.deepEqual(
    rules.getQuadrilateralMatrixRotationGroups([
      ['a', 'b', 'c', 'd', 'e'],
      ['f', 'g', 'h', 'i', 'j'],
      ['k', 'l', 'm', 'n', 'o'],
      ['p', 'q', 'r', 's', 't'],
      ['u', 'v', 'w', 'x', 'y']
    ], 'g', true),
    [{ type: 'ring', index: 2 }]
  );
  assert.deepEqual(
    rules.getQuadrilateralMatrixRotationGroups([
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'i']
    ], 'b', true),
    [{ type: 'ring', index: 1 }, { type: 'linear', index: 2 }]
  );
  assert.deepEqual(
    rules.getQuadrilateralMatrixRotationGroups([
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'i']
    ], 'e', false),
    []
  );
});

test('quadrilateral horizontal rotation path follows the region current row', () => {
  assert.deepEqual(
    rules.getQuadrilateralMatrixHorizontalPath([
      ['a', 'b', 'c'],
      ['d', 'L7-1', 'f'],
      ['g', 'h', 'i']
    ], 'L7-1'),
    [[2, 1], [2, 2], [2, 3]]
  );
  assert.deepEqual(
    rules.getQuadrilateralMatrixHorizontalPath([
      ['a', 'b', 'c'],
      ['L7-1', 'e', 'f'],
      ['g', 'h', 'i']
    ], 'L7-1'),
    [[2, 1], [2, 2], [2, 3]]
  );
  assert.deepEqual(
    rules.getQuadrilateralMatrixHorizontalPath([
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'L7-1']
    ], 'L7-1'),
    [[3, 1], [3, 2], [3, 3]]
  );
  assert.equal(
    rules.getQuadrilateralMatrixHorizontalPath([['a', 'b'], ['c', 'd']], 'L7-1'),
    null
  );
  assert.throws(
    () => rules.getQuadrilateralMatrixHorizontalPath([['L7-1', 'L7-1'], ['a', 'b']], 'L7-1'),
    RangeError
  );
});

test('quadrilateral linear rotation paths follow the region row and column', () => {
  const matrix = [
    ['a', 'b', 'c', 'd'],
    ['e', 'f', 'g', 'h'],
    ['i', 'L7-1', 'k', 'l'],
    ['m', 'n', 'o', 'p']
  ];
  const paths = rules.getQuadrilateralMatrixLinearPaths(matrix, 'L7-1');
  assert.deepEqual(paths, {
    horizontal: [[3, 1], [3, 2], [3, 3], [3, 4]],
    vertical: [[1, 2], [2, 2], [3, 2], [4, 2]]
  });
  assert.deepEqual(
    rules.rotateQuadrilateralMatrixPath(matrix, 'right', paths.horizontal)
      [2],
    ['l', 'i', 'L7-1', 'k'],
    'a left-to-right swipe advances the selected row'
  );
  assert.deepEqual(
    rules.rotateQuadrilateralMatrixPath(matrix, 'left', paths.horizontal)
      [2],
    ['L7-1', 'k', 'l', 'i'],
    'a right-to-left swipe reverses the selected row'
  );
  assert.deepEqual(
    rules.rotateQuadrilateralMatrixPath(matrix, 'right', paths.vertical)
      .map((row) => row[1]),
    ['n', 'b', 'f', 'L7-1'],
    'a top-to-bottom swipe advances the selected column'
  );
  assert.deepEqual(
    rules.rotateQuadrilateralMatrixPath(matrix, 'left', paths.vertical)
      .map((row) => row[1]),
    ['f', 'L7-1', 'n', 'b'],
    'a bottom-to-top swipe reverses the selected column'
  );
  assert.equal(
    rules.getQuadrilateralMatrixLinearPaths([['a', 'b'], ['c', 'd']], 'L7-1'),
    null
  );
  assert.throws(
    () => rules.getQuadrilateralMatrixLinearPaths(
      [['L7-1', 'L7-1'], ['a', 'b']],
      'L7-1'
    ),
    RangeError
  );
});

test('Level 5 BQ03 linear routes follow horizontal rows and vertical columns', () => {
  const block = levelFiveBoard.blocks.find((item) => item.name === 'BQ03');
  const paths = rules.getQuadrilateralMatrixLinearPaths(block.matrix, 'L7-1');

  assert.deepEqual(paths, {
    horizontal: [[2, 1], [2, 2], [2, 3]],
    vertical: [[1, 2], [2, 2], [3, 2]]
  });
  assert.deepEqual(
    rules.rotateQuadrilateralMatrixPath(block.matrix, 'right', paths.horizontal),
    [['L8-9', 'L8-10', 'L8-11'], [null, null, 'L7-1'], [null, null, null]],
    'a left-to-right swipe moves L7-1 to the right'
  );
  assert.deepEqual(
    rules.rotateQuadrilateralMatrixPath(block.matrix, 'right', paths.vertical),
    [['L8-9', null, 'L8-11'], [null, 'L8-10', null], [null, 'L7-1', null]],
    'a top-to-bottom swipe moves L7-1 down'
  );
});

test('recruitment costs include promotion costs from lower layers', () => {
  assert.equal(rules.getRecruitmentCost(8, 'g'), 1);
  assert.equal(rules.getRecruitmentCost(7, 'f'), 28);
  assert.equal(rules.getRecruitmentCost(0, 'g'), Infinity);
  assert.equal(rules.getRecruitmentCost(8, 'unknown'), Infinity);
});

test('relegation and recycling refunds preserve existing rounding', () => {
  assert.equal(rules.getRelegationRefund(40, 10), 10);
  assert.equal(rules.getRelegationRefund(20, 20), 0);
  assert.equal(rules.getRecycleRefund(41), 20);
});
