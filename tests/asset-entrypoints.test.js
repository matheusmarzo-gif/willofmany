'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gameRules = require('../game-rules');

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
const levelSixBoard = JSON.parse(fs.readFileSync(
  path.join(root, 'tabuleiro-06.json'),
  'utf8'
));
const levelSevenBoard = JSON.parse(fs.readFileSync(
  path.join(root, 'tabuleiro-07.json'),
  'utf8'
));
const campaignBoards = Array.from({ length: 7 }, (_, index) => JSON.parse(fs.readFileSync(
  path.join(root, `tabuleiro-${String(index + 1).padStart(2, '0')}.json`),
  'utf8'
)));

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

test('turn transition includes its fade-out within the one-second display duration', () => {
  assert.match(
    gameClient,
    /async function showTurnTransition[\s\S]*?await waitForWarAnimation\(750\);\s*turnTransition\.classList\.remove\('is-visible'\)/
  );
  assert.match(gameCss, /\.turn-transition \{[^}]*transition:opacity \.25s ease;/);
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
    'tabuleiro-05.json',
    'tabuleiro-06.json',
    'tabuleiro-07.json'
  ].forEach((resource) => {
    assert.ok(serverGradle.includes(`include "${resource}"`), `server includes ${resource}`);
  });
  assert.equal(serverGradle.includes('include "*.json"'), false,
    'server excludes unrelated and debug JSON files');
  assert.match(androidMainActivity, /"tabuleiro-05\.json"\.equals\(fileName\)/,
    'Android permits reading the Level 5 board asset');
  assert.match(androidMainActivity, /"tabuleiro-06\.json"\.equals\(fileName\)/,
    'Android permits reading the Level 6 board asset');
  assert.match(androidMainActivity, /"tabuleiro-07\.json"\.equals\(fileName\)/,
    'Android permits reading the Level 7 board asset');
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
  assert.match(gameClient, /rotateCircularDisk\(mode\.blockName, mode\.disco, mode\.direction, true, mode\.passType\)/);
  assert.match(gameClient, /function rotateCircularDisk\(\s*blockName,\s*disco,\s*direction,\s*keepDiskFocus = false,\s*passType = 'global'/);
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
  assert.match(gameClient, /\['tabuleiro-03', 'tabuleiro-05', 'tabuleiro-06', 'tabuleiro-07'\]\s*\.includes\(currentBoardData\?\.campaign\?\.id\)/);
  assert.match(
    gameClient,
    /function getRegionFocusPoint\(regionCode, applyRotation = true\) \{[\s\S]*?geometry\?\.shape === 'quadrilateral' &&\s*Array\.isArray\(geometry\.cells\)[\s\S]*?cell\.x - cell\.width \/ 2[\s\S]*?cell\.x \+ cell\.width \/ 2[\s\S]*?return \{\s*x: \(\(bounds\.left \+ bounds\.right\) \/ 2 \/ 908\) \* 100/
  );
  assert.match(gameClient, /const scale = Number\(focusScale\) \|\| Number\(currentBoardData\?\.regionFocusScale\) \|\| 1\.8;/);
  assert.match(gameClient, /function getRotatableQuadrilateralBlocks\(\)/);
  assert.match(gameClient, /function updateQuadrilateralRotationBlockPicker\(blocks\)/);
  assert.match(gameClient, /function rotateQuadrilateralBlock\(\s*blockName,\s*direction,\s*keepBlockFocus = false,\s*rotationPath = null,\s*passType = 'global'/);
  assert.match(html, /id="rotate-quadrilateral-block-button"[^>]*>GIRAR BLOCO/);
  assert.match(gameClient, /function getQuadrilateralRotationCells\(block(?:, rotationPath = null)?\)/);
  assert.match(gameClient, /function beginQuadrilateralRotationGesture\(event\)/);
  assert.match(gameClient, /Math\.PI \* 4 \/ 3/);
});

test('campaign can restart the current turn, handle resource defeat, and show contextual rotation guidance', () => {
  assert.match(html, /id="campaign-restart-turn-button"[^>]*>Reiniciar turno/);
  assert.match(gameClient, /function createGameSaveState\(\)/);
  assert.match(gameClient, /function captureCampaignTurnStartSnapshot\(\)/);
  assert.match(gameClient, /save\.campaignTurnStartSnapshot = campaignTurnStartSnapshot/);
  assert.match(gameClient, /function restartCampaignTurn\(\)[\s\S]*?campaignTurnStartSnapshot\?\.regionPiecesByRegion[\s\S]*?loadSavedGame\(\)[\s\S]*?updateRotationControls\(\)[\s\S]*?updateTurnState\(\)/);
  assert.match(gameClient, /campaignRestartTurnButton\.disabled = !isCampaignGame\(\) \|\| !campaignTurnStartSnapshot/);
  assert.match(gameClient, /captureCampaignTurnStartSnapshot\(\);\s*saveGame\(\);/);
  assert.match(gameClient, /function maybeShowCampaignResourceDefeat\(/);
  assert.match(gameClient, /isGameOver && guideContent\.onDismiss !== 'restartLevel'/);
  assert.equal(levelThreeBoard.campaign.guide.steps['level3-resource-defeat'].onDismiss,
    'restartLevel');
  assert.equal(levelTwoBoard.campaign.guide.steps['level2-rotate'].rotationGuide, true);
  assert.ok(levelTwoBoard.campaign.guide.steps['level2-rotate'].highlight
    .includes('ui:rotateQuadrilateralBlockButton'));
  assert.equal(levelTwoBoard.campaign.guide.steps['level2-rotate'].actionTarget, 'rotateBlock');
  assert.ok(levelThreeBoard.campaign.guide.steps['level3-region-labels'].highlight
    .includes('ui:rotateQuadrilateralBlockButton'));
  assert.deepEqual(levelThreeBoard.campaign.objectiveRegions, ['L8-16']);
  assert.match(gameClient, /function updateTurnState\(\) \{\s*if \(finishCampaignIfObjectiveMet\(\)\) return;/);
  assert.match(gameClient, /function finishCampaignIfObjectiveMet\(\) \{\s*if \(!isGameStarted \|\| isGameOver \|\| !isCampaignGame\(\) \|\| !campaignObjectiveRegions\.length/);
});

test('Level 4 copies Level 2 with its objective and initial armies updated', () => {
  const expectedBoard = JSON.parse(JSON.stringify(levelTwoBoard));
  expectedBoard.campaign.id = 'tabuleiro-04';
  expectedBoard.campaign.name = 'Tabuleiro 04';
  expectedBoard.campaign.objectiveRegions = ['L8-1', 'L8-3', 'L8-9'];
  expectedBoard.campaign.guide = levelFourBoard.campaign.guide;
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
  expectedBoard.blocks
    .flatMap((block) => block.regions)
    .find((region) => region.code === 'L8-8').bagCoins = 10;

  assert.deepEqual(levelFourBoard, expectedBoard,
    'Level 4 preserves Level 2 board data except its campaign metadata, L8-1/L8-9 pieces, and L8-8 bag value');
  const initialEnemyRegions = levelFourBoard.blocks
    .flatMap((block) => block.regions)
    .filter((region) => region.initialPieces?.some((piece) => piece.team === 'blue'))
    .map((region) => region.code)
    .sort();
  assert.deepEqual([...levelFourBoard.campaign.objectiveRegions].sort(), initialEnemyRegions,
    'the player must capture every region containing initial blue pieces');
  assert.deepEqual(startingRegion.initialPieces,
    [{ team: 'blue', stage: 'f' }, { team: 'blue', stage: 'f' }]);
  assert.equal(levelFourBoard.blocks
    .flatMap((block) => block.regions)
    .find((region) => region.code === 'L8-8').bagCoins, 10);
  assert.match(gameClient, /'tabuleiro-04': 'tabuleiro-04\.json'/);
  assert.ok(levelFourBoard.campaign.guide.transitions.some((transition) =>
    transition.from === 'await-level4-l8-10' &&
    transition.when.type === 'regionOwned' &&
    transition.when.region === 'L8-10' &&
    transition.next === 'level4-battle-tip'));
  assert.match(gameClient, /'tabuleiro-04': 'level4-resource-defeat'/);
  assert.equal(levelFourBoard.campaign.guide.initialStep, 'level4-intro');
  assert.equal(levelFourBoard.campaign.guide.steps['level4-battle-tip'].next,
    'level4-battle-order');
  assert.deepEqual(
    circularEnemyRegion.initialPieces,
    [{ team: 'blue', stage: 'f' }, { team: 'blue', stage: 'f' }, { team: 'blue', stage: 'g' }]
  );
  assert.deepEqual(levelFourBoard.campaign.objectiveRegions, ['L8-1', 'L8-3', 'L8-9']);
});

test('Level 4 battle-order message auto-shows after the circle tip', () => {
  const guide = levelFourBoard.campaign.guide;
  const circleTip = guide.steps['level4-battle-tip'];
  const battleOrder = guide.steps['level4-battle-order'];

  assert.equal(circleTip.next, 'level4-battle-order');
  assert.equal(battleOrder.autoShow, true);
  assert.match(gameClient,
    /if \(getCampaignGuideStep\(nextStep\)\?\.autoShow\) \{\s*showCampaignGuide\(nextStep\);/);
});

test('campaign guides configure valid objective regions and event-driven transitions', () => {
  const transitionTypes = new Set([
    'regionCaptured',
    'regionOwned',
    'soldierCount',
    'regionRotated',
    'regionMoved',
    'bagCollected',
    'actionCompleted',
    'turnStarted'
  ]);

  campaignBoards.forEach((board) => {
    const { campaign } = board;
    const guide = campaign.guide;
    const regionCodes = new Set(board.blocks.flatMap((block) =>
      block.regions.map((region) => region.code || region.name)));
    const validStates = new Set([
      ...Object.keys(guide.steps || {}),
      ...(guide.states || []),
      'complete'
    ]);

    (campaign.objectiveRegions || []).forEach((region) => {
      assert.ok(regionCodes.has(region), `${campaign.id} objective ${region} exists`);
    });
    (guide.transitions || []).forEach((transition) => {
      const sources = Array.isArray(transition.from) ? transition.from : [transition.from];
      sources.forEach((source) => {
        assert.ok(source === '*' || validStates.has(source),
          `${campaign.id} transition source ${source} exists`);
      });
      assert.ok(validStates.has(transition.next),
        `${campaign.id} transition destination ${transition.next} exists`);
      assert.ok(transitionTypes.has(transition.when?.type),
        `${campaign.id} transition has a supported condition`);
      const regions = [
        transition.when.region,
        ...(transition.when.regions || []),
        transition.when.source,
        transition.when.target
      ].filter(Boolean);
      regions.filter((region) => region !== 'approach').forEach((region) => {
        assert.ok(regionCodes.has(region),
          `${campaign.id} transition region ${region} exists`);
      });
    });
  });

  assert.deepEqual(campaignBoards[0].campaign.objectiveRegions, ['L8-1']);
  assert.ok(campaignBoards[0].campaign.guide.transitions.some((transition) =>
    transition.from === 'await-move' &&
    transition.when.type === 'regionCaptured' &&
    transition.when.region === 'L8-4' &&
    transition.when.team === 'orange' &&
    transition.next === 'bag-tip'));
  assert.ok(campaignBoards[0].campaign.guide.transitions.some((transition) =>
    transition.from === 'await-move' &&
    transition.when.type === 'regionOwned' &&
    transition.when.region === 'L8-4' &&
    transition.when.team === 'orange' &&
    transition.next === 'bag-tip'));
  assert.ok(campaignBoards[0].campaign.guide.transitions.some((transition) =>
    transition.from === 'await-bag' &&
    transition.when.type === 'bagCollected' &&
    transition.when.region === 'L8-3' &&
    transition.when.team === 'orange' &&
    transition.next === 'army-tip'));
  assert.match(gameClient,
    /async function startWar\([\s\S]*?const campaignCaptures = \[\];[\s\S]*?campaignCaptures\.push\(\{ region: regionCode, team: winner \}\)/);
  assert.match(gameClient,
    /if \(when\.type === 'bagCollected'\) \{\s*if \(event\) \{\s*return event\.type === 'bagCollected'[\s\S]*?campaignCollectedBags\.includes\(region\)/);
  assert.ok(campaignBoards[1].campaign.guide.transitions.some((transition) =>
    transition.from === 'await-l84' &&
    transition.when.type === 'regionOwned' &&
    transition.when.region === 'L8-4' &&
    transition.when.team === 'orange' &&
    transition.next === 'level2-rotate'));
  assert.ok(campaignBoards[1].campaign.guide.transitions.some((transition) =>
    transition.when.type === 'regionRotated' &&
    transition.when.region === 'L8-7' &&
    transition.next === 'await-circular'));
  const levelTwoCircularCapture = campaignBoards[1].campaign.guide.transitions.find((transition) =>
    transition.from === 'await-circular' &&
    transition.next === 'level2-pass-turn');
  assert.deepEqual(levelTwoCircularCapture.when.regions, ['L8-6', 'L8-7', 'L8-8', 'L8-9']);
  assert.equal(levelTwoCircularCapture.when.type, 'regionOwned');
  assert.ok(levelTwoBoard.campaign.guide.states.includes('await-final-approach'));
  assert.ok(levelTwoBoard.campaign.guide.transitions.some((transition) =>
    transition.from === 'level2-rotate-again' &&
    transition.when.type === 'regionRotated' &&
    transition.next === 'await-final-approach'));
  assert.ok(levelTwoBoard.campaign.guide.transitions.some((transition) =>
    transition.from === 'await-final-approach' &&
    transition.when.type === 'regionOwned' &&
    transition.when.region === 'L8-10' &&
    transition.next === 'level2-final-attack'));
  assert.equal(levelTwoBoard.campaign.guide.steps['level2-final-attack'].next,
    'await-l83-army');
  assert.ok(levelTwoBoard.campaign.guide.transitions.some((transition) =>
    transition.from === 'await-l83-army' &&
    transition.when.type === 'soldierCount' &&
    transition.when.region === 'L8-10' &&
    transition.when.team === 'orange' &&
    transition.when.soldiersAtLeast === 8 &&
    transition.next === 'level2-final-war'));
  assert.match(gameClient,
    /campaignGuideStep = campaignGuideStep === 'level2-rotate-again'\s*\?\s*'await-final-approach'\s*:\s*'await-circular'/);
  assert.match(gameClient,
    /if \(when\.type === 'regionOwned'\) \{\s*const regions = Array\.isArray\(when\.regions\) \? when\.regions : \[when\.region\];\s*return regions\.some\(/);
  [
    'regionCaptured',
    'regionRotated',
    'regionMoved',
    'bagCollected',
    'actionCompleted',
    'turnStarted'
  ].forEach((type) => assert.match(gameClient, new RegExp(`type: '${type}'`)));
});

test('Level 5 defines its four blocks, campaign economy, deadline, and doubled BQ01 rotation', () => {
  assert.equal(levelFiveBoard.regionFocusScale, 3.4,
    'Level 5 uses a lower zoom than Level 3 so selected regions stay inside the panel');
  const { guide: levelFiveGuide, ...levelFiveCampaign } = levelFiveBoard.campaign;
  assert.deepEqual(levelFiveCampaign, {
    id: 'tabuleiro-05',
    name: 'Tabuleiro 05',
    initialCoins: 12,
    coinsPerTurn: 4,
    coinsPerTurnStopAtTurn: 6,
    preserveCoinsBetweenTurns: false,
    turnLimitCurrentTurn: 22,
    aiActionsEnabled: false,
    rotationEnabled: true,
    objectiveRegions: ['L8-12'],
    objective: { type: 'captureInitialBlueRegions' }
  });

  const blocks = Object.fromEntries(levelFiveBoard.blocks.map((block) => [block.name, block]));
  assert.deepEqual(Object.keys(blocks), ['BQ01', 'BQ02', 'BQ03', 'BQ04']);
  assert.match(gameClient, /let selectedRotationPassType = 'global'/);
  assert.match(gameClient, /if \(selectedRotationPassType === 'local' && !localPassAvailable\) \{\s*selectedRotationPassType = 'global';/);
  assert.doesNotMatch(gameClient, /selectedRotationPassType === 'global' && !globalPassAvailable/);
  assert.deepEqual(blocks.BQ01.matrix, [
    [null, 'L8-5', null],
    ['L8-4', 'L8-6', 'L8-7'],
    [null, 'L8-8', null]
  ]);
  assert.equal(blocks.BQ01.rotationSteps, 2);
  assert.equal(blocks.BQ01.rotationEnabled, true);
  assert.deepEqual(blocks.BQ01.C_inicial, { x: 250, y: 75 });
  assert.deepEqual(blocks.BQ02.matrix, [
    ['L8-2', null],
    ['L8-3', 'L8-1']
  ]);
  assert.deepEqual(blocks.BQ02.C_inicial, { x: 1750, y: 225 });
  assert.deepEqual(blocks.BQ03.matrix, [
    ['L8-9', 'L8-10', 'L8-11'],
    [null, 'L7-1', null],
    [null, null, null]
  ]);
  const levelSevenRegion = blocks.BQ03.regions.find((region) => region.code === 'L7-1');
  assert.equal(levelSevenRegion.rank, 'L8');
  assert.equal(levelSevenRegion.layer, 7,
    'the region keeps its L7 identity while remaining in the L8 rotating block');
  assert.equal(blocks.BQ03.linearRotationEnabled, true,
    'the central linear rotation belongs to BQ03 positions, not to L7-1');
  assert.equal(levelSevenRegion.rotationPathAxis, undefined);
  assert.deepEqual(blocks.BQ03.C_inicial, { x: 750, y: 525 });
  assert.match(gameClient, /linearRotationEnabled: block\.linearRotationEnabled === true/);
  assert.deepEqual(blocks.BQ04.matrix, [['L8-12']]);
  assert.equal(blocks.BQ04.rotationEnabled, false);
  assert.deepEqual(blocks.BQ04.C_inicial, { x: 250, y: 525 });
  assert.equal(levelFiveGuide.steps['level5-intro'].focusRegion, 'L8-12');
  assert.equal(levelFiveGuide.steps['level5-turn3-tip'].restoreFocusTeam, 'orange');
  assert.deepEqual(levelFiveGuide.statePresentation['await-level5-l8-2'], {
    selectRegion: 'L8-10',
    focusRegion: 'L8-10'
  });
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
  assert.match(gameClient, /team === aiTeam && !isCampaignLevelTwo\(\) &&\s*wasPieceCreatedThisTurn\(regionCode, team, pieceStage\)/);
  assert.match(gameClient, /const canRecycle = availablePieces >= 2;/);
  assert.match(gameClient, /await waitForWarAnimation\(750\)/);
  assert.match(
    gameClient,
    /function getCampaignCoinsPerTurn\(level, turn = currentTurn\)[\s\S]*?coinsPerTurnStopAtTurn[\s\S]*?turn >= zeroIncomeAtTurn/
  );
  assert.match(
    gameClient,
    /if \(\['tabuleiro-03', 'tabuleiro-05', 'tabuleiro-06', 'tabuleiro-07'\]\s*\.includes\(currentBoardData\?\.campaign\?\.id\)[\s\S]*?for \(let row = 0; row < 2; row \+= 1\)[\s\S]*?for \(let column = 0; column < 4; column \+= 1\)[\s\S]*?\.slice\(0, 8\)/
  );
  assert.match(
    gameClient,
    /if \(currentBoardData\?\.boardType === 'mixed' \|\|\s*\['tabuleiro-03', 'tabuleiro-05', 'tabuleiro-06', 'tabuleiro-07'\]\s*\.includes\(currentBoardData\?\.campaign\?\.id\)\) \{\s*stageZoom = scale;\s*stageZoomOffset = \{\s*x: \(\(50 - point\.x\) \/ 100\) \* rect\.width \* scale,\s*y: \(\(50 - point\.y\) \/ 100\) \* rect\.height \* scale/
  );
  assert.match(gameClient, /gameRules\.rotateQuadrilateralMatrixPath\(matrix, direction, rotationPath\)/);
  assert.match(gameClient, /function getQuadrilateralRegionRotationPath\(block, region, target\)[\s\S]*?target\.rotationType === 'linear'[\s\S]*?getQuadrilateralMatrixLinearPaths/);
  assert.match(gameClient, /gameRules\.getQuadrilateralMatrixRingPath\(matrix, \[row \+ 1, column \+ 1\]\)/);
  assert.match(gameClient, /targetPath\?\.linear \? targetPath\.horizontal : targetPath/);
  assert.match(gameClient, /const rotationPath = kind === 'quadrilateral'[\s\S]*?getQuadrilateralRegionRotationPath\(/);
  assert.match(gameClient, /selectedRotationPaths\?\.linear[\s\S]*?traço horizontal ou vertical/);
  assert.match(gameClient, /mode\.linearRotationPaths[\s\S]*?const deltaX = event\.clientX - gesture\.startX[\s\S]*?mode\.rotationPath = horizontal/);
  assert.match(gameClient, /mode\.direction = routeDirection > 0 \? 'right' : 'left'/);
  assert.match(gameClient, /routeIndex: 0[\s\S]*?routeIndex: 1[\s\S]*?routeIndex: 2[\s\S]*?routeIndex: 3/);
  assert.match(gameClient, /mode\.direction === 'left'\s*\?\s*\[\.\.\.mode\.rotationPath\]\.reverse\(\)\s*:\s*mode\.rotationPath/);
  assert.match(gameCss, /quadrilateral-linear-route-cue 2\.8s linear infinite/);
  assert.match(gameClient, /type: 'rotate'[\s\S]*?rotationPassType: passType[\s\S]*?\.\.\.\(rotationPath \? \{ rotationPath \} : \{\}\)/);
  assert.match(html, /id="rotation-pass-panel"[\s\S]*?id="region-panel"/);
  assert.match(html, /id="rotation-target-options"[^]*?id="rotation-local-pass-button"/);
  assert.doesNotMatch(html, /rotation-target-select|Alvo da rotação/);
  assert.match(gameClient, /function getQuadrilateralRotationTargetsForRegion\(block, region\)[\s\S]*?getQuadrilateralMatrixRotationGroups[\s\S]*?quadrilateral:\$\{block\.name\}:linear:\$\{group\.index\}[\s\S]*?quadrilateral:\$\{block\.name\}:ring:\$\{group\.index\}/);
  assert.match(gameClient, /function recordRotationOwnership\(regionCode\)[\s\S]*?getRotationTargetsForRegion\(regionCode\)\.forEach\(\(target\) => \{\s*localRotationPasses\[owner\]\.push\(\{ regionCode, targetKey: target\.key \}\)/);
  assert.match(gameClient, /function restoreRotationOwnershipAfterUndo\(regionCode\)[\s\S]*?new Set\(getRotationTargetsForRegion\(regionCode\)\.map\(\(target\) => target\.key\)\)/);
  assert.match(gameClient, /legacyPathRegionCode[\s\S]*?legacyLinearTarget[\s\S]*?targetKey = matchingTarget\?\.key \|\| legacyLinearTarget\?\.key \|\| savedTargetKey/);
  assert.match(gameClient, /restoreRotationOwnershipAfterUndo\(regionCode\)/);
  assert.match(gameClient, /function getRotationTargetForLayer\(layerNumber\)[\s\S]*?key: `layer:\$\{layerNumber\}`/);
  assert.match(gameClient, /getRotationTargetsForRegion\(regionCode\)[\s\S]*?getQuadrilateralRotationTargetsForRegion\(quadrilateralBlock, region\)/);
  assert.match(gameClient, /function recordRotationUse\(targetKey, layerNumber, passType\)[\s\S]*?passType === 'local'[\s\S]*?consumeLocalRotationPass\(currentTeam, targetKey\)[\s\S]*?hasRotatedThisTurn = true[\s\S]*?rotationLocksByTarget\[targetKey\]/);
  assert.match(gameClient, /rotationPassType: passType/);
  assert.match(gameClient, /passType === 'local'[\s\S]*?clearCampaignMoveUndoHistory\(\)/);
  assert.match(gameClient, /localRotationPasses: JSON\.parse\(JSON\.stringify\(localRotationPasses\)\)[\s\S]*?rotationOwnershipByRegion[\s\S]*?rotationLocksByTarget/);
  assert.match(gameClient, /rotationPassType === 'local' \? 'local' : 'global'/);

  const expectedRight = [
    [null, 'L8-4', null],
    ['L8-8', 'L8-6', 'L8-5'],
    [null, 'L8-7', null]
  ];
  const rules = require(path.join(root, 'game-rules.js'));
  const once = rules.rotateQuadrilateralMatrix(blocks.BQ01.matrix, 'right');
  const twice = rules.rotateQuadrilateralMatrix(once, 'right');
  assert.deepEqual(twice, expectedRight,
    'a BQ01 clockwise action advances the matrix perimeter by two positions');
});

test('Level 6 defines its complete 5x5 board, no-income campaign, and ring/linear rotations', () => {
  assert.equal(levelSixBoard.regionFocusScale, 3);
  const { guide: levelSixGuide, ...levelSixCampaign } = levelSixBoard.campaign;
  assert.deepEqual(levelSixCampaign, {
    id: 'tabuleiro-06',
    name: 'Tabuleiro 06',
    initialCoins: 0,
    coinsPerTurn: 0,
    preserveCoinsBetweenTurns: false,
    aiActionsEnabled: false,
    rotationEnabled: true,
    warIncludesCornerContact: true,
    objectiveRegions: Array.from({ length: 25 }, (_, index) => {
      const number = index + 1;
      return ({
        8: 'L7-8',
        12: 'L7-12',
        13: 'L6-13',
        14: 'L7-14',
        18: 'L7-18'
      })[number] || `L8-${number}`;
    }),
    objectiveText: 'Domine todas as regiões',
    objective: { type: 'captureAllRegions' }
  });
  assert.equal(levelSixGuide.steps['level6-intro'].next, 'level6-rank-tip');
  assert.equal(levelSixGuide.steps['level6-rank-tip'].focusRegion, 'L6-13');
  assert.match(gameClient, /'tabuleiro-06': 'tabuleiro-06\.json'/);
  assert.match(gameClient, /'tabuleiro-07': 'tabuleiro-07\.json'/);
  assert.match(gameClient, /activeCampaignLevel\.objectiveText \|\| `conquiste/);
  assert.match(gameClient, /function finishCampaignIfObjectiveMet\(\)[\s\S]*?campaignObjectiveRegions\.every\(\(regionCode\) => getRegionDominador\(regionCode\) === 'orange'\)/);

  const [block] = levelSixBoard.blocks;
  assert.equal(block.name, 'BQ01');
  assert.equal(block.type, 'quadrilateral');
  assert.equal(block.matrixSize, 5);
  assert.deepEqual(block.matrix, [
    ['L8-1', 'L8-2', 'L8-3', 'L8-4', 'L8-5'],
    ['L8-6', 'L8-7', 'L7-8', 'L8-9', 'L8-10'],
    ['L8-11', 'L7-12', 'L6-13', 'L7-14', 'L8-15'],
    ['L8-16', 'L8-17', 'L7-18', 'L8-19', 'L8-20'],
    ['L8-21', 'L8-22', 'L8-23', 'L8-24', 'L8-25']
  ]);
  assert.deepEqual(block.C_inicial, { x: 250, y: 75 });
  assert.equal(block.L1, 150);
  assert.equal(block.L2, 500);
  assert.equal(block.rotationEnabled, true);
  assert.equal(block.linearRotationEnabled, true);
  assert.equal(block.regions.length, 25);
  assert.match(
    gameClient,
    /x: offsetX \+ \(block\.centerX \+ columnIndex \* block\.width\) \* scale,[\s\S]*?y: offsetY \+ \(block\.centerY \+ rowIndex \* block\.height\) \* scale/
  );
  block.regions.forEach((region) => {
    const actualPosition = [];
    block.matrix.forEach((row, rowIndex) => row.forEach((code, columnIndex) => {
      if (code === region.code) actualPosition.push([rowIndex + 1, columnIndex + 1]);
    }));
    assert.deepEqual(region.positions, actualPosition, `${region.code} matrix position`);
    assert.equal(region.maxPieces, region.layer);
  });

  const initialArmy = {
    'L8-1': ['orange', 'f', 4], 'L8-2': ['orange', 'f', 2],
    'L8-3': ['blue', 'e', 1], 'L8-4': ['orange', 'f', 2],
    'L8-5': ['orange', 'f', 4], 'L8-6': ['orange', 'f', 2],
    'L8-7': ['blue', 'f', 2], 'L7-8': ['blue', 'f', 1],
    'L8-9': ['blue', 'f', 2], 'L8-10': ['orange', 'f', 2],
    'L8-11': ['blue', 'e', 1], 'L7-12': ['blue', 'f', 1],
    'L6-13': ['blue', 'g', 4], 'L7-14': ['blue', 'f', 1],
    'L8-15': ['blue', 'e', 1], 'L8-16': ['orange', 'f', 2],
    'L8-17': ['blue', 'f', 2], 'L7-18': ['blue', 'f', 1],
    'L8-19': ['blue', 'f', 2], 'L8-20': ['orange', 'f', 2],
    'L8-21': ['orange', 'f', 4], 'L8-22': ['orange', 'f', 2],
    'L8-23': ['blue', 'e', 1], 'L8-24': ['orange', 'f', 2],
    'L8-25': ['orange', 'f', 4]
  };
  Object.entries(initialArmy).forEach(([code, [team, stage, count]]) => {
    assert.deepEqual(
      block.regions.find((region) => region.code === code).initialPieces,
      Array.from({ length: count }, () => ({ team, stage })),
      `${code} initial army`
    );
  });

  const matrixCenterCross = ['L8-3', 'L7-8', 'L6-13', 'L7-18', 'L8-23',
    'L8-11', 'L7-12', 'L7-14', 'L8-15'];
  matrixCenterCross.forEach((regionCode) => {
    const position = block.regions.find((region) => region.code === regionCode).positions[0];
    const ring = Math.min(
      position[0] - 1,
      position[1] - 1,
      block.matrixSize - position[0],
      block.matrixSize - position[1]
    );
    assert.deepEqual(
      gameRules.getQuadrilateralMatrixRotationGroups(block.matrix, regionCode, block.linearRotationEnabled),
      [
        ...(block.matrixSize - ring * 2 > 1 ? [{ type: 'ring', index: ring + 1 }] : []),
        { type: 'linear', index: 3 }
      ],
      `${regionCode} exposes its applicable ring and central line/column rotation`
    );
  });
  const levelSixCells = Object.fromEntries(block.regions.map((region) => {
    const [row, column] = region.positions[0];
    return [region.code, {
      x: block.C_inicial.x + (column - 1) * block.L2,
      y: block.C_inicial.y + (row - 1) * block.L1,
      width: block.L2,
      height: block.L1
    }];
  }));
  const centerToL8Neighbors = ['L8-7', 'L8-9', 'L8-17', 'L8-19'];
  centerToL8Neighbors.forEach((neighborCode) => {
    const neighbor = levelSixCells[neighborCode];
    assert.equal(
      gameRules.areAxisAlignedCellsNeighbors(
        levelSixCells['L6-13'],
        neighbor,
        1,
        levelSixBoard.campaign.warIncludesCornerContact
      ),
      true,
      `${neighborCode} is physically adjacent to L6-13 for war conflicts`
    );
    assert.equal(
      gameRules.areAxisAlignedCellsNeighbors(levelSixCells['L6-13'], neighbor),
      false,
      `${neighborCode} does not become a movement or promotion neighbor`
    );
  });
  assert.deepEqual(
    gameRules.buildWarConflicts(
      gameRules.getWarRegionOrder(['L6-13', ...centerToL8Neighbors]),
      {
        'L6-13': centerToL8Neighbors,
        ...Object.fromEntries(centerToL8Neighbors.map((code) => [code, ['L6-13']]))
      },
      {
        'L6-13': 'blue',
        ...Object.fromEntries(centerToL8Neighbors.map((code) => [code, 'orange']))
      }
    ),
    [{
      regionCode: 'L6-13',
      alliedRegions: ['L6-13'],
      enemyRegions: centerToL8Neighbors,
      attacker: 'blue'
    }],
    'war must group the blue center with the four diagonal L8 regions'
  );
  assert.match(
    gameClient,
    /function getCombatNeighbors\(regionCode\)[\s\S]*?warIncludesCornerContact === true[\s\S]*?areAxisAlignedCellsNeighbors\(firstCell, secondCell, 1, true\)/
  );
  assert.match(
    gameClient,
    /function getQuadrilateralRotationCells[\s\S]*?\(block\.centerX \+ \(column - 1\) \* block\.width\)[\s\S]*?\(block\.centerY \+ \(row - 1\) \* block\.height\)/
  );
  assert.match(
    gameClient,
    /if \(currentBoardData\?\.boardType === 'mixed' \|\|\s*\['tabuleiro-03', 'tabuleiro-05', 'tabuleiro-06', 'tabuleiro-07'\]\s*\.includes\(currentBoardData\?\.campaign\?\.id\)\) \{\s*stageZoom = scale;/
  );
  assert.match(
    gameClient,
    /if \(\['tabuleiro-03', 'tabuleiro-05', 'tabuleiro-06', 'tabuleiro-07'\]\s*\.includes\(currentBoardData\?\.campaign\?\.id\) &&\s*geometry\?\.shape === 'quadrilateral'/
  );
  assert.match(gameClient, /function focusRegion\(regionCode, focusScale = null\)[\s\S]*?Number\(focusScale\) \|\| Number\(currentBoardData\?\.regionFocusScale\)/);
  assert.match(
    gameClient,
    /const restoreCampaignWarView = isCampaignGame\(\) &&\s*\['tabuleiro-06', 'tabuleiro-07'\]\.includes\(activeCampaignLevel\.id\)[\s\S]*?focusRegion\(block\.regionCode, restoreCampaignWarView \? 2 : null\)[\s\S]*?if \(restoreCampaignWarView\) restoreStageView\(\);\s*else resetStageZoom\(\)/
  );
  assert.match(gameClient, /if \(!blocks\.length\)[\s\S]*?restoreStageView\(\)/);
});

test('Level 7 duplicates Level 6 with every initial piece team swapped', () => {
  const expectedBoard = structuredClone(levelSixBoard);
  expectedBoard.campaign.id = 'tabuleiro-07';
  expectedBoard.campaign.name = 'Tabuleiro 07';
  expectedBoard.campaign.guide = levelSevenBoard.campaign.guide;
  expectedBoard.blocks.forEach((block) => {
    block.regions.forEach((region) => {
      region.initialPieces?.forEach((piece) => {
        piece.team = piece.team === 'blue' ? 'orange' : 'blue';
      });
    });
  });
  assert.deepEqual(levelSevenBoard, expectedBoard);
  assert.equal(levelSevenBoard.campaign.guide.initialStep, 'level7-intro');
  assert.equal(levelSevenBoard.campaign.guide.steps['level7-intro'].next, 'level7-rank-tip');
  assert.equal(levelSevenBoard.campaign.guide.steps['level7-rank-tip'].focusRegion, 'L6-13');
});

test('campaign guide scripts and presentation settings are configured per level', () => {
  const highlightKinds = new Set(['region', 'regions', 'pieceButton', 'pieces', 'bag', 'ui']);
  const allowedActions = new Set(['purchase', 'war', 'passTurn', 'rotate']);
  const actionTargets = new Set(['purchaseG', 'war', 'passTurn', 'rotateBlock', 'rotationPassPanel']);
  const uiTargets = [...gameClient.match(/const uiTargets = \{([\s\S]*?)\n      \};/)[1]
    .matchAll(/^\s+(\w+)(?::\s*\w+)?[,]?$/gm)].map((match) => match[1]);

  campaignBoards.forEach((board) => {
    const guide = board.campaign.guide;
    const regionCodes = new Set(board.blocks.flatMap((block) =>
      block.regions.map((region) => region.code)));
    assert.ok(guide, `${board.campaign.id} has a guide`);
    assert.ok(guide.initialStep, `${board.campaign.id} configures the first guide step`);
    assert.ok(guide.steps[guide.initialStep] || guide.states.includes(guide.initialStep),
      `${board.campaign.id} initial step exists`);
    Object.entries(guide.steps).forEach(([stepName, step]) => {
      if (step.next && !['complete', 'previous'].includes(step.next)) {
        assert.ok(guide.steps[step.next] || guide.states.includes(step.next),
          `${board.campaign.id} ${stepName} continues to a configured step or state`);
      }
      if (step.allowAction) {
        assert.ok(allowedActions.has(step.allowAction), `${stepName} action is supported`);
        assert.ok(actionTargets.has(step.actionTarget), `${stepName} has a known action target`);
      }
      (step.highlight || []).forEach((target) => {
        const [kind, ...parts] = target.split(':');
        assert.ok(highlightKinds.has(kind), `${board.campaign.id} ${stepName} highlight ${target}`);
        if (kind === 'ui') assert.ok(uiTargets.includes(parts[0]), `UI target ${parts[0]} exists`);
        if (['region', 'pieces', 'bag'].includes(kind) &&
            !['approach', 'level3IntroDestination', 'turnFiveFocus', 'lastCircularSector']
              .includes(parts[0])) {
          assert.ok(regionCodes.has(parts[0]), `Region target ${parts[0]} exists`);
        }
        if (kind === 'regions' && parts[0] !== 'objectives') {
          parts.join(':').split(',').forEach((code) => {
            assert.ok(regionCodes.has(code), `Region target ${code} exists`);
          });
        }
      });
    });
    Object.keys(guide.statePresentation || {}).forEach((state) => {
      assert.ok(guide.states.includes(state), `${board.campaign.id} presentation state exists`);
    });
    if (guide.introOverlay) {
      assert.ok(guide.steps[guide.introNext], `${board.campaign.id} intro continues to a guide step`);
    }
  });

  assert.match(gameClient, /activeCampaignLevel\?\.guide\?\.initialStep/);
  assert.match(gameClient, /activeCampaignLevel\?\.guide\?\.steps\?\.\[step\]\?\.highlight/);
  assert.match(gameClient, /getCampaignGuideStep\(campaignGuideStep\)\?\.allowAction/);
  assert.match(gameClient, /currentGuideStep\?\.next/);
  assert.doesNotMatch(gameClient, /'level[1-7]-(?:intro|rank-tip)': \{/);
});

test('campaign guide resolves JSON-configured region, button, and state targets', () => {
  assert.match(gameClient, /pieceButton: \(stage\) => \[/);
  assert.match(gameClient, /regions: \(value\) => resolveRegionTargets\(value\)/);
  assert.match(gameClient, /function applyCampaignGuideStatePresentation\(state\)/);
  assert.match(gameClient, /statePresentation\?\.\[state\]/);
  assert.equal(campaignBoards[0].campaign.guide.steps.purchase.highlight[0], 'pieceButton:g');
  assert.equal(campaignBoards[0].campaign.guide.steps.purchase.autoShow, true);
  assert.equal(campaignBoards[0].campaign.guide.steps.war.highlight[2], 'regions:objectives');
  assert.ok(campaignBoards[2].campaign.guide.statePresentation['await-l8-10'].focusAfterFrame);
});

test('Level 5 guide stores its lesson sequence, focus, and focus restoration in JSON', () => {
  const guide = levelFiveBoard.campaign.guide;
  assert.equal(guide.initialStep, 'level5-intro');
  assert.equal(guide.steps['level5-intro'].next, 'level5-neighbor-tip');
  assert.equal(guide.steps['level5-neighbor-tip'].next, 'await-level5-l8-10');
  assert.equal(guide.steps['level5-rotation-groups-tip'].next, 'level5-rotation-passes-tip');
  assert.equal(guide.steps['level5-turn3-tip'].restoreFocusTeam, 'orange');
  assert.ok(guide.steps['level5-force-tip'].highlight.includes('ui:regionForce'));
  assert.equal(guide.statePresentation['await-level5-l8-2'].selectRegion, 'L8-10');
});

test('Levels 6 and 7 configure their agent messages and yellow-rank spotlight in JSON', () => {
  for (const [board, intro, rank] of [
    [levelSixBoard, 'level6-intro', 'level6-rank-tip'],
    [levelSevenBoard, 'level7-intro', 'level7-rank-tip']
  ]) {
    const guide = board.campaign.guide;
    assert.equal(guide.initialStep, intro);
    assert.equal(guide.steps[intro].next, rank);
    assert.match(guide.steps[intro].message, /Mostre que voc[e\u00ea] domina a Arte da Batalha/);
    assert.match(guide.steps[rank].message, /Rank Amarelo/);
    assert.equal(guide.steps[rank].focusRegion, 'L6-13');
    assert.ok(guide.steps[rank].highlight.includes('region:L6-13'));
  }
});

test('campaign agent messages fit without scrolling and continue with clicks anywhere', () => {
  assert.match(gameClient, /function getCampaignGuideMessagePages\(message\)[\s\S]*?campaignGuideCard\.scrollHeight <= campaignGuideCard\.clientHeight/);
  assert.match(gameClient, /function advanceCampaignGuideMessage\(\)[\s\S]*?updateCampaignGuideMessagePage\(\)/);
  assert.match(gameClient, /if \(advanceCampaignGuideMessage\(\)\) return/);
  assert.match(gameClient, /if \(eventType === 'click'\) \{\s*event\.preventDefault\(\);\s*dismissCampaignIntro\(\);/);
  assert.match(gameClient, /if \(campaignGuideMessagePage < campaignGuideMessagePages\.length - 1\)[\s\S]*?continueCampaignGuide\(\)/);
  assert.doesNotMatch(gameClient, /Toque (?:nesta|na) mensagem/);
  assert.match(gameCss, /\.campaign-guide-card \{[^}]*overflow:hidden;/);
  assert.match(html, /id="campaign-intro-hint"/);
  assert.match(html, /campaign-guide-hint" id="campaign-guide-hint">Clique para continuar/);
});

test('the action click that triggers a campaign message does not dismiss it immediately', () => {
  assert.match(gameClient,
    /let campaignGuideWasVisibleAtPointerDown = false;/);
  assert.match(gameClient,
    /if \(eventType === 'pointerdown'\) \{\s*campaignGuideWasVisibleAtPointerDown = isCampaignGame\(\) &&\s*!campaignGuide\.classList\.contains\('is-hidden'\);[\s\S]*?if \(event\.detail > 0 && !clickStartedWithGuideVisible &&\s*campaignIntro\.classList\.contains\('is-hidden'\) &&\s*!campaignGuide\.classList\.contains\('is-hidden'\)\) return;/);
});

test('campaign guide moves away from highlighted action controls', () => {
  assert.match(gameClient, /function getCampaignGuideActionTarget\(step\)[\s\S]*?rotateQuadrilateralBlockButton/);
  assert.match(gameClient, /function positionCampaignGuideAwayFromAction\(\)[\s\S]*?overlapsAction[\s\S]*?position: 'top'[\s\S]*?position: 'right'[\s\S]*?position: 'bottom'[\s\S]*?position: 'left'/);
  assert.match(gameClient, /positionCampaignGuideAwayFromAction\(\)/);
  assert.ok(levelTwoBoard.campaign.guide.steps['level2-rotate'].message
    .includes('passe Local ou Global'));
  assert.deepEqual(levelTwoBoard.campaign.guide.steps['level2-rotate'].cardPositionOrder,
    ['right', 'top', 'bottom', 'left']);
});

test('game menu groups campaign actions and Android exit closes the app', () => {
  assert.match(html, /id="game-menu-trigger"[^]*?id="game-menu"[^]*?id="campaign-restart-turn-button"[^]*?id="campaign-menu-button"[^]*?id="campaign-restart-button"/);
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
  assert.match(gameClient, /mode\.direction = mode\.kind === 'circular'\s*\?\s*gesture\.angleTravel > 0 \? 'right' : 'left'\s*:\s*gesture\.angleTravel > 0 \? 'right' : 'left'/);
  assert.match(gameClient, /focusRegion\(regionCode\)/);
  assert.match(gameCss, /\.quadrilateral-rotation-cell\.is-vacant/);
  assert.match(gameCss, /\.region-rotation-overlay\.is-rotating-clockwise/);
  assert.match(gameClient, /rotateQuadrilateralBlocksForLayer\(\s*layerNumber,\s*direction,\s*blockName,\s*rotationPath\s*\)/);
  assert.match(gameClient, /`B\$\{Number\(blockNumber\)\}`/);
  assert.match(gameClient, /gameRules\.rotateQuadrilateralMatrix\(/);
  assert.match(gameClient, /function rotateQuadrilateralBlocksForLayer\(\s*layerNumber,\s*direction,\s*selectedBlockName = null,\s*rotationPath = null\s*\)[\s\S]*?applyRegionData\(currentBoardData\);/);
  assert.match(gameClient, /function evaluateCampaignGuideTransitions\(event = null\)/);
  assert.ok(levelTwoBoard.campaign.guide.transitions.some((transition) =>
    transition.from === 'await-circular' &&
    transition.when.type === 'regionOwned' &&
    transition.when.region === 'L8-10' &&
    transition.next === 'level2-final-attack'));
  assert.match(gameClient, /gameRules\.getWarRegionOrder\(getRegionCalculationOrder\(\)\)/);
  assert.match(gameClient, /gameRules\.buildWarConflicts\(regionOrder, neighborsByRegion, dominators\)/);
  assert.match(gameClient, /function getCombatNeighbors\(regionCode\)[\s\S]*?neighbors\.superior[\s\S]*?neighbors\.inferior[\s\S]*?neighbors\.sameRank/);
  assert.ok(levelThreeBoard.campaign.guide.transitions.some((transition) =>
    transition.when.type === 'regionOwned' &&
    transition.when.region === 'L8-14' &&
    transition.next === 'level3-promotion-tip'));
  assert.ok(levelThreeBoard.campaign.guide.transitions.some((transition) =>
    transition.when.type === 'soldierCount' &&
    transition.when.region === 'L7-1' &&
    transition.next === 'level3-recruitment-tip'));
  assert.equal(levelThreeBoard.campaign.guide.steps['level3-region-labels'].focusRegion, 'L8-1');
  assert.doesNotMatch(gameClient, /stagePanelClose\.focus/);
  assert.match(gameClient, /if \(!isCampaignGame\(\) \|\| activeCampaignLevel\.id !== 'tabuleiro-03'\) \{\s*dragOverlayTargets\.appendChild\(outline\);/);
  assert.match(gameClient, /}, 3000\);/);
  assert.match(gameClient, /}, 1000\);/);
  assert.match(gameClient, /}, 2000\);/);
  assert.match(gameClient, /is-level-three-intro-pan/);
  assert.match(gameClient, /is-level-three-intro-return/);
  assert.match(gameClient, /await waitForWarAnimation\(750\)/);
  assert.match(gameClient, /stagePanel\.appendChild\(tag\)/);
  assert.match(gameClient, /levelThreeRegionMapVersion/);
  assert.match(gameClient, /mapSavedRegionCode\(code\)/);
  assert.match(gameCss, /\.stage\.is-level-three-intro-pan \{ transition-duration:3s;/);
  assert.match(gameCss, /\.stage\.is-level-three-intro-setup \{ transition:none;/);
  assert.match(gameCss, /\.stage\.is-level-three-intro-return \{ transition-duration:2s;/);
  assert.match(gameCss, /\.stage\.is-level-three-guide-focus,[^{]*\{ transition:none !important;/);
  assert.match(gameCss, /\.board-focus-outline\.is-war-outer \{[^}]*stroke-width:4px;/);
  assert.match(gameCss, /\.board-focus-outline\.is-selected-outer \{[^}]*stroke-width:3px;/);
  assert.match(levelThreeBoard.campaign.guide.steps['level3-promotion-tip'].message,
    /8 unidades livres nas regiões vermelhas/);
  assert.match(levelThreeBoard.campaign.guide.steps['level3-recruitment-tip'].message,
    /pelo menos 16 unidades nas regiões vermelhas/);
  assert.match(gameClient, /regionNeighborCache = \{\};[\s\S]*?recomputeNeighborCacheForLayer\(layer\);/);
  assert.match(
    gameClient,
    /if \(!isCampaignGame\(\) \|\| activeCampaignLevel\.preserveCoinsBetweenTurns !== true\)/
  );
  const { guide: levelThreeGuide, ...levelThreeCampaign } = levelThreeBoard.campaign;
  assert.deepEqual(levelThreeCampaign, {
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
  assert.equal(levelThreeGuide.steps['level3-intro'].effect, 'level3Intro');
  assert.equal(levelThreeGuide.steps['level3-intro'].focusRegion, 'L8-16');

  const expectedRegions = {
    BQ01: [['L8-1', 1, 1], ['L8-2', 2, 1], ['L8-3', 3, 1],
      ['L8-4', 1, 2], ['L8-5', 1, 3]],
    BQ02: [['L8-6', 1, 1], ['L8-7', 1, 2]],
    BQ03: [['L8-10', 1, 1], ['L8-11', 1, 2]],
    BQ04: [['L8-8', 1, 2], ['L8-9', 2, 2]],
    BQ05: [['L8-12', 1, 1], ['L8-13', 2, 1], ['L8-14', 3, 1],
      ['L7-1', 4, 1], ['L8-15', 5, 1], ['L8-16', 6, 1]]
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
