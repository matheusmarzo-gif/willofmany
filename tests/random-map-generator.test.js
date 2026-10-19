'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { generateRandomBoard } = require('../random-map-generator');

test('generated maps reject non-finite region targets', () => {
  assert.throws(() => generateRandomBoard(Number.NaN), RangeError);
});

test('generated maps use unique game region IDs and wider quadrilateral cells', () => {
  for (const targetRegions of [60, 65, 180, 900]) {
    const board = generateRandomBoard(targetRegions);
    assert.equal(board.boardType, 'quadrilateral');
    assert.equal(board.randomMap.targetRegions, targetRegions);
    assert.ok(board.blocks.length > 0);

    const cells = [];
    const regions = board.blocks.flatMap((block) => {
      assert.equal(block.type, 'quadrilateral');
      assert.equal(block.L1, 1000);
      assert.equal(block.L2, 500);
      assert.equal(block.rotationEnabled, false);
      assert.equal(block.linearRotationEnabled, false);
      assert.equal(block.matrix.length, block.matrixSize);
      assert.equal(block.matrix.every((row) => row.length === block.matrixSize), true);
      return block.regions.map((region) => {
        assert.match(region.code, /^L[1-8]-\d+$/);
        assert.equal(region.layer, Number(region.code.match(/^L(\d+)/)[1]));
        assert.equal(block.matrix[region.positions[0][0] - 1][region.positions[0][1] - 1], region.code);
        const [row, column] = region.positions[0];
        cells.push(`${block.C_inicial.x + (column - 1) * block.L1},${block.C_inicial.y + (row - 1) * block.L2}`);
        assert.ok(region.maxPieces >= 1 && region.maxPieces <= 8);
        if (region.villageBuildingLevel !== undefined) {
          assert.ok(region.villageBuildingLevel >= 1 && region.villageBuildingLevel <= 5);
        }
        if (region.farmBuildingLevel !== undefined) {
          assert.ok(region.farmBuildingLevel >= 1 && region.farmBuildingLevel <= 5);
        }
        return region;
      });
    });

    assert.equal(board.randomMap.actualRegions, regions.length);
    assert.equal(regions.length, targetRegions);
    assert.equal(new Set(regions.map((region) => region.code)).size, regions.length);
    const cellsByCenter = new Set(cells);
    const reached = new Set([cells[0]]);
    const pending = [cells[0]];
    while (pending.length) {
      const [x, y] = pending.shift().split(',').map(Number);
      for (const neighbor of [`${x + 1000},${y}`, `${x - 1000},${y}`, `${x},${y + 500}`, `${x},${y - 500}`]) {
        if (cellsByCenter.has(neighbor) && !reached.has(neighbor)) {
          reached.add(neighbor);
          pending.push(neighbor);
        }
      }
    }
    assert.equal(reached.size, targetRegions, 'generated regions remain connected after exact sizing');
    const startingRegions = regions.filter((region) => region.initialPieces.length);
    assert.equal(startingRegions.length, 2);
    assert.equal(new Set(startingRegions.map((region) => region.code)).size, 2);
    assert.ok(startingRegions.every((region) => /^L8-\d+$/.test(region.code)));
    const startingPieces = startingRegions.flatMap((region) => region.initialPieces);
    assert.deepEqual(startingPieces.map((piece) => piece.team).sort(), ['blue', 'orange']);
    assert.ok(startingPieces.every((piece) => piece.stage === 'g'));
    assert.ok(regions.some((region) => region.villageBuildingLevel !== undefined));
    assert.ok(regions.some((region) => region.farmBuildingLevel !== undefined));
    assert.ok(Buffer.byteLength(JSON.stringify(board)) < 2_000_000);
  }
});

test('random-map rotations enable rings everywhere and linear paths only on 3x3 and 5x5 blocks', () => {
  const board = generateRandomBoard(60, true);
  assert.equal(board.randomMap.rotationsEnabled, true);
  assert.ok(board.blocks.length > 0);
  board.blocks.forEach((block) => {
    assert.equal(block.rotationEnabled, true, `${block.name} ring rotation`);
    assert.equal(block.linearRotationEnabled, [3, 5].includes(block.matrixSize),
      `${block.name} linear rotation`);
  });
});
