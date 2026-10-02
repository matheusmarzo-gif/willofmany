'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const circularBoard = JSON.parse(fs.readFileSync(
  path.join(root, 'regioes-will-of-many-circular.json'),
  'utf8'
));
const levelTwoBoard = JSON.parse(fs.readFileSync(
  path.join(root, 'tabuleiro-02.json'),
  'utf8'
));

test('browser entrypoint loads the external client resources in dependency order', () => {
  const resources = [
    'href="game.css"',
    'src="game-rules.js"',
    'src="will-of-many-ai.js"',
    'src="game-client.js"'
  ];
  const positions = resources.map((resource) => html.indexOf(resource));

  assert.ok(positions.every((position) => position >= 0), 'all client resources are referenced');
  assert.deepEqual(positions, [...positions].sort((left, right) => left - right));
  assert.equal(html.includes('embedded-region-data'), false, 'no embedded board fallback remains');
});

test('Android and server builds package all external client resources', () => {
  const androidGradle = fs.readFileSync(
    path.join(root, 'android-app', 'app', 'build.gradle'),
    'utf8'
  );
  const serverGradle = fs.readFileSync(path.join(root, 'server-app', 'build.gradle'), 'utf8');
  const resources = ['game.css', 'game-client.js', 'game-rules.js', 'will-of-many-ai.js'];

  resources.forEach((resource) => {
    assert.ok(androidGradle.includes(`include("${resource}")`), `Android includes ${resource}`);
    assert.ok(serverGradle.includes(`include "${resource}"`), `server includes ${resource}`);
  });
});

test('circular board regions explicitly identify their independently rotating disks', () => {
  const circularBlock = circularBoard.blocks.find((block) => block.name === 'BC01');
  assert.ok(circularBlock);
  assert.equal(circularBoard.blocks.filter((block) => block.type === 'circular' ||
    block.regions?.some((region) => region.shape === 'circular')).length, 1);

  const assignments = circularBlock.regions.map((region) => [region.name, region.disco]);
  assert.equal(assignments.length, 36);
  assignments.forEach(([name, disco]) => {
    assert.equal(disco, name.split('-')[0], `${name} belongs to its layer disk`);
  });
});

test('Level 2 circular sector regions share the configured BC03 disk and preserve rotation', () => {
  const circularBlock = levelTwoBoard.blocks.find((block) => block.name === 'BC03');
  assert.ok(circularBlock);
  assert.equal(levelTwoBoard.blocks.filter((block) => block.type === 'circular' &&
    block.rotationEnabled !== false).length, 1);
  assert.equal(circularBlock.initialRotation, 90);
  assert.equal(circularBlock.rotationStep, 90);
  assert.deepEqual(
    circularBlock.regions.map((region) => [region.name, region.disco]),
    [['L8-6', 'C'], ['L8-7', 'C'], ['L8-8', 'C'], ['L8-9', 'C']]
  );
});
