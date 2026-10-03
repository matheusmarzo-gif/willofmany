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
const levelFourBoard = JSON.parse(fs.readFileSync(
  path.join(root, 'tabuleiro-04.json'),
  'utf8'
));
const levelFiveBoard = JSON.parse(fs.readFileSync(
  path.join(root, 'tabuleiro-05.json'),
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
  assert.ok(androidGradle.includes('include("*.png")'), 'Android includes campaign map images');
  assert.ok(serverGradle.includes('include "*.png"'), 'server includes campaign map images');
  [
    'regioes-will-of-many-circular.json',
    'regioes-will-of-many.json',
    'will-of-many-final.json',
    'tabuleiro-01.json',
    'tabuleiro-02.json',
    'tabuleiro-03.json',
    'tabuleiro-04.json',
    'tabuleiro-05.json'
  ].forEach((resource) => {
    assert.ok(serverGradle.includes(`include "${resource}"`), `server includes ${resource}`);
  });
  assert.equal(serverGradle.includes('include "*.json"'), false,
    'server excludes unrelated and debug JSON files');
  assert.match(androidMainActivity, /"tabuleiro-05\.json"\.equals\(fileName\)/,
    'Android permits reading the Level 5 board asset');
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
  assert.match(gameClient, /function getRotatableCircularDiskForRegion\(regionCode\)/);
  assert.match(gameClient, /function focusCircularRotationDisk\(block, disco\)/);
  assert.match(gameClient, /function updateCircularRotationOverlay\(svgNamespace\)/);
  assert.match(gameClient, /rotateCircularDisk\(mode\.blockName, mode\.disco, mode\.direction, true\)/);
  assert.match(gameClient, /function rotateCircularDisk\(blockName, disco, direction, keepDiskFocus = false\)/);
  assert.match(gameClient, /mode\.direction = mode\.kind === 'circular'\s*\?\s*gesture\.angleTravel > 0 \? 'right' : 'left'\s*:\s*gesture\.angleTravel > 0 \? 'left' : 'right'/);
  assert.match(gameClient, /activeRotationKind === 'circular' \? 'GIRAR DISCO' : 'GIRAR BLOCO'/);
});

test('piece slot centers stay unrotated until the piece is drawn once at the disk rotation', () => {
  assert.match(gameClient, /function getRegionPieceCenter\(regionCode\) \{[\s\S]*?getRegionFocusPoint\(regionCode, false\)/);
  assert.match(gameClient, /if \(pieceCount === 1 && slotCenter\) return \[slotCenter\]/);
  assert.match(gameClient, /const rotationCenter = getRegionRotationCenter\(regionCode\);[\s\S]*?const centerX = slotCenter\.x \* 908 - rotationCenter\.x;[\s\S]*?const center = \{/);
  assert.match(gameClient, /const slots = getBalancedRegionSlots\(regionCode, availableSlots, totalPieces\);[\s\S]*?const rotation = \(getRegionVisualRotation\(regionCode\) \* Math\.PI\) \/ 180;[\s\S]*?const rotatedX = rotationCenter\.x \+ \(localX \* cos - localY \* sin\);/);
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
  assert.match(gameClient, /regionBagCoins\.textContent = hasUncollectedBag[\s\S]*?Saco de moedas:/);
  assert.match(html, /id="region-bag-coins" class="is-hidden"/);
  assert.match(gameClient, /\['tabuleiro-03', 'tabuleiro-05'\]\.includes\(currentBoardData\?\.campaign\?\.id\)/);
  assert.match(
    gameClient,
    /function getRegionFocusPoint\(regionCode, applyRotation = true\) \{[\s\S]*?geometry\?\.shape === 'quadrilateral' &&\s*Array\.isArray\(geometry\.cells\)[\s\S]*?cell\.x - cell\.width \/ 2[\s\S]*?cell\.x \+ cell\.width \/ 2[\s\S]*?return \{\s*x: \(\(bounds\.left \+ bounds\.right\) \/ 2 \/ 908\) \* 100/
  );
  assert.match(gameClient, /const scale = Number\(currentBoardData\?\.regionFocusScale\) \|\| 1\.8;/);
  assert.match(gameClient, /function getRotatableQuadrilateralBlocks\(\)/);
  assert.match(gameClient, /function updateQuadrilateralRotationBlockPicker\(blocks\)/);
  assert.match(gameClient, /function rotateQuadrilateralBlock\(blockName, direction, keepBlockFocus = false, rotationPath = null\)/);
  assert.match(html, /id="rotate-quadrilateral-block-button"[^>]*>GIRAR BLOCO/);
  assert.match(gameClient, /function getQuadrilateralRotationCells\(block(?:, rotationPath = null)?\)/);
  assert.match(gameClient, /function beginQuadrilateralRotationGesture\(event\)/);
  assert.match(gameClient, /Math\.PI \* 4 \/ 3/);
});

test('campaign supports turn movement undo, resource defeat, and contextual rotation guidance', () => {
  assert.match(html, /id="campaign-undo-button"/);
  assert.match(gameClient, /function captureCampaignMoveUndo\(/);
  assert.match(gameClient, /function undoLastCampaignMove\(/);
  assert.match(gameClient, /campaignMoveUndoHistory: JSON\.parse\(JSON\.stringify\(campaignMoveUndoHistory\)\)/);
  assert.match(gameClient, /function maybeShowCampaignResourceDefeat\(/);
  assert.match(gameClient, /isGameOver && !\['level3-resource-defeat', 'level4-resource-defeat'\]\.includes\(step\)/);
  assert.match(gameClient, /title: 'Fim de jogo'[\s\S]*?não tem nenhuma peça F[\s\S]*?reiniciar o Level 3/);
  assert.match(gameClient, /Toque em GIRAR DISCO no painel da região[\s\S]*?círculo anti-horário/);
  assert.match(gameClient, /toque em GIRAR BLOCO no painel da região/);
  assert.match(gameClient, /case 'level2-rotate':[\s\S]*?rotateQuadrilateralBlockButton/);
  assert.match(gameClient, /case 'level3-region-labels':[\s\S]*?rotateQuadrilateralBlockButton/);
  assert.deepEqual(levelThreeBoard.campaign.objectiveRegions, ['L8-16']);
  assert.match(gameClient, /function updateTurnState\(\) \{\s*if \(finishCampaignIfObjectiveMet\(\)\) return;/);
  assert.match(gameClient, /function finishCampaignIfObjectiveMet\(\) \{\s*if \(!isGameStarted \|\| isGameOver \|\| !isCampaignGame\(\) \|\| !campaignObjectiveRegions\.length/);
});

test('Level 4 copies Level 2 with its objective and initial armies updated', () => {
  const expectedBoard = JSON.parse(JSON.stringify(levelTwoBoard));
  expectedBoard.campaign.id = 'tabuleiro-04';
  expectedBoard.campaign.name = 'Tabuleiro 04';
  expectedBoard.campaign.objectiveRegions = ['L8-1', 'L8-3', 'L8-9'];
  const startingRegion = expectedBoard.blocks
    .flatMap((block) => block.regions)
    .find((region) => region.code === 'L8-1');
  startingRegion.initialPieces = [
    { team: 'blue', stage: 'f' },
    { team: 'blue', stage: 'f' }
  ];
  const circularEnemyRegion = expectedBoard.blocks
    .flatMap((block) => block.regions)
    .find((region) => region.code === 'L8-9');
  circularEnemyRegion.initialPieces = [
    { team: 'blue', stage: 'f' },
    { team: 'blue', stage: 'f' },
    { team: 'blue', stage: 'g' }
  ];

  assert.deepEqual(levelFourBoard, expectedBoard,
    'Level 4 preserves Level 2 board data except its campaign metadata and L8-1 pieces');
  const initialEnemyRegions = levelFourBoard.blocks
    .flatMap((block) => block.regions)
    .filter((region) => region.initialPieces?.some((piece) => piece.team === 'blue'))
    .map((region) => region.code)
    .sort();
  assert.deepEqual([...levelFourBoard.campaign.objectiveRegions].sort(), initialEnemyRegions,
    'the player must capture every region containing initial blue pieces');
  assert.deepEqual(startingRegion.initialPieces,
    [{ team: 'blue', stage: 'f' }, { team: 'blue', stage: 'f' }]);
  assert.match(gameClient, /'tabuleiro-04': 'tabuleiro-04\.json'/);
  assert.match(gameClient, /activeCampaignLevel\.id === 'tabuleiro-04' \? 'level4-intro'/);
  assert.match(gameClient, /campaignGuideStep === 'await-level4-l8-10'[\s\S]*?getRegionDominador\('L8-10'\) === 'orange'/);
  assert.match(gameClient, /'tabuleiro-04': 'level4-resource-defeat'/);
  assert.match(gameClient, /level4-battle-tip[\s\S]*?level4-battle-order/);
  assert.deepEqual(
    circularEnemyRegion.initialPieces,
    [{ team: 'blue', stage: 'f' }, { team: 'blue', stage: 'f' }, { team: 'blue', stage: 'g' }]
  );
  assert.deepEqual(levelFourBoard.campaign.objectiveRegions, ['L8-1', 'L8-3', 'L8-9']);
});

test('Level 5 defines its four blocks, campaign economy, deadline, and doubled BQ01 rotation', () => {
  assert.equal(levelFiveBoard.regionFocusScale, 3.4,
    'Level 5 uses a lower zoom than Level 3 so selected regions stay inside the panel');
  assert.deepEqual(levelFiveBoard.campaign, {
    id: 'tabuleiro-05',
    name: 'Tabuleiro 05',
    initialCoins: 9,
    coinsPerTurn: 2,
    coinsPerTurnStopAtTurn: 12,
    preserveCoinsBetweenTurns: false,
    turnLimitCurrentTurn: 20,
    aiActionsEnabled: false,
    rotationEnabled: true,
    objectiveRegions: ['L8-12'],
    objective: { type: 'captureInitialBlueRegions' }
  });

  const blocks = Object.fromEntries(levelFiveBoard.blocks.map((block) => [block.name, block]));
  assert.deepEqual(Object.keys(blocks), ['BQ01', 'BQ02', 'BQ03', 'BQ04']);
  assert.deepEqual(blocks.BQ01.matrix, [
    [null, 'L8-5', null],
    ['L8-4', 'L8-6', 'L8-8'],
    [null, 'L8-7', null]
  ]);
  assert.equal(blocks.BQ01.rotationSteps, 2);
  assert.equal(blocks.BQ01.rotationEnabled, true);
  assert.deepEqual(blocks.BQ01.C_inicial, { x: 250, y: 75 });
  assert.deepEqual(blocks.BQ02.matrix, [
    ['L8-2', 'L8-3'],
    [null, 'L8-1']
  ]);
  assert.deepEqual(blocks.BQ02.C_inicial, { x: 1750, y: 225 });
  assert.deepEqual(blocks.BQ03.matrix, [
    ['L8-9', null, null],
    ['L8-10', 'L7-1', null],
    ['L8-11', null, null]
  ]);
  const levelSevenRegion = blocks.BQ03.regions.find((region) => region.code === 'L7-1');
  assert.equal(levelSevenRegion.rank, 'L8');
  assert.equal(levelSevenRegion.layer, 7,
    'the region keeps its L7 identity while remaining in the L8 rotating block');
  assert.deepEqual(levelSevenRegion.rotationPath, [[1, 2], [2, 2], [3, 2]]);
  assert.deepEqual(blocks.BQ03.C_inicial, { x: 750, y: 525 });
  assert.deepEqual(blocks.BQ04.matrix, [['L8-12']]);
  assert.equal(blocks.BQ04.rotationEnabled, false);
  assert.deepEqual(blocks.BQ04.C_inicial, { x: 250, y: 525 });
  levelFiveBoard.blocks.forEach((block) => {
    assert.equal(block.L1, 150);
    assert.equal(block.L2, 500);
    block.regions.forEach((region) => {
      assert.equal(region.maxPieces, 8);
      const actualPositions = [];
      block.matrix.forEach((row, rowIndex) => row.forEach((code, columnIndex) => {
        if (code === region.code) actualPositions.push([rowIndex + 1, columnIndex + 1]);
      }));
      assert.deepEqual(region.positions, actualPositions, `${block.name} ${region.code} position`);
    });
  });

  const piecesIn = (blockName, code) => blocks[blockName].regions
    .find((region) => region.code === code).initialPieces || [];
  ['L8-4', 'L8-5', 'L8-7'].forEach((code) => {
    assert.deepEqual(piecesIn('BQ01', code), [
      { team: 'blue', stage: 'g' },
      { team: 'blue', stage: 'f' },
      { team: 'blue', stage: 'f' }
    ]);
  });
  assert.deepEqual(piecesIn('BQ02', 'L8-1'), [
    { team: 'blue', stage: 'f' },
    { team: 'blue', stage: 'f' }
  ]);
  assert.equal(piecesIn('BQ02', 'L8-2').length, 4);
  assert.deepEqual(piecesIn('BQ02', 'L8-3'), []);
  assert.deepEqual(piecesIn('BQ03', 'L8-9'), [{ team: 'orange', stage: 'g' }]);
  assert.deepEqual(piecesIn('BQ04', 'L8-12'), [{ team: 'blue', stage: 'e' }]);
  assert.match(gameClient, /'tabuleiro-05': 'tabuleiro-05\.json'/);
  assert.match(gameClient, /rotationSteps: Number\(block\.rotationSteps\) === 2 \? 2 : 1/);
  assert.match(gameClient, /step < block\.rotationSteps/);
  assert.match(gameClient, /turnLimitCurrentTurn/);
  assert.match(
    gameClient,
    /function getCampaignCoinsPerTurn\(level, turn = currentTurn\)[\s\S]*?coinsPerTurnStopAtTurn[\s\S]*?turn >= zeroIncomeAtTurn/
  );
  assert.match(
    gameClient,
    /if \(\['tabuleiro-03', 'tabuleiro-05'\]\.includes\(currentBoardData\?\.campaign\?\.id\)[\s\S]*?for \(let row = 0; row < 2; row \+= 1\)[\s\S]*?for \(let column = 0; column < 4; column \+= 1\)[\s\S]*?\.slice\(0, 8\)/
  );
  assert.match(
    gameClient,
    /if \(currentBoardData\?\.boardType === 'mixed' \|\|\s*\['tabuleiro-03', 'tabuleiro-05'\]\.includes\(currentBoardData\?\.campaign\?\.id\)\) \{\s*stageZoom = scale;\s*stageZoomOffset = \{\s*x: \(\(50 - point\.x\) \/ 100\) \* rect\.width \* scale,\s*y: \(\(50 - point\.y\) \/ 100\) \* rect\.height \* scale/
  );
  assert.match(gameClient, /gameRules\.rotateQuadrilateralMatrixPath\(matrix, direction, rotationPath\)/);
  assert.match(gameClient, /const rotationPath = kind === 'quadrilateral'[\s\S]*?\(region\.code \|\| region\.name\) === selectedRegionCode\)\?\.rotationPath[\s\S]*?rotationPath,\s*gesture: null/);
  assert.match(gameClient, /regionRotationHelp\.textContent[\s\S]*?M\(1,2\) → M\(2,2\) → M\(3,2\)/);
  assert.match(gameClient, /type: 'rotate'[\s\S]*?\.\.\.\(rotationPath \? \{ rotationPath \} : \{\}\)/);

  const expectedRight = [
    [null, 'L8-4', null],
    ['L8-7', 'L8-6', 'L8-5'],
    [null, 'L8-8', null]
  ];
  const rules = require(path.join(root, 'game-rules.js'));
  const once = rules.rotateQuadrilateralMatrix(blocks.BQ01.matrix, 'right');
  const twice = rules.rotateQuadrilateralMatrix(once, 'right');
  assert.deepEqual(twice, expectedRight,
    'a BQ01 clockwise action advances the matrix perimeter by two positions');
});

test('Level 5 campaign guide introduces the objective and advances through support and force lessons', () => {
  assert.match(gameClient, /activeCampaignLevel\.id === 'tabuleiro-05' \? 'level5-intro'/);
  assert.match(gameClient, /'level5-intro', 'await-level5-l8-3', 'level5-support-tip',\s*'await-level5-l7-1', 'level5-force-tip'/);
  assert.match(gameClient, /Esse nível é desafiador![\s\S]*?conquistar L8-12/);
  assert.match(gameClient, /'level5-turn3-tip': \{[\s\S]*?Uma unidade E equivale a 6 unidades do tipo F/);
  assert.match(gameClient, /await showTurnTransition\(roundResult\);[\s\S]*?currentTurn === 3 && currentTeam === humanTeam[\s\S]*?showCampaignGuide\('level5-turn3-tip'\)/);
  assert.match(gameClient, /step === 'level5-turn3-tip'\) \{\s*focusRegion\('L8-12'\)/);
  assert.match(gameClient, /const wasLevelFiveTurnThreeTip = campaignGuideStep === 'level5-turn3-tip';[\s\S]*?focusStrongestRegionForTeam\('orange'\)/);
  assert.match(gameClient, /Estamos mais próximos de concluir o nível![\s\S]*?L8-9[\s\S]*?L7-1/);
  assert.match(gameClient, /Unidades no Rank Amarelo recebem metade da força[\s\S]*?8 unidades vermelhas[\s\S]*?L7-1 também tem uma rotação especial[\s\S]*?rank superior/);
  assert.match(gameClient, /campaignGuideStep === 'await-level5-l8-3'[\s\S]*?getRegionDominador\('L8-2'\) === 'orange'[\s\S]*?showCampaignGuide\('level5-support-tip'\)/);
  assert.match(gameClient, /case 'level5-support-tip':\s*return \[\s*getCampaignRegionShape\('L8-2'\)/);
  assert.match(gameClient, /step === 'level5-support-tip'\) \{\s*selectedRegionCode = 'L8-2'[\s\S]*?focusRegion\('L8-2'\)/);
  assert.match(gameClient, /campaignGuideStep === 'await-level5-l7-1'[\s\S]*?getTeamSoldierCount\('L7-1', 'orange'\) > 0[\s\S]*?showCampaignGuide\('level5-force-tip'\)/);
  assert.match(gameClient, /case 'level5-force-tip':\s*return \[getCampaignRegionShape\('L7-1'\), regionForce, regionFinalForce\]\.filter\(Boolean\)/);
  assert.match(gameClient, /step === 'level5-force-tip'[\s\S]*?selectedRegionCode = 'L7-1'[\s\S]*?focusRegion\('L7-1'\)/);
  assert.match(gameClient, /step === 'level5-intro'\) \{\s*focusRegion\('L8-12'\)/);
  assert.match(gameClient, /campaignGuideStep === 'await-level5-l8-3'\) \{\s*focusRegion\('L8-9'\)/);
});

test('game menu groups campaign actions and Android exit closes the app', () => {
  assert.match(html, /id="game-menu-trigger"[^]*?id="game-menu"[^]*?id="campaign-undo-button"[^]*?id="campaign-menu-button"[^]*?id="campaign-restart-button"/);
  assert.match(html, /id="campaign-menu-button"[^>]*>Retornar ao menu principal/);
  assert.match(html, /id="game-menu-resign-button"[^>]*>Desistir da partida/);
  assert.match(gameClient, /gameMenuTrigger\.addEventListener\('click'/);
  assert.match(gameClient, /gameMenuResignButton\.addEventListener\('click'/);
  assert.match(gameClient, /window\.AndroidBluetooth\.closeApp\(\)/);
  assert.match(androidMainActivity, /public void closeApp\(\)[\s\S]*?runOnUiThread\(\(\) -> \{[\s\S]*?finish\(\);/);
  assert.match(gameCss, /\.game-menu-card \.campaign-actions \{ display:flex; flex-direction:column;/);
});

test('obsolete rotation shortcut is removed and campaign completion has its own panel', () => {
  assert.match(gameClient, /app\.classList\.toggle\('is-android-webview', !!window\.AndroidBluetooth\)/);
  assert.doesNotMatch(html, /id="rotate-picker-button"|id="rotation-picker-close"/);
  assert.doesNotMatch(gameClient, /rotate-picker-button|rotation-picker-close/);
  assert.doesNotMatch(gameCss, /rotate-picker-button|rotation-picker-close/);
  assert.match(html, /id="campaign-victory-modal"[^]*?<h2 id="campaign-victory-title">Parabéns!<\/h2>/);
  assert.match(html, /id="campaign-victory-menu-button"[^>]*>Voltar ao menu principal/);
  assert.match(html, /id="campaign-next-level-button"[^>]*>Continuar para o próximo level/);
  assert.match(gameClient, /if \(reason === 'campaign'\) \{[\s\S]*?campaignVictoryModal\.classList\.remove\('is-hidden'\)[\s\S]*?return;\s*\}\s*renderFinalSummary/);
  assert.match(gameClient, /campaignNextLevelButton\.classList\.toggle\('is-hidden', !campaignNextLevelId\)/);
  assert.match(gameClient, /campaignVictoryMenuButton\.addEventListener\('click', returnCampaignToMenu\)/);
});

test('campaign mode opens a custom illustrated trail with data-driven unlocked level choices', () => {
  assert.match(html, /id="campaign-trail-screen"[^>]*aria-labelledby="campaign-trail-title"/);
  assert.match(html, /class="campaign-trail-art" viewBox="0 0 1000 400"/);
  assert.match(html, /stroke-dasharray="3 15"/);
  assert.match(html, /id="game-mode-options"[\s\S]*?data-mode="campaign"/);
  assert.match(html, /id="campaign-trail-levels"/);
  assert.match(gameClient, /function renderCampaignTrail\(\)/);
  assert.match(gameClient, /getCampaignLevelOrder\(\)/);
  assert.match(gameClient, /button\.disabled = !isUnlocked/);
  assert.match(gameClient, /button\.dataset\.levelId = levelId/);
  assert.match(gameClient, /function getCampaignTrailPosition\(index\)/);
  assert.match(gameClient, /function showCampaignTrail\(\)/);
  assert.match(gameClient, /document\.querySelectorAll\('#game-mode-options button'\)\.forEach\(\(button\) => \{[\s\S]*?gameMode = button\.dataset\.mode;[\s\S]*?if \(gameMode === 'campaign'\) \{[\s\S]*?showCampaignTrail\(\)/);
  assert.match(gameClient, /campaignTrailLevels\.addEventListener\('click', async \(event\) => \{[\s\S]*?selectedCampaignLevelId = levelButton\.dataset\.levelId;[\s\S]*?beginConfiguredGame\(\)/);
  assert.match(gameCss, /\.campaign-trail-map \{[^}]*height:clamp\(220px,54vh,470px\)/);
  assert.match(gameCss, /\.campaign-trail-art \{ display:block; width:100%; height:100%; \}/);
  assert.match(gameCss, /\.campaign-trail-level\.is-locked/);
  assert.match(gameCss, /\.campaign-trail-map \{[^}]*background:linear-gradient/);
  assert.match(gameCss, /\.campaign-trail-level::after \{[^}]*content:"\+"/);
  assert.match(gameCss, /\.campaign-trail-level\.is-locked::after \{[^}]*content:"x"/);
  assert.match(gameClient, /mode\.direction = mode\.kind === 'circular'\s*\?\s*gesture\.angleTravel > 0 \? 'right' : 'left'\s*:\s*gesture\.angleTravel > 0 \? 'left' : 'right'/);
  assert.match(gameClient, /focusRegion\(regionCode\)/);
  assert.match(gameCss, /\.quadrilateral-rotation-cell\.is-vacant/);
  assert.match(gameCss, /\.region-rotation-overlay\.is-rotating-clockwise/);
  assert.match(gameClient, /rotateQuadrilateralBlocksForLayer\(\s*layerNumber,\s*direction,\s*blockName,\s*rotationPath\s*\)/);
  assert.match(gameClient, /`B\$\{Number\(blockNumber\)\}`/);
  assert.match(gameClient, /gameRules\.rotateQuadrilateralMatrix\(/);
  assert.match(gameClient, /function rotateQuadrilateralBlocksForLayer\(\s*layerNumber,\s*direction,\s*selectedBlockName = null,\s*rotationPath = null\s*\)[\s\S]*?applyRegionData\(currentBoardData\);/);
  assert.match(gameClient, /'level3-intro', 'level3-region-labels', 'await-l8-8', 'await-l8-10'/);
  assert.match(gameClient, /'level3-battle-tip', 'await-l8-14', 'level3-promotion-tip'/);
  assert.match(gameClient, /'await-l7-1', 'level3-recruitment-tip',\s*'level4-intro'/);
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
  assert.deepEqual(block('BQ04').regions.find((region) => region.name === 'L8-8').bagCoins, 8);
  assert.deepEqual(block('BQ03').regions.find((region) => region.name === 'L8-11').initialPieces,
    [{ team: 'blue', stage: 'f' }]);
  assert.deepEqual(block('BQ04').regions.find((region) => region.name === 'L8-9').initialPieces,
    [{ team: 'blue', stage: 'f' }, { team: 'blue', stage: 'f' }, { team: 'blue', stage: 'g' }]);
  assert.deepEqual(block('BQ01').regions.find((region) => region.name === 'L8-1').initialPieces,
    [{ team: 'orange', stage: 'g' }]);
});
