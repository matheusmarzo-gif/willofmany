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

test('desirability values reachable villages using discounted income and graph distance', () => {
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
