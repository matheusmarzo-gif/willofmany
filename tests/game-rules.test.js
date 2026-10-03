'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const rules = require('../game-rules.js');

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

test('quadrilateral horizontal rotation path follows the region current row', () => {
  assert.deepEqual(
    rules.getQuadrilateralMatrixHorizontalPath([
      ['a', 'b', 'c'],
      ['d', 'L7-1', 'f'],
      ['g', 'h', 'i']
    ], 'L7-1'),
    [[1, 2], [2, 2], [3, 2]]
  );
  assert.deepEqual(
    rules.getQuadrilateralMatrixHorizontalPath([
      ['a', 'b', 'c'],
      ['L7-1', 'e', 'f'],
      ['g', 'h', 'i']
    ], 'L7-1'),
    [[1, 1], [2, 1], [3, 1]]
  );
  assert.deepEqual(
    rules.getQuadrilateralMatrixHorizontalPath([
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'L7-1']
    ], 'L7-1'),
    [[1, 3], [2, 3], [3, 3]]
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
