'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const gameCss = fs.readFileSync(path.join(root, 'game.css'), 'utf8');
const gameClient = fs.readFileSync(path.join(root, 'game-client.js'), 'utf8');
const androidMainActivity = fs.readFileSync(
  path.join(root, 'android-app', 'app', 'src', 'main', 'java', 'com', 'willofmany', 'app', 'MainActivity.java'),
  'utf8'
);
const circularBoard = JSON.parse(fs.readFileSync(
  path.join(root, 'regioes-will-of-many-circular.json'),
  'utf8'
));
const levelTwoBoard = JSON.parse(fs.readFileSync(
  path.join(root, 'tabuleiro-02.json'),
  'utf8'
));
const levelThreeBoard = JSON.parse(fs.readFileSync(
  path.join(root, 'tabuleiro-03.json'),
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
  assert.ok(androidGradle.includes('include("*.json")'), 'Android includes board JSON files');
  [
    'regioes-will-of-many-circular.json',
    'regioes-will-of-many.json',
    'will-of-many-final.json',
    'tabuleiro-01.json',
    'tabuleiro-02.json',
    'tabuleiro-03.json'
  ].forEach((resource) => {
    assert.ok(serverGradle.includes(`include "${resource}"`), `server includes ${resource}`);
  });
  assert.equal(serverGradle.includes('include "*.json"'), false,
    'server excludes unrelated and debug JSON files');
  assert.match(androidMainActivity, /"tabuleiro-03\.json"\.equals\(fileName\)/,
    'Android permits reading the Level 3 board asset');
});

test('new non-campaign games select the circular board configuration', () => {
  assert.match(
    gameClient,
    /const defaultNonCampaignBoardFile = 'regioes-will-of-many-circular\.json';/
  );
  assert.match(
    gameClient,
    /function getNewGameBoardFile\(\) \{\s*return gameMode === 'campaign'\s*\? campaignLevelFiles\[selectedCampaignLevelId\][\s\S]*?: defaultNonCampaignBoardFile;\s*\}/
  );
  assert.match(
    gameClient,
    /if \(gameMode !== 'campaign'\) \{[\s\S]*?await loadBoardFile\(defaultNonCampaignBoardFile\)/
  );
  assert.match(gameClient, /await loadBoardFile\(getNewGameBoardFile\(\)\)/);
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
  assert.equal(levelTwoBoard.campaign.preserveCoinsBetweenTurns, true);
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

test('Level 3 board preserves its campaign rules and all configured block placements', () => {
  const campaignFilesMatch = /'tabuleiro-03': 'tabuleiro-03\.json'/.test(gameClient);
  assert.equal(campaignFilesMatch, true, 'Level 3 participates in campaign progression');
  assert.equal(levelThreeBoard.displayScale, 1, 'Level 3 fits every region inside the clickable board');
  assert.equal(levelThreeBoard.regionFocusScale, 5.2, 'Level 3 doubles the focused-region zoom');
  assert.match(gameClient, /gameRules\.areAxisAlignedCellsNeighbors\(firstCell, secondCell\)/);
  assert.match(gameClient, /regionBlockName\.textContent = regionBlock \?/);
  assert.match(gameClient, /regionRotationBlockName\.textContent = rotationBlockLabel;/);
  assert.match(gameClient, /currentBoardData\?\.campaign\?\.id === 'tabuleiro-03'/);
  assert.match(gameClient, /const scale = Number\(currentBoardData\?\.regionFocusScale\) \|\| 1\.8;/);
  assert.match(gameClient, /function getRotatableQuadrilateralBlocks\(\)/);
  assert.match(gameClient, /function updateQuadrilateralRotationBlockPicker\(blocks\)/);
  assert.match(gameClient, /function rotateQuadrilateralBlock\(blockName, direction\)/);
  assert.match(gameClient, /rotateQuadrilateralBlocksForLayer\(layerNumber, direction, blockName\)/);
  assert.match(gameClient, /`B\$\{Number\(blockNumber\)\}`/);
  assert.match(gameClient, /gameRules\.rotateQuadrilateralMatrix\(/);
  assert.match(gameClient, /function rotateQuadrilateralBlocksForLayer\(layerNumber, direction, selectedBlockName = null\)[\s\S]*?applyRegionData\(currentBoardData\);/);
  assert.match(gameClient, /'level3-intro', 'level3-region-labels', 'await-l8-8', 'await-l8-10'/);
  assert.match(gameClient, /'level3-battle-tip', 'await-l8-14', 'level3-promotion-tip'/);
  assert.match(gameClient, /'await-l7-1', 'level3-recruitment-tip', 'complete'/);
  assert.match(gameClient, /function maybeAdvanceLevelThreeGuide\(\)/);
  assert.match(gameClient, /getRegionDominador\('L8-10'\) === 'orange'/);
  assert.match(gameClient, /case 'level3-battle-tip':\s*return \[getCampaignRegionShape\('L8-10'\)\]/);
  assert.match(gameClient, /gameRules\.getWarRegionOrder\(getRegionCalculationOrder\(\)\)/);
  assert.match(gameClient, /gameRules\.buildWarConflicts\(regionOrder, neighborsByRegion, dominators\)/);
  assert.match(gameClient, /function getCombatNeighbors\(regionCode\)[\s\S]*?neighbors\.superior[\s\S]*?neighbors\.inferior[\s\S]*?neighbors\.sameRank/);
  assert.match(gameClient, /getRegionDominador\('L8-14'\) === 'orange'/);
  assert.match(gameClient, /getTeamSoldierCount\('L7-1', 'orange'\) > 0/);
  assert.match(gameClient, /L8-1 \[BQ01\] ↻ \[B1\]/);
  assert.match(gameClient, /selectedRegionCode = 'L8-1';\s*updateSelectedRegionPanel\(selectedRegionCode\);\s*focusRegion\('L8-1'\);/);
  assert.match(gameClient, /if \(guideTargets\.length &&\s*!?\s*\['level3-intro', 'level3-region-labels'\]\.includes\(step\)\)/);
  assert.match(gameClient, /step === 'level3-region-labels'[\s\S]*?stage\.classList\.add\('is-level-three-guide-focus'\);\s*focusRegion\('L8-1'\);\s*renderBoardLayers\(\);\s*updateBoardFocusOverlay\(\);/);
  assert.doesNotMatch(gameClient, /stagePanelClose\.focus/);
  assert.match(gameClient, /if \(!isCampaignGame\(\) \|\| activeCampaignLevel\.id !== 'tabuleiro-03'\) \{\s*dragOverlayTargets\.appendChild\(outline\);/);
  assert.match(gameClient, /focusRegion\('L8-16'\)[\s\S]*?focusRegion\('L8-1'\)/);
  assert.match(gameClient, /focusRegion\('L8-1'\);\s*stage\.getBoundingClientRect\(\);[\s\S]*?stage\.classList\.add\('is-level-three-intro-pan'\);\s*focusRegion\('L8-16'\)/);
  assert.match(gameClient, /}, 3000\);/);
  assert.match(gameClient, /}, 1000\);/);
  assert.match(gameClient, /}, 2000\);/);
  assert.match(gameClient, /is-level-three-intro-pan/);
  assert.match(gameClient, /is-level-three-intro-return/);
  assert.match(gameClient, /waitForWarAnimation\(duration\)/);
  assert.match(gameClient, /activeCampaignLevel\.id === 'tabuleiro-03'\s*\?\s*1750\s*:\s*3500/);
  assert.match(gameClient, /stagePanel\.appendChild\(tag\)/);
  assert.match(gameClient, /regiões vizinhas e as tropas de suporte das regiões adjacentes/);
  assert.match(gameClient, /levelThreeRegionMapVersion/);
  assert.match(gameClient, /mapSavedRegionCode\(code\)/);
  assert.match(gameCss, /\.stage\.is-level-three-intro-pan \{ transition-duration:3s;/);
  assert.match(gameCss, /\.stage\.is-level-three-intro-setup \{ transition:none;/);
  assert.match(gameCss, /\.stage\.is-level-three-intro-return \{ transition-duration:2s;/);
  assert.match(gameCss, /\.stage\.is-level-three-guide-focus,[^{]*\{ transition:none !important;/);
  assert.match(gameCss, /\.board-focus-outline\.is-war-outer \{[^}]*stroke-width:4px;/);
  assert.match(gameCss, /\.board-focus-outline\.is-selected-outer \{[^}]*stroke-width:3px;/);
  assert.match(gameClient, /8 unidades livres nas regiões vermelhas/);
  assert.match(gameClient, /pelo menos 16 unidades nas regiões vermelhas/);
  assert.match(gameClient, /regionNeighborCache = \{\};[\s\S]*?recomputeNeighborCacheForLayer\(layer\);/);
  assert.match(
    gameClient,
    /if \(!isCampaignGame\(\) \|\| activeCampaignLevel\.preserveCoinsBetweenTurns !== true\)/
  );
  assert.deepEqual(levelThreeBoard.campaign, {
    id: 'tabuleiro-03',
    name: 'Tabuleiro 03',
    initialCoins: 4,
    coinsPerTurn: 0,
    preserveCoinsBetweenTurns: true,
    aiActionsEnabled: false,
    rotationEnabled: true,
    objectiveRegions: ['L8-16'],
    objective: { type: 'captureInitialBlueRegions' }
  });

  const expectedRegions = {
    BQ01: [['L8-1', 1, 1], ['L8-2', 2, 1], ['L8-3', 3, 1],
      ['L8-4', 1, 2], ['L8-5', 1, 3]],
    BQ02: [['L8-6', 1, 1], ['L8-7', 2, 1]],
    BQ03: [['L8-10', 1, 1], ['L8-11', 2, 1]],
    BQ04: [['L8-8', 2, 1], ['L8-9', 2, 2]],
    BQ05: [['L8-12', 1, 1], ['L8-13', 1, 2], ['L8-14', 1, 3],
      ['L7-1', 1, 4], ['L8-15', 1, 5], ['L8-16', 1, 6]]
  };
  assert.deepEqual(levelThreeBoard.blocks.map((block) => block.name),
    Object.keys(expectedRegions));
  levelThreeBoard.blocks.forEach((block) => {
    const expectedRotation = block.name !== 'BQ05';
    assert.equal(block.matrix.length, block.matrixSize);
    assert.ok(block.matrix.every((row) => row.length === block.matrixSize));
    assert.equal(block.rotationEnabled, expectedRotation);
    assert.equal(block.L1, 150);
    assert.equal(block.L2, 500);
    const actual = block.regions.map((region) => [
      region.name,
      ...region.positions[0],
      region.maxPieces
    ]);
    const expected = expectedRegions[block.name].map(([name, row, column]) => [
      name, row, column, name === 'L7-1' ? 7 : 8
    ]);
    assert.deepEqual(actual, expected, `${block.name} region positions and piece limits`);
    block.regions.forEach((region) => {
      assert.equal(region.code, region.name);
      assert.equal(region.region, Number(region.name.split('-')[1]));
    });
    const mapped = block.matrix.flat().filter(Boolean).sort();
    assert.deepEqual(mapped, expectedRegions[block.name].map(([name]) => name).sort());
  });

  const block = (name) => levelThreeBoard.blocks.find((item) => item.name === name);
  assert.deepEqual(block('BQ01').C_inicial, { x: 250, y: 75 });
  assert.deepEqual(block('BQ02').C_inicial, { x: 1750, y: 375 });
  assert.deepEqual(block('BQ03').C_inicial, { x: 2750, y: 375 });
  assert.deepEqual(block('BQ04').C_inicial, { x: 2750, y: 75 });
  assert.deepEqual(block('BQ04').rotationArea, { row: 1, column: 1, size: 2 });
  assert.deepEqual(block('BQ05').C_inicial, { x: 1750, y: 675 });
  assert.deepEqual(block('BQ02').regions.find((region) => region.name === 'L8-7').bagCoins, 7);
  assert.deepEqual(block('BQ04').regions.find((region) => region.name === 'L8-8').bagCoins, 6);
  assert.deepEqual(block('BQ03').regions.find((region) => region.name === 'L8-11').initialPieces,
    [{ team: 'blue', stage: 'f' }]);
  assert.deepEqual(block('BQ04').regions.find((region) => region.name === 'L8-9').initialPieces,
    [{ team: 'blue', stage: 'f' }, { team: 'blue', stage: 'f' }]);
  assert.deepEqual(block('BQ01').regions.find((region) => region.name === 'L8-1').initialPieces,
    [{ team: 'orange', stage: 'g' }]);
});
