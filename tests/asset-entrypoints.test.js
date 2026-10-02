'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

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
