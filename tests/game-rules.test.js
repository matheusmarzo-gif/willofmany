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
