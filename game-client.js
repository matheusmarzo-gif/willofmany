    const stage = document.querySelector('#stage');
    const app = document.querySelector('.app');
    const startScreen = document.querySelector('#start-screen');
    const startMenu = document.querySelector('#start-menu');
    const newGameOptions = document.querySelector('#new-game-options');
    const startMessage = document.querySelector('#start-message');
    const startGameButton = document.querySelector('#start-game-button');
    const startBackButton = document.querySelector('#start-back-button');
    const tutorialModal = document.querySelector('#tutorial-modal');
    const tutorialOpenButton = document.querySelector('#tutorial-open-button');
    const tutorialCloseButton = document.querySelector('#tutorial-close-button');
    const tutorialPreviousButton = document.querySelector('#tutorial-previous-button');
    const tutorialNextButton = document.querySelector('#tutorial-next-button');
    const tutorialCounter = document.querySelector('#tutorial-counter');
    const tutorialSlides = [...document.querySelectorAll('[data-tutorial-slide]')];
    const tutorialDots = [...document.querySelectorAll('[data-tutorial-goto]')];
    let currentTutorialSlide = 0;
    const colorOptionsGroup = document.querySelector('#color-options-group');
    const localModeHint = document.querySelector('#local-mode-hint');
    const bluetoothOptions = document.querySelector('#bluetooth-options');
    const bluetoothHostButton = document.querySelector('#bluetooth-host-button');
    const bluetoothSearchButton = document.querySelector('#bluetooth-search-button');
    const bluetoothDevices = document.querySelector('#bluetooth-devices');
    const onlineOptions = document.querySelector('#online-options');
    const onlineNameInput = document.querySelector('#online-name');
    const googleSignIn = document.querySelector('#google-sign-in');
    const onlineProfile = document.querySelector('#online-profile');
    const onlineLobby = document.querySelector('#online-lobby');
    const onlineStatus = document.querySelector('#online-status');
    const onlineDiagnostics = document.querySelector('#online-diagnostics');
    const onlineDiagnosticsText = document.querySelector('#online-diagnostics-text');
    const onlineCopyDiagnosticsButton = document.querySelector('#online-copy-diagnostics');
    const onlineMatchButton = document.querySelector('#online-match-button');
    const onlineCancelButton = document.querySelector('#online-cancel-button');
    const finalModal = document.querySelector('#final-modal');
    const finalSummary = document.querySelector('#final-summary');
    const campaignNextLevelButton = document.querySelector('#campaign-next-level-button');
    const finalMenuButton = document.querySelector('#final-menu-button');
    const finalRestartCampaignButton = document.querySelector('#final-restart-campaign-button');
    const campaignActions = document.querySelector('#campaign-actions');
    const campaignMenuButton = document.querySelector('#campaign-menu-button');
    const campaignRestartButton = document.querySelector('#campaign-restart-button');
    const campaignIntro = document.querySelector('#campaign-intro');
    const campaignIntroDismiss = document.querySelector('#campaign-intro-dismiss');
    const campaignDefeat = document.querySelector('#campaign-defeat');
    const campaignDefeatMessage = document.querySelector('#campaign-defeat-message');
    const campaignGuide = document.querySelector('#campaign-guide');
    const campaignGuideShade = document.querySelector('#campaign-guide-shade');
    const campaignGuideShadePath = document.querySelector('#campaign-guide-shade-path');
    const campaignGuideMask = document.querySelector('#campaign-guide-mask');
    const campaignGuideMaskBackground = document.querySelector('#campaign-guide-mask-background');
    const campaignGuideMaskHoles = document.querySelector('#campaign-guide-mask-holes');
    const campaignGuideRegionOutlines = document.querySelector('#campaign-guide-region-outlines');
    const campaignGuideSpotlights = document.querySelector('#campaign-guide-spotlights');
    const campaignGuideCard = document.querySelector('#campaign-guide-card');
    const campaignGuideContinue = document.querySelector('#campaign-guide-continue');
    const campaignGuideTitle = document.querySelector('#campaign-guide-title');
    const campaignGuideMessage = document.querySelector('#campaign-guide-message');
    const campaignGuideHint = document.querySelector('#campaign-guide-hint');
    const abandonMatchButton = document.querySelector('#abandon-match-button');
    const abandonMatchModal = document.querySelector('#abandon-match-modal');
    const confirmAbandonMatchButton = document.querySelector('#confirm-abandon-match-button');
    const stagePanel = document.querySelector('#stage-panel');
    const trashDropZone = document.querySelector('#trash-drop-zone');
    const trashDropRefund = document.querySelector('#trash-drop-refund');
    const stagePanelClose = document.querySelector('#stage-panel-close');
    const pieces = document.querySelector('#pieces');
    const controls = document.querySelector('#controls');
    const readout = document.querySelector('#readout');
    const pieceControls = document.querySelector('#piece-controls');
    const debugToggle = document.querySelector('#debug-toggle');
    const debugZoomOutButton = document.querySelector('#debug-zoom-out');
    const debugZoomInButton = document.querySelector('#debug-zoom-in');
    const debugExportButton = document.querySelector('#debug-export');
    const debugStatus = document.querySelector('#debug-status');
    const regionsFile = document.querySelector('#regions-file');
    const regionPanel = document.querySelector('#region-panel');
    const regionName = document.querySelector('#region-name');
    const regionRotationIndicator = document.querySelector('#region-rotation-indicator');
    const regionLayerOrangeForce = document.querySelector('#region-layer-orange-force');
    const regionLayerBlueForce = document.querySelector('#region-layer-blue-force');
    const regionPieceCounts = document.querySelector('#region-piece-counts');
    const regionSoldierCounts = document.querySelector('#region-soldier-counts');
    const regionFarm = document.querySelector('#region-farm');
    const regionForce = document.querySelector('#region-force');
    const regionFinalForce = document.querySelector('#region-final-force');
    const regionFreeUnits = document.querySelector('#region-free-units');
    const turnPoints = document.querySelector('#turn-points');
    const campaignObjective = document.querySelector('#campaign-objective');
    const turnWheatValue = document.querySelector('#turn-wheat-value');
    const wheatFeedback = document.querySelector('#wheat-feedback');
    const turnNumber = document.querySelector('#turn-number');
    const turnPlayer = document.querySelector('#turn-player');
    const warButton = document.querySelector('#war-button');
    const warStatus = document.querySelector('#war-status');
    const boardFocusOverlay = document.querySelector('#board-focus-overlay');
    const boardFocusMaskHoles = document.querySelector('#board-focus-mask-holes');
    const boardFocusDim = document.querySelector('#board-focus-dim');
    const boardFocusOutlines = document.querySelector('#board-focus-outlines');
    const regionDominator = document.querySelector('#region-dominator');
    const regionNeighbors = document.querySelector('#region-neighbors');
    const regionMoveControls = document.querySelector('#region-move-controls');
    const regionPromotionControls = document.querySelector('#region-promotion-controls');
    const regionRelegationControls = document.querySelector('#region-relegation-controls');
    const openMoveButton = document.querySelector('#open-move-button');
    const openPromotionButton = document.querySelector('#open-promotion-button');
    const openRelegationButton = document.querySelector('#open-relegation-button');
    const passTurnButton = document.querySelector('#pass-turn-button');
    const rotatePickerButton = document.querySelector('#rotate-picker-button');
    const rotationPickerClose = document.querySelector('#rotation-picker-close');
    const turnTransition = document.querySelector('#turn-transition');
    const turnTransitionMessage = document.querySelector('#turn-transition-message');
    const moveModal = document.querySelector('#move-modal');
    const moveDirectionOptions = document.querySelector('#move-direction-options');
    const moveAmountOptions = document.querySelector('#move-amount-options');
    const promotionModal = document.querySelector('#promotion-modal');
    const promotionTargetOptions = document.querySelector('#promotion-target-options');
    const promotionAmountOptions = document.querySelector('#promotion-amount-options');
    const relegationModal = document.querySelector('#relegation-modal');
    const relegationModalInstructions = document.querySelector('#relegation-modal-instructions');
    const relegationStageOptions = document.querySelector('#relegation-stage-options');
    const relegationTargetOptions = document.querySelector('#relegation-target-options');
    const statisticsButton = document.querySelector('#statistics-button');
    const statisticsModal = document.querySelector('#statistics-modal');
    const statisticsTableContainer = document.querySelector('#statistics-table-container');
    const debugCanvas = document.createElement('canvas');
    const debugContext = debugCanvas.getContext('2d');
    debugCanvas.className = 'debug-canvas is-hidden';
    debugCanvas.width = 908;
    debugCanvas.height = 908;
    debugCanvas.addEventListener('pointerdown', beginDebugProbeDrag);
    debugCanvas.addEventListener('pointermove', moveDebugProbeDrag);
    debugCanvas.addEventListener('pointerup', endDebugProbeDrag);
    debugCanvas.addEventListener('pointerleave', endDebugProbeDrag);
    stage.appendChild(debugCanvas);
    const dragOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    dragOverlay.classList.add('drag-overlay');
    dragOverlay.setAttribute('viewBox', '0 0 908 908');
    dragOverlay.setAttribute('aria-hidden', 'true');
    dragOverlay.style.display = 'none';
    dragOverlay.style.overflow = 'visible';
    const dragOverlayHeight = 1250;
    const dragOverlayDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const dragOverlayMask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    dragOverlayMask.id = 'drag-overlay-mask';
    dragOverlayMask.setAttribute('maskUnits', 'userSpaceOnUse');
    dragOverlayMask.setAttribute('x', '0');
    dragOverlayMask.setAttribute('y', '0');
    dragOverlayMask.setAttribute('width', '908');
    dragOverlayMask.setAttribute('height', String(dragOverlayHeight));
    const dragOverlayMaskBackground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    dragOverlayMaskBackground.setAttribute('width', '908');
    dragOverlayMaskBackground.setAttribute('height', String(dragOverlayHeight));
    dragOverlayMaskBackground.setAttribute('fill', '#fff');
    const dragOverlayMaskHoles = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    dragOverlayMaskHoles.setAttribute('fill', '#000');
    dragOverlayMaskHoles.setAttribute('fill-rule', 'evenodd');
    dragOverlayMask.append(dragOverlayMaskBackground, dragOverlayMaskHoles);
    dragOverlayDefs.appendChild(dragOverlayMask);
    const dragOverlayDim = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    dragOverlayDim.setAttribute('width', '908');
    dragOverlayDim.setAttribute('height', String(dragOverlayHeight));
    dragOverlayDim.setAttribute('fill', '#000');
    dragOverlayDim.setAttribute('fill-opacity', '.74');
    dragOverlayDim.setAttribute('mask', 'url(#drag-overlay-mask)');
    const dragOverlayTargets = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    dragOverlayTargets.classList.add('drag-target-outlines');
    dragOverlay.append(dragOverlayDefs, dragOverlayDim, dragOverlayTargets);
    stage.appendChild(dragOverlay);
    const gameRules = window.WillOfManyRules;
    if (!gameRules) throw new Error('O módulo de regras do jogo não foi carregado.');
    const rotations = Array(8).fill(0);
    const circularDiskAnimatedRotations = new Map();
    const circularDiskRotations = {};
    const pieceCounts = { blue:0, orange:0 };
    const pieceTargets = { blue:{code:'L8-4',region:4,label:'região L8-4',slots:[]}, orange:{code:'L8-1',region:1,label:'região L8-1',slots:[]} };
    const maxPieces = 16;
    const regionCapacity = 8;
    const soldierWeights = gameRules.soldierWeights;
    const stageOrder = gameRules.stageOrder;
    const wheatConsumptionByStage = { g: 1, f: 4, e: 16, d: 48, c: 144, b: 288, a: 576 };
    const starvationLossRateByDeficit = [
      { maximum: 0.05, lossRate: 0.01 },
      { maximum: 0.15, lossRate: 0.05 },
      { maximum: 0.30, lossRate: 0.10 },
      { maximum: 1, lossRate: 0.20 }
    ];
    const rotationStepByLayer = { 2: 25.71, 3: 20, 4: 18, 5: 18, 6: 20, 7: 25.71, 8: 45 };
    let allRegionMasks = null; // Will hold regions for all layers {1: {...}, 2: {...}, ...}
    let regionMasks = null; // Current layer's regions (for piece placement - still L8)
    const regionSlots = {};
    const regionStats = {};
    const regionForceStats = {};
    const regionForceBonusFactors = { 1: 40, 2: 24, 3: 16, 4: 8, 5: 5, 6: 3.5, 7: 1.8, 8: 1 };
    const regionPiecesByRegion = {};
    const regionCombatState = {};
    let regionNeighborCache = {};
    const regionProbeBoxes = {};
    let regionGeometryByCode = {};
    let quadrilateralBoard = null;
    let currentBoardData = null;
    let campaignBoardConfig = null;
    let activeCampaignLevel = null;
    let campaignCollectedBags = [];
    let campaignObjectiveRegions = [];
    let campaignResetPending = false;
    let selectedCampaignLevelId = 'tabuleiro-01';
    let campaignNextLevelId = null;
    let campaignGuideStep = 'complete';
    let campaignGuideDismissible = false;
    let campaignIntroPending = false;
    let campaignLevel2SeenSectors = [];
    let gameSessionVersion = 0;
    const campaignLevelFiles = {
      'tabuleiro-01': 'tabuleiro-01.json',
      'tabuleiro-02': 'tabuleiro-02.json'
    };
    const campaignProgressStorageKey = 'will-of-many-campaign-unlocked-level';
    const boardLayerElements = new Map();
    const probeBoxSize = 30;
    let debugZoom = 1;
    const probeBoxCountsByLayer = { 1: 2, 2: 4, 3: 7, 4: 8, 5: 9, 6: 10, 7: 11, 8: 12 };
    const blackRegionOrder = [3, 4, 5, 6, 7, 8, 1, 2];
    const redRegionOrder = [8, 8, 1, 2, 3, 4, 5, 6];
    let currentDebugLayer = 8; // Which layer's regions to show in debug canvas
    let selectedRegionCode = null;
    let warSpotlightRegionCodes = [];
    let focusedRegionCode = null;
    let stageZoom = 1;
    let stageZoomOffset = { x: 0, y: 0 };
    let currentTeam = 'orange';
    let currentTurn = 1;
    let humanTeam = 'orange';
    let aiTeam = 'blue';
    let gameSpeed = 1;
    let isGameStarted = false;
    let isGameOver = false;
    let selectedStartColor = null;
    let selectedStartSpeed = null;
    let gameMode = 'ai';
    let bluetoothRole = null;
    let bluetoothConnected = false;
    let onlineToken = localStorage.getItem('will-of-many-online-token') || '';
    let onlinePlayer = null;
    let onlineOpponent = null;
    let onlineTeam = null;
    let onlineMatchId = null;
    let onlineSocket = null;
    let onlineGameStartPending = false;
    let onlineSurrenderPending = false;
    let matchmakingPoll = null;
    let lobbyPoll = null;
    let googleScriptPromise = null;
    let onlineSessionLoading = false;
    let isApplyingBluetoothAction = false;
    let isAiTurnRunning = false;
    let selectedCircularRotationBlock = null;
    let rotationAnimationVersion = 0;
    let hasRotatedThisTurn = false;
    let lastRotatedLayer = null;
    let lastRotatedBy = null;
    let rotationLockTurn = null;
    let isWarRunning = false;
    let heavyRotationLayer = null;
    let pieceDragState = null;
    let turnMoveHistory = [];
    let turnRecycledPieces = [];
    let turnCreatedPieces = [];
    let victoryPoints = { orange: 0, blue: 0 };
    let lastRoundResult = null;
    let wheatBalances = { orange: 0, blue: 0 };
    let lastWheatTurnReport = null;
    const pontosDoTurn = { orange: 8, blue: 8 };
    const turnPointSchedule = [8, 10, 12, 16, 20, 24, 32, 40, 80, 100, 120, 160, 200, 240, 320, 400, 800, 1000, 1200, 1600, 2000, 2400, 3200, 4000];
    const promotionCostBySourceLayer = gameRules.promotionCostBySourceLayer;

    function getTurnPointIncome(turnNumber) {
      return turnPointSchedule[Math.min(Math.max(1, turnNumber), turnPointSchedule.length) - 1] * gameSpeed;
    }

    function getCampaignLevelOrder() {
      return Object.keys(campaignLevelFiles);
    }

    function getUnlockedCampaignLevelId() {
      const progress = localStorage.getItem(campaignProgressStorageKey);
      return campaignLevelFiles[progress] ? progress : 'tabuleiro-01';
    }

    function getNextCampaignLevelId(levelId) {
      const levels = getCampaignLevelOrder();
      const nextIndex = levels.indexOf(levelId) + 1;
      return nextIndex > 0 ? levels[nextIndex] || null : null;
    }

    function unlockNextCampaignLevel(levelId) {
      const nextLevelId = getNextCampaignLevelId(levelId);
      if (!nextLevelId) return null;
      const currentUnlockedIndex = getCampaignLevelOrder().indexOf(getUnlockedCampaignLevelId());
      const nextUnlockedIndex = getCampaignLevelOrder().indexOf(nextLevelId);
      if (nextUnlockedIndex > currentUnlockedIndex) {
        localStorage.setItem(campaignProgressStorageKey, nextLevelId);
      }
      return nextLevelId;
    }

    function getCampaignCoinsPerTurn(level) {
      const coinsPerTurn = Number(level?.coinsPerTurn);
      return Number.isFinite(coinsPerTurn) ? Math.max(0, coinsPerTurn) : 4;
    }

    function resetGameState() {
      gameSessionVersion += 1;
      Object.keys(regionPiecesByRegion).forEach((key) => delete regionPiecesByRegion[key]);
      Object.keys(regionStats).forEach((key) => delete regionStats[key]);
      Object.keys(regionForceStats).forEach((key) => delete regionForceStats[key]);
      Object.keys(regionCombatState).forEach((key) => delete regionCombatState[key]);
      pieceCounts.orange = 0;
      pieceCounts.blue = 0;
      rotations.fill(0);
      initializeCircularDiskRotations();
      currentTurn = 1;
      currentTeam = 'orange';
      hasRotatedThisTurn = false;
      lastRotatedLayer = null;
      lastRotatedBy = null;
      rotationLockTurn = null;
      selectedRegionCode = null;
      warSpotlightRegionCodes = [];
      focusedRegionCode = null;
      stageZoom = 1;
      stageZoomOffset = { x: 0, y: 0 };
      pontosDoTurn.orange = getTurnPointIncome(1);
      pontosDoTurn.blue = getTurnPointIncome(1);
      isGameOver = false;
      isGameStarted = true;
      isAiTurnRunning = false;
      isWarRunning = false;
      warStatus.classList.add('is-hidden');
      turnMoveHistory = [];
      turnRecycledPieces = [];
      turnCreatedPieces = [];
      victoryPoints = { orange: 0, blue: 0 };
      lastRoundResult = null;
      wheatBalances = { orange: 0, blue: 0 };
      lastWheatTurnReport = null;
      campaignCollectedBags = [];
      campaignLevel2SeenSectors = [];
      campaignObjectiveRegions = [];
      campaignResetPending = false;
      campaignNextLevelId = null;
      campaignGuideStep = 'complete';
      campaignGuideDismissible = false;
      campaignIntroPending = false;
      campaignIntro.classList.add('is-hidden');
      campaignIntro.setAttribute('aria-hidden', 'true');
      campaignGuide.classList.add('is-hidden');
      campaignGuide.setAttribute('aria-hidden', 'true');
      campaignGuideSpotlights.replaceChildren();
      turnPoints.classList.remove('is-guide-pinned');
      updateBoardFocusOverlay();
      campaignDefeat.classList.add('is-hidden');
      campaignDefeat.setAttribute('aria-hidden', 'true');
      campaignActions.classList.add('is-hidden');
      trashDropZone.classList.add('is-hidden');
      trashDropZone.classList.remove('is-visible', 'is-target', 'is-guide-visible');
    }

    function saveGame() {
      if (!isGameStarted || isGameOver || !allRegionMasks) return;
      const save = {
        gameMode, humanTeam, aiTeam, gameSpeed, currentTeam, currentTurn,
        campaignLevelId: activeCampaignLevel?.id || null,
        boardRotationConfigVersion: 4,
        campaignCollectedBags: [...campaignCollectedBags],
        campaignGuideStep,
        campaignLevel2SeenSectors: [...campaignLevel2SeenSectors],
        hasRotatedThisTurn, lastRotatedLayer, lastRotatedBy, rotationLockTurn,
        rotations: [...rotations], circularDiskRotations: { ...circularDiskRotations },
        pontosDoTurn: { ...pontosDoTurn },
        turnMoveHistory: JSON.parse(JSON.stringify(turnMoveHistory)),
        turnRecycledPieces: JSON.parse(JSON.stringify(turnRecycledPieces)),
        turnCreatedPieces: JSON.parse(JSON.stringify(turnCreatedPieces)),
        victoryPoints: { ...victoryPoints },
        wheatBalances: { ...wheatBalances },
        lastWheatTurnReport: lastWheatTurnReport ? { ...lastWheatTurnReport } : null,
        lastRoundResult: lastRoundResult ? { ...lastRoundResult } : null,
        regionPiecesByRegion: JSON.parse(JSON.stringify(regionPiecesByRegion))
      };
      localStorage.setItem('will-of-many-save', JSON.stringify(save));
    }

    function loadSavedGame() {
      try {
        const save = JSON.parse(localStorage.getItem('will-of-many-save') || 'null');
        if (!save || !save.regionPiecesByRegion) return false;
        gameMode = ['ai', 'campaign', 'local', 'bluetooth', 'online'].includes(save.gameMode) ? save.gameMode : 'ai';
        humanTeam = save.humanTeam === 'blue' ? 'blue' : 'orange';
        aiTeam = gameMode === 'ai' ? (humanTeam === 'orange' ? 'blue' : 'orange')
          : gameMode === 'campaign' ? 'blue' : null;
        activeCampaignLevel = gameMode === 'campaign' ? campaignBoardConfig : null;
        campaignCollectedBags = Array.isArray(save.campaignCollectedBags)
          ? save.campaignCollectedBags.filter((code) => typeof code === 'string')
          : [];
        campaignObjectiveRegions = gameMode === 'campaign'
          ? (activeCampaignLevel?.objectiveRegions || [])
          : [];
        campaignGuideStep = [
          'intro', 'coins', 'purchase', 'move', 'await-move', 'bag-tip',
          'await-bag', 'army-tip', 'await-army', 'war',
          'level2-intro', 'await-l84', 'level2-rotate', 'await-circular',
          'level2-pass-turn', 'await-next-rotation', 'level2-rotate-again',
          'level2-final-attack', 'await-l83-army', 'level2-final-war', 'await-l83',
          'level2-recycle', 'await-l81', 'complete'
        ].includes(save.campaignGuideStep)
          ? save.campaignGuideStep
          : 'complete';
        campaignIntroPending = gameMode === 'campaign' && campaignGuideStep === 'intro';
        gameSpeed = Math.max(1, Math.min(3, Number(save.gameSpeed) || 1));
        currentTeam = save.currentTeam === 'blue' ? 'blue' : 'orange';
        currentTurn = Math.max(1, Number(save.currentTurn) || 1);
        hasRotatedThisTurn = !!save.hasRotatedThisTurn;
        lastRotatedLayer = save.lastRotatedLayer || null;
        lastRotatedBy = save.lastRotatedBy || null;
        rotationLockTurn = save.rotationLockTurn || null;
        (save.rotations || []).forEach((value, index) => { rotations[index] = Number(value) || 0; });
        initializeCircularDiskRotations(true);
        Object.entries(save.circularDiskRotations || {}).forEach(([key, value]) => {
          const rotation = Number(value);
          if (Number.isFinite(rotation)) circularDiskRotations[key] = rotation;
        });
        campaignLevel2SeenSectors = Array.isArray(save.campaignLevel2SeenSectors)
          ? save.campaignLevel2SeenSectors.filter((code) => /^L8-[6-9]$/.test(code))
          : [];
        if (![3, 4].includes(save.boardRotationConfigVersion) && currentBoardData?.boardType === 'mixed') {
          currentBoardData.blocks.forEach((block) => {
            if (block.type !== 'circular') return;
            const initialRotation = Number(block.initialRotation) || 0;
            (block.regions || []).forEach((region) => {
              const layer = Number(region.layer || String(region.rank || region.code || region.name).match(/L(\d+)/)?.[1]);
              if (layer >= 1 && layer <= rotations.length) rotations[layer - 1] = initialRotation;
            });
          });
            initializeCircularDiskRotations(true);
          }
        const savedOrangePoints = Number(save.pontosDoTurn?.orange);
        const savedBluePoints = Number(save.pontosDoTurn?.blue);
        pontosDoTurn.orange = Number.isFinite(savedOrangePoints) ? savedOrangePoints : getTurnPointIncome(currentTurn);
        pontosDoTurn.blue = Number.isFinite(savedBluePoints) ? savedBluePoints : getTurnPointIncome(currentTurn);
        turnMoveHistory = Array.isArray(save.turnMoveHistory)
          ? save.turnMoveHistory.filter((move) =>
            move && (move.team === 'orange' || move.team === 'blue') &&
            typeof move.source === 'string' && typeof move.target === 'string')
          : [];
        turnRecycledPieces = Array.isArray(save.turnRecycledPieces)
          ? save.turnRecycledPieces.filter((piece) =>
            piece && (piece.team === 'orange' || piece.team === 'blue') &&
            typeof piece.source === 'string' &&
            Object.prototype.hasOwnProperty.call(soldierWeights, piece.stage))
          : [];
        turnCreatedPieces = Array.isArray(save.turnCreatedPieces)
          ? save.turnCreatedPieces.filter((piece) =>
            piece && (piece.team === 'orange' || piece.team === 'blue') &&
            typeof piece.source === 'string' &&
            Object.prototype.hasOwnProperty.call(soldierWeights, piece.stage))
          : [];
        victoryPoints = {
          orange: Math.max(0, Number(save.victoryPoints?.orange) || 0),
          blue: Math.max(0, Number(save.victoryPoints?.blue) || 0)
        };
        wheatBalances = {
          orange: Math.max(0, Number(save.wheatBalances?.orange) || 0),
          blue: Math.max(0, Number(save.wheatBalances?.blue) || 0)
        };
        lastWheatTurnReport = save.lastWheatTurnReport &&
          ['orange', 'blue'].includes(save.lastWheatTurnReport.team)
          ? save.lastWheatTurnReport
          : null;
        lastRoundResult = save.lastRoundResult &&
          Number.isInteger(save.lastRoundResult.round) &&
          (save.lastRoundResult.winner === 'orange' ||
            save.lastRoundResult.winner === 'blue' ||
            save.lastRoundResult.winner === 'draw')
          ? save.lastRoundResult
          : null;
        Object.keys(regionPiecesByRegion).forEach((code) => delete regionPiecesByRegion[code]);
        Object.keys(regionStats).forEach((code) => delete regionStats[code]);
        Object.keys(regionForceStats).forEach((code) => delete regionForceStats[code]);
        Object.keys(regionCombatState).forEach((code) => delete regionCombatState[code]);
        Object.assign(regionPiecesByRegion, save.regionPiecesByRegion);
        Object.keys(regionPiecesByRegion).forEach((code) => {
          ensureRegionPieces(code);
          regionStats[code] = {
            orange: getTeamPieceCountFromCounts(regionPiecesByRegion[code].orange),
            blue: getTeamPieceCountFromCounts(regionPiecesByRegion[code].blue)
          };
        });
        recalculatePieceCounts();
        renderBoardLayers();
        isGameStarted = true;
        isGameOver = false;
        return true;
      } catch (error) {
        startMessage.textContent = `Não foi possível continuar: ${error.message}`;
        return false;
      }
    }

    function isCampaignGame() {
      return gameMode === 'campaign' && !!activeCampaignLevel;
    }

    function isCampaignLevelTwo() {
      return isCampaignGame() && activeCampaignLevel.id === 'tabuleiro-02';
    }

    function isRegionInRotatableBlock(regionCode) {
      const geometry = regionGeometryByCode[regionCode];
      if (!geometry || geometry.shape !== 'circular') return false;
      const block = getRotatableCircularBlocks().find((item) =>
        String(item.name) === geometry.block);
      const regions = getCircularDiskRegions(block, geometry.disco);
      return !!block && regions.length > 0 && getCircularDiskRotationStep(block, regions) > 0;
    }

    function updateWarAvailability() {
      warButton.disabled = isGameOver || isWarRunning ||
        (isBluetoothGame() && !bluetoothConnected) ||
        (isOnlineGame() && (!onlineSocket || onlineSocket.readyState !== WebSocket.OPEN ||
          (onlineTeam !== 'orange' && ![6, 13, 18, 25].includes(currentTurn)))) ||
        (!isCampaignGame() && ![6, 13, 18, 25].includes(currentTurn));
    }

    function getGameSnapshot() {
      const regions = {};
      const regionPieceLimits = {};
      Object.keys(allRegionMasks || {}).forEach((layer) => {
        Object.keys(allRegionMasks[layer] || {}).forEach((region) => {
          const code = `L${layer}-${region}`;
          regionPieceLimits[code] = getRegionPieceLimit(code);
          regions[code] = {
            layer: Number(layer),
            orange: getTeamSoldierCount(code, 'orange'),
            blue: getTeamSoldierCount(code, 'blue'),
            orangeForce: getTeamSoldierCount(code, 'orange'),
            blueForce: getTeamSoldierCount(code, 'blue'),
            dominator: getRegionDominador(code)
          };
        });
      });
      return {
        currentTeam, humanTeam, aiTeam, currentTurn, gameSpeed, hasRotatedThisTurn,
        points: pontosDoTurn[aiTeam],
        pontosDoTurn: { ...pontosDoTurn },
        wheatBalances: { ...wheatBalances },
        blockedMoves: turnMoveHistory
          .filter((move) => move.team === aiTeam)
          .map(({ source, target, amount }) => ({ source, target, amount })),
        recycledPieces: turnRecycledPieces
          .filter((piece) => piece.team === aiTeam)
          .map(({ source, stage }) => ({ source, stage })),
        createdPieces: turnCreatedPieces
          .filter((piece) => piece.team === aiTeam)
          .map(({ source, stage }) => ({ source, stage })),
        regions,
        regionPieceLimits,
        regionForceStats: JSON.parse(JSON.stringify(regionForceStats)),
        regionForceBonusFactors: { ...regionForceBonusFactors },
        regionPiecesByRegion: JSON.parse(JSON.stringify(regionPiecesByRegion)),
        regionNeighborCache: JSON.parse(JSON.stringify(regionNeighborCache)),
        allRegionMasks
      };
    }

    function focusStrongestRegionForTeam(team) {
      if (!allRegionMasks) return null;
      let strongestCode = null;
      let strongestForce = 0;
      getRegionCalculationOrder().forEach((code) => {
        if (getRegionDominador(code) !== team) return;
        const finalForce = Number(regionForceStats[code]?.byTeam?.[team]?.forca_final || 0);
        if (finalForce > strongestForce) {
          strongestForce = finalForce;
          strongestCode = code;
        }
      });
      if (strongestCode) {
        selectedRegionCode = strongestCode;
        focusRegion(strongestCode);
        updateSelectedRegionPanel(strongestCode);
        updateMobileRotationControls();
      }
      return strongestCode;
    }

    function focusActionRegion(source, target) {
      const focusCode = target || source;
      if (!focusCode) return;
      selectedRegionCode = focusCode;
      focusRegion(focusCode);
      updateSelectedRegionPanel(focusCode);
      updateMobileRotationControls();
    }

    function getMoveCost(regionCode, amount) {
      const stage = Object.entries(soldierWeights)
        .find(([, soldierAmount]) => soldierAmount === amount)?.[0];
      if (!stage) return Infinity;
      if (stage === 'g' && getRegionLayer(regionCode) === 8) return 1;
      return Math.floor(getRecruitmentCost(regionCode, stage) / 2);
    }

    function getMaxMovableSoldiers(team, sourceCode, targetCode) {
      const available = getTeamSoldierCount(sourceCode, team);
      if (available < 2) return 0;

      const reverseMoves = turnMoveHistory.filter((move) =>
        move.team === team && move.source === targetCode && move.target === sourceCode);
      if (!reverseMoves.length) return available - 1;

      let lockedSoldiers = 0;
      for (const move of reverseMoves) {
        if (!Number.isInteger(move.amount) || move.amount < 1) return 0;
        lockedSoldiers += move.amount;
      }
      return Math.max(0, Math.min(available - 1, available - lockedSoldiers));
    }

    function isReverseMoveBlocked(team, sourceCode, targetCode, amount = 1) {
      return amount > getMaxMovableSoldiers(team, sourceCode, targetCode);
    }

    function getPromotionCost(regionCode, amount) {
      return (promotionCostBySourceLayer[getRegionLayer(regionCode)] || 0) * amount;
    }

    function getRegionDiskName(region) {
      const layer = Number(region.layer || String(region.rank || region.code || region.name).match(/L(\d+)/)?.[1]);
      return String(region.disco || `L${layer}`);
    }

    function isCircularBoardBlock(block) {
      return block?.type === 'circular' ||
        (currentBoardData?.boardType === 'circular' &&
          Array.isArray(block?.regions) &&
          block.regions.some((region) => (region.shape || region.geometry?.shape) === 'circular'));
    }

    function getCircularBlocks() {
      if (!Array.isArray(currentBoardData?.blocks)) return [];
      return currentBoardData.blocks.filter((block) =>
        isCircularBoardBlock(block) &&
        (block.regions || []).some((region) => (region.shape || region.geometry?.shape) === 'circular'));
    }

    function getRotatableCircularBlocks() {
      if (currentBoardData?.campaign?.rotationEnabled === false) return [];
      return getCircularBlocks().filter((block) => block.rotationEnabled !== false);
    }

    function getCircularDiskKey(blockName, disco) {
      return `${blockName}::${disco}`;
    }

    function getRegionCircularDiskKey(geometry) {
      return geometry?.shape === 'circular' && geometry.block && geometry.disco
        ? getCircularDiskKey(geometry.block, geometry.disco)
        : null;
    }

    function getCircularDiskRotation(blockName, disco, layerNumber) {
      const key = getCircularDiskKey(blockName, disco);
      const rotation = Number(circularDiskRotations[key]);
      return Number.isFinite(rotation) ? rotation : rotations[layerNumber - 1] || 0;
    }

    function getCircularDiskRegions(block, disco) {
      return (block?.regions || []).filter((region) =>
        (region.shape || region.geometry?.shape) === 'circular' &&
        getRegionDiskName(region) === disco);
    }

    function getCircularDiskRotationStep(block, regions) {
      return Number(block.rotationStep) ||
        rotationStepByLayer[Number(regions[0]?.layer || String(regions[0]?.rank || regions[0]?.code || regions[0]?.name).match(/L(\d+)/)?.[1])] ||
        0;
    }

    function canRotateCircularDisk(block, regions) {
      const layerNumber = Number(regions[0]?.layer ||
        String(regions[0]?.rank || regions[0]?.code || regions[0]?.name).match(/L(\d+)/)?.[1]);
      if (!isApplyingBluetoothAction && !isLocalPlayersTurn()) return false;
      if (hasRotatedThisTurn || getCircularDiskRotationStep(block, regions) <= 0) return false;
      return !(currentTurn === rotationLockTurn &&
        lastRotatedLayer === layerNumber &&
        lastRotatedBy !== currentTeam);
    }

    function initializeCircularDiskRotations(useLayerRotations = false) {
      Object.keys(circularDiskRotations).forEach((key) => delete circularDiskRotations[key]);
      getCircularBlocks().forEach((block) => {
        const disks = new Map();
        (block.regions || []).forEach((region) => {
          if ((region.shape || region.geometry?.shape) !== 'circular') return;
          const disco = getRegionDiskName(region);
          if (!disks.has(disco)) disks.set(disco, []);
          disks.get(disco).push(region);
        });
        disks.forEach((regions, disco) => {
          const layerNumber = Number(regions[0].layer ||
            String(regions[0].rank || regions[0].code || regions[0].name).match(/L(\d+)/)?.[1]);
          const rotation = useLayerRotations
            ? Number(rotations[layerNumber - 1]) || 0
            : Number(block.initialRotation) || 0;
          circularDiskRotations[getCircularDiskKey(block.name, disco)] = rotation;
          regions.forEach((region) => {
            const layer = Number(region.layer ||
              String(region.rank || region.code || region.name).match(/L(\d+)/)?.[1]);
            if (layer >= 1 && layer <= rotations.length) rotations[layer - 1] = rotation;
          });
        });
      });
    }

    function getRotationStep(layerNumber) {
      if (isCampaignGame() &&
          (activeCampaignLevel || campaignBoardConfig)?.rotationEnabled === false) return 0;
      if (currentBoardData?.boardType === 'mixed') {
        const circularBlock = currentBoardData.blocks.find((block) =>
          block.type === 'circular' && (block.regions || []).some((region) =>
            Number(region.layer || String(region.rank || region.code || region.name).match(/L(\d+)/)?.[1]) === layerNumber));
        if (circularBlock) return Number(circularBlock.rotationStep) || rotationStepByLayer[layerNumber] || 0;
      }
      return rotationStepByLayer[layerNumber] || 0;
    }

    function canRotateLayer(layerNumber) {
      if (!isApplyingBluetoothAction && !isLocalPlayersTurn()) return false;
      if (hasRotatedThisTurn) return false;
      if (getRotationStep(layerNumber) <= 0) return false;
      return !(currentTurn === rotationLockTurn && lastRotatedLayer === layerNumber && lastRotatedBy !== currentTeam);
    }

    function updateCircularRotationBlockPicker(blocks) {
      const picker = controls.querySelector('.rotation-block-picker');
      if (!picker) {
        controls.classList.remove('is-selecting-rotation-block');
        return;
      }
      const choices = picker.querySelector('.rotation-block-choices');
      const backButton = picker.querySelector('.rotation-block-back');
      const choosingBlock = blocks.length > 1 && !selectedCircularRotationBlock;
      controls.classList.toggle('is-selecting-rotation-block', choosingBlock);
      picker.hidden = blocks.length < 2;
      picker.querySelector('.rotation-block-label').hidden = !choosingBlock;
      choices.hidden = !choosingBlock;
      backButton.hidden = choosingBlock;
      backButton.textContent = `Trocar bloco (${selectedCircularRotationBlock})`;
      controls.querySelectorAll('.rotation-disk-controls').forEach((group) => {
        group.classList.toggle(
          'is-rotation-group-hidden',
          choosingBlock || group.dataset.rotationBlock !== selectedCircularRotationBlock
        );
      });
    }

    function renderCircularRotationControls() {
      controls.querySelectorAll('.rotation-block-picker, .rotation-disk-controls')
        .forEach((element) => element.remove());
      const blocks = getRotatableCircularBlocks();
      const circularLayers = new Set();
      const rotatableQuadrilateralLayers = new Set();
      blocks.forEach((block) => (block.regions || []).forEach((region) => {
        if ((region.shape || region.geometry?.shape) !== 'circular') return;
        const layer = Number(region.layer ||
          String(region.rank || region.code || region.name).match(/L(\d+)/)?.[1]);
        if (layer >= 1 && layer <= 8) circularLayers.add(layer);
      }));
      if (blocks.length) {
        (currentBoardData.blocks || [])
          .filter((block) => block.type === 'quadrilateral' && block.rotationEnabled !== false)
          .forEach((block) => (block.regions || []).forEach((region) => {
            const layer = Number(region.layer ||
              String(region.rank || region.code || region.name).match(/L(\d+)/)?.[1]);
            if (layer >= 1 && layer <= 8) rotatableQuadrilateralLayers.add(layer);
          }));
      }
      controls.querySelectorAll('.layer-controls').forEach((group) => {
        const layer = Number(group.dataset.layer);
        group.classList.toggle(
          'is-suppressed-by-circular-picker',
          circularLayers.has(layer) ||
            (blocks.length > 0 && !rotatableQuadrilateralLayers.has(layer))
        );
      });

      selectedCircularRotationBlock = blocks.length === 1 ? blocks[0].name : null;
      if (blocks.length > 1) {
        const picker = document.createElement('div');
        picker.className = 'rotation-block-picker';
        const label = document.createElement('p');
        label.className = 'rotation-block-label';
        label.textContent = 'Selecione o bloco circular';
        picker.appendChild(label);
        const choices = document.createElement('div');
        choices.className = 'rotation-block-choices';
        blocks.forEach((block) => {
          const button = document.createElement('button');
          button.className = 'rotation-block-button';
          button.type = 'button';
          button.textContent = block.name;
          button.setAttribute('aria-label', `Selecionar bloco circular ${block.name}`);
          button.addEventListener('click', () => {
            selectedCircularRotationBlock = block.name;
            updateCircularRotationBlockPicker(blocks);
          });
          choices.appendChild(button);
        });
        picker.appendChild(choices);
        const backButton = document.createElement('button');
        backButton.className = 'rotation-block-back';
        backButton.type = 'button';
        backButton.addEventListener('click', () => {
          selectedCircularRotationBlock = null;
          updateCircularRotationBlockPicker(blocks);
        });
        picker.appendChild(backButton);
        controls.insertBefore(picker, controls.firstChild);
      }

      blocks.forEach((block) => {
        const disks = new Map();
        (block.regions || []).forEach((region) => {
          if ((region.shape || region.geometry?.shape) !== 'circular') return;
          const disco = getRegionDiskName(region);
          if (!disks.has(disco)) disks.set(disco, []);
          disks.get(disco).push(region);
        });
        disks.forEach((regions, disco) => {
          const layerNumber = Number(regions[0].layer ||
            String(regions[0].rank || regions[0].code || regions[0].name).match(/L(\d+)/)?.[1]);
          const group = document.createElement('div');
          group.className = 'layer-controls rotation-disk-controls';
          group.dataset.layer = String(layerNumber);
          group.dataset.rotationBlock = String(block.name);
          group.dataset.disco = disco;
          ['right', 'left'].forEach((direction) => {
            const button = document.createElement('button');
            button.className = 'layer-button';
            button.type = 'button';
            button.dataset.layer = String(layerNumber);
            button.dataset.rotationBlock = String(block.name);
            button.dataset.disco = disco;
            button.dataset.direction = direction;
            button.textContent = disco === 'C'
              ? (direction === 'left' ? '← C' : 'C →')
              : `${disco} ${direction === 'right' ? '→' : '←'}`;
            button.setAttribute(
              'aria-label',
              `Girar disco ${disco} para a ${direction === 'left' ? 'esquerda' : 'direita'}`
            );
            button.addEventListener('click', () =>
              rotateCircularDisk(block.name, disco, direction));
            group.appendChild(button);
          });
          controls.appendChild(group);
        });
      });
      updateCircularRotationBlockPicker(blocks);
      updateRotationControls();
    }

    function updateRotationControls() {
      const layerNumbers = [...new Set(
        [...document.querySelectorAll('.layer-button')].map((button) => Number(button.dataset.layer))
      )];
      layerNumbers.forEach((layerNumber) => {
        const disabled = !canRotateLayer(layerNumber);
        document.querySelectorAll(`.layer-button[data-layer="${layerNumber}"]`).forEach((button) => {
          button.disabled = disabled;
          button.setAttribute('aria-disabled', String(disabled));
        });
      });
      controls.querySelectorAll('.layer-button[data-rotation-block]').forEach((button) => {
        const block = getRotatableCircularBlocks().find((item) =>
          String(item.name) === button.dataset.rotationBlock);
        const regions = getCircularDiskRegions(block, button.dataset.disco);
        const disabled = !block || !canRotateCircularDisk(block, regions);
        button.disabled = disabled;
        button.setAttribute('aria-disabled', String(disabled));
      });
      updateMobileRotationControls();
    }

    function updateMobileRotationControls() {
      const selectedLayer = getRegionLayer(selectedRegionCode);
      document.querySelectorAll('.layer-controls').forEach((group) => {
        group.classList.toggle('is-mobile-visible', selectedLayer > 0 && Number(group.dataset.layer) === selectedLayer);
      });
    }

    function isRegionAvailableForTeam(regionCode, team) {
      const dominator = getRegionDominador(regionCode);
      return dominator === 'free' || dominator === team;
    }

    function canAfford(cost) {
      return pontosDoTurn[currentTeam] >= cost;
    }

    function spendTurnPoints(cost) {
      if (!Number.isFinite(cost) || cost < 0 || !canAfford(cost)) return false;
      pontosDoTurn[currentTeam] -= cost;
      updateTurnPointsDisplay();
      renderPiecePurchaseButtons();
      return true;
    }

    function updateTurnPointsDisplay() {
      const teamLabel = currentTeam === 'orange' ? 'laranja' : 'azul';
      turnNumber.textContent = `Turn ${currentTurn}`;
      turnPlayer.textContent = `Vez: ${teamLabel}`;
      turnPoints.textContent = `Moedas: ${Number(pontosDoTurn[currentTeam]).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`;
      campaignObjective.classList.toggle('is-hidden', !isCampaignGame());
      if (isCampaignGame()) {
        campaignObjective.textContent = `Campanha · ${activeCampaignLevel.name}: conquiste ${campaignObjectiveRegions.join(', ') || 'as regiões azuis'}`;
      }
      const wheatTotals = getWheatTotals(currentTeam);
      const netWheatProduction = wheatTotals.production - wheatTotals.consumption;
      const netWheatSign = netWheatProduction >= 0 ? '+' : '';
      turnWheatValue.textContent = `Trigo: ${formatStatisticsNumber(wheatBalances[currentTeam])} · ${netWheatSign}${formatStatisticsNumber(netWheatProduction)}/turno`;
      const shortageReport = lastWheatTurnReport?.team === currentTeam &&
        lastWheatTurnReport.turn === currentTurn &&
        lastWheatTurnReport.shortage > 0
        ? lastWheatTurnReport
        : null;
      wheatFeedback.textContent = shortageReport
        ? `Faltaram ${formatStatisticsNumber(shortageReport.shortage)} de trigo · ${formatStatisticsNumber(shortageReport.lossRate * 100)}% de perda · ${shortageReport.piecesLost} peça(s) perdida(s)`
        : '';
      wheatFeedback.classList.toggle('is-hidden', !shortageReport);
    }

    function renderPiecePurchaseButtons() {
      pieceControls.innerHTML = '';
      const prefix = currentTeam === 'orange' ? 'peca_laranja' : 'peca_azul';
      const regionCode = selectedRegionCode || pieceTargets[currentTeam].code;
      Object.entries(soldierWeights)
        .sort((left, right) => left[1] - right[1])
        .forEach(([stage, cost]) => {
          if (isCampaignLevelTwo() && stage === 'f') return;
          const recruitCost = getRecruitmentCost(regionCode, stage);
          if (!isLocalPlayersTurn() || !canRecruitPiece(regionCode, stage, currentTeam) ||
              !canAfford(recruitCost)) return;
          const button = document.createElement('button');
          button.className = 'piece-button';
          button.type = 'button';
          button.dataset.stage = stage;
          button.innerHTML = `<img src="${prefix}_${stage}.png" alt=""><span>${stage.toUpperCase()} · ${recruitCost}</span>`;
          button.addEventListener('click', () => addPiece(currentTeam, stage));
          pieceControls.appendChild(button);
        });
      if (!pieceControls.children.length) {
        const empty = document.createElement('span');
        empty.className = 'debug-status';
        empty.textContent = 'Nenhuma compra disponível nesta região.';
        pieceControls.appendChild(empty);
      }
    }

    function getRecruitmentCost(regionCode, stage) {
      return gameRules.getRecruitmentCost(getRegionLayer(regionCode), stage);
    }

    function getRelegationRefund(sourceCode, targetCode, stage) {
      return gameRules.getRelegationRefund(
        getRecruitmentCost(sourceCode, stage),
        getRecruitmentCost(targetCode, stage)
      );
    }

    function getRecycleRefund(regionCode, stage) {
      return gameRules.getRecycleRefund(getRecruitmentCost(regionCode, stage));
    }

    function wasPieceRecycledThisTurn(regionCode, team, stage) {
      return turnRecycledPieces.some((piece) =>
        piece.team === team && piece.source === regionCode && piece.stage === stage);
    }

    function wasPieceCreatedThisTurn(regionCode, team, stage) {
      return turnCreatedPieces.some((piece) =>
        piece.team === team && piece.source === regionCode && piece.stage === stage);
    }

    function hasDirectRecruitmentPromotionCapacity(targetLayer, team, requiredSoldiers) {
      const minimumSoldiers = Number(requiredSoldiers);
      if (!Number.isFinite(minimumSoldiers) || minimumSoldiers <= 0) return false;
      if (targetLayer >= 8) return true;
      const sourceLayer = targetLayer + 1;
      const sourceSoldiers = Object.keys(allRegionMasks?.[sourceLayer] || {}).reduce((total, region) => {
        const code = `L${sourceLayer}-${region}`;
        return total + (getRegionDominador(code) === team ? getTeamSoldierCount(code, team) : 0);
      }, 0);
      const targetSoldiers = Object.keys(allRegionMasks?.[targetLayer] || {}).reduce((total, region) => {
        const code = `L${targetLayer}-${region}`;
        return total + (getRegionDominador(code) === team ? getTeamSoldierCount(code, team) : 0);
      }, 0);
      const availableSoldiers =
        (sourceSoldiers - sourceLayer * targetSoldiers) / sourceLayer;
      return availableSoldiers >= minimumSoldiers;
    }

    function canRecruitPiece(regionCode, stage, team) {
      if (!regionCode || !team || !Object.prototype.hasOwnProperty.call(soldierWeights, stage) ||
          getRegionDominador(regionCode) !== team ||
          wasPieceRecycledThisTurn(regionCode, team, stage)) return false;
      const layer = getRegionLayer(regionCode);
      if (!layer || !hasDirectRecruitmentPromotionCapacity(layer, team, soldierWeights[stage])) return false;
      const currentCounts = regionPiecesByRegion[regionCode]?.[team];
      if (!currentCounts) return false;
      const projectedCounts = { ...currentCounts, [stage]: Number(currentCounts[stage] || 0) + 1 };
      return getFinalPieceCountForTeam(projectedCounts) <= getRegionPieceLimit(regionCode);
    }

    function ensureRegionStats(layer, region) {
      const code = `L${layer}-${region}`;
      if (!regionStats[code]) regionStats[code] = { orange: 0, blue: 0 };
      return regionStats[code];
    }

    function ensureRegionPieces(regionCode) {
      if (!regionCode) return null;
      if (!regionPiecesByRegion[regionCode]) {
        regionPiecesByRegion[regionCode] = {
          orange: { g: 0, f: 0, e: 0, d: 0, c: 0, b: 0, a: 0 },
          blue: { g: 0, f: 0, e: 0, d: 0, c: 0, b: 0, a: 0 }
        };
      }
      if (!regionStats[regionCode]) {
        regionStats[regionCode] = { orange: 0, blue: 0 };
      }
      return regionPiecesByRegion[regionCode];
    }

    function getRegionDominador(regionCode) {
      if (!regionCode) return 'free';
      const counts = regionStats[regionCode] || { orange: 0, blue: 0 };
      if (counts.blue > 0 && counts.orange === 0) return 'blue';
      if (counts.orange > 0 && counts.blue === 0) return 'orange';
      return 'free';
    }

    function getPieceImageForTeam(team, stage) {
      const prefix = team === 'orange' ? 'peca_laranja' : 'peca_azul';
      return `${prefix}_${stage}`;
    }

    function getTeamSoldierCount(regionCode, team) {
      if (!regionCode || !regionPiecesByRegion[regionCode]) return 0;
      const teamCounts = regionPiecesByRegion[regionCode][team] || { g:0, f:0, e:0, d:0, c:0, b:0, a:0 };
      return gameRules.getSoldierCount(teamCounts);
    }

    function getTeamPieceCount(regionCode, team) {
      if (!regionCode || !regionPiecesByRegion[regionCode]) return 0;
      const teamCounts = regionPiecesByRegion[regionCode][team] || { g:0, f:0, e:0, d:0, c:0, b:0, a:0 };
      return gameRules.getPieceCount(teamCounts);
    }

    function getWheatRegionMetrics(regionCode) {
      const productionPerTurn = Math.max(0, Number(regionGeometryByCode[regionCode]?.farmProductionPerTurn) || 0);
      const dominator = getRegionDominador(regionCode);
      const production = { orange: 0, blue: 0 };
      if (productionPerTurn && (dominator === 'orange' || dominator === 'blue')) {
        production[dominator] = productionPerTurn;
      }
      const consumption = { orange: 0, blue: 0 };
      ['orange', 'blue'].forEach((team) => {
        const pieces = regionPiecesByRegion[regionCode]?.[team] || {};
        consumption[team] = Object.entries(wheatConsumptionByStage).reduce(
          (total, [stage, amount]) => total + Math.max(0, Number(pieces[stage]) || 0) * amount,
          0
        );
      });
      return { productionPerTurn, dominator, production, consumption };
    }

    function getWheatTotals(team) {
      return getRegionCalculationOrder().reduce((totals, regionCode) => {
        const metrics = getWheatRegionMetrics(regionCode);
        totals.production += metrics.production[team];
        totals.consumption += metrics.consumption[team];
        return totals;
      }, { production: 0, consumption: 0 });
    }

    function applyWheatForTurn(team) {
      const { production, consumption } = getWheatTotals(team);
      const stockAtStart = Math.max(0, Number(wheatBalances[team]) || 0);
      const available = stockAtStart + production;
      const shortage = Math.max(0, consumption - available);
      const deficitRatio = consumption > 0 ? shortage / consumption : 0;
      wheatBalances[team] = Math.max(0, available - consumption);

      let piecesLost = 0;
      let lossRate = 0;
      if (shortage > 0) {
        lossRate = starvationLossRateByDeficit.find((entry) => deficitRatio <= entry.maximum)?.lossRate || 0.20;
        const pieceCount = Object.values(regionPiecesByRegion).reduce(
          (total, region) => total + getTeamPieceCountFromCounts(region[team]),
          0
        );
        const expectedLosses = pieceCount * lossRate;
        piecesLost = Math.floor(expectedLosses);
        if (Math.random() < expectedLosses - piecesLost) piecesLost += 1;
        piecesLost = Math.min(pieceCount, piecesLost);

        let appliedLosses = 0;
        for (let loss = 0; loss < piecesLost; loss += 1) {
          const candidates = [];
          Object.entries(regionPiecesByRegion).forEach(([regionCode, region]) => {
            Object.entries(region[team] || {}).forEach(([stage, quantity]) => {
              for (let count = 0; count < Number(quantity || 0); count += 1) {
                candidates.push({ regionCode, stage });
              }
            });
          });
          if (!candidates.length) break;
          const victim = candidates[Math.floor(Math.random() * candidates.length)];
          regionPiecesByRegion[victim.regionCode][team][victim.stage] -= 1;
          regionStats[victim.regionCode] = {
            orange: getTeamPieceCount(victim.regionCode, 'orange'),
            blue: getTeamPieceCount(victim.regionCode, 'blue')
          };
          appliedLosses += 1;
        }
        piecesLost = appliedLosses;
      }

      recalculatePieceCounts();
      if (piecesLost > 0) {
        recalculateRegionForces();
        refreshRegionVisuals();
      }
      lastWheatTurnReport = {
        team,
        turn: currentTurn,
        production,
        consumption,
        stockAtStart,
        balance: wheatBalances[team],
        shortage,
        deficitRatio,
        lossRate,
        piecesLost
      };
      updateTurnPointsDisplay();
      return lastWheatTurnReport;
    }

    function getWheatShortageMessage(report) {
      if (!report?.shortage) return '';
      const teamLabel = report.team === 'orange' ? 'Laranja' : 'Azul';
      return `${teamLabel}: faltaram ${formatStatisticsNumber(report.shortage)} de trigo (${formatStatisticsNumber(report.deficitRatio * 100)}% do consumo); perda de ${formatStatisticsNumber(report.lossRate * 100)}% das peças (${report.piecesLost} peça(s)).`;
    }

    function getRegionLayer(regionCode) {
      return gameRules.getRegionLayer(regionCode);
    }

    function getRegionSlots(regionCode) {
      if (!regionCode) return [];
      const match = String(regionCode).match(/^L(\d+)-(\d+)$/);
      if (!match) return [];
      const layerNumber = Number(match[1]);
      const regionNumber = Number(match[2]);
      if (regionSlots[layerNumber] && Array.isArray(regionSlots[layerNumber][regionNumber])) {
        return regionSlots[layerNumber][regionNumber];
      }
      if (Array.isArray(regionSlots[regionNumber])) {
        return regionSlots[regionNumber];
      }
      return [];
    }

    function getRegionPieceLimit(regionCode) {
      if (!regionCode) return 1;
      const layer = getRegionLayer(regionCode);
      if (!layer) return regionCapacity;
      const configuredLimit = Number(regionGeometryByCode[regionCode]?.maxPieces);
      const defaultLimit = Number.isFinite(configuredLimit) && configuredLimit > 0 ? configuredLimit : layer;
      const slotLimit = getRegionSlots(regionCode).length || Number.POSITIVE_INFINITY;
      return Math.min(defaultLimit, Number.isFinite(slotLimit) ? slotLimit : defaultLimit);
    }

    function getRegionSoldierTotal(regionCode) {
      if (!regionCode || !regionPiecesByRegion[regionCode]) return 0;
      return ['orange', 'blue'].reduce((total, team) => total + getTeamSoldierCount(regionCode, team), 0);
    }

    function getRegionCalculationOrder() {
      const order = [];
      for (let layer = 8; layer >= 1; layer -= 1) {
        const regionKeys = Object.keys(allRegionMasks?.[layer] || {})
          .map(Number)
          .sort((a, b) => a - b);
        regionKeys.forEach((region) => order.push(`L${layer}-${region}`));
      }
      return order;
    }

    function resetCombatRegions() {
      getRegionCalculationOrder().forEach((regionCode) => {
        regionCombatState[regionCode] = { is_active: true };
      });
    }

    function getCombatNeighbors(regionCode) {
      if (regionGeometryByCode[regionCode]?.shape === 'quadrilateral') {
        return [...(regionNeighborCache[regionCode]?.sameRank || [])];
      }
      const neighbors = [...(regionNeighborCache[regionCode]?.inferior || [])];
      const rightNeighbor = getNeighborRegionCode(regionCode, 'right');
      if (rightNeighbor) neighbors.push(rightNeighbor);
      return [...new Set(neighbors)];
    }

    function getRegionFinalForceValue(regionCode) {
      return Number(regionForceStats[regionCode]?.forca_final || 0);
    }

    function formatStatisticsNumber(value) {
      return Number(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
    }

    function escapeHtmlText(value) {
      return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[character]);
    }

    function getVictoryMetrics() {
      const territories = { orange: 0, blue: 0 };
      const finalForces = { orange: 0, blue: 0 };
      Object.keys(allRegionMasks || {}).forEach((layer) => {
        Object.keys(allRegionMasks[layer] || {}).forEach((region) => {
          const code = `L${layer}-${region}`;
          const dominator = getRegionDominador(code);
          if (dominator === 'orange' || dominator === 'blue') territories[dominator] += 1;
          ['orange', 'blue'].forEach((team) => {
            finalForces[team] += Number(regionForceStats[code]?.byTeam?.[team]?.forca_final || 0);
          });
        });
      });
      return { territories, finalForces };
    }

    function scoreCurrentRound() {
      recalculateRegionForces();
      const metrics = getVictoryMetrics();
      const gains = { orange: 0, blue: 0 };
      if (metrics.territories.orange !== metrics.territories.blue) {
        gains[metrics.territories.orange > metrics.territories.blue ? 'orange' : 'blue'] += 1;
      }
      if (metrics.finalForces.orange !== metrics.finalForces.blue) {
        gains[metrics.finalForces.orange > metrics.finalForces.blue ? 'orange' : 'blue'] += 1;
      }
      victoryPoints.orange += gains.orange;
      victoryPoints.blue += gains.blue;
      const winner = gains.orange === gains.blue
        ? 'draw'
        : gains.orange > gains.blue ? 'orange' : 'blue';
      lastRoundResult = {
        round: currentTurn,
        winner,
        gains,
        totals: { ...victoryPoints },
        territories: metrics.territories,
        finalForces: metrics.finalForces
      };
      return lastRoundResult;
    }

    function renderStatistics() {
      const layers = Object.keys(allRegionMasks || {})
        .map(Number)
        .filter((layer) => Number.isInteger(layer) && layer >= 1 && layer <= 8)
        .sort((a, b) => b - a);
      const totals = {
        orange: { production: 0, consumption: 0 },
        blue: { production: 0, consumption: 0 }
      };
      const rows = layers.map((layer) => {
        const regions = Object.keys(allRegionMasks[layer] || {}).map((region) => `L${layer}-${region}`);
        const dominatedRegions = { orange: 0, blue: 0 };
        const soldierTotals = { orange: 0, blue: 0 };
        const finalForceTotals = { orange: 0, blue: 0 };
        const wheatTotals = {
          orange: { production: 0, consumption: 0 },
          blue: { production: 0, consumption: 0 }
        };
        regions.forEach((regionCode) => {
          const dominator = getRegionDominador(regionCode);
          if (dominator === 'orange' || dominator === 'blue') dominatedRegions[dominator] += 1;
          const wheat = getWheatRegionMetrics(regionCode);
          ['orange', 'blue'].forEach((team) => {
            soldierTotals[team] += getTeamSoldierCount(regionCode, team);
            finalForceTotals[team] += Number(regionForceStats[regionCode]?.byTeam?.[team]?.forca_final || 0);
            wheatTotals[team].production += wheat.production[team];
            wheatTotals[team].consumption += wheat.consumption[team];
            totals[team].production += wheat.production[team];
            totals[team].consumption += wheat.consumption[team];
          });
        });
        const rotation = ((rotations[layer - 1] % 360) + 360) % 360;
        return `<tr>
          <th scope="row">L${layer}</th>
          <td>${dominatedRegions.orange}</td>
          <td>${dominatedRegions.blue}</td>
          <td>${formatStatisticsNumber(soldierTotals.orange)}</td>
          <td>${formatStatisticsNumber(soldierTotals.blue)}</td>
          <td>${formatStatisticsNumber(finalForceTotals.orange)}</td>
          <td>${formatStatisticsNumber(finalForceTotals.blue)}</td>
          <td>${formatStatisticsNumber(wheatTotals.orange.production)}</td>
          <td>${formatStatisticsNumber(wheatTotals.blue.production)}</td>
          <td>${formatStatisticsNumber(wheatTotals.orange.consumption)}</td>
          <td>${formatStatisticsNumber(wheatTotals.blue.consumption)}</td>
          <td>${formatStatisticsNumber(rotation)}°</td>
        </tr>`;
      }).join('');
      const regionRows = getRegionCalculationOrder().map((regionCode) => {
        const wheat = getWheatRegionMetrics(regionCode);
        const farm = wheat.productionPerTurn
          ? `${formatStatisticsNumber(wheat.productionPerTurn)} / turno`
          : '—';
        const dominator = wheat.dominator === 'orange' ? 'Laranja' :
          wheat.dominator === 'blue' ? 'Azul' : 'Livre';
        return `<tr>
          <th scope="row">${escapeHtmlText(regionCode)}</th>
          <td>${farm}</td>
          <td>${dominator}</td>
          <td>${formatStatisticsNumber(wheat.production.orange)}</td>
          <td>${formatStatisticsNumber(wheat.production.blue)}</td>
          <td>${formatStatisticsNumber(wheat.consumption.orange)}</td>
          <td>${formatStatisticsNumber(wheat.consumption.blue)}</td>
        </tr>`;
      }).join('');
      const victoryScore = `<p class="victory-score">Pontos de vitória — Laranja: ${victoryPoints.orange} · Azul: ${victoryPoints.blue}</p>`;
      const wheatSummary = `<p class="victory-score">Trigo armazenado — Laranja: ${formatStatisticsNumber(wheatBalances.orange)} · Azul: ${formatStatisticsNumber(wheatBalances.blue)}. Produção/consumo por turno — Laranja: ${formatStatisticsNumber(totals.orange.production)} / ${formatStatisticsNumber(totals.orange.consumption)} · Azul: ${formatStatisticsNumber(totals.blue.production)} / ${formatStatisticsNumber(totals.blue.consumption)}.</p>`;
      statisticsTableContainer.innerHTML = `${victoryScore}${wheatSummary}<h3>Resumo por disco</h3><table class="statistics-table">
        <thead><tr>
          <th scope="col">Disco</th>
          <th scope="col">Regiões laranja</th>
          <th scope="col">Regiões azuis</th>
          <th scope="col">Soldados laranja</th>
          <th scope="col">Soldados azuis</th>
          <th scope="col">Força final laranja</th>
          <th scope="col">Força final azul</th>
          <th scope="col">Produção Laranja</th>
          <th scope="col">Produção Azul</th>
          <th scope="col">Consumo Laranja</th>
          <th scope="col">Consumo Azul</th>
          <th scope="col">Rotação</th>
        </tr></thead>
        <tbody>${rows || '<tr><td colspan="12">Dados dos discos ainda não estão disponíveis.</td></tr>'}</tbody>
      </table><h3>Produção e consumo por região</h3><table class="statistics-table">
        <thead><tr>
          <th scope="col">Região</th>
          <th scope="col">Fazenda</th>
          <th scope="col">Dominador</th>
          <th scope="col">Produção Laranja</th>
          <th scope="col">Produção Azul</th>
          <th scope="col">Consumo Laranja</th>
          <th scope="col">Consumo Azul</th>
        </tr></thead>
        <tbody>${regionRows || '<tr><td colspan="7">Dados das regiões ainda não estão disponíveis.</td></tr>'}</tbody>
      </table>`;
    }

    function setRegionTeamOwnership(regionCode, team) {
      const totalSoldiers = getRegionSoldierTotal(regionCode);
      ensureRegionPieces(regionCode);
      const regionPieces = regionPiecesByRegion[regionCode];
      const opponent = team === 'orange' ? 'blue' : 'orange';
      regionPieces[opponent] = buildStageCountsFromSoldierTotal(0);
      regionPieces[team] = buildStageCountsFromSoldierTotal(totalSoldiers);
      regionStats[regionCode] = {
        orange: getTeamPieceCount(regionCode, 'orange'),
        blue: getTeamPieceCount(regionCode, 'blue')
      };
      turnMoveHistory = turnMoveHistory.filter((move) =>
        move.source !== regionCode && move.target !== regionCode);
    }

    function recalculatePieceCounts() {
      pieceCounts.orange = 0;
      pieceCounts.blue = 0;
      Object.values(regionPiecesByRegion).forEach((piecesByTeam) => {
        ['orange', 'blue'].forEach((team) => {
          pieceCounts[team] += getTeamPieceCountFromCounts(piecesByTeam[team]);
        });
      });
    }

    function getTeamPieceCountFromCounts(teamCounts) {
      if (!teamCounts) return 0;
      return gameRules.getPieceCount(teamCounts);
    }

    function renderWarStatus(title, alliedRegions, enemyRegions, alliedForce, enemyForce, result) {
      warStatus.innerHTML = `<h2>${title}</h2>
        <p>Aliados: ${alliedRegions.join(', ') || 'nenhum'}</p>
        <p>Inimigos: ${enemyRegions.join(', ') || 'nenhum'}</p>
        <p>${result}</p>`;
      warStatus.classList.remove('is-hidden');
    }

    function renderWarForces(attacker, alliedForce, enemyForce) {
      const orangeForce = attacker === 'orange' ? alliedForce : enemyForce;
      const blueForce = attacker === 'blue' ? alliedForce : enemyForce;
      warStatus.innerHTML = `<h2>Forças em confronto</h2>
        <p class="war-force-line"><strong>Laranja Força final: ${orangeForce.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</strong>
        <span aria-hidden="true"> ⚔ </span>
        <strong>${blueForce.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} : Força final Azul</strong></p>`;
      warStatus.classList.remove('is-hidden');
    }

    function renderWarWinner(winner) {
      const winnerLabel = winner === 'orange' ? 'Laranja' : winner === 'blue' ? 'Azul' : 'Nenhum';
      warStatus.innerHTML = `<h2>Vencedor: ${winnerLabel}!</h2>`;
      warStatus.classList.remove('is-hidden');
    }

    function waitForWarAnimation(milliseconds) {
      return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
    }

    async function startWar(isAutomatic = false, allowUnscheduled = false) {
      if (isWarRunning || !allRegionMasks ||
          (!isCampaignGame() && !isAutomatic && !allowUnscheduled &&
            ![6, 13, 18, 25].includes(currentTurn))) return;
      const sessionVersion = gameSessionVersion;
      isWarRunning = true;
      if (gameMode === 'bluetooth' && bluetoothRole === 'host' && bluetoothConnected) {
        sendBluetoothMessage({ type: 'war_start' });
      }
      if (isOnlineGame() && onlineTeam === 'orange') sendOnlineMessage({ type: 'war_start' });
      warButton.disabled = true;
      resetCombatRegions();
      warSpotlightRegionCodes = [];
      updateBoardFocusOverlay();
      resetStageZoom();
      const blocks = [];

      getRegionCalculationOrder().forEach((regionCode) => {
        const combatState = regionCombatState[regionCode];
        if (!combatState?.is_active) return;
        const dominator = getRegionDominador(regionCode);
        combatState.is_active = false;
        if (dominator !== 'orange' && dominator !== 'blue') return;

        const alliedRegions = [regionCode];
        const enemyRegions = [];
        getCombatNeighbors(regionCode).forEach((neighborCode) => {
          const neighborDominator = getRegionDominador(neighborCode);
          if (neighborDominator === dominator) alliedRegions.push(neighborCode);
          if (neighborDominator !== 'free' && neighborDominator !== dominator) enemyRegions.push(neighborCode);
          if (neighborDominator === dominator || (neighborDominator !== 'free' && neighborDominator !== dominator)) {
            regionCombatState[neighborCode] = { is_active: false };
          }
        });
        if (enemyRegions.length) {
          blocks.push({ regionCode, alliedRegions: [...new Set(alliedRegions)], enemyRegions: [...new Set(enemyRegions)], attacker: dominator });
        }
      });

      if (!blocks.length) {
        warSpotlightRegionCodes = [];
        updateBoardFocusOverlay();
        readout.textContent = 'Guerra: nenhum bloco de confronto encontrado.';
        isWarRunning = false;
        updateWarAvailability();
        const centerWinner = getCenterConqueror();
        if (centerWinner && (!isOnlineGame() || onlineTeam === 'orange')) {
          finishGame(centerWinner, 'center');
        } else if (finishCampaignIfObjectiveMet()) {
          return;
        } else if (isAutomatic && (!isOnlineGame() || onlineTeam === 'orange')) {
          finishGame(null, 'turn30');
        }
        return;
      }

      blocks.reverse();
      for (const block of blocks) {
        warSpotlightRegionCodes = [...new Set([...block.alliedRegions, ...block.enemyRegions])];
        updateBoardFocusOverlay();
        focusRegion(block.regionCode);
        const alliedForce = block.alliedRegions.reduce((sum, code) => sum + getRegionFinalForceValue(code), 0);
        const enemyForce = block.enemyRegions.reduce((sum, code) => sum + getRegionFinalForceValue(code), 0);
        renderWarForces(block.attacker, alliedForce, enemyForce);
        await waitForWarAnimation(3000);
        if (sessionVersion !== gameSessionVersion) return;

        const winner = alliedForce > enemyForce
          ? block.attacker
          : alliedForce < enemyForce
            ? (block.attacker === 'orange' ? 'blue' : 'orange')
            : null;
        renderWarWinner(winner);
        await waitForWarAnimation(2200);
        if (sessionVersion !== gameSessionVersion) return;

        if (winner) {
          pieces.classList.remove('war-flash');
          void pieces.offsetWidth;
          pieces.classList.add('war-flash');
          const losingRegions = winner === block.attacker ? block.enemyRegions : block.alliedRegions;
          losingRegions.forEach((regionCode) => {
            setRegionTeamOwnership(regionCode, winner);
            collectCampaignBagAtRegion(regionCode, winner);
          });
          recalculatePieceCounts();
          recalculateRegionForces();
          refreshRegionVisuals();
          updateSelectedRegionPanel(selectedRegionCode);
          readout.textContent = `${block.regionCode}: regiões derrotadas trocaram de equipe.`;
          await waitForWarAnimation(1000);
          if (sessionVersion !== gameSessionVersion) return;
        }
      }

      warStatus.classList.add('is-hidden');
      warSpotlightRegionCodes = [];
      updateBoardFocusOverlay();
      resetStageZoom();
      isWarRunning = false;
      updateWarAvailability();
      recalculateRegionForces();
      refreshRegionVisuals();
      updateSelectedRegionPanel(selectedRegionCode);
      readout.textContent = `Guerra concluída: ${blocks.length} bloco(s) de confronto.`;
      saveGame();
      maybeAdvanceLevel2Guide();
      const centerWinner = getCenterConqueror();
      if (centerWinner && (!isOnlineGame() || onlineTeam === 'orange')) {
        finishGame(centerWinner, 'center');
      } else if (finishCampaignIfObjectiveMet()) {
        return;
      } else if (isAutomatic && (!isOnlineGame() || onlineTeam === 'orange')) {
        finishGame(null, 'turn30');
      }
    }

    function recalculateRegionForces() {
      const forceState = {};
      getRegionCalculationOrder().forEach((regionCode) => {
        forceState[regionCode] = {
          byTeam: {
            orange: {
              forca: getTeamSoldierCount(regionCode, 'orange'),
              unidades_livres_temp: getTeamSoldierCount(regionCode, 'orange')
            },
            blue: {
              forca: getTeamSoldierCount(regionCode, 'blue'),
              unidades_livres_temp: getTeamSoldierCount(regionCode, 'blue')
            }
          }
        };
      });

      getRegionCalculationOrder().forEach((regionCode) => {
        const layer = getRegionLayer(regionCode);
        const state = forceState[regionCode];
        if (layer <= 1) return;
        const sourceTeam = getRegionDominador(regionCode);
        if (sourceTeam !== 'orange' && sourceTeam !== 'blue') return;
        const sourceState = state.byTeam[sourceTeam];
        const soldiers = getTeamSoldierCount(regionCode, sourceTeam);
        if (soldiers <= 0) return;

        const superiorRegions = (regionNeighborCache[regionCode]?.superior || [])
          .filter((targetCode) => getRegionLayer(targetCode) === layer - 1)
          .filter((targetCode) => getRegionDominador(targetCode) === sourceTeam)
          .sort((a, b) => {
            const aRegion = Number(a.split('-')[1]);
            const bRegion = Number(b.split('-')[1]);
            return aRegion - bRegion;
          });
        const forcePerSoldier = sourceState.forca / soldiers;
        const recipientsPerSourceGroup = layer;
        let availableSourceGroups = soldiers / recipientsPerSourceGroup;

        superiorRegions.forEach((targetCode) => {
          if (availableSourceGroups <= 0) return;
          const targetState = forceState[targetCode].byTeam[sourceTeam];
          const recipientCount = Math.min(targetState.unidades_livres_temp, availableSourceGroups);
          if (recipientCount <= 0) return;

          const donatedForce = recipientCount * recipientsPerSourceGroup * forcePerSoldier / 2;
          sourceState.forca -= donatedForce;
          targetState.forca += donatedForce;
          targetState.unidades_livres_temp -= recipientCount;
          availableSourceGroups -= recipientCount;
        });
      });

      const aggregateForceState = {};
      Object.entries(forceState).forEach(([regionCode, state]) => {
        const layer = getRegionLayer(regionCode);
        const bonusFactor = regionForceBonusFactors[layer] || 1;
        const aggregate = ['orange', 'blue'].reduce((result, team) => {
          state.byTeam[team].forca_final = state.byTeam[team].forca * bonusFactor;
          result.byTeam[team] = {
            forca: state.byTeam[team].forca,
            unidades_livres_temp: state.byTeam[team].unidades_livres_temp,
            forca_final: state.byTeam[team].forca_final
          };
          result.forca += state.byTeam[team].forca;
          result.unidades_livres_temp += state.byTeam[team].unidades_livres_temp;
          result.forca_final += state.byTeam[team].forca_final;
          return result;
        }, { forca: 0, unidades_livres_temp: 0, forca_final: 0, byTeam: {} });
        aggregateForceState[regionCode] = aggregate;
      });
      Object.keys(regionForceStats).forEach((regionCode) => delete regionForceStats[regionCode]);
      Object.assign(regionForceStats, aggregateForceState);
      if (!statisticsModal.classList.contains('is-hidden')) renderStatistics();
    }

    function getNeighborRegionCode(regionCode, direction) {
      if (!regionCode) return null;
      const geometry = regionGeometryByCode[regionCode];
      if (currentBoardData?.boardType === 'mixed' && geometry?.shape === 'circular') {
        const candidates = (getRegionNeighborSummary(regionCode).sameRank || [])
          .filter((candidate) => {
            const candidateGeometry = regionGeometryByCode[candidate];
            return candidateGeometry?.shape === 'circular' &&
              candidateGeometry.block === geometry.block;
          });
        const sourceBoundary = direction === 'left' ? geometry.startAngle : geometry.endAngle;
        const boundaryError = (first, second) => {
          const difference = ((first - second) % 360 + 360) % 360;
          return Math.min(difference, 360 - difference);
        };
        return candidates
          .map((candidate) => ({
            code: candidate,
            error: boundaryError(
              direction === 'left'
                ? regionGeometryByCode[candidate].endAngle
                : regionGeometryByCode[candidate].startAngle,
              sourceBoundary
            )
          }))
          .filter((candidate) => candidate.error < 0.01)
          .sort((first, second) => first.code.localeCompare(second.code))[0]?.code || null;
      }
      if (geometry?.shape === 'quadrilateral') {
        const neighbors = getRegionNeighborSummary(regionCode).sameRank || [];
        const candidates = neighbors.filter((candidate) => getRegionLayer(candidate) === geometry.layer);
        const horizontal = candidates.filter((candidate) => {
          const candidateX = regionGeometryByCode[candidate]?.centerX;
          return direction === 'left'
            ? Number.isFinite(candidateX) && candidateX < geometry.centerX
            : Number.isFinite(candidateX) && candidateX > geometry.centerX;
        });
        return horizontal.sort((first, second) =>
          Math.abs(regionGeometryByCode[first].centerX - geometry.centerX) -
          Math.abs(regionGeometryByCode[second].centerX - geometry.centerX))[0] || null;
      }
      const match = String(regionCode).match(/^L(\d+)-(\d+)$/);
      if (!match) return null;
      const layerNumber = Number(match[1]);
      const regionNumber = Number(match[2]);
      const layerRegions = allRegionMasks && allRegionMasks[layerNumber]
        ? Object.keys(allRegionMasks[layerNumber]).map((value) => Number(value)).sort((a, b) => a - b)
        : [1, 2, 3, 4, 5, 6, 7, 8];

      if (!layerRegions.length) return null;
      const normalizedOrder = [...new Set(layerRegions)];
      const index = normalizedOrder.indexOf(regionNumber);
      if (index === -1) return null;
      const offset = direction === 'left' ? -1 : 1;
      const targetRegion = normalizedOrder[(index + offset + normalizedOrder.length) % normalizedOrder.length];
      return `L${layerNumber}-${targetRegion}`;
    }

    function getDragMoveTargets(sourceCode, team, amount) {
      if (!sourceCode || !team || !Number.isInteger(amount) || amount <= 0) return [];
      const available = getTeamSoldierCount(sourceCode, team);
      const sourceLimit = getRegionPieceLimit(sourceCode);
      if (amount > available || available - amount < 1) return [];
      const sourceCounts = { ...regionPiecesByRegion[sourceCode][team], g: Math.max(0, available - amount) };
      for (const stage of ['f', 'e', 'd', 'c', 'b', 'a']) sourceCounts[stage] = 0;
      const sourceFinalPieces = getFinalPieceCountForTeam(sourceCounts);
      if (sourceFinalPieces > sourceLimit) return [];

      const targets = [];
      const candidateTargets = currentBoardData?.boardType === 'mixed' ||
        regionGeometryByCode[sourceCode]?.shape === 'quadrilateral'
        ? (regionNeighborCache[sourceCode]?.sameRank || [])
        : ['left', 'right'].map((direction) => getNeighborRegionCode(sourceCode, direction)).filter(Boolean);
      for (const targetCode of candidateTargets) {
        if (targets.some((target) => target.code === targetCode)) continue;
        if (isReverseMoveBlocked(team, sourceCode, targetCode, amount)) continue;
        if (!isRegionAvailableForTeam(targetCode, team)) continue;
        ensureRegionPieces(targetCode);
        const targetCounts = { ...regionPiecesByRegion[targetCode][team], g: getTeamSoldierCount(targetCode, team) + amount };
        for (const stage of ['f', 'e', 'd', 'c', 'b', 'a']) targetCounts[stage] = 0;
        if (getFinalPieceCountForTeam(targetCounts) > getRegionPieceLimit(targetCode)) continue;
        const cost = getMoveCost(sourceCode, amount);
        if (!canAfford(cost)) continue;
        targets.push({ code: targetCode, type: 'move' });
      }
      return targets;
    }

    function getDragPromotionTargets(sourceCode, team, amount) {
      if (!Number.isInteger(amount) || amount <= 0) return [];
      const costPerUnit = promotionCostBySourceLayer[getRegionLayer(sourceCode)] || 0;
      if (!costPerUnit || !canAfford(costPerUnit * amount)) return [];
      return getPromotionTargetsForRegion(sourceCode, team)
        .filter((target) => target.availablePromotions >= amount)
        .map((target) => ({ code: target.code, type: 'promotion' }));
    }

    function getDragRelegationTargets(sourceCode, team, stage) {
      return getRelegationTargetsForPiece(sourceCode, team, stage)
        .map((target) => ({ code: target.code, type: 'relegation' }));
    }

    function getDragTargets(sourceCode, team, amount, stage) {
      return [
        ...getDragMoveTargets(sourceCode, team, amount),
        ...getDragPromotionTargets(sourceCode, team, amount),
        ...getDragRelegationTargets(sourceCode, team, stage)
      ];
    }

    function drawDragOverlay(targetCodes = []) {
      dragOverlayMaskHoles.replaceChildren();
      dragOverlayTargets.replaceChildren();
      dragOverlay.style.display = targetCodes.length ? '' : 'none';
      if (!targetCodes.length) return;
      const svgNamespace = 'http://www.w3.org/2000/svg';
      targetCodes.forEach((regionCode) => {
        const geometry = regionGeometryByCode[regionCode];
        if (!geometry) return;
        const pathData = getRegionFocusPathData(geometry);
        const center = getRegionRotationCenter(regionCode);
        const transform = `rotate(${getRegionVisualRotation(regionCode)} ${center.x} ${center.y})`;
        const hole = document.createElementNS(svgNamespace, 'path');
        hole.setAttribute('d', pathData);
        hole.setAttribute('transform', transform);
        dragOverlayMaskHoles.appendChild(hole);

        const outline = document.createElementNS(svgNamespace, 'path');
        outline.setAttribute('d', pathData);
        outline.setAttribute('transform', transform);
        outline.classList.add('drag-target-outline');
        dragOverlayTargets.appendChild(outline);
      });
    }

    function findPieceAtPointer(clientX, clientY, sourceCode) {
      const candidates = [...pieces.querySelectorAll('.piece')].reverse();
      const hits = candidates.filter((piece) => {
        if (piece.dataset.team !== currentTeam) return false;
        const rect = piece.getBoundingClientRect();
        return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      });
      return hits.find((piece) => piece.dataset.region === sourceCode) || hits[0] || null;
    }

    function isPointerOverTrash(clientX, clientY) {
      if (trashDropZone.classList.contains('is-hidden')) return false;
      const rect = trashDropZone.getBoundingClientRect();
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    }

    function clearPieceDrag() {
      if (!pieceDragState) return;
      pieceDragState.sourcePiece?.classList.remove('is-drag-source');
      pieceDragState.dragPiece?.remove();
      stage.classList.remove('is-dragging');
      trashDropZone.classList.add('is-hidden');
      trashDropZone.classList.remove('is-visible', 'is-target');
      pieceDragState = null;
      drawDragOverlay();
    }

    function finishPieceDrag(clientX, clientY) {
      if (!pieceDragState) return;
      const overTrash = isPointerOverTrash(clientX, clientY);
      const { sourceCode, amount, pieceStage, canRecycle, startX, startY } = pieceDragState;
      const moved = pieceDragState.moved ||
        Math.hypot(clientX - startX, clientY - startY) >= 6;
      if (!moved) {
        selectedRegionCode = sourceCode;
        updateSelectedRegionPanel(selectedRegionCode);
        updateMobileRotationControls();
        focusRegion(sourceCode);
        clearPieceDrag();
        return;
      }
      if (overTrash) {
        const recycled = canRecycle && recyclePiece(sourceCode, currentTeam, pieceStage);
        if (!recycled) readout.textContent = 'Não foi possível descartar essa peça.';
        clearPieceDrag();
        return;
      }
      const targetCode = resolveRegionFromPointer(clientX, clientY);
      const target = pieceDragState.targets.find((candidate) => candidate.code === targetCode);
      const completed = target
        ? target.type === 'move'
          ? (selectedRegionCode = sourceCode, performMoveTo(target.code, amount), true)
          : target.type === 'promotion'
            ? (performPromotion(target.code, amount), true)
            : (performRelegation(target.code, pieceStage), true)
        : false;
      if (!completed) {
        readout.textContent = 'Arraste cancelado: solte a peça sobre uma região válida.';
      }
      clearPieceDrag();
    }

    function beginPieceDrag(event, sourceCode) {
      if (!isLocalPlayersTurn()) return false;
      const piece = findPieceAtPointer(event.clientX, event.clientY, sourceCode);
      if (!piece) return false;
      sourceCode = piece.dataset.region;
      const pieceStage = piece.dataset.stage;
      const amount = soldierWeights[pieceStage] || 0;
      const availablePieces = getTeamPieceCount(sourceCode, currentTeam);
      const targets = getDragTargets(sourceCode, currentTeam, amount, pieceStage);
      if (!amount || !Object.prototype.hasOwnProperty.call(soldierWeights, pieceStage)) return false;
      const canRecycle = availablePieces >= 2 &&
        (isCampaignLevelTwo() ||
          !wasPieceCreatedThisTurn(sourceCode, currentTeam, pieceStage));
      if (!targets.length && !canRecycle) return false;
      const dragPiece = document.createElement('img');
      dragPiece.className = 'drag-piece';
      dragPiece.style.width = `${30 / Math.max(1, stageZoom)}px`;
      dragPiece.style.height = `${30 / Math.max(1, stageZoom)}px`;
      dragPiece.src = piece.src;
      dragPiece.alt = piece.alt;
      pieces.appendChild(dragPiece);
      piece.classList.add('is-drag-source');
      pieceDragState = {
        sourceCode,
        amount,
        pieceStage,
        targets,
        dragPiece,
        sourcePiece: piece,
        canRecycle,
        startX: event.clientX,
        startY: event.clientY,
        moved: false
      };
      stage.classList.add('is-dragging');
      drawDragOverlay(targets.map((target) => target.code));
      const stageRect = stagePanel.getBoundingClientRect();
      trashDropZone.style.left = `${Math.max(8, stageRect.left - 74)}px`;
      trashDropZone.style.top = `${stageRect.top + stageRect.height / 2}px`;
      trashDropRefund.textContent = `+${getRecycleRefund(sourceCode, pieceStage)} moedas`;
      if (canRecycle) {
        trashDropZone.classList.remove('is-hidden');
        window.requestAnimationFrame(() => trashDropZone.classList.add('is-visible'));
      } else {
        trashDropZone.classList.add('is-hidden');
      }
      updateDraggedPiece(event.clientX, event.clientY);
      try {
        stage.setPointerCapture?.(event.pointerId);
      } catch (error) {
        // Pointer capture is optional for synthetic browser events.
      }
      event.preventDefault();
      event.stopPropagation();
      return true;
    }

    function updateDraggedPiece(clientX, clientY) {
      if (!pieceDragState?.dragPiece) return;
      if (Math.hypot(clientX - pieceDragState.startX, clientY - pieceDragState.startY) >= 6) {
        pieceDragState.moved = true;
      }
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      pieceDragState.dragPiece.style.left = `${x}%`;
      pieceDragState.dragPiece.style.top = `${y}%`;
      trashDropZone.classList.toggle('is-target', isPointerOverTrash(clientX, clientY));
    }

    function addSoldierAmountToRegion(regionCode, team, amount) {
      if (!regionCode || !team || !Number.isInteger(amount) || amount <= 0) return false;
      if (!regionPiecesByRegion[regionCode]) {
        regionPiecesByRegion[regionCode] = {
          orange: { g: 0, f: 0, e: 0, d: 0, c: 0, b: 0, a: 0 },
          blue: { g: 0, f: 0, e: 0, d: 0, c: 0, b: 0, a: 0 }
        };
      }
      const counts = regionPiecesByRegion[regionCode][team];
      const newTotal = getTeamSoldierCount(regionCode, team) + amount;
      for (const stage of stageOrder) counts[stage] = 0;
      counts.g = newTotal;
      regionStats[regionCode] = {
        orange: Object.values(regionPiecesByRegion[regionCode].orange).reduce((sum, value) => sum + value, 0),
        blue: Object.values(regionPiecesByRegion[regionCode].blue).reduce((sum, value) => sum + value, 0)
      };
      return true;
    }

    function removeSoldierAmountFromRegion(regionCode, team, amount) {
      if (!regionCode || !team || !Number.isInteger(amount) || amount <= 0) return false;
      if (!regionPiecesByRegion[regionCode]) return false;
      const counts = regionPiecesByRegion[regionCode][team];
      const currentTotal = getTeamSoldierCount(regionCode, team);
      if (amount > currentTotal) return false;
      const remainingTotal = Math.max(0, currentTotal - amount);
      for (const stage of stageOrder) counts[stage] = 0;
      counts.g = remainingTotal;
      regionStats[regionCode] = {
        orange: Object.values(regionPiecesByRegion[regionCode].orange).reduce((sum, value) => sum + value, 0),
        blue: Object.values(regionPiecesByRegion[regionCode].blue).reduce((sum, value) => sum + value, 0)
      };
      return true;
    }

    function mergeTeamCounts(counts) {
      return gameRules.mergeTeamCounts(counts);
    }

    function getFinalPieceCountForTeam(teamCounts) {
      return gameRules.getFinalPieceCountForTeam(teamCounts);
    }

    function buildStageCountsFromSoldierTotal(totalSoldiers) {
      return gameRules.buildStageCountsFromSoldierTotal(totalSoldiers);
    }

    function moveSoldierCountBetweenRegions(sourceCode, targetCode, team, amount) {
      if (!sourceCode || !targetCode || !team || !Number.isInteger(amount) || amount <= 0) return false;
      ensureRegionPieces(sourceCode);
      ensureRegionPieces(targetCode);
      const sourceTotal = getTeamSoldierCount(sourceCode, team);
      const targetTotal = getTeamSoldierCount(targetCode, team);
      const nextSourceTotal = Math.max(0, sourceTotal - amount);
      const nextTargetTotal = targetTotal + amount;
      regionPiecesByRegion[sourceCode][team] = buildStageCountsFromSoldierTotal(nextSourceTotal);
      regionPiecesByRegion[targetCode][team] = buildStageCountsFromSoldierTotal(nextTargetTotal);
      regionStats[sourceCode] = {
        orange: Object.values(regionPiecesByRegion[sourceCode].orange).reduce((sum, value) => sum + value, 0),
        blue: Object.values(regionPiecesByRegion[sourceCode].blue).reduce((sum, value) => sum + value, 0)
      };
      regionStats[targetCode] = {
        orange: Object.values(regionPiecesByRegion[targetCode].orange).reduce((sum, value) => sum + value, 0),
        blue: Object.values(regionPiecesByRegion[targetCode].blue).reduce((sum, value) => sum + value, 0)
      };
      return true;
    }

    function mergeRegionTeam(regionCode, team, previousCounts = null) {
      const regionPieces = regionPiecesByRegion[regionCode] || { orange: { g: 0, f: 0, e: 0, d: 0, c: 0, b: 0, a: 0 }, blue: { g: 0, f: 0, e: 0, d: 0, c: 0, b: 0, a: 0 } };
      const countsBeforeMerge = { ...regionPieces[team] };
      mergeTeamCounts(regionPieces[team]);
      const stageBaseline = previousCounts || countsBeforeMerge;
      Object.keys(soldierWeights).forEach((stage) => {
        const createdByMerge = !previousCounts &&
          Number(regionPieces[team][stage] || 0) > Number(countsBeforeMerge[stage] || 0);
        const createdByTransfer = previousCounts &&
          Number(regionPieces[team][stage] || 0) > Number(stageBaseline[stage] || 0);
        if ((createdByMerge || createdByTransfer) &&
            !wasPieceCreatedThisTurn(regionCode, team, stage)) {
          turnCreatedPieces.push({ team, source: regionCode, stage });
        }
      });
      regionPiecesByRegion[regionCode] = regionPieces;
      regionStats[regionCode] = {
        orange: Object.values(regionPieces.orange).reduce((sum, value) => sum + value, 0),
        blue: Object.values(regionPieces.blue).reduce((sum, value) => sum + value, 0)
      };
    }

    function recyclePiece(regionCode, team, pieceStage) {
      if ((!isApplyingBluetoothAction && !isLocalPlayersTurn()) || team !== currentTeam ||
          !Object.prototype.hasOwnProperty.call(soldierWeights, pieceStage)) return false;
      if (!isCampaignLevelTwo() && wasPieceCreatedThisTurn(regionCode, team, pieceStage)) {
        readout.textContent = `${regionCode}: uma peça ${pieceStage.toUpperCase()} recém-promovida não pode ser reciclada neste turno.`;
        return false;
      }
      const teamPieces = regionPiecesByRegion[regionCode]?.[team];
      if (!teamPieces || Number(teamPieces[pieceStage]) < 1) return false;
      if (getTeamPieceCount(regionCode, team) < 2) {
        readout.textContent = `${regionCode}: é necessário manter pelo menos 1 outra peça nessa região.`;
        return false;
      }

      const refund = getRecycleRefund(regionCode, pieceStage);
      teamPieces[pieceStage] -= 1;
      turnRecycledPieces.push({ team, source: regionCode, stage: pieceStage });
      mergeRegionTeam(regionCode, team);
      pontosDoTurn[team] += refund;
      recalculatePieceCounts();
      recalculateRegionForces();
      refreshRegionVisuals();
      updateTurnPointsDisplay();
      renderPiecePurchaseButtons();
      updateSelectedRegionPanel(selectedRegionCode);
      updateTurnState();
      showActionFeedback(regionCode, refund, 'recycle', '+');
      updateReadout();
      readout.textContent = refund > 0
        ? `${regionCode}: peça ${pieceStage.toUpperCase()} descartada. +${refund} moedas.`
        : `${regionCode}: peça ${pieceStage.toUpperCase()} descartada. Sem moedas de retorno.`;
      publishBluetoothAction({
        type: 'recycle',
        team,
        source: regionCode,
        stage: pieceStage
      });
      return true;
    }

    function updateTurnState() {
      renderPiecePurchaseButtons();
      passTurnButton.disabled = !isLocalPlayersTurn() || isWarRunning || isGameOver || isAiTurnRunning;
      updateTurnPointsDisplay();
      maybeAdvanceLevel2Guide();
    }

    function getRegionProbeBoxesForLayer(layerNumber, regionNumber) {
      const regionCode = `L${layerNumber}-${regionNumber}`;
      const cached = regionProbeBoxes[regionCode];
      if (cached) return cached;

      const tiles = allRegionMasks?.[layerNumber]?.[String(regionNumber)] || [];
      if (!tiles.length) {
        regionProbeBoxes[regionCode] = [];
        return [];
      }

      const points = tiles.map((key) => {
        const [column, row] = key.split(',').map(Number);
        return { x: column * 4 + 2, y: row * 4 + 2 };
      });
      const averageX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
      const averageY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
      const minX = Math.min(...points.map((point) => point.x));
      const minY = Math.min(...points.map((point) => point.y));
      const maxX = Math.max(...points.map((point) => point.x));
      const maxY = Math.max(...points.map((point) => point.y));
      const spreadX = Math.max(20, (maxX - minX) * 0.22);
      const spreadY = Math.max(20, (maxY - minY) * 0.22);
      const count = Math.max(1, probeBoxCountsByLayer[layerNumber] || 1);
      const boxes = [];
      const boxSize = probeBoxSize;

      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
        const x = averageX + Math.cos(angle) * spreadX;
        const y = averageY + Math.sin(angle) * spreadY;
        boxes.push({
          x: x - boxSize / 2,
          y: y - boxSize / 2,
          width: boxSize,
          height: boxSize
        });
      }

      regionProbeBoxes[regionCode] = boxes;
      return boxes;
    }

    function rotateRect(rect, layerNumber, centerX = 454, centerY = 454) {
      const rotation = ((rotations[(layerNumber - 1)] || 0) * Math.PI) / 180;
      const sin = Math.sin(rotation);
      const cos = Math.cos(rotation);
      const dx1 = rect.x - centerX;
      const dy1 = rect.y - centerY;
      const dx2 = rect.x + rect.width - centerX;
      const dy2 = rect.y + rect.height - centerY;

      const corners = [
        { x: dx1, y: dy1 },
        { x: dx2, y: dy1 },
        { x: dx1, y: dy2 },
        { x: dx2, y: dy2 }
      ].map(({ x, y }) => ({
        x: centerX + (x * cos - y * sin),
        y: centerY + (x * sin + y * cos)
      }));

      const xs = corners.map((point) => point.x);
      const ys = corners.map((point) => point.y);
      return {
        x: Math.min(...xs),
        y: Math.min(...ys),
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys)
      };
    }

    function rectsIntersect(a, b) {
      return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    }

    function splitCircularAngleRange(startAngle, endAngle) {
      const span = endAngle - startAngle;
      if (span >= 360) return [[0, 360]];
      const normalizedStart = ((startAngle % 360) + 360) % 360;
      const normalizedEnd = normalizedStart + span;
      if (normalizedEnd <= 360) return [[normalizedStart, normalizedEnd]];
      return [[normalizedStart, 360], [0, normalizedEnd - 360]];
    }

    function getCircularAngleGap(firstStart, firstEnd, secondStart, secondEnd) {
      const firstRanges = splitCircularAngleRange(firstStart, firstEnd);
      const secondRanges = splitCircularAngleRange(secondStart, secondEnd);
      let minimumGap = 360;
      firstRanges.forEach(([firstLow, firstHigh]) => {
        secondRanges.forEach(([secondLow, secondHigh]) => {
          [-360, 0, 360].forEach((offset) => {
            const shiftedLow = secondLow + offset;
            const shiftedHigh = secondHigh + offset;
            const gap = Math.max(0, shiftedLow - firstHigh, firstLow - shiftedHigh);
            minimumGap = Math.min(minimumGap, gap);
          });
        });
      });
      return minimumGap * Math.PI / 180;
    }

    function clampNumber(value, minimum, maximum) {
      return Math.max(minimum, Math.min(maximum, value));
    }

    function getCircularRegionDistance(first, second) {
      const firstGeometry = regionGeometryByCode[first];
      const secondGeometry = regionGeometryByCode[second];
      if (!firstGeometry || !secondGeometry) return null;
      if (firstGeometry.block !== secondGeometry.block ||
          Math.abs(firstGeometry.centerX - secondGeometry.centerX) > 0.001 ||
          Math.abs(firstGeometry.centerY - secondGeometry.centerY) > 0.001) return null;

      const firstRotation = -(rotations[firstGeometry.layer - 1] || 0);
      const secondRotation = -(rotations[secondGeometry.layer - 1] || 0);
      const angleGap = getCircularAngleGap(
        firstGeometry.startAngle + firstRotation,
        firstGeometry.endAngle + firstRotation,
        secondGeometry.startAngle + secondRotation,
        secondGeometry.endAngle + secondRotation
      );
      const firstRadii = [firstGeometry.innerRadius, firstGeometry.outerRadius];
      const secondRadii = [secondGeometry.innerRadius, secondGeometry.outerRadius];
      const cosine = Math.cos(angleGap);
      let minimumSquaredDistance = Number.POSITIVE_INFINITY;
      const testRadii = (firstRadius, secondRadius) => {
        const squaredDistance = Math.max(0,
          firstRadius * firstRadius + secondRadius * secondRadius -
          2 * firstRadius * secondRadius * cosine);
        minimumSquaredDistance = Math.min(minimumSquaredDistance, squaredDistance);
      };

      firstRadii.forEach((firstRadius) => {
        secondRadii.forEach((secondRadius) => testRadii(firstRadius, secondRadius));
        testRadii(
          firstRadius,
          clampNumber(firstRadius * cosine, secondRadii[0], secondRadii[1])
        );
      });
      secondRadii.forEach((secondRadius) => {
        testRadii(
          clampNumber(secondRadius * cosine, firstRadii[0], firstRadii[1]),
          secondRadius
        );
      });
      return Math.sqrt(minimumSquaredDistance);
    }

    function isPointInCircularRegion(geometry, x, y) {
      const dx = x - geometry.centerX;
      const dy = geometry.centerY - y;
      const radius = Math.hypot(dx, dy);
      if (radius < geometry.innerRadius - 3 || radius > geometry.outerRadius + 3) return false;
      const span = geometry.endAngle - geometry.startAngle;
      if (span >= 360) return true;
      const rotation = getRegionVisualRotation(`L${geometry.layer}-${geometry.region}`) || 0;
      const startAngle = ((geometry.startAngle - rotation) % 360 + 360) % 360;
      const angle = ((Math.atan2(dy, dx) * 180 / Math.PI) % 360 + 360) % 360;
      const relativeAngle = (angle - startAngle + 360) % 360;
      return relativeAngle < span - 0.01;
    }

    function areCircularAndQuadrilateralRegionsNeighbors(circular, quadrilateral) {
      if (circular?.shape !== 'circular' || quadrilateral?.shape !== 'quadrilateral') return null;
      const pointInCell = (x, y, cell, tolerance = 2) =>
        x >= cell.x - cell.width / 2 - tolerance &&
        x <= cell.x + cell.width / 2 + tolerance &&
        y >= cell.y - cell.height / 2 - tolerance &&
        y <= cell.y + cell.height / 2 + tolerance;

      for (const cell of quadrilateral.cells) {
        const left = cell.x - cell.width / 2;
        const right = cell.x + cell.width / 2;
        const top = cell.y - cell.height / 2;
        const bottom = cell.y + cell.height / 2;
        for (let y = top; y <= bottom; y += 4) {
          for (let x = left; x <= right; x += 4) {
            if (isPointInCircularRegion(circular, x, y)) return true;
          }
          if (isPointInCircularRegion(circular, left, y) ||
              isPointInCircularRegion(circular, right, y)) return true;
        }
        for (let x = left; x <= right; x += 4) {
          if (isPointInCircularRegion(circular, x, top) ||
              isPointInCircularRegion(circular, x, bottom)) return true;
        }

        const span = circular.endAngle - circular.startAngle;
        const rotation = getRegionVisualRotation(`L${circular.layer}-${circular.region}`) || 0;
        const startAngle = circular.startAngle - rotation;
        const radialStep = 4;
        const angleStep = 2;
        const radialCount = Math.max(1, Math.ceil((circular.outerRadius - circular.innerRadius) / radialStep));
        const angleCount = Math.max(1, Math.ceil(span / angleStep));
        for (let radialIndex = 0; radialIndex <= radialCount; radialIndex += 1) {
          const radius = circular.innerRadius +
            (circular.outerRadius - circular.innerRadius) * radialIndex / radialCount;
          for (let angleIndex = 0; angleIndex <= angleCount; angleIndex += 1) {
            const angle = (startAngle + span * angleIndex / angleCount) * Math.PI / 180;
            const x = circular.centerX + radius * Math.cos(angle);
            const y = circular.centerY - radius * Math.sin(angle);
            if (pointInCell(x, y, cell)) return true;
          }
        }
      }
      return false;
    }

    function areQuadrilateralRegionsNeighbors(first, second) {
      const firstGeometry = regionGeometryByCode[first];
      const secondGeometry = regionGeometryByCode[second];
      if (firstGeometry?.shape !== 'quadrilateral' ||
          secondGeometry?.shape !== 'quadrilateral' ||
          firstGeometry.block !== secondGeometry.block) return null;
      return firstGeometry.cells.some((firstCell) =>
        secondGeometry.cells.some((secondCell) =>
          Math.abs(firstCell.row - secondCell.row) +
          Math.abs(firstCell.column - secondCell.column) === 1));
    }

    function areRegionsNeighbors(first, second) {
      const quadrilateralResult = areQuadrilateralRegionsNeighbors(first, second);
      if (quadrilateralResult !== null) return quadrilateralResult;
      const firstGeometry = regionGeometryByCode[first];
      const secondGeometry = regionGeometryByCode[second];
      const mixedBlockNeighbor = areCircularAndQuadrilateralRegionsNeighbors(firstGeometry, secondGeometry) ??
        areCircularAndQuadrilateralRegionsNeighbors(secondGeometry, firstGeometry);
      if (mixedBlockNeighbor !== null) return mixedBlockNeighbor;
      const distance = getCircularRegionDistance(first, second);
      if (distance !== null) return distance < 5;

      const firstLayer = getRegionLayer(first);
      const secondLayer = getRegionLayer(second);
      const firstRegion = Number(first.split('-')[1]);
      const secondRegion = Number(second.split('-')[1]);
      const firstBoxes = (regionProbeBoxes[first] || getRegionProbeBoxesForLayer(firstLayer, firstRegion))
        .map((box) => rotateRect(box, firstLayer));
      const secondBoxes = (regionProbeBoxes[second] || getRegionProbeBoxesForLayer(secondLayer, secondRegion))
        .map((box) => rotateRect(box, secondLayer));
      return firstBoxes.some((boxA) =>
        secondBoxes.some((boxB) => rectsIntersect(boxA, boxB)));
    }

    function getRegionNeighborSummary(regionCode) {
      if (!regionCode || !regionNeighborCache[regionCode]) {
        return { superior: [], inferior: [], sameRank: [] };
      }
      return regionNeighborCache[regionCode];
    }

    function recomputeNeighborCacheForLayer(layerNumber) {
      const layersToRecompute = [layerNumber];
      if (layerNumber > 1) layersToRecompute.push(layerNumber - 1);
      if (layerNumber < 8) layersToRecompute.push(layerNumber + 1);
      const uniqueLayers = [...new Set(layersToRecompute.filter((layer) => allRegionMasks && allRegionMasks[layer]))];

      uniqueLayers.forEach((layer) => {
        const regionEntries = Object.keys(allRegionMasks[layer] || {});
        regionEntries.forEach((regionKey) => {
          const regionCode = `L${layer}-${regionKey}`;
          const superior = [];
          const inferior = [];
          const sameRank = [];

          Object.keys(allRegionMasks[layer] || {}).forEach((neighborRegionKey) => {
            const candidate = `L${layer}-${neighborRegionKey}`;
            if (candidate !== regionCode && areRegionsNeighbors(regionCode, candidate)) {
              sameRank.push(candidate);
            }
          });

          if (layer > 1) {
            Object.keys(allRegionMasks[layer - 1] || {}).forEach((superiorRegionKey) => {
              const candidate = `L${layer - 1}-${superiorRegionKey}`;
              if (areRegionsNeighbors(regionCode, candidate)) superior.push(candidate);
            });
          }

          if (layer < 8) {
            Object.keys(allRegionMasks[layer + 1] || {}).forEach((inferiorRegionKey) => {
              const candidate = `L${layer + 1}-${inferiorRegionKey}`;
              if (areRegionsNeighbors(regionCode, candidate)) inferior.push(candidate);
            });
          }

          regionNeighborCache[regionCode] = {
            superior: [...new Set(superior)].sort((a, b) => {
              const [aLayer, aRegion] = a.split('-').map((value) => Number(value.replace(/^L/, '')));
              const [bLayer, bRegion] = b.split('-').map((value) => Number(value.replace(/^L/, '')));
              return aLayer === bLayer ? aRegion - bRegion : aLayer - bLayer;
            }),
            inferior: [...new Set(inferior)].sort((a, b) => {
              const [aLayer, aRegion] = a.split('-').map((value) => Number(value.replace(/^L/, '')));
              const [bLayer, bRegion] = b.split('-').map((value) => Number(value.replace(/^L/, '')));
              return aLayer === bLayer ? aRegion - bRegion : aLayer - bLayer;
            }),
            sameRank: [...new Set(sameRank)].sort()
          };
        });
      });
    }

    function getPromotionBudgetForRegion(regionCode, team) {
      if (!regionCode || !team) return 0;
      const sourceLayer = getRegionLayer(regionCode);
      if (sourceLayer <= 1) return 0;
      const currentLayerRegions = Object.keys(allRegionMasks?.[sourceLayer] || {}).filter((regionKey) => {
        const code = `L${sourceLayer}-${regionKey}`;
        return getRegionDominador(code) === team;
      });
      const n = currentLayerRegions.reduce((total, regionKey) => {
        return total + getTeamSoldierCount(`L${sourceLayer}-${regionKey}`, team);
      }, 0);

      const superiorLayerRegions = Object.keys(allRegionMasks?.[sourceLayer - 1] || {}).filter((regionKey) => {
        const code = `L${sourceLayer - 1}-${regionKey}`;
        return getRegionDominador(code) === team;
      });
      const t = superiorLayerRegions.reduce((total, regionKey) => {
        return total + getTeamSoldierCount(`L${sourceLayer - 1}-${regionKey}`, team);
      }, 0);

      const sourceSoldiers = getTeamSoldierCount(regionCode, team);
      if (sourceSoldiers < 2) return 0;
      const promotionGroupSize = sourceLayer + 1;
      const layerBudget = Math.max(0, Math.floor((n - (sourceLayer * t)) / promotionGroupSize));
      const localBudget = Math.max(0, sourceSoldiers - 1);
      return Math.min(layerBudget, localBudget);
    }

    function getPromotionTargetsForRegion(regionCode, team) {
      if (!regionCode || !team) return [];
      const sourceLayer = getRegionLayer(regionCode);
      if (sourceLayer <= 1) return [];
      ensureRegionPieces(regionCode);
      const sourceSoldiers = getTeamSoldierCount(regionCode, team);
      if (sourceSoldiers < 2) return [];
      const maxPromotions = getPromotionBudgetForRegion(regionCode, team);
      if (maxPromotions <= 0) return [];
      const dominator = getRegionDominador(regionCode);
      if (dominator !== 'free' && dominator !== team) return [];

      const targets = [];
      const superiorRegions = getRegionNeighborSummary(regionCode).superior || [];
      superiorRegions.forEach((targetCode) => {
        if (getRegionLayer(targetCode) !== sourceLayer - 1) return;
        const targetDominator = getRegionDominador(targetCode);
        if (targetDominator !== 'free' && targetDominator !== team) return;
        ensureRegionPieces(targetCode);
        const targetCounts = regionPiecesByRegion[targetCode][team] || { g:0, f:0, e:0, d:0, c:0, b:0, a:0 };
        const targetTotal = getFinalPieceCountForTeam(targetCounts);
        const targetLimit = getRegionPieceLimit(targetCode);
        if (targetTotal >= targetLimit) return;
        let availablePromotions = 0;
        for (let amount = 1; amount <= maxPromotions; amount += 1) {
          const projectedTarget = { ...targetCounts, g: Number(targetCounts.g || 0) + amount };
          if (getFinalPieceCountForTeam(projectedTarget) <= targetLimit) {
            availablePromotions = amount;
          }
        }
        if (availablePromotions > 0) {
          targets.push({ code: targetCode, availablePromotions, targetLimit, targetTotal });
        }
      });
      return targets.sort((left, right) => left.code.localeCompare(right.code));
    }

    function getRelegationTargetsForPiece(regionCode, team, stage) {
      if (!regionCode || !team || !Object.prototype.hasOwnProperty.call(soldierWeights, stage) ||
          !isRegionAvailableForTeam(regionCode, team) || getTeamPieceCount(regionCode, team) < 2 ||
          Number(regionPiecesByRegion[regionCode]?.[team]?.[stage] || 0) < 1) return [];
      const sourceLayer = getRegionLayer(regionCode);
      if (sourceLayer >= 8) return [];

      return (getRegionNeighborSummary(regionCode).inferior || [])
        .filter((targetCode) => getRegionLayer(targetCode) === sourceLayer + 1)
        .filter((targetCode) => isRegionAvailableForTeam(targetCode, team))
        .filter((targetCode) => {
          ensureRegionPieces(targetCode);
          const targetCounts = regionPiecesByRegion[targetCode][team];
          if (getFinalPieceCountForTeam(targetCounts) >= getRegionPieceLimit(targetCode)) return false;
          const projectedCounts = { ...targetCounts, [stage]: Number(targetCounts[stage] || 0) + 1 };
          return getFinalPieceCountForTeam(projectedCounts) <= getRegionPieceLimit(targetCode);
        })
        .map((code) => ({
          code,
          refund: getRelegationRefund(regionCode, code, stage)
        }))
        .sort((left, right) => left.code.localeCompare(right.code));
    }

    function getRelegationOptionsForRegion(regionCode, team) {
      if (!regionCode || getTeamPieceCount(regionCode, team) < 2) return [];
      return Object.keys(soldierWeights)
        .filter((stage) => Number(regionPiecesByRegion[regionCode]?.[team]?.[stage] || 0) > 0)
        .map((stage) => ({
          stage,
          targets: getRelegationTargetsForPiece(regionCode, team, stage)
        }))
        .filter((option) => option.targets.length > 0);
    }

    function refreshPromotionControls(regionCode = selectedRegionCode) {
      const promotionTargets = regionCode ? getPromotionTargetsForRegion(regionCode, currentTeam) : [];
      regionPromotionControls.classList.toggle('is-hidden', !promotionTargets.length);
      const relegationOptions = regionCode ? getRelegationOptionsForRegion(regionCode, currentTeam) : [];
      regionRelegationControls.classList.toggle('is-hidden', !relegationOptions.length);
    }

    function closeModal(modal) {
      modal.classList.add('is-hidden');
    }

    function getMoveAmountOptions(target) {
      const geometry = regionGeometryByCode[selectedRegionCode];
      const usesDirectRegionTargets = currentBoardData?.boardType === 'mixed' ||
        geometry?.shape === 'quadrilateral';
      const neighbor = usesDirectRegionTargets
        ? target
        : getNeighborRegionCode(selectedRegionCode, target);
      if (!neighbor || !isRegionAvailableForTeam(neighbor, currentTeam)) return [];
      if (usesDirectRegionTargets &&
          !(regionNeighborCache[selectedRegionCode]?.sameRank || []).includes(neighbor)) return [];
      const maxAmount = getMaxMovableSoldiers(currentTeam, selectedRegionCode, neighbor);
      return Object.entries(soldierWeights)
        .filter(([, amount]) =>
          amount <= maxAmount && canAfford(getMoveCost(selectedRegionCode, amount)))
        .sort((left, right) => left[1] - right[1]);
    }

    function openMoveModal() {
      if (currentBoardData?.boardType === 'mixed' ||
          regionGeometryByCode[selectedRegionCode]?.shape === 'quadrilateral') {
        moveDirectionOptions.replaceChildren();
        (regionNeighborCache[selectedRegionCode]?.sameRank || [])
          .filter((code) => getRegionLayer(code) === getRegionLayer(selectedRegionCode))
          .forEach((code) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = code;
            button.addEventListener('click', () => renderMoveAmountOptions(code));
            moveDirectionOptions.appendChild(button);
          });
        moveModal.querySelector('#move-modal-instructions').textContent = 'Escolha a região quadricular vizinha.';
      } else {
        moveDirectionOptions.innerHTML = '<button type="button" data-direction="left">Esquerda</button><button type="button" data-direction="right">Direita</button>';
        moveDirectionOptions.querySelectorAll('[data-direction]').forEach((button) => {
          button.addEventListener('click', () => renderMoveAmountOptions(button.dataset.direction));
        });
        moveModal.querySelector('#move-modal-instructions').textContent = 'Escolha uma direção.';
      }
      moveDirectionOptions.classList.remove('is-hidden');
      moveAmountOptions.classList.add('is-hidden');
      moveAmountOptions.innerHTML = '';
      moveModal.classList.remove('is-hidden');
    }

    function renderMoveAmountOptions(target) {
      const options = getMoveAmountOptions(target);
      const targetCode = currentBoardData?.boardType === 'mixed' ||
        regionGeometryByCode[selectedRegionCode]?.shape === 'quadrilateral'
        ? target
        : getNeighborRegionCode(selectedRegionCode, target);
      moveDirectionOptions.classList.add('is-hidden');
      moveAmountOptions.classList.remove('is-hidden');
      moveAmountOptions.innerHTML = '';
      options.forEach(([stage, amount]) => {
        const button = document.createElement('button');
        button.type = 'button';
        const cost = getMoveCost(selectedRegionCode, amount);
        button.innerHTML = `<img src="${currentTeam === 'orange' ? 'peca_laranja' : 'peca_azul'}_${stage}.png" alt=""> ${stage.toUpperCase()} · ${amount} · ${cost} moedas`;
        button.addEventListener('click', () => {
          closeModal(moveModal);
          performMoveTo(targetCode, amount);
        });
        moveAmountOptions.appendChild(button);
      });
      if (!options.length) {
        moveAmountOptions.innerHTML = '<p>Moedas ou unidades insuficientes para mover.</p>';
      }
    }

    function openPromotionModal() {
      const targets = getPromotionTargetsForRegion(selectedRegionCode, currentTeam);
      promotionTargetOptions.innerHTML = '';
      promotionAmountOptions.innerHTML = '';
      promotionAmountOptions.classList.add('is-hidden');
      targets.forEach((target) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = target.code;
        button.addEventListener('click', () => renderPromotionAmountOptions(target));
        promotionTargetOptions.appendChild(button);
      });
      promotionModal.classList.remove('is-hidden');
    }

    function renderPromotionAmountOptions(target) {
      promotionTargetOptions.classList.add('is-hidden');
      promotionAmountOptions.classList.remove('is-hidden');
      promotionAmountOptions.innerHTML = '';
      const costPerUnit = promotionCostBySourceLayer[getRegionLayer(selectedRegionCode)] || 0;
      const maxByPoints = costPerUnit ? Math.floor(pontosDoTurn[currentTeam] / costPerUnit) : 0;
      Object.entries(soldierWeights)
        .filter(([, amount]) => amount <= target.availablePromotions && amount <= maxByPoints)
        .sort((left, right) => left[1] - right[1])
        .forEach(([stage, amount]) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.innerHTML = `<img src="${currentTeam === 'orange' ? 'peca_laranja' : 'peca_azul'}_${stage}.png" alt=""> ${stage.toUpperCase()} · ${amount}`;
          button.addEventListener('click', () => {
            closeModal(promotionModal);
            performPromotion(target.code, amount);
          });
          promotionAmountOptions.appendChild(button);
        });
      if (!promotionAmountOptions.children.length) {
        promotionAmountOptions.innerHTML = '<p>Moedas insuficientes para promover.</p>';
      }
    }

    function openRelegationModal() {
      const options = getRelegationOptionsForRegion(selectedRegionCode, currentTeam);
      relegationStageOptions.innerHTML = '';
      relegationTargetOptions.innerHTML = '';
      relegationTargetOptions.classList.add('is-hidden');
      relegationStageOptions.classList.remove('is-hidden');
      relegationModalInstructions.textContent =
        'Escolha uma peça para enviar a uma região vizinha inferior livre ou dominada por você. É necessário manter outra peça na origem.';
      options.forEach(({ stage }) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = `<img src="${currentTeam === 'orange' ? 'peca_laranja' : 'peca_azul'}_${stage}.png" alt=""> ${stage.toUpperCase()} · ${regionPiecesByRegion[selectedRegionCode][currentTeam][stage]}`;
        button.addEventListener('click', () => renderRelegationTargets(stage));
        relegationStageOptions.appendChild(button);
      });
      relegationModal.classList.remove('is-hidden');
    }

    function renderRelegationTargets(stage) {
      const targets = getRelegationTargetsForPiece(selectedRegionCode, currentTeam, stage);
      relegationStageOptions.classList.add('is-hidden');
      relegationTargetOptions.classList.remove('is-hidden');
      relegationTargetOptions.innerHTML = '';
      relegationModalInstructions.textContent = `Escolha a região inferior para a peça ${stage.toUpperCase()}. Restituição: metade do valor na origem menos o custo da peça no destino (mínimo 0).`;
      targets.forEach((target) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `${target.code} · +${target.refund.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`;
        button.addEventListener('click', () => {
          closeModal(relegationModal);
          performRelegation(target.code, stage);
        });
        relegationTargetOptions.appendChild(button);
      });
      if (!targets.length) {
        relegationTargetOptions.innerHTML = '<p>Nenhuma região inferior disponível para essa peça.</p>';
      }
    }

    function updateSelectedRegionPanel(regionCode = selectedRegionCode) {
      updateBoardFocusOverlay();
      regionPanel.classList.remove('is-hidden');
      const code = regionCode || '-';
      const counts = regionCode ? (regionStats[regionCode] || { orange: 0, blue: 0 }) : { orange: 0, blue: 0 };
      const safeCounts = {
        orange: Number(counts.orange || 0),
        blue: Number(counts.blue || 0)
      };
      const soldierTotal = regionCode ? getRegionSoldierTotal(regionCode) : 0;
      const forceState = regionCode ? (regionForceStats[regionCode] || { forca: 0, unidades_livres_temp: soldierTotal }) : { forca: 0, unidades_livres_temp: 0 };
      const dominator = getRegionDominador(regionCode);
      const selectedLayer = getRegionLayer(regionCode);
      const farmProduction = Math.max(0, Number(regionGeometryByCode[regionCode]?.farmProductionPerTurn) || 0);
      const layerFinalForces = { orange: 0, blue: 0 };
      if (selectedLayer) {
        Object.keys(allRegionMasks?.[selectedLayer] || {}).forEach((region) => {
          const layerRegionCode = `L${selectedLayer}-${region}`;
          const teamForces = regionForceStats[layerRegionCode]?.byTeam;
          layerFinalForces.orange += Number(teamForces?.orange?.forca_final || 0);
          layerFinalForces.blue += Number(teamForces?.blue?.forca_final || 0);
        });
      }
      const currentTeamSoldiers = regionCode ? getTeamSoldierCount(regionCode, currentTeam) : 0;
      const maxMove = regionCode ? Math.max(0, currentTeamSoldiers - 1) : 0;
      const canMoveTroops = currentTeamSoldiers > 1;
      const neighborSummary = getRegionNeighborSummary(regionCode);
      const superiorText = neighborSummary.superior.length ? neighborSummary.superior.join(', ') : 'nenhuma';
      const inferiorText = neighborSummary.inferior.length ? neighborSummary.inferior.join(', ') : 'nenhuma';
      const sameRankText = neighborSummary.sameRank.length ? neighborSummary.sameRank.join(', ') : 'nenhuma';
      regionName.textContent = code;
      const rotationAvailable = isRegionInRotatableBlock(regionCode);
      regionRotationIndicator.classList.toggle('is-hidden', !rotationAvailable);
      regionRotationIndicator.setAttribute('aria-hidden', String(!rotationAvailable));
      regionLayerOrangeForce.textContent = formatStatisticsNumber(layerFinalForces.orange);
      regionLayerBlueForce.textContent = formatStatisticsNumber(layerFinalForces.blue);
      regionPieceCounts.textContent = `Peças: ${safeCounts.orange + safeCounts.blue}`;
      regionSoldierCounts.textContent = `Soldados: ${soldierTotal}`;
      regionFarm.classList.toggle('is-hidden', farmProduction <= 0);
      regionFarm.textContent = farmProduction > 0
        ? `Fazenda: ${formatStatisticsNumber(farmProduction)} trigo/turno · ${dominator === 'orange' ? 'laranja' : dominator === 'blue' ? 'azul' : 'sem dono'}`
        : '';
      regionForce.textContent = `Força: ${Number(forceState.forca || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`;
      regionFinalForce.textContent = `Força final: ${Number(forceState.forca_final || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`;
      regionFreeUnits.textContent = `unidades_livres_temp: ${Number(forceState.unidades_livres_temp || 0).toLocaleString('pt-BR', { maximumFractionDigits: 6 })}`;
      updateTurnPointsDisplay();
      regionDominator.textContent = `Dominador: ${dominator === 'blue' ? 'azul' : dominator === 'orange' ? 'laranja' : 'livre'}`;
      regionNeighbors.textContent = `Vizinhos: superiores (${superiorText}) · mesmo rank (${sameRankText}) · inferiores (${inferiorText})`;
      regionMoveControls.classList.toggle('is-hidden', !canMoveTroops);
      refreshPromotionControls(regionCode);
      updateTurnState();
      updateRegionActionPositions();
    }

    function updateRegionActionPositions() {
      if (!window.matchMedia('(orientation:landscape) and (max-height:600px) and (max-width:1000px)').matches || regionPanel.classList.contains('is-hidden')) return;
      window.requestAnimationFrame(() => {
        const regionPanelBottom = regionPanel.getBoundingClientRect().bottom;
        const actionTop = Math.min(regionPanelBottom + 8, window.innerHeight - 94);
        app.style.setProperty('--region-actions-rotate-top', `${actionTop}px`);
        app.style.setProperty('--region-actions-pass-top', `${actionTop + 50}px`);
      });
    }
    window.addEventListener('resize', () => {
      updateRegionActionPositions();
      if (Object.keys(regionGeometryByCode).length) renderBoardLayers();
    });
    window.addEventListener('orientationchange', updateRegionActionPositions);

    function updateReadout() {
      const total = pieceCounts.blue + pieceCounts.orange;
      const orangeCode = pieceTargets?.orange?.code || 'L8-2';
      const blueCode = pieceTargets?.blue?.code || 'L8-6';
      const visibleRotation = ((rotations[7] % 360) + 360) % 360;
      readout.textContent = `Cima: ${orangeCode} ${Number(visibleRotation.toFixed(2))}° · Baixo: ${blueCode} ${Number(visibleRotation.toFixed(2))}° · Peças ${total}/16`;
    }

    function playRotationSound() {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(70, now);
      oscillator.frequency.exponentialRampToValueAtTime(38, now + 0.65);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.95);
      oscillator.addEventListener('ended', () => audioContext.close());
    }

    let actionAudioContext = null;

    function playActionSound(actionType) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Este navegador não oferece suporte ao áudio das ações.');
        return;
      }
      try {
        if (!actionAudioContext) actionAudioContext = new AudioContextClass();
        const playTone = () => {
          const sound = {
            buy: { frequency: 520, endFrequency: 740, duration: 0.16, wave: 'triangle' },
            move: { frequency: 360, endFrequency: 270, duration: 0.13, wave: 'sine' },
            promote: { frequency: 480, endFrequency: 820, duration: 0.22, wave: 'sine' },
            relegate: { frequency: 520, endFrequency: 340, duration: 0.2, wave: 'sine' },
            recycle: { frequency: 620, endFrequency: 440, duration: 0.18, wave: 'triangle' }
          }[actionType];
          if (!sound) return;
          const now = actionAudioContext.currentTime;
          const oscillator = actionAudioContext.createOscillator();
          const gain = actionAudioContext.createGain();
          oscillator.type = sound.wave;
          oscillator.frequency.setValueAtTime(sound.frequency, now);
          oscillator.frequency.exponentialRampToValueAtTime(sound.endFrequency, now + sound.duration);
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(0.045, now + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + sound.duration + 0.05);
          oscillator.connect(gain);
          gain.connect(actionAudioContext.destination);
          oscillator.start(now);
          oscillator.stop(now + sound.duration + 0.06);
        };
        if (actionAudioContext.state === 'suspended') {
          actionAudioContext.resume().then(playTone).catch((error) => console.warn('Não foi possível reproduzir o som da ação.', error));
        } else {
          playTone();
        }
      } catch (error) {
        console.warn('Não foi possível reproduzir o som da ação.', error);
      }
    }

    function showActionFeedback(regionCode, cost, actionType, sign = '-') {
      playActionSound(actionType);
      const point = getRegionFocusPoint(regionCode);
      if (!point) return;
      const tag = document.createElement('span');
      tag.className = 'action-cost-tag';
      tag.textContent = `${sign}${Number(cost).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`;
      tag.setAttribute('aria-hidden', 'true');
      tag.style.left = `${point.x}%`;
      tag.style.top = `${point.y}%`;
      stage.appendChild(tag);
      window.setTimeout(() => tag.remove(), 1800);
    }

    function updateActiveRegions() {
      const normalizedRotation = ((rotations[7] % 360) + 360) % 360;
      const regionStep = Math.floor((normalizedRotation + 42) / 45) % 8;
      const blueRegion = blackRegionOrder[regionStep];
      const orangeRegion = redRegionOrder[regionStep];
      pieceTargets.blue.region = blueRegion;
      pieceTargets.blue.code = `L8-${blueRegion}`;
      pieceTargets.blue.label = `região L8-${blueRegion}`;
      pieceTargets.blue.slots = getRegionSlots(`L8-${blueRegion}`) || [];
      pieceTargets.orange.region = orangeRegion;
      pieceTargets.orange.code = `L8-${orangeRegion}`;
      pieceTargets.orange.label = `região L8-${orangeRegion}`;
      pieceTargets.orange.slots = getRegionSlots(`L8-${orangeRegion}`) || [];
    }

    function syncLayerTransforms() {
      document.querySelectorAll('.layer').forEach((layer, index) => {
        layer.style.transform = `rotate(${rotations[index] || 0}deg)`;
      });
    }

    function updateL8AttachedLayers() {
      pieces.style.transform = 'rotate(0deg)';
      debugCanvas.style.transform = 'none';
      if (!debugCanvas.classList.contains('is-hidden') && currentDebugLayer === 8) {
        updateDebugCanvasRotation();
      }
    }

    function updateDebugCanvasRotation() {
      if (debugCanvas.classList.contains('is-hidden')) return;
      debugCanvas.style.transform = `scale(${debugZoom})`;
      debugCanvas.style.transformOrigin = 'center';
    }

    function updateDebugZoom() {
      if (debugCanvas.classList.contains('is-hidden')) return;
      debugCanvas.style.transform = `scale(${debugZoom})`;
      debugCanvas.style.transformOrigin = 'center';
      drawRegionDebug();
    }

    function getVisibleDebugLayers() {
      if (!allRegionMasks) return [];
      if (currentDebugLayer && allRegionMasks[currentDebugLayer]) return [currentDebugLayer];
      return Object.keys(allRegionMasks).map(Number).sort((a, b) => a - b);
    }

    function drawRegionDebug() {
      debugContext.clearRect(0, 0, 908, 908);
      if (!allRegionMasks) return;

      const visibleLayers = getVisibleDebugLayers();
      visibleLayers.forEach((layerNumber) => {
        const regions = allRegionMasks[layerNumber] || {};
        const rotation = rotations[layerNumber - 1] || 0;
        debugContext.save();
        debugContext.translate(454, 454);
        debugContext.rotate((rotation * Math.PI) / 180);
        debugContext.translate(-454, -454);

        Object.entries(regions || {}).forEach(([region, tiles]) => {
          const hue = (Number(region) - 1) * (280 / Math.max(1, Object.keys(regions).length - 1));
          debugContext.fillStyle = `hsla(${hue}, 85%, 50%, .72)`;
          let sumColumn = 0;
          let sumRow = 0;
          tiles.forEach((key) => {
            const [column, row] = key.split(',').map(Number);
            sumColumn += column;
            sumRow += row;
            debugContext.fillRect(column * 4, row * 4, 4, 4);
          });

          const probeBoxes = (regionProbeBoxes[`L${layerNumber}-${region}`] || getRegionProbeBoxesForLayer(layerNumber, Number(region)))
            .map((rect) => rotateRect(rect, layerNumber));
          debugContext.fillStyle = 'rgba(255,255,255,0.16)';
          debugContext.strokeStyle = 'rgba(255,255,255,1)';
          debugContext.lineWidth = 2.2;
          probeBoxes.forEach((rect) => {
            debugContext.fillRect(rect.x, rect.y, rect.width, rect.height);
            debugContext.strokeRect(rect.x, rect.y, rect.width, rect.height);
          });

          debugContext.fillStyle = '#20211f';
          debugContext.font = '700 16px Trebuchet MS';
          debugContext.textAlign = 'center';
          debugContext.fillText(`L${layerNumber}-${region}`, (sumColumn / tiles.length + .5) * 4, (sumRow / tiles.length + .5) * 4);
        });

        debugContext.restore();
      });
    }

    function getDebugPointerCoordinates(clientX, clientY) {
      const rect = debugCanvas.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return { x: 0, y: 0 };
      }
      const scaleX = 908 / rect.width;
      const scaleY = 908 / rect.height;
      const localX = (clientX - rect.left) * scaleX;
      const localY = (clientY - rect.top) * scaleY;
      const rotation = -((rotations[(currentDebugLayer || 1) - 1] || 0) * Math.PI) / 180;
      const cx = 454;
      const cy = 454;
      const dx = localX - cx;
      const dy = localY - cy;
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      return {
        x: cx + (dx * cos - dy * sin),
        y: cy + (dx * sin + dy * cos)
      };
    }

    let debugDragState = null;

    function findDebugProbeBoxAt(clientX, clientY) {
      if (!currentDebugLayer || !allRegionMasks?.[currentDebugLayer]) return null;
      const point = getDebugPointerCoordinates(clientX, clientY);

      for (const regionKey of Object.keys(allRegionMasks[currentDebugLayer] || {})) {
        const regionCode = `L${currentDebugLayer}-${regionKey}`;
        const boxes = regionProbeBoxes[regionCode] || getRegionProbeBoxesForLayer(currentDebugLayer, Number(regionKey));
        for (let index = 0; index < boxes.length; index += 1) {
          const box = rotateRect(boxes[index], currentDebugLayer);
          if (point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height) {
            return { regionCode, index };
          }
        }
      }
      return null;
    }

    function beginDebugProbeDrag(event) {
      if (!debugCanvas || debugCanvas.classList.contains('is-hidden')) return;
      event.preventDefault();
      event.stopPropagation();
      const hit = findDebugProbeBoxAt(event.clientX, event.clientY);
      if (!hit) return;
      const rect = debugCanvas.getBoundingClientRect();
      const box = regionProbeBoxes[hit.regionCode][hit.index];
      debugDragState = {
        regionCode: hit.regionCode,
        index: hit.index,
        offsetX: (event.clientX - rect.left) * (908 / rect.width) - box.x,
        offsetY: (event.clientY - rect.top) * (908 / rect.height) - box.y
      };
      try {
        debugCanvas.setPointerCapture?.(event.pointerId);
      } catch (error) {
        // Synthetic browser events do not always support capture; drag logic still works without it.
      }
    }

    function moveDebugProbeDrag(event) {
      if (!debugDragState) return;
      event.preventDefault();
      event.stopPropagation();
      const rect = debugCanvas.getBoundingClientRect();
      const point = getDebugPointerCoordinates(event.clientX, event.clientY);
      const targetBox = regionProbeBoxes[debugDragState.regionCode][debugDragState.index];
      const nextX = Math.max(0, Math.min(908 - targetBox.width, point.x - debugDragState.offsetX));
      const nextY = Math.max(0, Math.min(908 - targetBox.height, point.y - debugDragState.offsetY));
      targetBox.x = nextX;
      targetBox.y = nextY;
      drawRegionDebug();
    }

    function endDebugProbeDrag(event) {
      debugDragState = null;
      event?.stopPropagation?.();
      if (selectedRegionCode) updateSelectedRegionPanel(selectedRegionCode);
    }

    function isDebugModeActive() {
      return !!(debugCanvas && !debugCanvas.classList.contains('is-hidden'));
    }

    function syncDebugInteractionState() {
      const debugActive = isDebugModeActive();
      [passTurnButton, openMoveButton, openPromotionButton, openRelegationButton, ...pieceControls.querySelectorAll('button')].forEach((button) => {
        if (button) button.disabled = debugActive;
      });
      updateRotationControls();
    }

    function refreshRegionVisuals() {
      const existingPieces = new Map(
        [...pieces.children].map((piece) => [piece.dataset.pieceKey, piece])
      );
      const activeKeys = new Set();
      Object.entries(regionPiecesByRegion).forEach(([regionCode, piecesByTeam]) => {
        const availableSlots = getRegionSlots(regionCode) || [];
        const totalPieces = Object.values(piecesByTeam)
          .flatMap((stages) => Object.values(stages))
          .reduce((total, quantity) => total + Number(quantity || 0), 0);
        const slots = getBalancedRegionSlots(regionCode, availableSlots, totalPieces);
        const layerNumber = getRegionLayer(regionCode);
        const rotation = (getRegionVisualRotation(regionCode) * Math.PI) / 180;
        const sin = Math.sin(rotation);
        const cos = Math.cos(rotation);
        const rotationCenter = getRegionRotationCenter(regionCode);
        let slotIndex = 0;
        const teamOrder = ['orange', 'blue'];
        const stageOrder = ['g', 'f', 'e', 'd', 'c', 'b', 'a'];

        teamOrder.forEach((team) => {
          stageOrder.forEach((stage) => {
            const quantity = piecesByTeam[team][stage] || 0;
            for (let i = 0; i < quantity; i += 1) {
              const slot = slots[slotIndex] || slots[0];
              if (!slot) return;
              const localX = (slot.x / 100) * 908 - rotationCenter.x;
              const localY = (slot.y / 100) * 908 - rotationCenter.y;
              const rotatedX = rotationCenter.x + (localX * cos - localY * sin);
              const rotatedY = rotationCenter.y + (localX * sin + localY * cos);
              const pieceKey = `${regionCode}:${team}:${stage}:${i}`;
              let piece = existingPieces.get(pieceKey);
              if (!piece) {
                piece = document.createElement('img');
                piece.className = 'piece';
                piece.dataset.pieceKey = pieceKey;
                pieces.appendChild(piece);
              }
              piece.style.width = `${30 / Math.max(1, stageZoom)}px`;
              piece.style.height = `${30 / Math.max(1, stageZoom)}px`;
              activeKeys.add(pieceKey);
              piece.dataset.layer = String(layerNumber);
              piece.dataset.region = regionCode;
              piece.dataset.team = team;
              piece.dataset.stage = stage;
              piece.classList.toggle('heavy-rotation', layerNumber === heavyRotationLayer && existingPieces.has(pieceKey));
              piece.src = `${getPieceImageForTeam(team, stage)}.png`;
              piece.alt = `Peça ${team === 'blue' ? 'azul' : 'laranja'} de nível ${stage.toUpperCase()} na região ${regionCode}`;
              piece.style.left = `${(rotatedX / 908) * 100}%`;
              piece.style.top = `${(rotatedY / 908) * 100}%`;
              const visualRotation = getRegionVisualRotation(regionCode);
              piece.style.transform = `translate(-50%,-50%) rotate(${visualRotation}deg)`;
              pieces.appendChild(piece);
              slotIndex += 1;
            }
          });
        });
      });
      existingPieces.forEach((piece, key) => {
        if (!activeKeys.has(key)) piece.remove();
      });
    }

    function rotationEasing(progress) {
      const x1 = 0.7;
      const y1 = 0;
      const x2 = 0.9;
      const y2 = 0.45;
      const clampedProgress = Math.max(0, Math.min(1, progress));
      let lower = 0;
      let upper = 1;
      let parameter = clampedProgress;
      for (let iteration = 0; iteration < 12; iteration += 1) {
        const currentX = 3 * (1 - parameter) ** 2 * parameter * x1
          + 3 * (1 - parameter) * parameter ** 2 * x2
          + parameter ** 3;
        if (currentX < clampedProgress) {
          lower = parameter;
        } else {
          upper = parameter;
        }
        parameter = (lower + upper) / 2;
      }
      return 3 * (1 - parameter) ** 2 * parameter * y1
        + 3 * (1 - parameter) * parameter ** 2 * y2
        + parameter ** 3;
    }

    function animatePieceLayer(layerNumber, signedDelta, startRotation, targetRotation) {
      const animatedPieces = [...pieces.querySelectorAll(`.piece[data-layer="${layerNumber}"][data-rotation-start-left]`)];
      if (!animatedPieces.length) return;
      const duration = 3000;
      const startedAt = performance.now();
      const paths = animatedPieces.map((piece) => {
        const startX = parseFloat(piece.dataset.rotationStartLeft);
        const startY = parseFloat(piece.dataset.rotationStartTop);
        return {
          piece,
          radians: Math.atan2(startY - 50, startX - 50),
          radius: Math.hypot(startX - 50, startY - 50)
        };
      });
      const animate = (now) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = rotationEasing(progress);
        const angleOffset = (signedDelta * Math.PI / 180) * eased;
        paths.forEach(({ piece, radians, radius }) => {
          const angle = radians + angleOffset;
          piece.style.transition = 'none';
          piece.style.left = `${50 + Math.cos(angle) * radius}%`;
          piece.style.top = `${50 + Math.sin(angle) * radius}%`;
          piece.style.transform = `translate(-50%,-50%) rotate(${startRotation + (targetRotation - startRotation) * eased}deg)`;
        });
        if (progress < 1) {
          window.requestAnimationFrame(animate);
          return;
        }
        paths.forEach(({ piece }) => {
          piece.style.left = piece.dataset.rotationTargetLeft;
          piece.style.top = piece.dataset.rotationTargetTop;
          piece.style.transform = piece.dataset.rotationTargetTransform;
          piece.style.transition = '';
          delete piece.dataset.rotationStartLeft;
          delete piece.dataset.rotationStartTop;
          delete piece.dataset.rotationStartTransform;
          delete piece.dataset.rotationTargetLeft;
          delete piece.dataset.rotationTargetTop;
          delete piece.dataset.rotationTargetTransform;
        });
      };
      window.requestAnimationFrame(animate);
    }

    function captureCircularDiskPiecePositions(regionCodes) {
      const regionCodeSet = new Set(regionCodes);
      return new Map(
        [...pieces.querySelectorAll('.piece')]
          .filter((piece) => regionCodeSet.has(piece.dataset.region))
          .map((piece) => [piece, {
            x: parseFloat(piece.style.left) / 100 * 908,
            y: parseFloat(piece.style.top) / 100 * 908,
            transform: piece.style.transform
          }])
      );
    }

    function animateCircularDisk(blockName, disco, regionCodes, layerNumbers,
      startRotation, targetRotation, animationVersion, startPositions) {
      const diskKey = getCircularDiskKey(blockName, disco);
      const groups = [...boardLayerElements.values()]
        .flatMap((layerElement) => [...layerElement.querySelectorAll('[data-circular-rotation-group]')])
        .filter((group) => group.dataset.circularRotationGroup === diskKey);
      if (!groups.length) return;
      circularDiskAnimatedRotations.set(diskKey, startRotation);
      const startedAt = performance.now();
      const duration = 3000;
      const center = {
        x: Number(groups[0].dataset.centerX),
        y: Number(groups[0].dataset.centerY)
      };
      const regionCodeSet = new Set(regionCodes);
      const animatedPieces = [...pieces.querySelectorAll('.piece')]
        .filter((piece) => regionCodeSet.has(piece.dataset.region) && startPositions.has(piece));
      const piecePaths = animatedPieces.map((piece) => {
        const start = startPositions.get(piece);
        return {
          piece,
          startX: start.x,
          startY: start.y,
          targetLeft: piece.style.left,
          targetTop: piece.style.top,
          targetTransform: piece.style.transform
        };
      });
      groups.forEach((group) =>
        group.setAttribute('transform', `rotate(${startRotation} ${center.x} ${center.y})`));
      piecePaths.forEach(({ piece }) => {
        const start = startPositions.get(piece);
        piece.style.left = `${start.x / 908 * 100}%`;
        piece.style.top = `${start.y / 908 * 100}%`;
        piece.style.transform = start.transform ||
          `translate(-50%,-50%) rotate(${startRotation}deg)`;
      });
      const animate = (now) => {
        if (animationVersion !== rotationAnimationVersion) return;
        const progress = Math.min(1, (now - startedAt) / duration);
        const angle = startRotation + (targetRotation - startRotation) * rotationEasing(progress);
        circularDiskAnimatedRotations.set(diskKey, angle);
        groups.forEach((group) =>
          group.setAttribute('transform', `rotate(${angle} ${center.x} ${center.y})`));
        const delta = (angle - startRotation) * Math.PI / 180;
        const cosine = Math.cos(delta);
        const sine = Math.sin(delta);
        piecePaths.forEach(({ piece, startX, startY, targetLeft, targetTop, targetTransform }) => {
          if (progress >= 1) {
            piece.style.left = targetLeft;
            piece.style.top = targetTop;
            piece.style.transform = targetTransform;
            return;
          }
          const dx = startX - center.x;
          const dy = startY - center.y;
          const x = center.x + dx * cosine - dy * sine;
          const y = center.y + dx * sine + dy * cosine;
          piece.style.left = `${x / 908 * 100}%`;
          piece.style.top = `${y / 908 * 100}%`;
          piece.style.transform =
            `translate(-50%,-50%) rotate(${angle}deg)`;
        });
        layerNumbers.forEach((layerNumber) => updateBoardFocusOverlayTransforms(layerNumber));
        if (progress < 1) {
          window.requestAnimationFrame(animate);
        } else {
          circularDiskAnimatedRotations.delete(diskKey);
          updateBoardFocusOverlay();
        }
      };
      window.requestAnimationFrame(animate);
    }

    function captureMixedCircularPiecePositions(layerNumber) {
      const regionCodes = Object.entries(regionGeometryByCode)
        .filter(([, geometry]) => geometry.layer === layerNumber && geometry.shape === 'circular')
        .map(([code]) => code);
      return captureCircularDiskPiecePositions(regionCodes);
    }

    function animateMixedCircularBlocks(layerNumber, startRotation, targetRotation,
      animationVersion, startPositions) {
      const diskRegions = new Map();
      Object.entries(regionGeometryByCode).forEach(([code, geometry]) => {
        if (geometry.layer !== layerNumber || geometry.shape !== 'circular') return;
        const diskKey = getRegionCircularDiskKey(geometry);
        if (!diskKey) return;
        if (!diskRegions.has(diskKey)) {
          diskRegions.set(diskKey, {
            block: geometry.block,
            disco: geometry.disco,
            codes: [],
            layers: new Set()
          });
        }
        diskRegions.get(diskKey).codes.push(code);
        diskRegions.get(diskKey).layers.add(geometry.layer);
      });
      diskRegions.forEach(({ block, disco, codes, layers }) => {
        circularDiskRotations[getCircularDiskKey(block, disco)] = targetRotation;
        const diskPositions = new Map([...startPositions].filter(([piece]) =>
          codes.includes(piece.dataset.region)));
        animateCircularDisk(
          block,
          disco,
          codes,
          [...layers],
          startRotation,
          targetRotation,
          animationVersion,
          diskPositions
        );
      });
    }

    function rotateCircularDisk(blockName, disco, direction) {
      const block = getRotatableCircularBlocks().find((item) => String(item.name) === blockName);
      const regions = getCircularDiskRegions(block, disco);
      if (!block || !regions.length) return;
      if (!canRotateCircularDisk(block, regions)) {
        const firstRegion = regions[0];
        const layer = Number(firstRegion.layer ||
          String(firstRegion.rank || firstRegion.code || firstRegion.name).match(/L(\d+)/)?.[1]);
        readout.textContent = hasRotatedThisTurn
          ? 'Você já girou um disco neste turn.'
          : `Disco ${disco}: indisponível neste turn.`;
        if (layer >= 1 && layer <= 8) updateRotationControls();
        return;
      }

      const step = getCircularDiskRotationStep(block, regions);
      const rotationDelta = direction === 'left' ? -step : step;
      const diskKey = getCircularDiskKey(blockName, disco);
      const regionCodes = regions.map((region) => region.code || region.name);
      const layerNumbers = [...new Set(regions.map((region) => Number(region.layer ||
        String(region.rank || region.code || region.name).match(/L(\d+)/)?.[1])))];
      const primaryLayer = layerNumbers[0];
      const previousRotation = getCircularDiskRotation(blockName, disco, primaryLayer);
      const targetRotation = previousRotation + rotationDelta;
      const startingPiecePositions = captureCircularDiskPiecePositions(regionCodes);

      controls.classList.remove('is-rotation-picker-open', 'is-selecting-rotation-block');
      app.classList.remove('is-rotation-picker-open');
      campaignGuide.classList.remove('is-rotation-picker-open');
      resetStageZoom();
      stagePanel.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      playRotationSound();

      circularDiskRotations[diskKey] = targetRotation;
      layerNumbers.forEach((layerNumber) => {
        rotations[layerNumber - 1] = targetRotation;
        recomputeNeighborCacheForLayer(layerNumber);
      });
      if (layerNumbers.includes(8)) {
        updateActiveRegions();
        updateL8AttachedLayers();
      }
      rotationAnimationVersion += 1;
      hasRotatedThisTurn = true;
      lastRotatedLayer = primaryLayer;
      lastRotatedBy = currentTeam;
      rotationLockTurn = currentTurn + 1;
      if (isCampaignLevelTwo() &&
          ['level2-rotate', 'level2-rotate-again'].includes(campaignGuideStep)) {
        hideCampaignGuide();
        campaignGuideStep = 'await-circular';
      }
      updateRotationControls();
      recalculateRegionForces();
      refreshRegionVisuals();
      animateCircularDisk(
        blockName,
        disco,
        regionCodes,
        layerNumbers,
        previousRotation,
        targetRotation,
        rotationAnimationVersion,
        startingPiecePositions
      );
      updateBoardFocusOverlay();
      updateSelectedRegionPanel(selectedRegionCode);
      updateReadout();
      if (!debugCanvas.classList.contains('is-hidden') &&
          layerNumbers.includes(currentDebugLayer)) {
        drawRegionDebug();
        updateDebugCanvasRotation();
      }
      saveGame();
      publishBluetoothAction({
        type: 'rotate',
        team: currentTeam,
        layer: primaryLayer,
        block: blockName,
        disco,
        direction
      });
      finishIfCenterConquered();
    }

    function addPiece(team, stage) {
      if ((!isApplyingBluetoothAction && !isLocalPlayersTurn()) || team !== currentTeam) return;
      const selectedRegion = selectedRegionCode || pieceTargets[team].code;
      const regionReference = selectedRegion;
      if (!regionReference || !Object.prototype.hasOwnProperty.call(soldierWeights, stage)) return;
      if (isCampaignLevelTwo() && stage === 'f') {
        readout.textContent = 'Neste level, peças F devem ser formadas ao combinar 7 peças G.';
        return;
      }
      if (wasPieceRecycledThisTurn(regionReference, team, stage)) {
        readout.textContent = `${regionReference}: não é possível recomprar neste turno uma peça ${stage.toUpperCase()} descartada nesta região.`;
        return;
      }
      const dominator = getRegionDominador(regionReference);
      if (dominator !== team) {
        readout.textContent = `${regionReference}: só é possível comprar peças em uma região dominada pela sua equipe.`;
        return;
      }
      if (!hasDirectRecruitmentPromotionCapacity(
        getRegionLayer(regionReference), team, soldierWeights[stage]
      )) {
        readout.textContent = `${regionReference}: falta força nas camadas inferiores para recrutar diretamente aqui.`;
        return;
      }

      if (!regionPiecesByRegion[regionReference]) {
        regionPiecesByRegion[regionReference] = {
          orange: { g: 0, f: 0, e: 0, d: 0, c: 0, b: 0, a: 0 },
          blue: { g: 0, f: 0, e: 0, d: 0, c: 0, b: 0, a: 0 }
        };
      }
      if (!regionStats[regionReference]) regionStats[regionReference] = { orange: 0, blue: 0 };

      const targetSlots = getRegionSlots(regionReference) || [];
      const regionLimit = getRegionPieceLimit(regionReference);
      const projectedCounts = { ...regionPiecesByRegion[regionReference][team] };
      projectedCounts[stage] = Number(projectedCounts[stage] || 0) + 1;
      const projectedFinalCount = getFinalPieceCountForTeam(projectedCounts);
      if (projectedFinalCount > regionLimit) {
        readout.textContent = `${regionReference}: capacidade de região atingida (${regionLimit} peças).`;
        return;
      }
      const currentPieceCount = getFinalPieceCountForTeam(regionPiecesByRegion[regionReference][team]);
      const currentSlotIndex = Math.min(currentPieceCount, Math.max(0, targetSlots.length - 1));
      const slot = targetSlots[currentSlotIndex];
      if (!slot && projectedFinalCount >= currentPieceCount) {
        readout.textContent = `${regionReference}: não há espaço seguro para outra peça de 25 x 25.`;
        return;
      }
      const cost = getRecruitmentCost(regionReference, stage);
      if (!spendTurnPoints(cost)) {
        readout.textContent = `${regionReference}: moedas insuficientes para comprar uma peça ${stage.toUpperCase()}.`;
        return;
      }

      regionPiecesByRegion[regionReference][team][stage] += 1;
      regionStats[regionReference][team] += 1;
      pieceCounts[team] += 1;
      mergeRegionTeam(regionReference, team);
      recalculateRegionForces();
      refreshRegionVisuals();
      showActionFeedback(regionReference, cost, 'buy');
      if (selectedRegionCode === regionReference) updateSelectedRegionPanel(regionReference);
      updateTurnState();
      updateReadout();
      publishBluetoothAction({
        type: 'buy',
        team,
        source: regionReference,
        stage
      });
      finishIfCenterConquered();
      if (isCampaignGame() && campaignGuideStep === 'purchase' &&
          team === 'orange' && regionReference === 'L8-5' && stage === 'g') {
        showCampaignGuide('move');
      } else {
        maybeShowCampaignWarGuide();
      }
    }

    function getRegionRotationCenter(regionCode) {
      const geometry = regionGeometryByCode[regionCode];
      if (geometry?.shape === 'circular') {
        return { x: geometry.centerX, y: geometry.centerY };
      }
      return { x: 454, y: 454 };
    }

    function getRegionVisualRotation(regionCode) {
      const geometry = regionGeometryByCode[regionCode];
      if (!geometry) return 0;
      const diskKey = getRegionCircularDiskKey(geometry);
      const animatedRotation = diskKey
        ? circularDiskAnimatedRotations.get(diskKey)
        : circularDiskAnimatedRotations.get(geometry.layer);
      if (geometry.shape === 'circular' && Number.isFinite(animatedRotation)) {
        return animatedRotation;
      }
      if (currentBoardData?.boardType === 'mixed' && geometry.shape === 'quadrilateral') {
        const block = quadrilateralBoard?.blocks.find((item) => item.name === geometry.block);
        if (block && !block.rotationEnabled) return 0;
      }
      return diskKey
        ? getCircularDiskRotation(geometry.block, geometry.disco, geometry.layer)
        : rotations[getRegionLayer(regionCode) - 1] || 0;
    }

    function getRegionFocusPoint(regionCode, applyRotation = true) {
      const match = String(regionCode || '').match(/^L(\d+)-(\d+)$/);
      if (!match || !allRegionMasks) return null;
      const layer = Number(match[1]);
      const region = match[2];
      const tiles = allRegionMasks[layer]?.[region];
      if (!Array.isArray(tiles) || !tiles.length) return null;
      const rotation = applyRotation ? (getRegionVisualRotation(regionCode) * Math.PI) / 180 : 0;
      const sin = Math.sin(rotation);
      const cos = Math.cos(rotation);
      const geometry = regionGeometryByCode[regionCode];
      const rotationCenter = currentBoardData?.boardType === 'mixed' && geometry?.shape === 'circular'
        ? { x: geometry.centerX, y: geometry.centerY }
        : { x: 454, y: 454 };
      const point = tiles.reduce((sum, key) => {
        const [column, row] = key.split(',').map(Number);
        const rawX = column * 4 + 2;
        const rawY = row * 4 + 2;
        const dx = rawX - rotationCenter.x;
        const dy = rawY - rotationCenter.y;
        sum.x += rotationCenter.x + (dx * cos - dy * sin);
        sum.y += rotationCenter.y + (dx * sin + dy * cos);
        return sum;
      }, { x: 0, y: 0 });
      return {
        x: (point.x / tiles.length / 908) * 100,
        y: (point.y / tiles.length / 908) * 100
      };
    }

    function getRegionPieceCenter(regionCode) {
      const geometry = regionGeometryByCode[regionCode];
      if (geometry?.shape === 'circular') {
        return getRegionFocusPoint(regionCode, currentBoardData?.boardType !== 'mixed');
      }
      if (geometry?.shape !== 'quadrilateral' ||
          !Number.isFinite(geometry.centerX) || !Number.isFinite(geometry.centerY)) {
        return getRegionFocusPoint(regionCode);
      }
      const rotation = getRegionVisualRotation(regionCode);
      const angle = (rotation * Math.PI) / 180;
      const center = getRegionRotationCenter(regionCode);
      const dx = geometry.centerX - center.x;
      const dy = geometry.centerY - center.y;
      return {
        x: (center.x + dx * Math.cos(angle) - dy * Math.sin(angle)) / 908 * 100,
        y: (center.y + dx * Math.sin(angle) + dy * Math.cos(angle)) / 908 * 100
      };
    }

    function getBalancedRegionSlots(regionCode, slots, pieceCount) {
      if (pieceCount <= 0 || !slots.length) return slots;
      const slotCenter = getRegionPieceCenter(regionCode);
      if (pieceCount === 1 && slotCenter) return [slotCenter];
      if ((pieceCount !== 2 && pieceCount !== 3) || !slotCenter) return slots;

      const geometry = regionGeometryByCode[regionCode];
      if (pieceCount === 3 && currentBoardData?.boardType === 'mixed' &&
          geometry?.shape === 'circular') {
        const angle = (geometry.startAngle + geometry.endAngle) / 2 * Math.PI / 180;
        const radialSpan = Math.max(0, geometry.outerRadius - geometry.innerRadius);
        const innerRadius = geometry.innerRadius + radialSpan * 0.18;
        const outerRadius = geometry.innerRadius + radialSpan * 0.62;
        const angleOffset = Math.min(24, (geometry.endAngle - geometry.startAngle) * 0.28) * Math.PI / 180;
        const positions = [
          { radius: innerRadius, angle },
          { radius: outerRadius, angle: angle - angleOffset },
          { radius: outerRadius, angle: angle + angleOffset }
        ];
        return positions.map(({ radius, angle: pieceAngle }) => ({
          x: (geometry.centerX + radius * Math.cos(pieceAngle)) / 908 * 100,
          y: (geometry.centerY - radius * Math.sin(pieceAngle)) / 908 * 100
        }));
      }

      const layerNumber = getRegionLayer(regionCode);
      const isMixedCircular = currentBoardData?.boardType === 'mixed' &&
        regionGeometryByCode[regionCode]?.shape === 'circular';
      const angle = (isMixedCircular ? 0 : getRegionVisualRotation(regionCode)) * Math.PI / 180;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);
      const match = String(regionCode).match(/^L\d+-(\d+)$/);
      const tiles = match ? allRegionMasks?.[layerNumber]?.[match[1]] : null;
      const center = regionGeometryByCode[regionCode]?.shape === 'circular'
        && !isMixedCircular ? {
          x: (454 + (slotCenter.x * 908 - 454) * cos - (slotCenter.y * 908 - 454) * sin) / 908,
          y: (454 + (slotCenter.x * 908 - 454) * sin + (slotCenter.y * 908 - 454) * cos) / 908
        }
        : slotCenter;

      if (regionGeometryByCode[regionCode]?.shape !== 'circular' &&
          Array.isArray(tiles) && tiles.length) {
        const points = tiles.map((key) => {
          const [column, row] = key.split(',').map(Number);
          const rawX = column * 4 + 2;
          const rawY = row * 4 + 2;
          const dx = rawX - 454;
          const dy = rawY - 454;
          return {
            rawX,
            rawY,
            x: 454 + dx * cos - dy * sin,
            y: 454 + dx * sin + dy * cos
          };
        });
        const regionSet = new Set(points.map((point) => `${Math.round(point.x)},${Math.round(point.y)}`));
        const panelWidth = stagePanel.getBoundingClientRect().width || 780;
        const radius = Math.max(2, Math.min(3, Math.ceil(30 / panelWidth * 908 / 4 / 2)));
        const rows = new Map();
        points.forEach((point) => {
          for (let y = Math.floor(point.y / 4) - radius; y <= Math.floor(point.y / 4) + radius; y += 1) {
            for (let x = Math.floor(point.x / 4) - radius; x <= Math.floor(point.x / 4) + radius; x += 1) {
              if (!regionSet.has(`${Math.round(x * 4 + 2)},${Math.round(y * 4 + 2)}`)) return;
            }
          }
          const rowKey = Math.floor(point.y / 4);
          if (!rows.has(rowKey)) rows.set(rowKey, []);
          rows.get(rowKey).push(point);
        });

        const baseGap = 30 / panelWidth * 100 * 1.2;
        let bestRow = null;
        let bestRowScore = Number.POSITIVE_INFINITY;
        rows.forEach((row) => {
          if (row.length < pieceCount) return;
          row.sort((first, second) => first.x - second.x);
          const minX = row[0].x / 908 * 100;
          const maxX = row[row.length - 1].x / 908 * 100;
          const availableGap = (maxX - minX) / (pieceCount - 1);
          const gap = Math.min(baseGap, availableGap * 0.8);
          const occupiedWidth = gap * (pieceCount - 1);
          const startX = Math.max(minX, Math.min(center.x - occupiedWidth / 2, maxX - occupiedWidth));
          const targetXs = Array.from({ length: pieceCount }, (_, index) => startX + gap * index);
          const selected = [];
          targetXs.forEach((targetX) => {
            const previous = selected[selected.length - 1];
            const candidate = row.reduce((closest, point) => {
              const pointX = point.x / 908 * 100;
              if (previous && pointX <= previous.x / 908 * 100 + gap * 0.75) return closest;
              if (!closest || Math.abs(pointX - targetX) < Math.abs(closest.x / 908 * 100 - targetX)) {
                return point;
              }
              return closest;
            }, null);
            if (candidate) selected.push(candidate);
          });
          if (selected.length !== pieceCount) return;
          const averageX = selected.reduce((total, point) => total + point.x / 908 * 100, 0) / pieceCount;
          const averageY = selected.reduce((total, point) => total + point.y / 908 * 100, 0) / pieceCount;
          const rowScore = (averageY - center.y) ** 2 * 3
            + (averageX - center.x) ** 2 * 2 + (baseGap - gap) ** 2;
          if (rowScore < bestRowScore) {
            bestRowScore = rowScore;
            bestRow = selected.map((point) => ({
              x: point.rawX / 908 * 100,
              y: point.rawY / 908 * 100
            }));
          }
        });
        if (bestRow) return bestRow;
      }

      if (slots.length < pieceCount) return slots;
      const positionedSlots = slots.map((slot) => {
        const dx = slot.x / 100 * 908 - 454;
        const dy = slot.y / 100 * 908 - 454;
        return {
          slot,
          x: (454 + dx * cos - dy * sin) / 908 * 100,
          y: (454 + dx * sin + dy * cos) / 908 * 100
        };
      });
      const horizontalSpan = Math.max(...positionedSlots.map((point) => point.x))
        - Math.min(...positionedSlots.map((point) => point.x));
      const panelWidth = stagePanel.getBoundingClientRect().width || 780;
      const desiredGap = Math.min(30 / panelWidth * 100 * 1.2,
        horizontalSpan / (pieceCount - 1) * 0.8);
      const minimumGap = desiredGap * 0.45;
      let bestArrangement = positionedSlots.slice(0, pieceCount);
      let bestScore = Number.POSITIVE_INFINITY;
      const evaluate = (arrangement) => {
        const ordered = [...arrangement].sort((first, second) => first.x - second.x);
        const average = ordered.reduce((sum, point) => ({
          x: sum.x + point.x / ordered.length,
          y: sum.y + point.y / ordered.length
        }), { x: 0, y: 0 });
        const gaps = ordered.slice(1).map((point, index) => point.x - ordered[index].x);
        const verticalDeviation = ordered.reduce((total, point) =>
          total + (point.y - center.y) ** 2, 0) / ordered.length;
        const centerDeviation = (average.x - center.x) ** 2 + (average.y - center.y) ** 2;
        const spacingDeviation = gaps.reduce((total, gap) => total + (gap - desiredGap) ** 2, 0);
        const overlapPenalty = gaps.reduce((total, gap) =>
          total + Math.max(0, minimumGap - gap) ** 2 * 4, 0);
        const score = verticalDeviation * 3 + centerDeviation * 2
          + spacingDeviation * 2 + overlapPenalty;
        if (score < bestScore) {
          bestScore = score;
          bestArrangement = ordered;
        }
      };
      for (let first = 0; first < positionedSlots.length; first += 1) {
        for (let second = first + 1; second < positionedSlots.length; second += 1) {
          if (pieceCount === 2) {
            evaluate([positionedSlots[first], positionedSlots[second]]);
            continue;
          }
          for (let third = second + 1; third < positionedSlots.length; third += 1) {
            evaluate([positionedSlots[first], positionedSlots[second], positionedSlots[third]]);
          }
        }
      }
      return bestArrangement.map((point) => point.slot);
    }

    function updateStageZoom() {
      if (stageZoom === 1) {
        stageZoomOffset = { x: 0, y: 0 };
        stage.style.transform = '';
        stagePanel.classList.remove('is-focused');
        updateZoomAwarePieceSizes();
        if (Object.keys(regionGeometryByCode).length) renderBoardLayers();
        return;
      }
      const rect = stagePanel.getBoundingClientRect();
      stage.style.transform = `translate(${stageZoomOffset.x}px, ${stageZoomOffset.y}px) scale(${stageZoom})`;
      stagePanel.classList.add('is-focused');
      updateZoomAwarePieceSizes();
      if (Object.keys(regionGeometryByCode).length) renderBoardLayers();
      stagePanelClose.focus({ preventScroll: true });
      if (rect.width <= 0 || rect.height <= 0) return;
    }

    function updateZoomAwarePieceSizes() {
      const size = `${30 / Math.max(1, stageZoom)}px`;
      pieces.querySelectorAll('.piece, .drag-piece').forEach((piece) => {
        piece.style.width = size;
        piece.style.height = size;
      });
    }

    function focusRegion(regionCode) {
      updateBoardFocusOverlay();
      const point = getRegionFocusPoint(regionCode);
      if (!point) return;
      const layer = getRegionLayer(regionCode);
      const rect = stagePanel.getBoundingClientRect();
      const scale = 1.8;
      if (currentBoardData?.boardType === 'mixed') {
        stageZoom = scale;
        stageZoomOffset = {
          x: ((50 - point.x) / 100) * rect.width * scale,
          y: ((50 - point.y) / 100) * rect.height * scale
        };
        focusedRegionCode = regionCode;
        updateStageZoom();
        return;
      }
      const outerLayerFocus = { 5: 0.06, 6: 0.12, 7: 0.18, 8: 0.24 };
      const outwardBias = outerLayerFocus[layer] || 0;
      const radialX = point.x - 50;
      const radialY = point.y - 50;
      const targetX = 50 + radialX * outwardBias;
      const targetY = 50 + radialY * outwardBias;
      stageZoom = scale;
      stageZoomOffset = {
        x: ((targetX - point.x) / 100) * rect.width * scale,
        y: ((targetY - point.y) / 100) * rect.height * scale
      };
      focusedRegionCode = regionCode;
      updateStageZoom();
    }

    function resetStageZoom() {
      focusedRegionCode = null;
      stageZoom = 1;
      updateStageZoom();
    }

    function resolveRegionFromPointer(clientX, clientY) {
      if (!allRegionMasks) return null;
      const rect = stagePanel.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const transformedX = clientX - centerX - stageZoomOffset.x;
      const transformedY = clientY - centerY - stageZoomOffset.y;
      const unzoomedX = transformedX / stageZoom;
      const unzoomedY = transformedY / stageZoom;

      const layerOrder = Object.keys(allRegionMasks)
        .map(Number)
        .sort((a, b) => b - a);

      if (currentBoardData?.boardType === 'mixed') {
        const viewX = ((unzoomedX + rect.width / 2) / rect.width) * 908;
        const viewY = ((unzoomedY + rect.height / 2) / rect.height) * 908;
        for (const layer of layerOrder) {
          const layerData = allRegionMasks[layer];
          if (!layerData) continue;
          const match = Object.keys(layerData).find((region) => {
            const regionCode = `L${layer}-${region}`;
            const geometry = regionGeometryByCode[regionCode];
            if (!geometry) return false;
            let pointX = viewX;
            let pointY = viewY;
            if (geometry.shape === 'circular') {
              const angle = -getRegionVisualRotation(regionCode) * Math.PI / 180;
              const dx = viewX - geometry.centerX;
              const dy = viewY - geometry.centerY;
              pointX = geometry.centerX + dx * Math.cos(angle) - dy * Math.sin(angle);
              pointY = geometry.centerY + dx * Math.sin(angle) + dy * Math.cos(angle);
            }
            const tile = `${Math.floor(pointX / 4)},${Math.floor(pointY / 4)}`;
            return (layerData[region] || []).includes(tile);
          });
          if (match) {
            currentDebugLayer = layer;
            regionMasks = layerData;
            if (!debugCanvas.classList.contains('is-hidden')) drawRegionDebug();
            document.querySelectorAll('.layer-button').forEach((button) =>
              button.classList.toggle('is-active', Number(button.dataset.layer) === layer));
            return `L${layer}-${match}`;
          }
        }
        return null;
      }

      for (const layer of layerOrder) {
        const rotation = ((rotations[layer - 1] || 0) * Math.PI) / 180;
        const dx = unzoomedX;
        const dy = unzoomedY;
        const sin = Math.sin(-rotation);
        const cos = Math.cos(-rotation);
        const localX = dx * cos - dy * sin;
        const localY = dx * sin + dy * cos;
        const relativeX = ((localX + rect.width / 2) / rect.width) * 908;
        const relativeY = ((localY + rect.height / 2) / rect.height) * 908;
        const column = Math.floor(relativeX / 4);
        const row = Math.floor(relativeY / 4);
        const tile = `${column},${row}`;
        const layerData = allRegionMasks[layer];
        if (!layerData) continue;
        const match = Object.keys(layerData).find((region) => (layerData[region] || []).includes(tile));
        if (match) {
          currentDebugLayer = layer;
          regionMasks = layerData;
          if (!debugCanvas.classList.contains('is-hidden')) {
            drawRegionDebug();
          }
          if (layer) {
            document.querySelectorAll('.layer-button').forEach((button) => button.classList.toggle('is-active', Number(button.dataset.layer) === layer));
          }
          return `L${layer}-${match}`;
        }
      }
      return null;
    }

    function getSafeSlots(layerNumber, regionNumber, applyRotation = true) {
      const tiles = Array.isArray(allRegionMasks?.[layerNumber]?.[String(regionNumber)]) ? allRegionMasks[layerNumber][String(regionNumber)] : [];
      if (!tiles.length) return [];

      const centerX = 454;
      const centerY = 454;
      const rotation = applyRotation ? ((rotations[(layerNumber - 1)] || 0) * Math.PI) / 180 : 0;
      const sin = Math.sin(rotation);
      const cos = Math.cos(rotation);

      const transformedPoints = tiles.map((key) => {
        const [column, row] = key.split(',').map(Number);
        const rawX = (column * 4) + 2;
        const rawY = (row * 4) + 2;
        const dx = rawX - centerX;
        const dy = rawY - centerY;
        return {
          x: centerX + (dx * cos - dy * sin),
          y: centerY + (dx * sin + dy * cos),
          rawX,
          rawY
        };
      });

      const regionSet = new Set(transformedPoints.map((point) => `${Math.round(point.x)},${Math.round(point.y)}`));
      const radius = Math.max(2, Math.min(3, Math.ceil((30 / (stagePanel.getBoundingClientRect().width || 780) * 908) / 4 / 2)));
      const candidates = transformedPoints.filter((point) => {
        for (let y = Math.floor(point.y / 4) - radius; y <= Math.floor(point.y / 4) + radius; y += 1) {
          for (let x = Math.floor(point.x / 4) - radius; x <= Math.floor(point.x / 4) + radius; x += 1) {
            if (!regionSet.has(`${Math.round(x * 4 + 2)},${Math.round(y * 4 + 2)}`)) {
              return false;
            }
          }
        }
        return true;
      });

      const slots = [];
      const minDistance = Math.max(4, (30 * 908 / (stagePanel.getBoundingClientRect().width || 780)) * 0.75);
      while (slots.length < 8 && candidates.length) {
        let bestIndex = 0;
        let bestScore = -1;
        candidates.forEach((candidate, index) => {
          const score = slots.length
            ? Math.min(...slots.map((slot) => Math.hypot(candidate.x - slot.x, candidate.y - slot.y)))
            : 0;
          if ((!slots.length || score >= minDistance) && score > bestScore) {
            bestIndex = index;
            bestScore = score;
          }
        });
        const selected = candidates.splice(bestIndex, 1)[0];
        if (!slots.length || bestScore >= minDistance) {
          slots.push(selected);
        } else {
          break;
        }
      }

      return slots.map((slot) => ({
        x: (slot.x / 908) * 100,
        y: (slot.y / 908) * 100
      }));
    }

    function placeInitialPiece(team, regionCode, stage = 'g') {
      if (!regionPiecesByRegion[regionCode]) {
        regionPiecesByRegion[regionCode] = {
          orange: { g: 0, f: 0, e: 0, d: 0, c: 0, b: 0, a: 0 },
          blue: { g: 0, f: 0, e: 0, d: 0, c: 0, b: 0, a: 0 }
        };
      }
      if (!regionStats[regionCode]) regionStats[regionCode] = { orange: 0, blue: 0 };
      regionPiecesByRegion[regionCode][team][stage] += 1;
      regionStats[regionCode][team] += 1;
      pieceCounts[team] += 1;
    }

    function placeBoardInitialPieces() {
      const initialPieces = Object.entries(regionGeometryByCode).flatMap(([regionCode, geometry]) =>
        geometry.initialPieces.map((piece) => ({ ...piece, regionCode })));
      if (initialPieces.length) {
        initialPieces.forEach(({ team, stage, regionCode }) => placeInitialPiece(team, regionCode, stage));
        return;
      }
      placeInitialPiece('orange', 'L8-2');
      placeInitialPiece('blue', 'L8-6');
    }

    function rebuildRegionSlotsForLayer(layerNumber) {
      if (!allRegionMasks || !allRegionMasks[layerNumber]) return;
      const layerSlots = {};
      Object.keys(allRegionMasks[layerNumber]).forEach((regionKey) => {
        const regionNumber = Number(regionKey);
        layerSlots[regionNumber] = getSafeSlots(layerNumber, regionNumber, false);
      });
      regionSlots[layerNumber] = layerSlots;
    }

    function buildCompleteRegionProbeBoxes() {
      const complete = {};
      for (let layer = 1; layer <= 8; layer += 1) {
        const regionCount = Math.max(1, Object.keys(allRegionMasks?.[layer] || {}).length || 1);
        for (let region = 1; region <= Math.max(regionCount, layer === 1 ? 1 : layer === 2 ? 2 : layer === 3 ? 3 : layer === 4 ? 4 : layer === 5 ? 5 : layer === 6 ? 6 : layer === 7 ? 7 : 8); region += 1) {
          const regionCode = `L${layer}-${region}`;
          const existing = regionProbeBoxes[regionCode];
          if (existing && Array.isArray(existing)) {
            complete[regionCode] = existing.map((box) => ({ ...box }));
          } else {
            const boxes = getRegionProbeBoxesForLayer(layer, region).map((box) => ({ ...box }));
            complete[regionCode] = boxes;
          }
        }
      }
      return complete;
    }

    function buildCompleteAllRegionMasks() {
      const complete = {};
      for (let layer = 1; layer <= 8; layer += 1) {
        const regionMap = allRegionMasks?.[layer] || {};
        const regionCount = layer === 1 ? 1 : layer === 2 ? 2 : layer === 3 ? 3 : layer === 4 ? 4 : layer === 5 ? 5 : layer === 6 ? 6 : layer === 7 ? 7 : 8;
        complete[layer] = {};
        for (let region = 1; region <= regionCount; region += 1) {
          const regionKey = String(region);
          const tiles = Array.isArray(regionMap[regionKey]) ? regionMap[regionKey] : [];
          complete[layer][regionKey] = [...tiles];
        }
      }
      return complete;
    }

    function buildDebugExportPayload() {
      const routeRegions = Object.fromEntries(
        Object.entries(regionPiecesByRegion).map(([regionCode, teamMap]) => {
          const summary = {
            orange: { ...teamMap.orange },
            blue: { ...teamMap.blue },
            total: Object.values(teamMap.orange).reduce((sum, value) => sum + Number(value || 0), 0) + Object.values(teamMap.blue).reduce((sum, value) => sum + Number(value || 0), 0),
            dominator: getRegionDominador(regionCode),
            slots: getRegionSlots(regionCode)?.length || 0
          };
          return [regionCode, summary];
        })
      );

      const completeProbeBoxes = buildCompleteRegionProbeBoxes();
      const completeMasks = buildCompleteAllRegionMasks();
      const slotExport = {};
      Object.entries(regionSlots).forEach(([layerKey, regionMap]) => {
        Object.entries(regionMap || {}).forEach(([regionKey, slots]) => {
          slotExport[`L${layerKey}-${regionKey}`] = slots;
        });
      });

      return {
        timestamp: new Date().toISOString(),
        currentTeam,
        selectedRegionCode,
        rotations: [...rotations],
        pieceCounts: { ...pieceCounts },
        pieceTargets: JSON.parse(JSON.stringify(pieceTargets)),
        regionStats: JSON.parse(JSON.stringify(regionStats)),
        regionPiecesByRegion: JSON.parse(JSON.stringify(regionPiecesByRegion)),
        regionProbeBoxes: JSON.parse(JSON.stringify(completeProbeBoxes)),
        regionSlots: slotExport,
        regions: routeRegions,
        allRegionMasks: completeMasks
      };
    }

    function rotateQuadrilateralMatrix(matrix, direction) {
      const rotated = matrix.map((row) => [...row]);
      const rotateRing = (top, left, size) => {
        if (size <= 1) return;
        const perimeter = [];
        for (let column = left; column < left + size; column += 1) perimeter.push([top, column]);
        for (let row = top + 1; row < top + size; row += 1) perimeter.push([row, left + size - 1]);
        for (let column = left + size - 2; column >= left; column -= 1) perimeter.push([top + size - 1, column]);
        for (let row = top + size - 2; row > top; row -= 1) perimeter.push([row, left]);
        const values = perimeter.map(([row, column]) => matrix[row][column]);
        const offset = direction === 'left' ? 1 : -1;
        perimeter.forEach(([row, column], index) => {
          const destination = perimeter[(index + offset + perimeter.length) % perimeter.length];
          rotated[destination[0]][destination[1]] = values[index];
        });
        rotateRing(top + 1, left + 1, size - 2);
      };
      rotateRing(0, 0, matrix.length);
      return rotated;
    }

    function prepareQuadrilateralBoard(data) {
      if (!['quadrilateral', 'mixed'].includes(data?.boardType)) return null;
      if (!Array.isArray(data.blocks) || !data.blocks.length) {
        throw new Error('o tabuleiro quadricular não contém blocos');
      }

      const blocks = [];
      const regionDefinitions = new Map();
      let left = Number.POSITIVE_INFINITY;
      let top = Number.POSITIVE_INFINITY;
      let right = Number.NEGATIVE_INFINITY;
      let bottom = Number.NEGATIVE_INFINITY;

      data.blocks.forEach((block) => {
        if (!block || block.type !== 'circular') return;
        const center = block.center || {};
        const radius = Math.max(0, ...(block.regions || []).map((region) =>
          Number(region.geometry?.r2 ?? region.geometry?.outerRadius ?? region.r2 ?? region.outerRadius) || 0));
        const centerX = Number(center.x);
        const centerY = Number(center.y);
        if (!Number.isFinite(centerX) || !Number.isFinite(centerY) || !radius) {
          throw new Error(`geometria circular inválida no bloco ${block.name || ''}`);
        }
        left = Math.min(left, centerX - radius);
        top = Math.min(top, centerY - radius);
        right = Math.max(right, centerX + radius);
        bottom = Math.max(bottom, centerY + radius);
      });

      data.blocks.forEach((block) => {
        if (block?.type === 'circular') return;
        if (!block || block.type !== 'quadrilateral' || !Array.isArray(block.matrix)) {
          throw new Error('bloco quadricular inválido');
        }
        const size = Number(block.matrixSize || block.matrix.length);
        const height = Number(block.L1);
        const width = Number(block.L2);
        const initialCenter = block.C_inicial || block.initialCenter;
        const centerX = Number(initialCenter?.x ?? initialCenter?.c_x_inicial);
        const centerY = Number(initialCenter?.y ?? initialCenter?.c_y_inicial);
        if (!Number.isInteger(size) || size < 1 || block.matrix.length !== size ||
            block.matrix.some((row) => !Array.isArray(row) || row.length !== size) ||
            !Number.isFinite(height) || height <= 0 ||
            !Number.isFinite(width) || width <= 0 ||
            !Number.isFinite(centerX) || !Number.isFinite(centerY) ||
            !Array.isArray(block.regions)) {
          throw new Error(`dimensões ou matriz inválidas no bloco ${block.name || ''}`);
        }

        const regionByAlias = new Map();
        block.regions.forEach((region) => {
          const match = String(region?.rank || region?.code || region?.name || '').match(/L(\d+)/);
          const layer = Number(region?.layer || match?.[1]);
          const regionMatch = String(region?.code || region?.name || '').match(/L\d+-(\d+)/);
          const regionNumber = Number(region?.region || regionMatch?.[1]);
          const code = String(region?.code || region?.name || `L${layer}-${regionNumber}`);
          if (!Number.isInteger(layer) || layer < 1 || layer > 8 ||
              !Number.isInteger(regionNumber) || regionNumber < 1 ||
              !/^L\d+-\d+$/.test(code)) {
            throw new Error(`identificador ou rank inválido no bloco ${block.name}`);
          }
          const initialPieces = Array.isArray(region.initialPieces) ? region.initialPieces.map((piece) => {
            if (!piece || !['orange', 'blue'].includes(piece.team) ||
                !Object.prototype.hasOwnProperty.call(soldierWeights, piece.stage)) {
              throw new Error(`peça inicial inválida para ${code}`);
            }
            return { team: piece.team, stage: piece.stage };
          }) : [];
          const definition = {
            ...region,
            code,
            layer,
            region: regionNumber,
            initialPieces
          };
          regionDefinitions.set(code, definition);
          [region.identifier, region.id, region.name, region.code]
            .filter((alias) => typeof alias === 'string' && alias)
            .forEach((alias) => regionByAlias.set(alias, code));
        });

        const matrix = block.matrix.map((row) => row.map((entry) => {
          if (entry == null || entry === '') return null;
          const alias = typeof entry === 'object' ? entry.code || entry.identifier || entry.id : String(entry);
          const code = regionByAlias.get(alias) || (regionDefinitions.has(alias) ? alias : null);
          if (!code || !regionDefinitions.has(code)) {
            throw new Error(`a matriz do bloco ${block.name} referencia uma região desconhecida: ${alias}`);
          }
          return code;
        }));
        const positionsByCode = {};
        matrix.forEach((row, rowIndex) => row.forEach((code, columnIndex) => {
          if (!code) return;
          if (!positionsByCode[code]) positionsByCode[code] = [];
          positionsByCode[code].push(`${rowIndex + 1},${columnIndex + 1}`);
        }));
        block.regions.forEach((region) => {
          const code = regionByAlias.get(region.code || region.name || region.identifier || region.id);
          const positions = region.positions || region.posicoes;
          if (!code || !Array.isArray(positions)) return;
          const declared = positions.map((position) => {
            if (Array.isArray(position) && position.length === 2) return `${Number(position[0])},${Number(position[1])}`;
            if (position && typeof position === 'object') {
              return `${Number(position.row || position.linha)},${Number(position.column || position.coluna)}`;
            }
            return '';
          }).sort();
          const mapped = [...(positionsByCode[code] || [])].sort();
          if (declared.some((position) => !/^\d+,\d+$/.test(position)) ||
              declared.join('|') !== mapped.join('|')) {
            throw new Error(`as posições declaradas não correspondem à matriz M para ${code}`);
          }
        });
        const blockLeft = centerX - width / 2;
        const blockTop = centerY - height / 2;
        left = Math.min(left, blockLeft);
        top = Math.min(top, blockTop);
        right = Math.max(right, centerX + (size - 1) * width + width / 2);
        bottom = Math.max(bottom, centerY + (size - 1) * height + height / 2);
        blocks.push({
          name: String(block.name || ''),
          size,
          width,
          height,
          centerX,
          centerY,
          matrix,
          rotationEnabled: block.rotationEnabled !== false,
          regions: block.regions
        });
      });

      const tileColumns = Number(data.coordinateSystem?.tileColumns) || 226;
      const tileRows = Number(data.coordinateSystem?.tileRows) || 226;
      const tileSize = Number(data.coordinateSystem?.tileSize) || 4;
      const tileOffset = Number(data.coordinateSystem?.tileCenterOffset) || tileSize / 2;
      const displayScale = Number.isFinite(Number(data.displayScale))
        ? Math.min(2, Math.max(1, Number(data.displayScale)))
        : 1;
      const scale = Math.min(908 / (right - left), 908 / (bottom - top)) * displayScale;
      const viewOffsetX = Number(data.viewOffset?.x) || 0;
      const viewOffsetY = Number(data.viewOffset?.y) || 0;
      const offsetX = (908 - (right - left) * scale) / 2 - left * scale + viewOffsetX;
      const offsetY = (908 - (bottom - top) * scale) / 2 - top * scale + viewOffsetY;
      const matrices = {};
      const cellsByRegion = {};
      const cellOwners = {};

      blocks.forEach((block) => {
        matrices[block.name] = block.matrix.map((row) => [...row]);
        block.matrix.forEach((row, rowIndex) => {
          row.forEach((code, columnIndex) => {
            if (!code) return;
            const cellKey = `${block.name}:${rowIndex + 1}:${columnIndex + 1}`;
            if (cellOwners[cellKey]) throw new Error(`célula duplicada na matriz do bloco ${block.name}`);
            cellOwners[cellKey] = code;
            if (!cellsByRegion[code]) cellsByRegion[code] = [];
            cellsByRegion[code].push({
              block: block.name,
              row: rowIndex + 1,
              column: columnIndex + 1,
              x: offsetX + (block.centerX + rowIndex * block.width) * scale,
              y: offsetY + (block.centerY + columnIndex * block.height) * scale,
              width: block.width * scale,
              height: block.height * scale
            });
          });
        });
      });

      const masks = {};
      const geometry = {};
      Object.entries(cellsByRegion).forEach(([code, cells]) => {
        const definition = regionDefinitions.get(code);
        if (!definition) throw new Error(`faltam metadados para a região ${code}`);
        const layerName = String(definition.layer);
        if (!masks[layerName]) masks[layerName] = {};
        const tiles = new Set();
        cells.forEach((cell) => {
          const firstColumn = Math.max(0, Math.floor((cell.x - cell.width / 2) / tileSize));
          const lastColumn = Math.min(tileColumns - 1, Math.ceil((cell.x + cell.width / 2) / tileSize));
          const firstRow = Math.max(0, Math.floor((cell.y - cell.height / 2) / tileSize));
          const lastRow = Math.min(tileRows - 1, Math.ceil((cell.y + cell.height / 2) / tileSize));
          for (let row = firstRow; row <= lastRow; row += 1) {
            const y = row * tileSize + tileOffset;
            if (y < cell.y - cell.height / 2 || y >= cell.y + cell.height / 2) continue;
            for (let column = firstColumn; column <= lastColumn; column += 1) {
              const x = column * tileSize + tileOffset;
              if (x >= cell.x - cell.width / 2 && x < cell.x + cell.width / 2) {
                tiles.add(`${column},${row}`);
              }
            }
          }
        });
        masks[layerName][String(definition.region)] = [...tiles];
        geometry[code] = {
          block: cells[0].block,
          shape: 'quadrilateral',
          layer: definition.layer,
          centerX: cells.reduce((sum, cell) => sum + cell.x, 0) / cells.length,
          centerY: cells.reduce((sum, cell) => sum + cell.y, 0) / cells.length,
          cells,
          maxPieces: Number(definition.maxPieces) || definition.layer,
          farmProductionPerTurn: Number(definition.farmProductionPerTurn) || 0,
          bagCoins: Math.max(0, Number(definition.bagCoins) || 0),
          initialPieces: definition.initialPieces
        };
      });

      return {
        blocks,
        matrices,
        cellsByRegion,
        cellOwners,
        masks,
        geometry,
        campaign: data.campaign || null,
        scale,
        offsetX,
        offsetY,
        tileColumns,
        tileRows,
        tileSize,
        tileOffset
      };
    }

    function normalizeImportedRegionMasks(data) {
      quadrilateralBoard = null;
      if (['quadrilateral', 'mixed'].includes(data?.boardType)) {
        quadrilateralBoard = prepareQuadrilateralBoard(data);
        if (data.boardType === 'quadrilateral') return quadrilateralBoard.masks;
      }
      const normalized = data?.boardType === 'mixed'
        ? Object.fromEntries(Object.entries(quadrilateralBoard?.masks || {})
          .map(([layer, regions]) => [layer, { ...regions }]))
        : {};
      const addRegion = (layerKey, regionKey, regionValue) => {
        const layerName = String(layerKey);
        if (!normalized[layerName]) normalized[layerName] = {};

        if (Array.isArray(regionValue)) {
          normalized[layerName][String(regionKey)] = regionValue;
          return;
        }

        if (regionValue && typeof regionValue === 'object') {
          const tiles = Array.isArray(regionValue.tiles)
            ? regionValue.tiles
            : (Array.isArray(regionValue.points)
              ? regionValue.points
              : (Array.isArray(regionValue.regions) ? regionValue.regions : []));
          normalized[layerName][String(regionKey)] = tiles;
          return;
        }

        normalized[layerName][String(regionKey)] = [];
      };

      if (data && Array.isArray(data.blocks)) {
        const coordinateSystem = data.coordinateSystem || {};
        const tileColumns = Number(coordinateSystem.tileColumns) || 226;
        const tileRows = Number(coordinateSystem.tileRows) || 226;
        const tileSize = Number(coordinateSystem.tileSize) || 4;
        const tileOffset = Number(coordinateSystem.tileCenterOffset) || tileSize / 2;

        const expandRegionMaskRuns = (runs, region) => {
          if (!Array.isArray(runs)) {
            throw new Error(`máscara raster inválida para ${region.code || 'região'}`);
          }
          const tiles = [];
          runs.forEach((run) => {
            if (!Array.isArray(run) || run.length !== 3) {
              throw new Error(`linha de máscara inválida para ${region.code || 'região'}`);
            }
            const [row, firstColumn, lastColumn] = run.map(Number);
            if (![row, firstColumn, lastColumn].every(Number.isInteger)
              || row < 0 || row >= tileRows || firstColumn < 0
              || lastColumn < firstColumn || lastColumn >= tileColumns) {
              throw new Error(`limite de máscara inválido para ${region.code || 'região'}`);
            }
            for (let column = firstColumn; column <= lastColumn; column += 1) {
              tiles.push(`${column},${row}`);
            }
          });
          return tiles;
        };

        const rasterizeCircularRegion = (region, block) => {
          const geometry = region.geometry || region;
          const center = geometry.center || region.center || block.center;
          const innerRadius = Number(geometry.r1 ?? geometry.innerRadius) * (quadrilateralBoard?.scale || 1);
          const outerRadius = Number(geometry.r2 ?? geometry.outerRadius) * (quadrilateralBoard?.scale || 1);
          const startAngle = Number(geometry.g1 ?? geometry.startAngle);
          const endAngle = Number(geometry.g2 ?? geometry.endAngle);
          const span = endAngle - startAngle;

          if (!center || !Number.isFinite(Number(center.x)) || !Number.isFinite(Number(center.y))
            || !Number.isFinite(innerRadius) || !Number.isFinite(outerRadius)
            || !Number.isFinite(startAngle) || !Number.isFinite(endAngle)
            || innerRadius < 0 || outerRadius <= innerRadius || span <= 0 || span > 360) {
            throw new Error(`geometria circular inválida para ${region.code || 'região'}`);
          }

          const centerX = (quadrilateralBoard?.offsetX || 0) + Number(center.x) * (quadrilateralBoard?.scale || 1);
          const centerY = (quadrilateralBoard?.offsetY || 0) + Number(center.y) * (quadrilateralBoard?.scale || 1);
          const tiles = [];
          for (let row = 0; row < tileRows; row += 1) {
            const y = row * tileSize + tileOffset;
            for (let column = 0; column < tileColumns; column += 1) {
              const x = column * tileSize + tileOffset;
              const dx = x - centerX;
              const dy = centerY - y;
              const radius = Math.hypot(dx, dy);
              if (radius < innerRadius || radius > outerRadius) continue;

              if (span < 360) {
                const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
                const relativeAngle = (angle - startAngle % 360 + 360) % 360;
                if (relativeAngle >= span) continue;
              }
              tiles.push(`${column},${row}`);
            }
          }
          return tiles;
        };

        data.blocks.forEach((block) => {
          if (!block || typeof block !== 'object' || !Array.isArray(block.regions)) return;
          if (block.type === 'quadrilateral' && quadrilateralBoard) return;
          block.regions.forEach((region) => {
            if (!region || typeof region !== 'object') return;
            const layerKey = region.layer ?? region.rank ?? (typeof region.code === 'string' ? region.code.match(/^L(\d+)/)?.[1] : null);
            const regionKey = region.region ?? region.index ?? region.number ?? (typeof region.code === 'string' ? region.code.split('-').slice(1).join('-') : null);
            if (layerKey == null || regionKey == null) return;
            const tiles = Array.isArray(region.tiles)
              ? region.tiles
              : (Array.isArray(region.maskRuns)
                ? expandRegionMaskRuns(region.maskRuns, region)
                : (Array.isArray(region.points)
                  ? region.points
                  : rasterizeCircularRegion(region, block)));
            addRegion(layerKey, regionKey, tiles);
          });
        });
      }

      const rawSource = data && (data.allRegionMasks || data.layers || data.regions || data);
      if (!rawSource || typeof rawSource !== 'object') {
        return Object.keys(normalized).length ? normalized : null;
      }

      const layerEntries = Object.entries(rawSource).filter(([layerKey]) => /^\d+$/.test(String(layerKey)));
      if (!layerEntries.length && !Object.keys(normalized).length) {
        return null;
      }

      layerEntries.forEach(([layerKey, layerValue]) => {
        if (!layerValue || typeof layerValue !== 'object') {
          normalized[layerKey] = normalized[layerKey] || {};
          return;
        }

        Object.entries(layerValue).forEach(([regionKey, regionValue]) => {
          addRegion(layerKey, regionKey, regionValue);
        });
      });

      return normalized;
    }

    function normalizeImportedRegionGeometry(data) {
      if (data?.boardType === 'quadrilateral') return quadrilateralBoard?.geometry || {};
      const normalized = data?.boardType === 'mixed'
        ? { ...(quadrilateralBoard?.geometry || {}) }
        : {};
      if (!data || !Array.isArray(data.blocks)) return normalized;

      data.blocks.forEach((block) => {
        if (!block || typeof block !== 'object' || !Array.isArray(block.regions)) return;
        if (block.type === 'quadrilateral' && data.boardType === 'mixed') return;
        const center = block.center || {};
        block.regions.forEach((region) => {
          if (!region || typeof region !== 'object') return;
          const rankMatch = String(region.rank || region.code || region.name || '').match(/L(\d+)/);
          const layer = Number(region.layer || rankMatch?.[1]);
          const regionMatch = String(region.code || region.name || '').match(/L\d+-(\d+)/);
          const regionNumber = Number(region.region || regionMatch?.[1]);
          const code = region.code || region.name || `L${layer}-${regionNumber}`;
          const geometry = region.geometry || region;
          const regionCenter = geometry.center || region.center || center;
          const boardScale = data.boardType === 'mixed' ? quadrilateralBoard?.scale || 1 : 1;
          const boardOffsetX = data.boardType === 'mixed' ? quadrilateralBoard?.offsetX || 0 : 0;
          const boardOffsetY = data.boardType === 'mixed' ? quadrilateralBoard?.offsetY || 0 : 0;
          const regionGeometry = {
            shape: String(geometry.shape || region.shape || 'circular'),
            block: String(region.block || block.name || ''),
            disco: getRegionDiskName(region),
            layer,
            region: regionNumber,
            centerX: boardOffsetX + Number(regionCenter.x) * boardScale,
            centerY: boardOffsetY + Number(regionCenter.y) * boardScale,
            innerRadius: Number(geometry.r1 ?? geometry.innerRadius) * boardScale,
            outerRadius: Number(geometry.r2 ?? geometry.outerRadius) * boardScale,
            startAngle: Number(geometry.g1 ?? geometry.startAngle),
            endAngle: Number(geometry.g2 ?? geometry.endAngle),
            maxPieces: Number(region.maxPieces)
          };

          if (!Number.isInteger(layer) || layer < 1 || layer > 8 ||
              !Number.isInteger(regionNumber) || regionNumber < 1 ||
              !Number.isFinite(regionGeometry.centerX) || !Number.isFinite(regionGeometry.centerY) ||
              !Number.isFinite(regionGeometry.innerRadius) || regionGeometry.innerRadius < 0 ||
              !Number.isFinite(regionGeometry.outerRadius) || regionGeometry.outerRadius <= regionGeometry.innerRadius ||
              !Number.isFinite(regionGeometry.startAngle) || !Number.isFinite(regionGeometry.endAngle) ||
              regionGeometry.endAngle <= regionGeometry.startAngle ||
              regionGeometry.endAngle - regionGeometry.startAngle > 360 ||
              !Number.isFinite(regionGeometry.maxPieces) || regionGeometry.maxPieces < 1) {
            throw new Error(`metadados geométricos inválidos para ${code}`);
          }

          normalized[code] = {
            ...regionGeometry,
            farmProductionPerTurn: Number(region.farmProductionPerTurn) || 0,
            bagCoins: Math.max(0, Number(region.bagCoins) || 0),
            initialPieces: Array.isArray(region.initialPieces) ? region.initialPieces.map((piece) => {
              if (!piece || !['orange', 'blue'].includes(piece.team) ||
                  !Object.prototype.hasOwnProperty.call(soldierWeights, piece.stage)) {
                throw new Error(`peça inicial inválida para ${code}`);
              }
              return { team: piece.team, stage: piece.stage };
            }) : []
          };
        });
      });

      return normalized;
    }

    function getRankColor(layer) {
      return {
        1: '#ffffff',
        2: '#ee82ee',
        3: '#4b0082',
        4: '#0000ff',
        5: '#008000',
        6: '#ffff00',
        7: '#ffa500',
        8: '#ff0000'
      }[layer] || '#ffffff';
    }

    function rotateQuadrilateralBlocksForLayer(layerNumber, direction) {
      if (!quadrilateralBoard || !currentBoardData) return false;
      const rotatableNames = quadrilateralBoard.blocks
        .filter((block) => block.rotationEnabled && block.regions.some((region) =>
          Number(region.layer || String(region.rank || region.code || region.name).match(/L(\d+)/)?.[1]) === layerNumber))
        .map((block) => block.name);
      if (!rotatableNames.length) return false;

      rotatableNames.forEach((blockName) => {
        const matrix = rotateQuadrilateralMatrix(quadrilateralBoard.matrices[blockName], direction);
        const sourceBlock = currentBoardData.blocks.find((block) => String(block.name || '') === blockName);
        if (!sourceBlock) throw new Error(`bloco quadricular ausente: ${blockName}`);
        sourceBlock.matrix = matrix;
        const positionsByCode = {};
        matrix.forEach((row, rowIndex) => row.forEach((code, columnIndex) => {
          if (!code) return;
          if (!positionsByCode[code]) positionsByCode[code] = [];
          positionsByCode[code].push([rowIndex + 1, columnIndex + 1]);
        }));
        sourceBlock.regions.forEach((region) => {
          const code = region.code || region.name || region.identifier || region.id;
          const propertyName = Array.isArray(region.posicoes) ? 'posicoes' : 'positions';
          region[propertyName] = positionsByCode[code] || [];
        });
      });

      applyRegionData(currentBoardData);
      return true;
    }

    function getCircularRegionPath(geometry) {
      const { centerX, centerY, innerRadius, outerRadius, startAngle, endAngle } = geometry;
      const span = endAngle - startAngle;
      const pointAt = (radius, angle) => {
        const radians = angle * Math.PI / 180;
        return {
          x: centerX + radius * Math.cos(radians),
          y: centerY - radius * Math.sin(radians)
        };
      };

      if (span >= 360) {
        if (innerRadius === 0) return null;
        return [
          `M ${centerX + outerRadius} ${centerY}`,
          `A ${outerRadius} ${outerRadius} 0 1 0 ${centerX - outerRadius} ${centerY}`,
          `A ${outerRadius} ${outerRadius} 0 1 0 ${centerX + outerRadius} ${centerY}`,
          `M ${centerX + innerRadius} ${centerY}`,
          `A ${innerRadius} ${innerRadius} 0 1 1 ${centerX - innerRadius} ${centerY}`,
          `A ${innerRadius} ${innerRadius} 0 1 1 ${centerX + innerRadius} ${centerY}`,
          'Z'
        ].join(' ');
      }

      const outerStart = pointAt(outerRadius, startAngle);
      const outerEnd = pointAt(outerRadius, endAngle);
      const largeArc = span > 180 ? 1 : 0;
      const path = [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}`
      ];

      if (innerRadius === 0) {
        path.push(`L ${centerX} ${centerY}`, 'Z');
      } else {
        const innerEnd = pointAt(innerRadius, endAngle);
        const innerStart = pointAt(innerRadius, startAngle);
        path.push(
          `L ${innerEnd.x} ${innerEnd.y}`,
          `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`,
          'Z'
        );
      }
      return path.join(' ');
    }

    function getQuadrilateralRegionPath(geometry) {
      return geometry.cells.map((cell) => {
        const left = cell.x - cell.width / 2;
        const top = cell.y - cell.height / 2;
        const right = left + cell.width;
        const bottom = top + cell.height;
        return `M ${left} ${top} H ${right} V ${bottom} H ${left} Z`;
      }).join(' ');
    }

    function getRegionFocusPathData(geometry) {
      if (geometry.shape === 'quadrilateral') return getQuadrilateralRegionPath(geometry);
      const path = getCircularRegionPath(geometry);
      if (path) return path;
      const { centerX, centerY, outerRadius } = geometry;
      return [
        `M ${centerX + outerRadius} ${centerY}`,
        `A ${outerRadius} ${outerRadius} 0 1 0 ${centerX - outerRadius} ${centerY}`,
        `A ${outerRadius} ${outerRadius} 0 1 0 ${centerX + outerRadius} ${centerY}`,
        'Z'
      ].join(' ');
    }

    function updateBoardFocusOverlay() {
      if (!boardFocusOverlay) return;
      const svgNamespace = 'http://www.w3.org/2000/svg';
      const warRegions = [...new Set(warSpotlightRegionCodes)]
        .filter((code) => Object.prototype.hasOwnProperty.call(regionGeometryByCode, code));
      const selectedRegion = !warRegions.length && selectedRegionCode &&
        Object.prototype.hasOwnProperty.call(regionGeometryByCode, selectedRegionCode)
        ? selectedRegionCode
        : null;
      const focusRegions = [...new Set([...warRegions, ...(selectedRegion ? [selectedRegion] : [])])];
      boardFocusMaskHoles.replaceChildren();
      boardFocusOutlines.replaceChildren();
      boardFocusDim.style.display = warRegions.length ? '' : 'none';

      warRegions.forEach((regionCode) => {
        const geometry = regionGeometryByCode[regionCode];
        const path = document.createElementNS(svgNamespace, 'path');
        path.setAttribute('d', getRegionFocusPathData(geometry));
        path.dataset.regionCode = regionCode;
        const rotationCenter = getRegionRotationCenter(regionCode);
        path.setAttribute(
          'transform',
          `rotate(${getRegionVisualRotation(regionCode)} ${rotationCenter.x} ${rotationCenter.y})`
        );
        boardFocusMaskHoles.appendChild(path);
      });

      focusRegions.forEach((regionCode) => {
        const geometry = regionGeometryByCode[regionCode];
        const isWarRegion = warRegions.includes(regionCode);
        const pathData = getRegionFocusPathData(geometry);
        const rotationCenter = getRegionRotationCenter(regionCode);
        const transform = `rotate(${getRegionVisualRotation(regionCode)} ${rotationCenter.x} ${rotationCenter.y})`;
        const outerOutline = document.createElementNS(svgNamespace, 'path');
        outerOutline.setAttribute('d', pathData);
        outerOutline.dataset.regionCode = regionCode;
        outerOutline.setAttribute('transform', transform);
        outerOutline.setAttribute(
          'class',
          `board-focus-outline ${isWarRegion ? 'is-war-outer' : 'is-selected-outer'}`
        );
        boardFocusOutlines.appendChild(outerOutline);

        const innerOutline = document.createElementNS(svgNamespace, 'path');
        innerOutline.setAttribute('d', pathData);
        innerOutline.dataset.regionCode = regionCode;
        innerOutline.setAttribute('transform', transform);
        innerOutline.setAttribute(
          'class',
          `board-focus-outline ${isWarRegion ? 'is-war-inner' : 'is-selected-inner'}`
        );
        boardFocusOutlines.appendChild(innerOutline);
      });
    }

    function updateBoardFocusOverlayTransforms(layerNumber) {
      [boardFocusMaskHoles, boardFocusOutlines].forEach((container) => {
        [...container.children].forEach((path) => {
          const regionCode = path.dataset.regionCode;
          const geometry = regionGeometryByCode[regionCode];
          if (!geometry || geometry.layer !== layerNumber) return;
          const rotationCenter = getRegionRotationCenter(regionCode);
          path.setAttribute(
            'transform',
            `rotate(${getRegionVisualRotation(regionCode)} ${rotationCenter.x} ${rotationCenter.y})`
          );
        });
      });
    }

    function appendCampaignBagIcon(layerElement, code, geometry, svgNamespace, iconScale) {
      if (!geometry.bagCoins || campaignCollectedBags.includes(code)) return;
      const icon = document.createElementNS(svgNamespace, 'g');
      const angle = ((geometry.startAngle + geometry.endAngle) / 2) * Math.PI / 180;
      const radius = (geometry.innerRadius + geometry.outerRadius) / 2;
      const centerX = geometry.shape === 'circular'
        ? geometry.centerX + radius * Math.cos(angle)
        : geometry.centerX;
      const centerY = geometry.shape === 'circular'
        ? geometry.centerY - radius * Math.sin(angle)
        : geometry.centerY;
      icon.setAttribute('transform', `translate(${centerX} ${centerY}) scale(${iconScale})`);
      icon.setAttribute('pointer-events', 'none');
      icon.dataset.region = code;
      icon.setAttribute('aria-label', `Saco com ${geometry.bagCoins} moedas`);
      const sack = document.createElementNS(svgNamespace, 'path');
      sack.setAttribute('d', 'M-7 -11 Q0 -7 7 -11 L5 -5 Q12 1 10 9 Q8 15 0 15 Q-8 15 -10 9 Q-12 1 -5 -5 Z');
      sack.setAttribute('fill', '#a56b31');
      sack.setAttribute('stroke', '#54351f');
      sack.setAttribute('stroke-width', '1.5');
      icon.appendChild(sack);
      const tie = document.createElementNS(svgNamespace, 'path');
      tie.setAttribute('d', 'M-5 -6 Q0 -3 5 -6 M-3 -10 Q0 -7 3 -10');
      tie.setAttribute('fill', 'none');
      tie.setAttribute('stroke', '#f2d18a');
      tie.setAttribute('stroke-width', '1.5');
      icon.appendChild(tie);
      const coin = document.createElementNS(svgNamespace, 'circle');
      coin.setAttribute('cx', '0');
      coin.setAttribute('cy', '5');
      coin.setAttribute('r', '4');
      coin.setAttribute('fill', '#f6d65b');
      coin.setAttribute('stroke', '#805b1d');
      coin.setAttribute('stroke-width', '1');
      icon.appendChild(coin);
      const title = document.createElementNS(svgNamespace, 'title');
      title.textContent = `Saco em ${code}: ${geometry.bagCoins} moedas`;
      icon.appendChild(title);
      layerElement.appendChild(icon);
    }

    function renderBoardLayers() {
      const svgNamespace = 'http://www.w3.org/2000/svg';
      const farmTiers = [250, 1000, 4000, 16000, 50000];
      const iconScale = 908 / ((stagePanel.getBoundingClientRect().width || 780) * Math.max(1, stageZoom));
      boardLayerElements.forEach((layerElement, layer) => {
        if (getCircularBlocks().length) layerElement.style.transform = 'rotate(0deg)';
        layerElement.replaceChildren();
        const regions = Object.entries(regionGeometryByCode)
          .filter(([, geometry]) => geometry.layer === layer)
          .sort((left, right) => (left[1].startAngle || 0) - (right[1].startAngle || 0));
        const circularGroups = new Map();
        const getRegionRenderLayer = (geometry) => {
          const diskKey = getRegionCircularDiskKey(geometry);
          if (!diskKey) {
            return layerElement;
          }
          if (!circularGroups.has(diskKey)) {
            const group = document.createElementNS(svgNamespace, 'g');
            const angle = getCircularDiskRotation(geometry.block, geometry.disco, layer);
            group.setAttribute(
              'transform',
              `rotate(${angle} ${geometry.centerX} ${geometry.centerY})`
            );
            group.dataset.circularRotationGroup = diskKey;
            group.dataset.rotationBlock = geometry.block;
            group.dataset.disco = geometry.disco;
            group.dataset.centerX = String(geometry.centerX);
            group.dataset.centerY = String(geometry.centerY);
            layerElement.appendChild(group);
            circularGroups.set(diskKey, group);
          }
          return circularGroups.get(diskKey);
        };

        regions.forEach(([code, geometry]) => {
          const pathData = geometry.shape === 'quadrilateral'
            ? getQuadrilateralRegionPath(geometry)
            : getCircularRegionPath(geometry);
          const shape = document.createElementNS(svgNamespace, pathData ? 'path' : 'circle');
          if (pathData) {
            shape.setAttribute('d', pathData);
          } else {
            shape.setAttribute('cx', String(geometry.centerX));
            shape.setAttribute('cy', String(geometry.centerY));
            shape.setAttribute('r', String(geometry.outerRadius));
          }
          shape.setAttribute('fill', getRankColor(layer));
          shape.setAttribute('stroke', '#000000');
          shape.setAttribute('stroke-width', '2');
          shape.setAttribute('vector-effect', 'non-scaling-stroke');
          shape.dataset.region = code;
          getRegionRenderLayer(geometry).appendChild(shape);
        });

        regions.forEach(([code, geometry]) => {
          const renderLayer = getRegionRenderLayer(geometry);
          if (geometry.shape === 'quadrilateral') {
            appendCampaignBagIcon(renderLayer, code, geometry, svgNamespace, iconScale);
            return;
          }
          const production = Math.max(0, Number(geometry.farmProductionPerTurn) || 0);
          if (!production) {
            appendCampaignBagIcon(renderLayer, code, geometry, svgNamespace, iconScale);
            return;
          }
          const tier = Math.max(1, Math.min(5, farmTiers.findIndex((value) => production <= value) + 1));
          const angle = ((geometry.startAngle + geometry.endAngle) / 2) * Math.PI / 180;
          const radius = (geometry.innerRadius + geometry.outerRadius) / 2;
          const centerX = geometry.centerX + radius * Math.cos(angle);
          const centerY = geometry.centerY - radius * Math.sin(angle);
          const icon = document.createElementNS(svgNamespace, 'g');
          icon.setAttribute('transform', `translate(${centerX} ${centerY}) scale(${iconScale})`);
          icon.setAttribute('aria-label', `Fazenda: ${formatStatisticsNumber(production)} trigo por turno`);
          icon.setAttribute('pointer-events', 'none');
          icon.dataset.region = code;

          const background = document.createElementNS(svgNamespace, 'circle');
          background.setAttribute('r', '15');
          background.setAttribute('fill', ['#fff2bf', '#f7e8a4', '#eed77d', '#e8c44e', '#dcad2c'][tier - 1]);
          background.setAttribute('stroke', '#634c1d');
          background.setAttribute('stroke-width', '1.5');
          icon.appendChild(background);

          const field = document.createElementNS(svgNamespace, 'path');
          field.setAttribute('d', 'M-10 9 Q0 5 10 9');
          field.setAttribute('fill', 'none');
          field.setAttribute('stroke', '#546b35');
          field.setAttribute('stroke-width', '1.7');
          field.setAttribute('stroke-linecap', 'round');
          icon.appendChild(field);

          const stalkXs = [-7, -3.5, 0, 3.5, 7].slice(0, tier);
          stalkXs.forEach((x, index) => {
            const stalk = document.createElementNS(svgNamespace, 'path');
            const topY = -8 + Math.abs(index - (tier - 1) / 2) * 1.2;
            stalk.setAttribute('d', `M${x} 7 Q${x - 1} 0 ${x} ${topY}`);
            stalk.setAttribute('fill', 'none');
            stalk.setAttribute('stroke', '#526c31');
            stalk.setAttribute('stroke-width', '1.6');
            stalk.setAttribute('stroke-linecap', 'round');
            icon.appendChild(stalk);

            const grain = document.createElementNS(svgNamespace, 'ellipse');
            grain.setAttribute('cx', String(x));
            grain.setAttribute('cy', String(topY));
            grain.setAttribute('rx', '1.8');
            grain.setAttribute('ry', '2.8');
            grain.setAttribute('fill', '#9a6a1b');
            grain.setAttribute('transform', `rotate(-28 ${x} ${topY})`);
            icon.appendChild(grain);
          });

          const title = document.createElementNS(svgNamespace, 'title');
          title.textContent = `Fazenda em ${code}: ${formatStatisticsNumber(production)} trigo por turno`;
          icon.appendChild(title);
          renderLayer.appendChild(icon);
          appendCampaignBagIcon(renderLayer, code, geometry, svgNamespace, iconScale);
        });
      });
      updateBoardFocusOverlay();
    }

    function normalizeImportedRegionProbeBoxes(data) {
      const incoming = data && data.regionProbeBoxes;
      if (!incoming || typeof incoming !== 'object') {
        return {};
      }

      const normalized = {};
      Object.entries(incoming).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          normalized[key] = value.map((box) => ({ ...box }));
          return;
        }
        if (value && typeof value === 'object' && Array.isArray(value.boxes)) {
          normalized[key] = value.boxes.map((box) => ({ ...box }));
        }
      });
      return normalized;
    }

    function exportGameDebugLog() {
      const snapshot = buildDebugExportPayload();
      console.log('DEBUG_LOG', snapshot);
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `will-of-many-debug-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      debugStatus.textContent = 'JSON de debug exportado com caixas de vizinhança.';
    }

    function applyRegionData(data) {
      currentBoardData = data;
      const normalizedMasks = normalizeImportedRegionMasks(data);
      const importedProbeBoxes = normalizeImportedRegionProbeBoxes(data);

      if (!normalizedMasks || !Object.keys(normalizedMasks).length) {
        throw new Error('o JSON não contém uma estrutura de regiões válida');
      }

      regionGeometryByCode = normalizeImportedRegionGeometry(data);
      const nextCampaignBoardConfig = data?.campaign && typeof data.campaign === 'object'
        ? {
          ...data.campaign,
          objectiveRegions: Array.isArray(data.campaign.objectiveRegions)
            ? data.campaign.objectiveRegions.filter((code) =>
              Object.prototype.hasOwnProperty.call(regionGeometryByCode, code))
            : Object.entries(regionGeometryByCode)
              .filter(([, geometry]) => geometry.initialPieces.some((piece) => piece.team === 'blue'))
              .map(([code]) => code)
        }
        : null;
      if (nextCampaignBoardConfig?.id !== campaignBoardConfig?.id) campaignCollectedBags = [];
      campaignBoardConfig = nextCampaignBoardConfig;
      if (!isGameStarted) initializeCircularDiskRotations();
      renderCircularRotationControls();
      renderBoardLayers();
      allRegionMasks = normalizedMasks;
      regionNeighborCache = {};
      Object.entries(allRegionMasks).forEach(([layer, regions]) => {
        Object.keys(regions || {}).forEach((region) => ensureRegionStats(Number(layer), Number(region)));
      });

      Object.entries(importedProbeBoxes).forEach(([regionCode, boxes]) => {
        regionProbeBoxes[regionCode] = Array.isArray(boxes) ? boxes.map((box) => ({ ...box })) : [];
      });

      const layer8Regions = allRegionMasks['8'] || {};
      if (!layer8Regions || !Object.keys(layer8Regions).length) {
        throw new Error('o JSON não contém regiões de L8');
      }

      regionMasks = layer8Regions;
      const counts = Object.entries(regionMasks).map(([region, tiles]) => `L8-${region}: ${Array.isArray(tiles) ? tiles.length : 0}`).join(' · ');
      debugStatus.textContent = data?.boardType === 'quadrilateral'
        ? `JSON carregado · ${data.campaign?.name || 'tabuleiro quadricular'} · ${Object.keys(regionGeometryByCode).length} regiões`
        : `JSON carregado · ${counts}`;
      drawRegionDebug();
      Object.entries(regionMasks).forEach(([region, tiles]) => {
        if (!regionSlots[8]) regionSlots[8] = {};
        regionSlots[8][region] = getSafeSlots(8, Number(region), false);
      });
      for (let layer = 1; layer <= 8; layer += 1) {
        if (allRegionMasks[layer]) {
          rebuildRegionSlotsForLayer(layer);
          recomputeNeighborCacheForLayer(layer);
        }
      }
      updateActiveRegions();
      resetCombatRegions();
      if (!isGameStarted) {
        humanTeam = 'orange';
        aiTeam = 'blue';
        gameSpeed = 1;
        resetGameState();
        placeBoardInitialPieces();
        for (let layer = 1; layer <= 8; layer += 1) {
          if (allRegionMasks[layer]) recomputeNeighborCacheForLayer(layer);
        }
      }
      renderPiecePurchaseButtons();
      recalculateRegionForces();
      refreshRegionVisuals();
      updateSelectedRegionPanel(selectedRegionCode);
      updateReadout();
      updateTurnState();
      updateWarAvailability();
      if ((gameMode === 'ai' || isCampaignGame()) && isGameStarted && currentTeam === aiTeam) scheduleAiTurn();
      startOnlineMatchWhenReady();
    }

    async function loadBoardFile(fileName) {
      if (location.protocol === 'file:' && window.AndroidBluetooth?.readGameAsset) {
        const boardJson = window.AndroidBluetooth.readGameAsset(fileName);
        if (!boardJson) throw new Error(`O Android não encontrou ${fileName} nos recursos do aplicativo.`);
        applyRegionData(JSON.parse(boardJson));
        return;
      }
      const response = await fetch(fileName);
      if (!response.ok) throw new Error(`${fileName}: HTTP ${response.status}`);
      applyRegionData(await response.json());
    }

    async function loadRegionMasks() {
      const candidates = ['regioes-will-of-many-circular.json', 'will-of-many-final.json', 'regioes-will-of-many.json'];
      if (location.protocol === 'file:' && window.AndroidBluetooth?.readGameAsset) {
        try {
          const regionJson = window.AndroidBluetooth.readGameAsset(candidates[0]);
          if (!regionJson) {
            throw new Error(`O Android não conseguiu ler ${candidates[0]} dos recursos instalados.`);
          }
          applyRegionData(JSON.parse(regionJson));
          debugStatus.textContent = `JSON carregado · ${candidates[0]} (Android)`;
          return;
        } catch (error) {
          const message = `Falha ao carregar o tabuleiro no Android: ${error.message}`;
          debugStatus.textContent = message;
          readout.textContent = message;
          console.error(message, error);
          return;
        }
      }

      let loadedFile = null;
      let lastLoadError = null;
      for (const fileName of candidates) {
        try {
          const response = await fetch(fileName);
          if (!response.ok) {
            lastLoadError = new Error(`${fileName}: HTTP ${response.status}`);
            continue;
          }
          loadedFile = fileName;
          applyRegionData(await response.json());
          debugStatus.textContent = `JSON carregado · ${loadedFile}`;
          return;
        } catch (error) {
          lastLoadError = error;
        }
      }
      const message = `JSON do tabuleiro não carregado automaticamente.${lastLoadError ? ` Último erro: ${lastLoadError.message}` : ''} Use Carregar JSON.`;
      debugStatus.textContent = message;
      readout.textContent = message;
      console.error(message, lastLoadError);
    }

    for (let index = 0; index < 8; index += 1) {
      const layer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      layer.setAttribute('class', 'layer');
      layer.setAttribute('viewBox', '0 0 908 908');
      layer.setAttribute('aria-hidden', 'true');
      layer.dataset.layer = String(index + 1);
      layer.style.zIndex = index + 1;
      stage.insertBefore(layer, pieces);
      const layerNumber = index + 1;
      boardLayerElements.set(layerNumber, layer);
      const layerControls = document.createElement('div');
      layerControls.className = 'layer-controls';
      layerControls.dataset.layer = String(layerNumber);
      ['right', 'left'].forEach((direction) => {
        const button = document.createElement('button');
        button.className = 'layer-button';
        button.type = 'button';
        button.dataset.layer = String(layerNumber);
        button.dataset.direction = direction;
        button.textContent = `L${layerNumber} ${direction === 'right' ? '→' : '←'}`;
        button.setAttribute('aria-label', `Girar disco L${layerNumber} para a ${direction === 'left' ? 'esquerda' : 'direita'}`);
        button.disabled = getRotationStep(layerNumber) <= 0;
        button.addEventListener('click', () => {
          if (!canRotateLayer(layerNumber)) {
            readout.textContent = hasRotatedThisTurn
              ? 'Você já girou um disco neste turn.'
              : `L${layerNumber}: disco indisponível neste turn.`;
            return;
          }
          controls.classList.remove('is-rotation-picker-open');
          app.classList.remove('is-rotation-picker-open');
          const step = getRotationStep(layerNumber);
          if (quadrilateralBoard?.blocks.some((block) => block.rotationEnabled &&
              block.regions.some((region) =>
                Number(region.layer || String(region.rank || region.code || region.name).match(/L(\d+)/)?.[1]) === layerNumber))) {
            resetStageZoom();
            playRotationSound();
            if (!rotateQuadrilateralBlocksForLayer(layerNumber, direction)) return;
            rotationAnimationVersion += 1;
            hasRotatedThisTurn = true;
            lastRotatedLayer = layerNumber;
            lastRotatedBy = currentTeam;
            rotationLockTurn = currentTurn + 1;
            updateRotationControls();
            recalculateRegionForces();
            refreshRegionVisuals();
            updateSelectedRegionPanel(selectedRegionCode);
            updateReadout();
            saveGame();
            publishBluetoothAction({
              type: 'rotate',
              team: currentTeam,
              layer: layerNumber,
              direction
            });
            finishIfCenterConquered();
            return;
          }
          if (currentBoardData?.boardType === 'mixed' &&
              Object.values(regionGeometryByCode).some((geometry) =>
                geometry.layer === layerNumber && geometry.shape === 'circular')) {
            resetStageZoom();
            stagePanel.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            playRotationSound();
            const rotationDelta = direction === 'left' ? -step : step;
            const previousRotation = rotations[index];
            const startingPiecePositions = captureMixedCircularPiecePositions(layerNumber);
            rotations[index] += rotationDelta;
            rotationAnimationVersion += 1;
            hasRotatedThisTurn = true;
            lastRotatedLayer = layerNumber;
            lastRotatedBy = currentTeam;
            rotationLockTurn = currentTurn + 1;
            if (isCampaignLevelTwo() &&
                ['level2-rotate', 'level2-rotate-again'].includes(campaignGuideStep)) {
              hideCampaignGuide();
              campaignGuideStep = 'await-circular';
            }
            updateRotationControls();
            recomputeNeighborCacheForLayer(layerNumber);
            recalculateRegionForces();
            refreshRegionVisuals();
            animateMixedCircularBlocks(
              layerNumber,
              previousRotation,
              rotations[index],
              rotationAnimationVersion,
              startingPiecePositions
            );
            updateBoardFocusOverlay();
            updateSelectedRegionPanel(selectedRegionCode);
            updateReadout();
            saveGame();
            publishBluetoothAction({
              type: 'rotate',
              team: currentTeam,
              layer: layerNumber,
              direction
            });
            finishIfCenterConquered();
            return;
          }
          resetStageZoom();
          stagePanel.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
          playRotationSound();
          document.querySelectorAll('.layer').forEach((item) => item.classList.remove('heavy-rotation'));
          layer.classList.add('heavy-rotation');
          heavyRotationLayer = layerNumber;
          pieces.querySelectorAll(`.piece[data-layer="${layerNumber}"]`).forEach((piece) => {
            piece.classList.add('heavy-rotation');
            piece.dataset.rotationStartLeft = piece.style.left;
            piece.dataset.rotationStartTop = piece.style.top;
            piece.dataset.rotationStartTransform = piece.style.transform;
          });
          void pieces.offsetWidth;
          const rotationDelta = direction === 'left' ? -step : step;
          const previousRotation = rotations[index];
          rotations[index] += rotationDelta;
          rotationAnimationVersion += 1;
          hasRotatedThisTurn = true;
          lastRotatedLayer = layerNumber;
          lastRotatedBy = currentTeam;
          rotationLockTurn = currentTurn + 1;
          updateRotationControls();
        syncLayerTransforms();
          if (index === 7) {
            updateActiveRegions();
            updateL8AttachedLayers();
          }
        // If debug canvas is showing this layer's regions, rotate it too
        if (!debugCanvas.classList.contains('is-hidden') && currentDebugLayer === index + 1) {
          updateDebugCanvasRotation();
        }
          document.querySelectorAll('.layer-button').forEach((item) => item.classList.remove('is-active'));
          document.querySelectorAll(`.layer-button[data-layer="${layerNumber}"]`).forEach((item) => item.classList.add('is-active'));

          const rotatedLayer = index + 1;
          rebuildRegionSlotsForLayer(rotatedLayer);
          recomputeNeighborCacheForLayer(rotatedLayer);
          recalculateRegionForces();
          refreshRegionVisuals();
          pieces.querySelectorAll(`.piece[data-layer="${layerNumber}"]`).forEach((piece) => {
            piece.dataset.rotationTargetLeft = piece.style.left;
            piece.dataset.rotationTargetTop = piece.style.top;
            piece.dataset.rotationTargetTransform = piece.style.transform;
          });
          animatePieceLayer(layerNumber, rotationDelta, previousRotation, rotations[index]);
          if (selectedRegionCode) {
            updateSelectedRegionPanel(selectedRegionCode);
          }
        // Update debug canvas if visible
          if (!debugCanvas.classList.contains('is-hidden')) {
            currentDebugLayer = index + 1;
            regionMasks = allRegionMasks ? allRegionMasks[index + 1] : null;
            drawRegionDebug();
            updateDebugCanvasRotation();
          }
          updateReadout();
          publishBluetoothAction({
            type: 'rotate',
            team: currentTeam,
            layer: layerNumber,
            direction,
            source: selectedRegionCode
          });
          window.setTimeout(() => {
            stagePanel.classList.remove('heavy-shake');
            void stagePanel.offsetWidth;
            stagePanel.classList.add('heavy-shake');
          }, 3000);
          window.setTimeout(() => {
            layer.classList.remove('heavy-rotation');
            heavyRotationLayer = null;
            pieces.querySelectorAll('.piece.heavy-rotation').forEach((piece) => piece.classList.remove('heavy-rotation'));
          }, 3100);
        });
        layerControls.appendChild(button);
      });
      controls.appendChild(layerControls);
    }
    document.querySelectorAll('.layer-button[data-layer="8"]').forEach((button) => button.classList.add('is-active'));
    updateRotationControls();
    renderPiecePurchaseButtons();
    rotatePickerButton.addEventListener('click', () => {
      controls.classList.add('is-rotation-picker-open');
      app.classList.add('is-rotation-picker-open');
      const circularBlocks = getRotatableCircularBlocks();
      selectedCircularRotationBlock = circularBlocks.length === 1
        ? circularBlocks[0].name
        : null;
      updateCircularRotationBlockPicker(circularBlocks);
      campaignGuide.classList.toggle('is-rotation-picker-open',
        ['level2-rotate', 'level2-rotate-again'].includes(campaignGuideStep));
      rotationPickerClose.focus({ preventScroll: true });
      updateCampaignGuideSpotlights();
    });
    rotationPickerClose.addEventListener('click', () => {
      controls.classList.remove('is-rotation-picker-open');
      app.classList.remove('is-rotation-picker-open');
      campaignGuide.classList.remove('is-rotation-picker-open');
      rotatePickerButton.focus({ preventScroll: true });
      updateCampaignGuideSpotlights();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !controls.classList.contains('is-rotation-picker-open')) return;
      controls.classList.remove('is-rotation-picker-open');
      app.classList.remove('is-rotation-picker-open');
      campaignGuide.classList.remove('is-rotation-picker-open');
      rotatePickerButton.focus({ preventScroll: true });
    });
    function renderFinalSummary(winner, reason) {
      const layers = [];
      for (let layer = 8; layer >= 1; layer -= 1) {
        const totals = { orange: 0, blue: 0 };
        Object.keys(allRegionMasks?.[layer] || {}).forEach((region) => {
          const code = `L${layer}-${region}`;
          totals.orange += getTeamSoldierCount(code, 'orange');
          totals.blue += getTeamSoldierCount(code, 'blue');
        });
        layers.push(`<h3>Disco L${layer}</h3><p>Laranja: ${totals.orange} soldados · Azul: ${totals.blue} soldados</p>`);
      }
      const dominated = { orange: 0, blue: 0 };
      Object.keys(allRegionMasks || {}).forEach((layer) => {
        Object.keys(allRegionMasks[layer] || {}).forEach((region) => {
          const dominator = getRegionDominador(`L${layer}-${region}`);
          if (dominator === 'orange' || dominator === 'blue') dominated[dominator] += 1;
        });
      });
      const totalOrange = Object.keys(regionPiecesByRegion).reduce((sum, code) => sum + getTeamSoldierCount(code, 'orange'), 0);
      const totalBlue = Object.keys(regionPiecesByRegion).reduce((sum, code) => sum + getTeamSoldierCount(code, 'blue'), 0);
      const winnerLabel = winner === 'orange' ? 'Laranja' : winner === 'blue' ? 'Azul' : 'Empate';
      const endReason = reason === 'center' ? 'Vitória por conquista do centro.' :
        reason === 'campaign' ? `Level concluído: ${activeCampaignLevel?.name || 'Campanha'}.` :
        reason === 'turn30' ? 'Fim do turno 30.' :
          reason === 'inactivity' ? 'Derrota por ficar mais de 40 segundos sem interagir.' :
            reason === 'surrender' ? 'Partida encerrada por abandono.' :
            'Resultado pela pontuação de vitória.';
      const metrics = getVictoryMetrics();
      finalSummary.innerHTML = `<h3>Vencedor final: ${winnerLabel}</h3>
        <p>${endReason}</p>
        <p class="victory-score">Pontos de vitória — Laranja: ${victoryPoints.orange} · Azul: ${victoryPoints.blue}</p>
        ${layers.join('')}<h3>Total de unidades</h3>
        <p>Laranja: ${totalOrange} soldados · Azul: ${totalBlue} soldados</p>
        <h3>Regiões dominadas · Força final total</h3>
        <p>Laranja: ${dominated.orange} regiões · ${formatStatisticsNumber(metrics.finalForces.orange)} de força</p>
        <p>Azul: ${dominated.blue} regiões · ${formatStatisticsNumber(metrics.finalForces.blue)} de força</p>`;
    }

    function getCenterConqueror() {
      const centerRegion = Object.keys(allRegionMasks?.[1] || {})[0];
      if (!centerRegion) return null;
      const owner = getRegionDominador(`L1-${centerRegion}`);
      return owner === 'orange' || owner === 'blue' ? owner : null;
    }

    function finishGame(winnerOverride = null, reason = 'score', notifyOpponent = true) {
      if (isGameOver) return;
      const winner = winnerOverride === 'orange' || winnerOverride === 'blue'
        ? winnerOverride
        : victoryPoints.orange === victoryPoints.blue
          ? null
          : victoryPoints.orange > victoryPoints.blue ? 'orange' : 'blue';
      isGameOver = true;
      isGameStarted = false;
      abandonMatchButton.classList.add('is-hidden');
      onlineSurrenderPending = false;
      confirmAbandonMatchButton.disabled = false;
      if (notifyOpponent && gameMode === 'bluetooth' && bluetoothConnected) {
        sendBluetoothMessage({
          type: 'game_over',
          winner: winner || 'draw',
          reason,
          victoryPoints: { ...victoryPoints }
        });
      }
      if (notifyOpponent && isOnlineGame()) {
        sendOnlineMessage({
          type: 'game_over',
          winner: winner || 'draw',
          reason,
          victoryPoints: { ...victoryPoints }
        });
      }
      localStorage.removeItem('will-of-many-save');
      updateWarAvailability();
      passTurnButton.disabled = true;
      renderFinalSummary(winner, reason);
      const nextLevelNumber = campaignNextLevelId
        ? getCampaignLevelOrder().indexOf(campaignNextLevelId) + 1
        : 0;
      campaignNextLevelButton.classList.toggle('is-hidden', reason !== 'campaign' || !campaignNextLevelId);
      finalRestartCampaignButton.classList.toggle('is-hidden', reason !== 'campaign');
      if (campaignNextLevelId) {
        campaignNextLevelButton.textContent = `Continuar para o Level ${nextLevelNumber}`;
      }
      finalModal.classList.remove('is-hidden');
    }

    function finishIfCenterConquered(notifyOpponent = true) {
      if (!isGameStarted || isGameOver || isApplyingBluetoothAction) return false;
      const centerWinner = getCenterConqueror();
      if (!centerWinner) return false;
      finishGame(centerWinner, 'center', notifyOpponent);
      return true;
    }

    function finishCampaignIfObjectiveMet() {
      if (!isCampaignGame() || !campaignObjectiveRegions.length ||
          !campaignObjectiveRegions.every((regionCode) => getRegionDominador(regionCode) === 'orange')) {
        return false;
      }
      campaignNextLevelId = unlockNextCampaignLevel(activeCampaignLevel.id);
      finishGame('orange', 'campaign');
      return true;
    }

    async function failCampaignLevel() {
      if (!isCampaignGame() || campaignResetPending || isGameOver) return;
      campaignResetPending = true;
      const sessionVersion = gameSessionVersion;
      isGameOver = true;
      isGameStarted = false;
      isAiTurnRunning = false;
      localStorage.removeItem('will-of-many-save');
      passTurnButton.disabled = true;
      const turnLimit = Math.max(1, Number(activeCampaignLevel?.turnLimit) || 1);
      const turnWord = turnLimit === 1 ? 'turno' : 'turnos';
      const message = `Você perdeu: tinha apenas ${turnLimit} ${turnWord} para concluir este level.`;
      readout.textContent = `${message} ${activeCampaignLevel.name} será reiniciado...`;
      campaignDefeatMessage.textContent = `${message} ${activeCampaignLevel.name} será reiniciado...`;
      campaignDefeat.classList.remove('is-hidden');
      campaignDefeat.setAttribute('aria-hidden', 'false');
      await waitForWarAnimation(2200);
      if (sessionVersion === gameSessionVersion && isCampaignGame()) {
        campaignDefeat.classList.add('is-hidden');
        campaignDefeat.setAttribute('aria-hidden', 'true');
        campaignResetPending = false;
        await beginConfiguredGame();
      }
    }

    function showCampaignIntro() {
      if (campaignIntroPending) {
        campaignIntroPending = false;
        campaignIntro.classList.remove('is-hidden');
        campaignIntro.setAttribute('aria-hidden', 'false');
        campaignIntroDismiss.focus({ preventScroll: true });
        return;
      }
      if (isCampaignLevelTwo() && [
        'level2-intro', 'level2-rotate', 'level2-pass-turn',
        'level2-rotate-again', 'level2-final-attack', 'level2-final-war',
        'level2-recycle'
      ].includes(campaignGuideStep)) {
        showCampaignGuide(campaignGuideStep);
        return;
      }
      if (isCampaignGame() && [
        'coins', 'purchase', 'move', 'bag-tip', 'army-tip', 'war'
      ].includes(campaignGuideStep)) showCampaignGuide(campaignGuideStep);
    }

    function dismissCampaignIntro() {
      const shouldContinueGuide = !campaignIntro.classList.contains('is-hidden') &&
        isCampaignGame() && isGameStarted && campaignGuideStep === 'intro';
      campaignIntro.classList.add('is-hidden');
      campaignIntro.setAttribute('aria-hidden', 'true');
      campaignIntroDismiss.blur();
      if (shouldContinueGuide) showCampaignGuide('coins');
    }

    function getCampaignApproachRegion() {
      const startingRegions = Object.entries(regionGeometryByCode)
        .filter(([, geometry]) => geometry.initialPieces.some((piece) => piece.team === 'orange'))
        .map(([code]) => code);
      for (const start of startingRegions) {
        for (const target of campaignObjectiveRegions) {
          const queue = [[start]];
          const visited = new Set([start]);
          while (queue.length) {
            const path = queue.shift();
            const current = path[path.length - 1];
            if (current === target) return path.length > 1 ? path[path.length - 2] : null;
            [...(regionNeighborCache[current]?.sameRank || [])].sort().forEach((neighbor) => {
              if (visited.has(neighbor)) return;
              visited.add(neighbor);
              queue.push([...path, neighbor]);
            });
          }
        }
      }
      return null;
    }

    function getCampaignRegionShape(regionCode) {
      if (!regionCode) return null;
      return [...document.querySelectorAll('[data-region]')].find((element) =>
        element.dataset.region === regionCode && !element.dataset.team &&
        ['path', 'circle'].includes(element.tagName.toLowerCase())
      ) || null;
    }

    function getCampaignBagIcon(regionCode) {
      return [...document.querySelectorAll('g[data-region][aria-label]')].find((element) =>
        element.dataset.region === regionCode && element.getAttribute('aria-label').startsWith('Saco com')
      ) || null;
    }

    function getCampaignGuideTargetElements(step) {
      const approachRegion = getCampaignApproachRegion();
      const piecesInRegion = (regionCode) => [...pieces.querySelectorAll('.piece')]
        .filter((piece) => piece.dataset.region === regionCode && piece.dataset.team === 'orange');
      const rotatableLayerButtons = [...document.querySelectorAll('.layer-button[data-layer="8"]')];
      switch (step) {
        case 'coins': return [turnPoints];
        case 'purchase':
          return [
            document.querySelector('#piece-controls .piece-button[data-stage="g"]'),
            getCampaignRegionShape('L8-5')
          ];
        case 'move':
          return [...piecesInRegion('L8-5'), getCampaignRegionShape('L8-4')].filter(Boolean);
        case 'bag-tip':
          return [turnPoints, getCampaignBagIcon('L8-3')].filter(Boolean);
        case 'army-tip': return [getCampaignRegionShape(approachRegion)].filter(Boolean);
        case 'war':
          return [
            document.querySelector('#war-button'),
            getCampaignRegionShape(approachRegion),
            ...campaignObjectiveRegions.map(getCampaignRegionShape)
          ].filter(Boolean);
        case 'level2-rotate':
          return [
            ...['L8-6', 'L8-7', 'L8-8', 'L8-9'].map(getCampaignRegionShape),
            regionName,
            regionRotationIndicator,
            rotatePickerButton,
            ...rotatableLayerButtons
          ].filter(Boolean);
        case 'level2-pass-turn':
          return [passTurnButton];
        case 'level2-rotate-again':
          return [rotatePickerButton, ...rotatableLayerButtons];
        case 'level2-final-attack':
          return [
            getCampaignRegionShape('L8-3'),
            getCampaignRegionShape('L8-10')
          ].filter(Boolean);
        case 'level2-final-war':
          return [document.querySelector('#war-button')].filter(Boolean);
        case 'level2-recycle':
          return [
            getCampaignRegionShape('L8-3'),
            getCampaignRegionShape('L8-10'),
            trashDropZone
          ].filter(Boolean);
        default: return [];
      }
    }

    function updateCampaignGuideSpotlights() {
      if (campaignGuide.classList.contains('is-hidden')) return;
      const targets = getCampaignGuideTargetElements(campaignGuideStep).filter((target) => {
        if (!target || !target.getClientRects().length) return false;
        const rect = target.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight &&
          rect.right > 0 && rect.left < window.innerWidth;
      });
      campaignGuideSpotlights.replaceChildren();
      const width = campaignGuideShade.clientWidth;
      const height = campaignGuideShade.clientHeight;
      campaignGuideShade.setAttribute('viewBox', `0 0 ${width} ${height}`);
      campaignGuideMask.setAttribute('x', '0');
      campaignGuideMask.setAttribute('y', '0');
      campaignGuideMask.setAttribute('width', String(width));
      campaignGuideMask.setAttribute('height', String(height));
      campaignGuideMaskBackground.setAttribute('width', String(width));
      campaignGuideMaskBackground.setAttribute('height', String(height));
      campaignGuideMaskHoles.replaceChildren();
      campaignGuideRegionOutlines.replaceChildren();
      const svgNamespace = 'http://www.w3.org/2000/svg';
      const circularGuideTargets = new Map();
      targets.forEach((target) => {
        if (target.namespaceURI !== svgNamespace || target.tagName.toLowerCase() !== 'path') return;
        const geometry = regionGeometryByCode[target.dataset.region];
        if (geometry?.shape !== 'circular') return;
        if (!circularGuideTargets.has(geometry.block)) circularGuideTargets.set(geometry.block, []);
        circularGuideTargets.get(geometry.block).push({ target, geometry });
      });
      const fullCircularGuideBlocks = new Set();
      circularGuideTargets.forEach((entries, blockName) => {
        const block = currentBoardData?.blocks.find((item) => item.name === blockName);
        if (block?.regions?.length && entries.length >= block.regions.length) {
          fullCircularGuideBlocks.add(blockName);
        }
      });
      targets.forEach((target) => {
        if (target.namespaceURI === svgNamespace && target.tagName.toLowerCase() === 'path') {
          const matrix = target.getScreenCTM();
          const pathData = target.getAttribute('d');
          if (!matrix || !pathData) return;
          const transform = `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`;
          const hole = document.createElementNS(svgNamespace, 'path');
          hole.setAttribute('d', pathData);
          hole.setAttribute('transform', transform);
          campaignGuideMaskHoles.appendChild(hole);
          const geometry = regionGeometryByCode[target.dataset.region];
          if (!geometry || !fullCircularGuideBlocks.has(geometry.block)) {
            const outline = document.createElementNS(svgNamespace, 'path');
            outline.setAttribute('d', pathData);
            outline.setAttribute('transform', transform);
            outline.classList.add('campaign-guide-region-outline');
            campaignGuideRegionOutlines.appendChild(outline);
          }
          return;
        }
        const rect = target.getBoundingClientRect();
        const padding = target === turnPoints || target.id === 'war-button' ? 8 : 6;
        const left = Math.max(0, rect.left - padding);
        const top = Math.max(0, rect.top - padding);
        const right = Math.min(width, rect.right + padding);
        const bottom = Math.min(height, rect.bottom + padding);
        const outline = document.createElement('span');
        outline.className = 'campaign-guide-spotlight';
        outline.style.left = `${left}px`;
        outline.style.top = `${top}px`;
        outline.style.width = `${Math.max(1, right - left)}px`;
        outline.style.height = `${Math.max(1, bottom - top)}px`;
        campaignGuideSpotlights.appendChild(outline);
        const hole = document.createElementNS(svgNamespace, 'rect');
        hole.setAttribute('x', String(left));
        hole.setAttribute('y', String(top));
        hole.setAttribute('width', String(Math.max(1, right - left)));
        hole.setAttribute('height', String(Math.max(1, bottom - top)));
        campaignGuideMaskHoles.appendChild(hole);
      });
      fullCircularGuideBlocks.forEach((blockName) => {
        const entry = circularGuideTargets.get(blockName)?.[0];
        if (!entry) return;
        const { target, geometry } = entry;
        const matrix = target.getScreenCTM();
        if (!matrix) return;
        const radius = geometry.outerRadius;
        const path = [
          `M ${geometry.centerX + radius} ${geometry.centerY}`,
          `A ${radius} ${radius} 0 1 0 ${geometry.centerX - radius} ${geometry.centerY}`,
          `A ${radius} ${radius} 0 1 0 ${geometry.centerX + radius} ${geometry.centerY}`
        ].join(' ');
        const outline = document.createElementNS(svgNamespace, 'path');
        outline.setAttribute('d', path);
        outline.setAttribute(
          'transform',
          `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`
        );
        outline.classList.add('campaign-guide-region-outline');
        campaignGuideRegionOutlines.appendChild(outline);
      });
      campaignGuideShadePath.setAttribute('d', `M0 0H${width}V${height}H0Z`);
      if (campaignGuideStep === 'bag-tip') {
        const regionShape = getCampaignRegionShape('L8-3');
        const matrix = regionShape?.getScreenCTM();
        const pathData = regionShape?.getAttribute('d');
        if (matrix && pathData) {
          const outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          outline.classList.add('campaign-guide-region-outline');
          outline.setAttribute('d', pathData);
          outline.setAttribute('transform', `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`);
          campaignGuideRegionOutlines.appendChild(outline);
        }
      }
      const targetRects = targets.map((target) => target.getBoundingClientRect());
      const guideTop = campaignGuideCard.dataset.position === 'top';
      if (!guideTop && targetRects.some((rect) => rect.bottom > height * 0.67)) {
        campaignGuideCard.dataset.position = 'top';
      } else if (guideTop && targetRects.every((rect) => rect.bottom < height * 0.6)) {
        campaignGuideCard.removeAttribute('data-position');
      }
    }

    function showCampaignGuide(step) {
      if (!isCampaignGame() || !isGameStarted || isGameOver) return;
      const approachRegion = getCampaignApproachRegion();
      const guideContent = {
        coins: {
          title: 'Suas moedas neste turno',
          message: `Você tem ${Number(pontosDoTurn.orange).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} moedas disponíveis para comprar unidades ou movê-las. As moedas não acumulam de um turno para o outro.`,
          dismissible: true
        },
        purchase: {
          title: 'Compre sua primeira unidade',
          message: 'Você controla L8-5. Toque no ícone da peça G para comprar uma unidade; ela custa 1 moeda.',
          dismissible: false
        },
        move: {
          title: 'Avance pelo tabuleiro',
          message: 'Toque nesta mensagem para voltar ao jogo. Depois, arraste a peça G de L8-5 para a região vizinha L8-4.',
          dismissible: true
        },
        'bag-tip': {
          title: 'Encontre mais moedas',
          message: 'Suas moedas estão acabando. Compre uma unidade G em L8-4 (1 moeda) e avance com uma das duas até L8-3 para pegar o saco com 3 moedas.',
          dismissible: true
        },
        'army-tip': {
          title: 'Prepare o avanço final',
          message: `Parabéns! Você encontrou as moedas. Faltam apenas duas regiões: reúna o máximo possível de soldados em ${approachRegion || 'L8-2'}, ao lado do inimigo.`,
          dismissible: true
        },
        war: {
          title: 'Declare Guerra',
          message: `Você tem pelo menos dois soldados em ${approachRegion || 'L8-2'}. Toque em Guerra para atacar os territórios inimigos vizinhos; vença com mais força para conquistá-los.`,
          dismissible: false
        },
        'level2-intro': {
          title: 'Level 2: alcance L8-1',
          message: 'Seu objetivo é conquistar a região L8-1. Você tem 5 turnos para alcançar esse objetivo. Toque nesta mensagem para voltar ao tabuleiro.',
          dismissible: true
        },
        'level2-rotate': {
          title: 'Atravesse o disco BC03',
          message: 'O disco BC03 gira. O ícone ↻ ao lado do nome da região indica que ela faz parte de um disco rotativo. Use os controles para girar à direita ou à esquerda e encontrar um caminho até o outro lado sem enfrentar os inimigos.',
          dismissible: false
        },
        'level2-pass-turn': {
          title: 'Gire novamente no próximo turno',
          message: 'Você já conquistou uma região do disco. Passe o turno para liberar outra rotação e continuar abrindo caminho.',
          dismissible: false
        },
        'level2-rotate-again': {
          title: 'Continue pelo disco',
          message: 'Agora você pode girar o BC03 novamente. Escolha girar para a direita ou para a esquerda para alinhar o caminho com a próxima região.',
          dismissible: false
        },
        'level2-final-attack': {
          title: 'Prepare para a conquista',
          message: 'Seu oponente tem uma peça F! Uma peça F vale 7 unidades G. Para dominar aquela região construa primeiro mais 7 peças na sua região.',
          dismissible: true
        },
        'level2-final-war': {
          title: 'Declare Guerra',
          message: 'Você já reuniu unidades G suficientes para enfrentar a peça F. Declare Guerra para conquistar L8-3.',
          dismissible: false
        },
        'level2-recycle': {
          title: 'Recicle peças para avançar',
          message: 'Ao arrastar uma peça para a lixeira, você recebe de volta metade do custo dela. Use essa estratégia entre L8-3 e L8-10 para reunir recursos e conquistar a região principal L8-1.',
          dismissible: true
        }
      }[step];
      if (!guideContent) return;
      campaignGuideStep = step;
      campaignGuideDismissible = guideContent.dismissible;
      if (step === 'level2-recycle') {
        trashDropZone.classList.remove('is-hidden');
        trashDropZone.classList.add('is-guide-visible');
      }
      turnPoints.classList.toggle('is-guide-pinned', step === 'bag-tip');
      campaignGuideTitle.textContent = guideContent.title;
      campaignGuideMessage.textContent = guideContent.message;
      campaignGuideContinue.disabled = !guideContent.dismissible;
      campaignGuideHint.textContent = guideContent.dismissible
        ? 'Toque na mensagem para continuar'
        : step === 'purchase' ? 'Compre a unidade destacada para continuar'
          : step === 'level2-pass-turn' ? 'Passe o turno para continuar'
            : ['level2-rotate', 'level2-rotate-again'].includes(step)
              ? 'Toque em GIRAR DISCO e escolha uma direção'
            : step === 'level2-final-war' ? 'Toque no botão Guerra destacado'
              : 'Toque na mensagem para continuar';
      campaignGuideCard.removeAttribute('data-position');
      campaignGuide.classList.remove('is-hidden');
      app.classList.add('is-campaign-guiding');
      app.classList.toggle('is-rotation-guide',
        ['level2-rotate', 'level2-rotate-again'].includes(step));
      campaignGuide.setAttribute('aria-hidden', 'false');
      if (step === 'purchase') focusRegion('L8-5');
      else if (step === 'coins') focusRegion('L8-5');
      else if (step === 'bag-tip') focusRegion('L8-3');
      else if (step === 'army-tip' && approachRegion) focusRegion(approachRegion);
      else if (step === 'level2-rotate') {
        selectedRegionCode = 'L8-7';
        updateSelectedRegionPanel(selectedRegionCode);
        focusRegion('L8-7');
      }
      else if (step === 'level2-rotate-again') {
        selectedRegionCode = campaignLevel2SeenSectors[campaignLevel2SeenSectors.length - 1] || 'L8-7';
        updateSelectedRegionPanel(selectedRegionCode);
        focusRegion(selectedRegionCode);
      }
      else if (step === 'level2-final-attack') {
        selectedRegionCode = 'L8-10';
        updateSelectedRegionPanel(selectedRegionCode);
        focusRegion(selectedRegionCode);
      }
      else if (step === 'level2-recycle') {
        selectedRegionCode = 'L8-3';
        updateSelectedRegionPanel(selectedRegionCode);
        focusRegion('L8-3');
      }
      const primaryTarget = step === 'purchase'
        ? document.querySelector('#piece-controls .piece-button[data-stage="g"]')
        : step === 'coins' ? turnPoints
          : step === 'bag-tip' ? getCampaignBagIcon('L8-3')
            : step === 'war' ? document.querySelector('#war-button')
              : getCampaignGuideTargetElements(step)[0];
      const guideTargets = getCampaignGuideTargetElements(step)
        .filter((target) => target && target.getClientRects().length);
      if (guideTargets.length) {
        const rects = guideTargets.map((target) => target.getBoundingClientRect());
        const bounds = {
          top: Math.min(...rects.map((rect) => rect.top)),
          bottom: Math.max(...rects.map((rect) => rect.bottom))
        };
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        if (bounds.bottom - bounds.top < window.innerHeight - 170) {
          const center = (bounds.top + bounds.bottom) / 2;
          window.scrollTo(0, Math.max(0, Math.min(maxScroll,
            window.scrollY + center - window.innerHeight / 2)));
        } else if (primaryTarget) primaryTarget.scrollIntoView({ block: 'center', inline: 'nearest' });
      }
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        updateCampaignGuideSpotlights();
        const focusTarget = guideContent.dismissible ? campaignGuideContinue : primaryTarget;
        focusTarget?.focus?.({ preventScroll: true });
      }));
      saveGame();
    }

    function hideCampaignGuide() {
      const wasRecycleGuide = campaignGuideStep === 'level2-recycle';
      campaignGuide.classList.add('is-hidden');
      app.classList.remove('is-campaign-guiding');
      app.classList.remove('is-rotation-guide');
      campaignGuide.setAttribute('aria-hidden', 'true');
      turnPoints.classList.remove('is-guide-pinned');
      campaignGuideSpotlights.replaceChildren();
      campaignGuideContinue.blur();
      campaignGuideShadePath.setAttribute('d', '');
      campaignGuideMaskHoles.replaceChildren();
      campaignGuideRegionOutlines.replaceChildren();
      if (wasRecycleGuide) {
        trashDropZone.classList.remove('is-guide-visible');
        trashDropZone.classList.add('is-hidden');
      }
    }

    function continueCampaignGuide() {
      if (!campaignGuideDismissible || campaignGuide.classList.contains('is-hidden')) return;
      if (campaignGuideStep === 'coins') {
        showCampaignGuide('purchase');
        return;
      }
      const nextStep = {
        move: 'await-move',
        'bag-tip': 'await-bag',
        'army-tip': 'await-army',
        'level2-intro': 'await-l84',
        'level2-rotate': 'await-circular',
        'level2-rotate-again': 'await-circular',
        'level2-final-attack': 'await-l83-army',
        'level2-final-war': 'await-l83',
        'level2-recycle': 'await-l81'
      }[campaignGuideStep] || 'complete';
      hideCampaignGuide();
      campaignGuideStep = nextStep;
      if (campaignGuideStep === 'await-l84') {
        resetStageZoom();
        focusStrongestRegionForTeam('orange');
      }
      saveGame();
      if (nextStep === 'await-army') maybeShowCampaignWarGuide();
      if (isCampaignLevelTwo()) maybeAdvanceLevel2Guide();
    }

    function isCampaignGuideActionAllowed(target, eventType) {
      if ((campaignMenuButton.contains(target) || campaignRestartButton.contains(target)) &&
          (eventType === 'pointerdown' || eventType === 'click')) return true;
      if (campaignGuideDismissible) return campaignGuideContinue.contains(target);
      if (campaignGuideStep === 'purchase') {
        const purchaseButton = document.querySelector('#piece-controls .piece-button[data-stage="g"]');
        return !!purchaseButton && purchaseButton.contains(target);
      }
      if (campaignGuideStep === 'level2-pass-turn') {
        return passTurnButton.contains(target) &&
          (eventType === 'pointerdown' || eventType === 'click');
      }
      if (['level2-rotate', 'level2-rotate-again'].includes(campaignGuideStep)) {
        return (rotatePickerButton.contains(target) ||
          rotationPickerClose.contains(target) ||
          target.closest?.('.layer-button[data-layer="8"]') != null) &&
          (eventType === 'pointerdown' || eventType === 'click');
      }
      return ['war', 'level2-final-war'].includes(campaignGuideStep) &&
        warButton.contains(target) &&
        (eventType === 'pointerdown' || eventType === 'click');
    }

    function maybeShowCampaignWarGuide() {
      if (!isCampaignGame() || campaignGuideStep !== 'await-army') return;
      const approachRegion = getCampaignApproachRegion();
      if (!approachRegion || getRegionDominador(approachRegion) !== 'orange' ||
          getTeamSoldierCount(approachRegion, 'orange') < 2) return;
      showCampaignGuide('war');
    }

    function maybeAdvanceLevel2Guide() {
      if (!isCampaignLevelTwo() || isGameOver) return;
      const orangeOwns = (code) => getRegionDominador(code) === 'orange';
      if (campaignGuideStep === 'await-l84' && orangeOwns('L8-4')) {
        showCampaignGuide('level2-rotate');
        return;
      }
      if (campaignGuideStep === 'await-circular') {
        const newlyConqueredSector = Object.entries(regionGeometryByCode)
          .filter(([, geometry]) => geometry.shape === 'circular')
          .map(([code]) => code)
          .filter((code) => orangeOwns(code) && !campaignLevel2SeenSectors.includes(code));
        if (newlyConqueredSector.length) {
          campaignLevel2SeenSectors.push(...newlyConqueredSector);
          showCampaignGuide('level2-pass-turn');
          return;
        }
      }
      if (campaignGuideStep === 'await-circular' && orangeOwns('L8-10')) {
        showCampaignGuide('level2-final-attack');
        return;
      }
      if (campaignGuideStep === 'await-l83-army' && orangeOwns('L8-10') &&
          getTeamSoldierCount('L8-10', 'orange') >= 8) {
        showCampaignGuide('level2-final-war');
        return;
      }
      if (campaignGuideStep === 'await-l83' && orangeOwns('L8-3')) {
        showCampaignGuide('level2-recycle');
      }
    }

    function returnCampaignToMenu() {
      if (!isCampaignGame()) return;
      gameSessionVersion += 1;
      isGameStarted = false;
      isGameOver = true;
      isAiTurnRunning = false;
      isWarRunning = false;
      warStatus.classList.add('is-hidden');
      warSpotlightRegionCodes = [];
      updateBoardFocusOverlay();
      campaignResetPending = false;
      campaignIntroPending = false;
      localStorage.removeItem('will-of-many-save');
      dismissCampaignIntro();
      hideCampaignGuide();
      campaignGuideStep = 'complete';
      campaignDefeat.classList.add('is-hidden');
      campaignDefeat.setAttribute('aria-hidden', 'true');
      campaignActions.classList.add('is-hidden');
      finalModal.classList.add('is-hidden');
      turnTransition.classList.remove('is-visible');
      turnTransition.setAttribute('aria-hidden', 'true');
      app.classList.add('is-hidden');
      newGameOptions.classList.add('is-hidden');
      startMenu.classList.remove('is-hidden');
      startScreen.classList.remove('is-hidden');
      startMessage.textContent = '';
    }

    async function restartCampaignLevel() {
      if (!isCampaignGame()) return;
      gameSessionVersion += 1;
      isGameStarted = false;
      isGameOver = true;
      isAiTurnRunning = false;
      isWarRunning = false;
      campaignResetPending = false;
      dismissCampaignIntro();
      hideCampaignGuide();
      campaignDefeat.classList.add('is-hidden');
      campaignDefeat.setAttribute('aria-hidden', 'true');
      finalModal.classList.add('is-hidden');
      campaignRestartButton.disabled = true;
      finalRestartCampaignButton.disabled = true;
      try {
        await beginConfiguredGame();
      } finally {
        campaignRestartButton.disabled = false;
        finalRestartCampaignButton.disabled = false;
      }
    }

    function showGameBoard() {
      startScreen.classList.add('is-hidden');
      app.classList.remove('is-hidden');
      renderBoardLayers();
      abandonMatchButton.classList.toggle('is-hidden', !isOnlineGame() || !isGameStarted || isGameOver);
      updateWarAvailability();
      updateTurnPointsDisplay();
      campaignActions.classList.toggle('is-hidden', !isCampaignGame() || !isGameStarted);
      finalRestartCampaignButton.classList.add('is-hidden');
      focusStrongestRegionForTeam(currentTeam);
      updateSelectedRegionPanel(selectedRegionCode);
      updateTurnState();
      showCampaignIntro();
      if ((gameMode === 'ai' || isCampaignGame()) && currentTeam === aiTeam) scheduleAiTurn();
    }

    async function showTurnTransition(roundResult = null) {
      const playerLabel = currentTeam === 'orange' ? 'JOGADOR LARANJA' : 'JOGADOR AZUL';
      const player = document.createElement('span');
      player.className = 'turn-transition-player';
      player.textContent = playerLabel;
      const turn = document.createElement('span');
      turn.className = 'turn-transition-turn';
      turn.textContent = `TURN ${currentTurn}`;
      const round = document.createElement('span');
      round.className = 'turn-transition-round-result';
      const details = document.createElement('span');
      details.className = 'turn-transition-round-details';
      const score = document.createElement('span');
      score.className = 'turn-transition-round-score';
      if (roundResult) {
        const orangeWon = roundResult.winner === 'orange';
        round.dataset.winner = roundResult.winner;
        round.textContent = roundResult.winner === 'draw'
          ? 'Rodada empatada'
          : `Vencedor da Rodada: ${orangeWon ? 'Laranja' : 'Azul'}`;
        details.textContent = roundResult.winner === 'draw'
          ? `Nenhuma equipe marcou pontos nesta rodada.`
          : `${roundResult.gains[roundResult.winner]} ${roundResult.gains[roundResult.winner] === 1 ? 'ponto' : 'pontos'} de vitória · Perdedor: ${orangeWon ? 'Azul' : 'Laranja'} (${roundResult.gains[orangeWon ? 'blue' : 'orange']} pontos)`;
        score.textContent = `Territórios: Laranja ${roundResult.territories.orange} · Azul ${roundResult.territories.blue} | Força final: Laranja ${formatStatisticsNumber(roundResult.finalForces.orange)} · Azul ${formatStatisticsNumber(roundResult.finalForces.blue)} | Total de pontos — Laranja ${roundResult.totals.orange} · Azul ${roundResult.totals.blue}`;
      } else {
        round.textContent = 'A partida começou';
        details.textContent = '';
        score.textContent = `Pontos de vitória — Laranja: ${victoryPoints.orange} · Azul: ${victoryPoints.blue}`;
      }
      turnTransitionMessage.dataset.team = currentTeam;
      turnTransitionMessage.replaceChildren(player, turn, round, details, score);
      turnTransition.classList.add('is-visible');
      turnTransition.setAttribute('aria-hidden', 'false');
      await waitForWarAnimation(3500);
      turnTransition.classList.remove('is-visible');
      turnTransition.setAttribute('aria-hidden', 'true');
    }

    async function scheduleAiTurn() {
      if ((gameMode !== 'ai' && !isCampaignGame()) || !isGameStarted ||
          isGameOver || currentTeam !== aiTeam || isAiTurnRunning) return;
      isAiTurnRunning = true;
      passTurnButton.disabled = true;
      if (isCampaignGame() && activeCampaignLevel.aiActionsEnabled === false) {
        turnPlayer.textContent = 'Vez: azul · IA inativa';
        isAiTurnRunning = false;
        await passTurnToNextPlayer();
        return;
      }
      turnPlayer.textContent = `Vez: ${aiTeam === 'orange' ? 'laranja' : 'azul'} · IA pensando`;
      await waitForWarAnimation(650);
      focusStrongestRegionForTeam(aiTeam);
      await waitForWarAnimation(700);

      let actionCount = 0;
      let pendingAiFollowUp = null;
      while (actionCount < 32 && pontosDoTurn[aiTeam] > 0 && !isGameOver) {
        const pointsBefore = pontosDoTurn[aiTeam];
        const snapshot = getGameSnapshot();
        snapshot.pendingAiFollowUp = pendingAiFollowUp;
        const action = window.WillOfManyAI?.chooseAction(snapshot) || { type: 'pass' };
        if (action.type === 'rotate') break;
        if (action.type === 'pass') break;

        let recycleSucceeded = false;
        focusActionRegion(action.source, action.target);
        turnPlayer.textContent = `Vez: ${aiTeam === 'orange' ? 'laranja' : 'azul'} · IA: ${action.type}`;
        await waitForWarAnimation(500);
        if (action.type === 'buy' && action.source) {
          pendingAiFollowUp = action.followUp || null;
          selectedRegionCode = action.source;
          addPiece(aiTeam, action.stage || 'g');
        } else if (action.type === 'move' && action.source && action.target) {
          pendingAiFollowUp = null;
          selectedRegionCode = action.source;
          performMoveTo(action.target, action.amount || 1);
        } else if (action.type === 'promote' && action.source && action.target) {
          pendingAiFollowUp = null;
          selectedRegionCode = action.source;
          performPromotion(action.target, action.amount || 1);
        } else if (action.type === 'relegate' && action.source && action.target && action.stage) {
          pendingAiFollowUp = null;
          selectedRegionCode = action.source;
          performRelegation(action.target, action.stage);
        } else if (action.type === 'recycle' && action.source && action.stage) {
          pendingAiFollowUp = null;
          selectedRegionCode = action.source;
          recycleSucceeded = recyclePiece(action.source, aiTeam, action.stage);
        }
        actionCount += 1;
        await waitForWarAnimation(850);
        if (pontosDoTurn[aiTeam] >= pointsBefore && !recycleSucceeded) break;
      }

      if (!isGameOver && !hasRotatedThisTurn) {
        let rotationButton = null;
        const suggested = window.WillOfManyAI?.chooseAction(getGameSnapshot());
        if (suggested?.type === 'rotate') {
          const candidateLayers = suggested.layers || [suggested.layer];
          for (const candidateLayer of candidateLayers) {
            const candidateButtons = [...document.querySelectorAll(
              `.layer-button[data-layer="${candidateLayer}"][data-direction="${suggested.direction || 'right'}"]`
            )];
            const candidateButton = candidateButtons.find((button) =>
              button.dataset.rotationBlock) ||
              candidateButtons.find((button) =>
                !button.closest('.is-suppressed-by-circular-picker'));
            if (candidateButton && !candidateButton.disabled) {
              rotationButton = candidateButton;
              break;
            }
          }
        }
        if (!rotationButton || rotationButton.disabled) {
          const availableButtons = [...document.querySelectorAll('.layer-button')]
            .filter((button) => !button.disabled && Number(button.dataset.layer) >= 2 &&
              (button.dataset.rotationBlock ||
                !button.closest('.is-suppressed-by-circular-picker')));
          rotationButton = availableButtons[Math.floor(Math.random() * availableButtons.length)];
        }
        if (rotationButton) {
          focusActionRegion(selectedRegionCode);
          await waitForWarAnimation(500);
          const rotationBefore = rotationAnimationVersion;
          turnPlayer.textContent = `Vez: ${aiTeam === 'orange' ? 'laranja' : 'azul'} · IA girando disco`;
          rotationButton.click();
          await waitForWarAnimation(3200);
          if (rotationAnimationVersion === rotationBefore) {
            const retryButton = [...document.querySelectorAll('.layer-button')]
              .find((button) => !button.disabled && Number(button.dataset.layer) >= 2 &&
                (button.dataset.rotationBlock ||
                  !button.closest('.is-suppressed-by-circular-picker')));
            if (retryButton) {
              retryButton.click();
              await waitForWarAnimation(3200);
            }
          }
        }
      }
      isAiTurnRunning = false;
      if (!isGameOver) await passTurnToNextPlayer();
    }

    async function passTurnToNextPlayer() {
      if (isWarRunning || isGameOver || isAiTurnRunning || !isLocalPlayersTurn()) return;
      if (isCampaignLevelTwo() && campaignGuideStep === 'level2-pass-turn' &&
          !campaignGuide.classList.contains('is-hidden')) {
        hideCampaignGuide();
        campaignGuideStep = 'await-next-rotation';
        saveGame();
      }
      passTurnButton.disabled = true;
      const roundResult = scoreCurrentRound();
      if (finishIfCenterConquered()) return;
      const campaignTurnLimit = Number(activeCampaignLevel?.turnLimit);
      if (isCampaignGame() && currentTeam === humanTeam &&
          Number.isFinite(campaignTurnLimit) && campaignTurnLimit > 0 &&
          currentTurn >= campaignTurnLimit * 2 - 1) {
        await failCampaignLevel();
        return;
      }
      if (isCampaignGame() && currentTeam === aiTeam &&
          Number.isFinite(campaignTurnLimit) && campaignTurnLimit > 0 &&
          currentTurn >= campaignTurnLimit * 2) {
        if (!finishCampaignIfObjectiveMet()) await failCampaignLevel();
        return;
      }
      currentTeam = currentTeam === 'orange' ? 'blue' : 'orange';
      currentTurn += 1;
      turnMoveHistory = turnMoveHistory.filter((move) => move.team !== currentTeam);
      turnRecycledPieces = turnRecycledPieces.filter((piece) => piece.team !== currentTeam);
      turnCreatedPieces = turnCreatedPieces.filter((piece) => piece.team !== currentTeam);
      hasRotatedThisTurn = false;
      updateRotationControls();
      if (!isCampaignLevelTwo()) {
        pontosDoTurn[currentTeam] = isCampaignGame()
          ? getCampaignCoinsPerTurn(activeCampaignLevel)
          : getTurnPointIncome(currentTurn);
      }
      const wheatReport = isCampaignGame() ? null : applyWheatForTurn(currentTeam);
      renderPiecePurchaseButtons();
      recalculateRegionForces();
      focusStrongestRegionForTeam(currentTeam);
      updateTurnState();
      updateSelectedRegionPanel(selectedRegionCode);
      updateWarAvailability();
      saveGame();
      if (gameMode === 'bluetooth') {
        sendBluetoothMessage({
          type: 'game_state',
          state: JSON.parse(localStorage.getItem('will-of-many-save'))
        });
      }
      if (isOnlineGame()) {
        sendOnlineMessage({
          type: 'game_state',
          state: JSON.parse(localStorage.getItem('will-of-many-save'))
        });
      }
      await showTurnTransition(roundResult);
      const wheatMessage = getWheatShortageMessage(wheatReport);
      if (wheatMessage) readout.textContent = wheatMessage;
      passTurnButton.disabled = !isLocalPlayersTurn();
      if (currentTurn === 30) {
        if (!isOnlineGame() || onlineTeam === 'orange') await startWar(true);
        return;
      }
      if ((gameMode === 'ai' || isCampaignGame()) && currentTeam === aiTeam) scheduleAiTurn();
      if (isCampaignLevelTwo() && currentTeam === humanTeam &&
          campaignGuideStep === 'await-next-rotation') {
        showCampaignGuide('level2-rotate-again');
      }
    }

    passTurnButton.addEventListener('click', passTurnToNextPlayer);
    warButton.addEventListener('click', () => {
      if (isCampaignGame() && campaignGuideStep === 'war') {
        hideCampaignGuide();
        campaignGuideStep = 'complete';
        saveGame();
      } else if (isCampaignLevelTwo() && campaignGuideStep === 'level2-final-war') {
        hideCampaignGuide();
        campaignGuideStep = 'await-l83';
        saveGame();
      }
      if (gameMode === 'bluetooth' && bluetoothRole === 'guest') {
        sendBluetoothMessage({ type: 'war_request' });
        startMessage.textContent = 'Solicitação de guerra enviada ao anfitrião.';
        readout.textContent = 'Solicitação de guerra enviada ao anfitrião.';
        return;
      }
      if (isOnlineGame() && onlineTeam === 'blue') {
        sendOnlineMessage({ type: 'war_request' });
        onlineStatus.textContent = 'Pedido de guerra enviado ao anfitrião da partida.';
        return;
      }
      if (!isLocalPlayersTurn()) return;
      startWar(false);
    });
    function performPromotion(targetCode, amount) {
      if (!isApplyingBluetoothAction && !isLocalPlayersTurn()) return;
      if (!selectedRegionCode) return;
      if (!targetCode) return;
      if (!isRegionAvailableForTeam(targetCode, currentTeam)) {
        readout.textContent = `${targetCode}: região dominada pelo oponente.`;
        return;
      }
      const promotionTargets = getPromotionTargetsForRegion(selectedRegionCode, currentTeam);
      const targetInfo = promotionTargets.find((item) => item.code === targetCode);
      if (!targetInfo) return;
      if (amount <= 0) return;
      const cost = getPromotionCost(selectedRegionCode, amount);
      if (!spendTurnPoints(cost)) {
        readout.textContent = `${selectedRegionCode}: moedas insuficientes para promover (${cost}).`;
        return;
      }
      ensureRegionPieces(targetCode);
      const targetCountsBefore = { ...regionPiecesByRegion[targetCode][currentTeam] };
      moveSoldierCountBetweenRegions(selectedRegionCode, targetCode, currentTeam, amount);
      mergeRegionTeam(selectedRegionCode, currentTeam);
      mergeRegionTeam(targetCode, currentTeam, targetCountsBefore);
      collectCampaignBagAtRegion(targetCode, currentTeam);
      recalculateRegionForces();
      refreshRegionVisuals();
      showActionFeedback(targetCode, cost, 'promote');
      updateSelectedRegionPanel(selectedRegionCode);
      updateReadout();
      updateTurnState();
      readout.textContent = `${selectedRegionCode} → ${targetCode}: promoção realizada (${amount})`;
      publishBluetoothAction({
        type: 'promote',
        team: currentTeam,
        source: selectedRegionCode,
        target: targetCode,
        amount
      });
      finishIfCenterConquered();
    }

    function performRelegation(targetCode, stage) {
      if (!isApplyingBluetoothAction && !isLocalPlayersTurn()) return;
      const sourceCode = selectedRegionCode;
      if (!sourceCode || !targetCode ||
          !Object.prototype.hasOwnProperty.call(soldierWeights, stage)) return;
      if (!isRegionAvailableForTeam(sourceCode, currentTeam) ||
          getTeamPieceCount(sourceCode, currentTeam) < 2 ||
          Number(regionPiecesByRegion[sourceCode]?.[currentTeam]?.[stage] || 0) < 1) {
        readout.textContent = `${sourceCode}: é necessário possuir a peça e manter pelo menos outra na região de origem.`;
        return;
      }
      const targetInfo = getRelegationTargetsForPiece(sourceCode, currentTeam, stage)
        .find((target) => target.code === targetCode);
      if (!targetInfo) {
        readout.textContent = `${targetCode}: região inferior indisponível, dominada pelo oponente ou sem espaço.`;
        return;
      }

      ensureRegionPieces(targetCode);
      const targetCountsBefore = { ...regionPiecesByRegion[targetCode][currentTeam] };
      regionPiecesByRegion[sourceCode][currentTeam][stage] -= 1;
      regionPiecesByRegion[targetCode][currentTeam][stage] =
        Number(regionPiecesByRegion[targetCode][currentTeam][stage] || 0) + 1;
      mergeRegionTeam(sourceCode, currentTeam);
      mergeRegionTeam(targetCode, currentTeam, targetCountsBefore);
      collectCampaignBagAtRegion(targetCode, currentTeam);
      const refund = getRelegationRefund(sourceCode, targetCode, stage);
      pontosDoTurn[currentTeam] += refund;
      recalculatePieceCounts();
      recalculateRegionForces();
      refreshRegionVisuals();
      updateSelectedRegionPanel(sourceCode);
      updateReadout();
      updateTurnState();
      showActionFeedback(targetCode, refund, 'relegate', '+');
      readout.textContent = refund > 0
        ? `${sourceCode} → ${targetCode}: peça ${stage.toUpperCase()} rebaixada. +${refund.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} moedas.`
        : `${sourceCode} → ${targetCode}: peça ${stage.toUpperCase()} rebaixada. Sem restituição.`;
      publishBluetoothAction({
        type: 'relegate',
        team: currentTeam,
        source: sourceCode,
        target: targetCode,
        stage
      });
      finishIfCenterConquered();
    }

    function collectCampaignBagAtRegion(regionCode, team) {
      if (!isCampaignGame() || getTeamSoldierCount(regionCode, team) <= 0 ||
          campaignCollectedBags.includes(regionCode)) return 0;
      const coins = Math.max(0, Number(regionGeometryByCode[regionCode]?.bagCoins) || 0);
      if (!coins) return 0;
      campaignCollectedBags.push(regionCode);
      pontosDoTurn[team] += coins;
      renderBoardLayers();
      showActionFeedback(regionCode, coins, 'bag', '+');
      readout.textContent = `${team === 'orange' ? 'Laranja' : 'Azul'} encontrou um saco com ${coins} moedas em ${regionCode}.`;
      updateTurnState();
      if (team === 'orange' && campaignGuideStep === 'await-bag' && regionCode === 'L8-3') {
        showCampaignGuide('army-tip');
      }
      return coins;
    }

    function performMove(direction, amount) {
      const targetCode = getNeighborRegionCode(selectedRegionCode, direction);
      if (targetCode) performMoveTo(targetCode, amount);
    }

    function performMoveTo(neighbor, amount) {
      if (!isApplyingBluetoothAction && !isLocalPlayersTurn()) return;
      if (!selectedRegionCode) return;
      if (!neighbor) return;
      const sourceCode = selectedRegionCode;
      const sameRankNeighbors = regionNeighborCache[sourceCode]?.sameRank || [];
      const isNeighbor = sameRankNeighbors.includes(neighbor) ||
        getNeighborRegionCode(sourceCode, 'left') === neighbor ||
        getNeighborRegionCode(sourceCode, 'right') === neighbor;
      if (!isNeighbor || getRegionLayer(sourceCode) !== getRegionLayer(neighbor)) {
        readout.textContent = `${neighbor}: a região não é uma vizinha de movimento válida.`;
        return;
      }
      if (isReverseMoveBlocked(currentTeam, sourceCode, neighbor, amount)) {
        readout.textContent = `${sourceCode} → ${neighbor}: não há soldados disponíveis para retornar por esse caminho neste turno.`;
        return;
      }
      ensureRegionPieces(sourceCode);
      ensureRegionPieces(neighbor);
      if (!isRegionAvailableForTeam(neighbor, currentTeam)) {
        readout.textContent = `${neighbor}: região dominada pelo oponente.`;
        return;
      }
      const available = getTeamSoldierCount(sourceCode, currentTeam);
      const sourceCounts = { ...regionPiecesByRegion[sourceCode][currentTeam] };
      const targetCounts = { ...regionPiecesByRegion[neighbor][currentTeam] };
      const projectedSource = { ...sourceCounts };
      const projectedTarget = { ...targetCounts };
      projectedSource.g = Math.max(0, available - amount);
      projectedTarget.g = (getTeamSoldierCount(neighbor, currentTeam) + amount);
      for (const stage of ['f', 'e', 'd', 'c', 'b', 'a']) {
        projectedSource[stage] = 0;
        projectedTarget[stage] = 0;
      }
      const sourceFinalPieces = getFinalPieceCountForTeam(projectedSource);
      const targetFinalPieces = getFinalPieceCountForTeam(projectedTarget);
      const sourceLimit = getRegionPieceLimit(sourceCode);
      const destinationLimit = getRegionPieceLimit(neighbor);
      if (amount < 1 || amount > available || available - amount < 1 || sourceFinalPieces > sourceLimit || targetFinalPieces > destinationLimit) {
        readout.textContent = `${sourceCode}: não é possível mover esse número de soldados.`;
        return;
      }
      const cost = getMoveCost(sourceCode, amount);
      if (!spendTurnPoints(cost)) {
        readout.textContent = `${sourceCode}: moedas insuficientes para mover (${cost}).`;
        return;
      }
      if (!removeSoldierAmountFromRegion(sourceCode, currentTeam, amount)) {
        readout.textContent = `${sourceCode}: quantidade inválida para mover.`;
        return;
      }
      addSoldierAmountToRegion(neighbor, currentTeam, amount);
      mergeRegionTeam(sourceCode, currentTeam);
      mergeRegionTeam(neighbor, currentTeam, targetCounts);
      turnMoveHistory.push({ team: currentTeam, source: sourceCode, target: neighbor, amount });
      collectCampaignBagAtRegion(neighbor, currentTeam);
      recalculateRegionForces();
      refreshRegionVisuals();
      showActionFeedback(neighbor, cost, 'move');
      updateSelectedRegionPanel(sourceCode);
      updateReadout();
      publishBluetoothAction({
        type: 'move',
        team: currentTeam,
        source: sourceCode,
        target: neighbor,
        amount
      });
      finishIfCenterConquered();
      maybeAdvanceLevel2Guide();
      if (isCampaignGame() && currentTeam === 'orange' &&
          campaignGuideStep === 'await-move' && sourceCode === 'L8-5' && neighbor === 'L8-4') {
        showCampaignGuide('bag-tip');
      } else {
        maybeShowCampaignWarGuide();
      }
    }

    openMoveButton.addEventListener('click', openMoveModal);
    openPromotionButton.addEventListener('click', openPromotionModal);
    openRelegationButton.addEventListener('click', openRelegationModal);
    moveDirectionOptions.querySelectorAll('[data-direction]').forEach((button) => {
      button.addEventListener('click', () => renderMoveAmountOptions(button.dataset.direction));
    });
    document.querySelectorAll('[data-close-modal]').forEach((button) => {
      button.addEventListener('click', () => closeModal(document.querySelector(`#${button.dataset.closeModal}`)));
    });
    statisticsButton.addEventListener('click', () => {
      renderStatistics();
      statisticsModal.classList.remove('is-hidden');
    });
    function changeDebugZoom(delta) {
      const next = Number(Math.min(2.5, Math.max(0.5, debugZoom + delta)).toFixed(2));
      if (next === debugZoom) return;
      debugZoom = next;
      updateDebugZoom();
    }

    debugZoomOutButton.addEventListener('click', () => changeDebugZoom(-0.25));
    debugZoomInButton.addEventListener('click', () => changeDebugZoom(0.25));
    document.addEventListener('keydown', (event) => {
      if (!isDebugModeActive()) return;
      if (event.key === '-' || event.key === '_' || event.key === 'Subtract') {
        event.preventDefault();
        changeDebugZoom(-0.25);
      }
      if (event.key === '+' || event.key === '=' || event.key === 'Add') {
        event.preventDefault();
        changeDebugZoom(0.25);
      }
    });
    debugExportButton.addEventListener('click', exportGameDebugLog);
    stage.addEventListener('pointerdown', (event) => {
      if (isDebugModeActive()) {
        event.stopPropagation();
        return;
      }
      if (!allRegionMasks) return;
      const regionCode = resolveRegionFromPointer(event.clientX, event.clientY);
      if (!regionCode) {
        selectedRegionCode = null;
        updateSelectedRegionPanel();
        updateMobileRotationControls();
        return;
      }
      if (beginPieceDrag(event, regionCode)) return;
      selectedRegionCode = regionCode;
      updateSelectedRegionPanel(selectedRegionCode);
      updateMobileRotationControls();
      focusRegion(regionCode);
    });
    stage.addEventListener('pointermove', (event) => {
      if (!pieceDragState) return;
      event.preventDefault();
      event.stopPropagation();
      updateDraggedPiece(event.clientX, event.clientY);
    });
    stage.addEventListener('pointerup', (event) => {
      if (!pieceDragState) return;
      event.preventDefault();
      event.stopPropagation();
      finishPieceDrag(event.clientX, event.clientY);
    });
    stage.addEventListener('pointercancel', (event) => {
      if (!pieceDragState) return;
      event.preventDefault();
      event.stopPropagation();
      clearPieceDrag();
    });
    stagePanelClose.addEventListener('click', resetStageZoom);
    debugToggle.addEventListener('click', () => {
      debugCanvas.classList.toggle('is-hidden');
      debugCanvas.style.pointerEvents = debugCanvas.classList.contains('is-hidden') ? 'none' : 'auto';
      debugToggle.textContent = debugCanvas.classList.contains('is-hidden') ? 'Mostrar regiões' : 'Ocultar regiões';
      syncDebugInteractionState();
      if (!debugCanvas.classList.contains('is-hidden')) {
        currentDebugLayer = currentDebugLayer || 8;
        const activeButton = [...document.querySelectorAll('.layer-button')].find((button) => button.classList.contains('is-active'));
        if (activeButton) {
          currentDebugLayer = Number(activeButton.dataset.layer);
        }
        regionMasks = allRegionMasks ? allRegionMasks[currentDebugLayer] : null;
        updateDebugZoom();
      }
      if (selectedRegionCode) {
        updateSelectedRegionPanel(selectedRegionCode);
      } else {
        updateSelectedRegionPanel();
      }
    });
    regionsFile.addEventListener('change', async () => {
      const [file] = regionsFile.files;
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        applyRegionData(parsed);
      } catch (error) {
        debugStatus.textContent = `JSON inválido: ${error.message}`;
      }
    });
    function selectStartOption(selector, attribute, value) {
      document.querySelectorAll(selector).forEach((button) => {
        button.classList.toggle('is-active', button.dataset[attribute] === value);
      });
    }

    function isBluetoothGame() {
      return gameMode === 'bluetooth';
    }

    function isOnlineGame() {
      return gameMode === 'online';
    }

    function isLocalPlayersTurn() {
      if (isOnlineGame()) {
        return !!onlineSocket && onlineSocket.readyState === WebSocket.OPEN &&
          currentTeam === onlineTeam;
      }
      if (!isBluetoothGame()) return true;
      const localTeam = bluetoothRole === 'host' ? 'orange' : 'blue';
      return bluetoothConnected && currentTeam === localTeam;
    }

    function sendBluetoothMessage(message) {
      if (!window.AndroidBluetooth || !bluetoothConnected) return false;
      try {
        window.AndroidBluetooth.send(JSON.stringify(message));
        return true;
      } catch (error) {
        const status = `Erro Bluetooth: ${error.message}`;
        startMessage.textContent = status;
        if (isGameStarted) readout.textContent = status;
        return false;
      }
    }

    function publishBluetoothAction(action) {
      if (isApplyingBluetoothAction) return;
      if (isOnlineGame()) {
        saveGame();
        sendOnlineMessage({
          type: 'game_action',
          action: { ...action, team: action.team || currentTeam },
          state: JSON.parse(localStorage.getItem('will-of-many-save'))
        });
        return;
      }
      if (!isBluetoothGame() || !bluetoothConnected) return;
      saveGame();
      sendBluetoothMessage({
        type: 'game_action',
        action,
        state: JSON.parse(localStorage.getItem('will-of-many-save'))
      });
    }

    async function apiRequest(path, options = {}) {
      const headers = new Headers(options.headers || {});
      headers.set('Content-Type', 'application/json');
      if (onlineToken) headers.set('Authorization', `Bearer ${onlineToken}`);
      const endpoint = new URL(path, location.href).href;
      const startedAt = performance.now();
      let response;
      try {
        response = await fetch(path, { ...options, headers });
      } catch (error) {
        throw addOnlineErrorDetails(error, {
          stage: 'Conectando à API do servidor',
          endpoint,
          elapsedMs: Math.round(performance.now() - startedAt)
        });
      }
      let result;
      try {
        result = await response.json();
      } catch (error) {
        const responseError = new Error(
          `O servidor respondeu com dados que não são JSON (HTTP ${response.status}).`
        );
        throw addOnlineErrorDetails(responseError, {
          stage: 'Interpretando a resposta do servidor',
          endpoint,
          status: response.status,
          contentType: response.headers.get('content-type') || 'não informado',
          elapsedMs: Math.round(performance.now() - startedAt)
        });
      }
      if (!response.ok) {
        const error = new Error(result.error || `Falha do servidor (${response.status}).`);
        throw addOnlineErrorDetails(error, {
          stage: 'Resposta da API do servidor',
          endpoint,
          status: response.status,
          contentType: response.headers.get('content-type') || 'não informado',
          elapsedMs: Math.round(performance.now() - startedAt)
        });
      }
      onlineDiagnostics.classList.add('is-hidden');
      onlineDiagnostics.open = false;
      return result;
    }

    function addOnlineErrorDetails(error, details) {
      const diagnosticError = error instanceof Error ? error : new Error(String(error));
      diagnosticError.onlineDiagnostics = details;
      return diagnosticError;
    }

    function showOnlineError(message, error, stage, endpoint = '') {
      const diagnosticError = error instanceof Error ? error : new Error(String(error));
      const details = diagnosticError.onlineDiagnostics || {};
      const lines = [
        `Etapa: ${details.stage || stage}`,
        `Página: ${location.origin}${location.pathname}`,
        `Endpoint: ${details.endpoint || endpoint || 'não informado'}`,
        `Resultado: ${details.status ? `HTTP ${details.status}` : `${diagnosticError.name}: ${diagnosticError.message}`}`,
        ...(details.contentType ? [`Tipo de resposta: ${details.contentType}`] : []),
        `Tempo até a falha: ${typeof details.elapsedMs === 'number' ? `${details.elapsedMs} ms` : 'não disponível'}`,
        `Internet indicada pelo aparelho: ${navigator.onLine ? 'sim' : 'não'}`,
        `Contexto HTTPS seguro: ${window.isSecureContext ? 'sim' : 'não'}`,
        `Horário local: ${new Date().toLocaleString()}`,
        `Navegador: ${navigator.userAgent}`
      ];
      if (location.protocol === 'file:') {
        lines.push('Dica: esta página está aberta como arquivo local. Para jogar online, abra https://willofmany-game.onrender.com/ no navegador.');
      } else if (!navigator.onLine) {
        lines.push('Dica: o aparelho informa que está sem conexão com a internet.');
      } else if (!window.isSecureContext) {
        lines.push('Dica: abra o jogo pelo endereço HTTPS publicado; o login Google exige um contexto seguro.');
      } else if (diagnosticError.name === 'TypeError') {
        lines.push('Dica: o navegador não recebeu uma resposta HTTP. Confira a rede/VPN, o DNS privado, bloqueadores e tente novamente após o servidor Render iniciar.');
      }
      onlineStatus.textContent = `${message}\nToque em "Mostrar detalhes técnicos do erro" e depois em "Copiar diagnóstico" para compartilhar as informações.`;
      onlineDiagnosticsText.textContent = lines.join('\n');
      onlineDiagnostics.classList.remove('is-hidden');
    }

    function sendOnlineMessage(message) {
      if (!onlineSocket || onlineSocket.readyState !== WebSocket.OPEN) {
        onlineStatus.textContent = 'Conexão com a partida online indisponível.';
        return false;
      }
      onlineSocket.send(JSON.stringify(message));
      return true;
    }

    async function loadGoogleIdentityButton() {
      let currentStage = 'Carregando configuração do servidor';
      let currentEndpoint = new URL('/api/config', location.href).href;
      try {
        const config = await apiRequest('/api/config');
        if (!config.googleClientId) {
          onlineStatus.textContent = 'O servidor precisa ser configurado com GOOGLE_CLIENT_ID.';
          return;
        }
        googleSignIn.replaceChildren();
        if (window.AndroidGoogleSignIn?.signInWithGoogle) {
          const button = document.createElement('button');
          button.className = 'start-confirm';
          button.type = 'button';
          button.textContent = 'Entrar com Google';
          button.addEventListener('click', () => {
            button.disabled = true;
            onlineStatus.textContent = 'Selecione uma conta Google na janela do Android.';
            window.AndroidGoogleSignIn.signInWithGoogle(config.googleClientId);
          });
          googleSignIn.appendChild(button);
          return;
        }
        const renderButton = () => {
          if (!window.google?.accounts?.id) return;
          googleSignIn.replaceChildren();
          window.google.accounts.id.initialize({
            client_id: config.googleClientId,
            callback: async (response) => {
              try {
                const login = await apiRequest('/api/auth/google', {
                  method: 'POST',
                  body: JSON.stringify({
                    idToken: response.credential,
                    name: onlineNameInput.value.trim() || null
                  })
                });
                onlineToken = login.token;
                onlinePlayer = login.player;
                localStorage.setItem('will-of-many-online-token', onlineToken);
                renderOnlineProfile();
                await refreshOnlineLobby();
                onlineStatus.textContent = 'Conta conectada. Entre na fila para encontrar uma partida.';
              } catch (error) {
                showOnlineError(
                  `Falha no login Google: ${error.message}`,
                  error,
                  'Enviando a credencial Google ao servidor',
                  new URL('/api/auth/google', location.href).href
                );
              }
            }
          });
          window.google.accounts.id.renderButton(googleSignIn, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular'
          });
        };
        if (window.google?.accounts?.id) {
          renderButton();
          return;
        }
        if (!googleScriptPromise) {
          googleScriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = () => reject(addOnlineErrorDetails(
              new Error('O navegador não conseguiu carregar o script do login Google.'),
              {
                stage: 'Carregando o login do Google',
                endpoint: script.src
              }
            ));
            document.head.appendChild(script);
          });
        }
        currentStage = 'Carregando o login do Google';
        currentEndpoint = 'https://accounts.google.com/gsi/client';
        await googleScriptPromise;
        if (!window.google?.accounts?.id) {
          throw addOnlineErrorDetails(
            new Error('O script carregou, mas o botão de login Google não ficou disponível.'),
            { stage: currentStage, endpoint: currentEndpoint }
          );
        }
        renderButton();
      } catch (error) {
        showOnlineError(
          `Servidor online indisponível: ${error.message}`,
          error,
          currentStage,
          currentEndpoint
        );
      }
    }

    window.onAndroidGoogleSignIn = (resultPayload) => {
      let result;
      try {
        result = typeof resultPayload === 'string' ? JSON.parse(resultPayload) : resultPayload;
      } catch (error) {
        showOnlineError(
          `Resposta do login Android inválida: ${error.message}`,
          error,
          'Recebendo a conta Google do Android'
        );
        return;
      }
      const button = googleSignIn.querySelector('button');
      if (button) button.disabled = false;
      if (result?.type === 'cancelled') {
        onlineStatus.textContent = 'Login cancelado. Toque em Entrar com Google para tentar novamente.';
        return;
      }
      if (result?.type !== 'success' || !result.idToken) {
        const error = new Error(result?.message || 'O Android não retornou uma credencial Google.');
        showOnlineError(
          `Falha no login Google: ${error.message}`,
          error,
          'Selecionando uma conta Google no Android'
        );
        return;
      }
      completeGoogleLogin(result.idToken);
    };

    async function completeGoogleLogin(idToken) {
      try {
        const login = await apiRequest('/api/auth/google', {
          method: 'POST',
          body: JSON.stringify({
            idToken,
            name: onlineNameInput.value.trim() || null
          })
        });
        onlineToken = login.token;
        onlinePlayer = login.player;
        localStorage.setItem('will-of-many-online-token', onlineToken);
        renderOnlineProfile();
        await refreshOnlineLobby();
        onlineStatus.textContent = 'Conta conectada. Entre na fila para encontrar uma partida.';
      } catch (error) {
        showOnlineError(
          `Falha no login Google: ${error.message}`,
          error,
          'Validando a credencial Google no servidor',
          new URL('/api/auth/google', location.href).href
        );
      }
    }

    function renderOnlineProfile() {
      onlineProfile.textContent = `${onlinePlayer.name} · Elo ${onlinePlayer.elo} · ${onlinePlayer.email}`;
      onlineProfile.classList.remove('is-hidden');
      googleSignIn.classList.add('is-hidden');
      onlineMatchButton.classList.remove('is-hidden');
      onlineCancelButton.classList.add('is-hidden');
    }

    async function restoreOnlineSession() {
      if (!onlineToken || onlineSessionLoading) return;
      onlineSessionLoading = true;
      try {
        onlinePlayer = await apiRequest('/api/me');
        renderOnlineProfile();
        onlineStatus.textContent = 'Sessão restaurada.';
        await refreshOnlineLobby();
      } catch (error) {
        onlineToken = '';
        onlinePlayer = null;
        localStorage.removeItem('will-of-many-online-token');
        onlineProfile.classList.add('is-hidden');
        googleSignIn.classList.remove('is-hidden');
        onlineMatchButton.classList.add('is-hidden');
        showOnlineError(
          `Não foi possível restaurar a sessão: ${error.message}`,
          error,
          'Restaurando a sessão',
          new URL('/api/me', location.href).href
        );
      } finally {
        onlineSessionLoading = false;
      }
    }

    async function refreshOnlineLobby() {
      if (!onlineToken || !onlineOptions || onlineOptions.classList.contains('is-hidden')) return;
      try {
        const lobby = await apiRequest('/api/lobby');
        onlineLobby.textContent = lobby.waitingPlayers.length
          ? `Aguardando: ${lobby.waitingPlayers.map((player) =>
            `${player.name} (${player.elo})`).join(' · ')}`
          : 'Nenhum jogador aguardando no lobby.';
      } catch (error) {
        onlineLobby.textContent = error.message;
        showOnlineError(
          `Não foi possível atualizar o lobby: ${error.message}`,
          error,
          'Consultando o lobby',
          new URL('/api/lobby', location.href).href
        );
      }
    }

    async function enterOnlineQueue() {
      try {
        await apiRequest('/api/matchmaking/join', { method: 'POST', body: '{}' });
        onlineMatchButton.classList.add('is-hidden');
        onlineCancelButton.classList.remove('is-hidden');
        onlineStatus.textContent = 'Buscando adversário com Elo próximo...';
        if (matchmakingPoll) window.clearInterval(matchmakingPoll);
        matchmakingPoll = window.setInterval(pollOnlineMatch, 2000);
        await pollOnlineMatch();
      } catch (error) {
        showOnlineError(
          `Não foi possível entrar na fila: ${error.message}`,
          error,
          'Entrando na fila de partidas',
          new URL('/api/matchmaking/join', location.href).href
        );
      }
    }

    async function pollOnlineMatch() {
      try {
        const status = await apiRequest('/api/matchmaking/status');
        if (status.status === 'matched') {
          if (matchmakingPoll) window.clearInterval(matchmakingPoll);
          matchmakingPoll = null;
          onlineCancelButton.classList.add('is-hidden');
          onlineStatus.textContent = `Adversário encontrado: ${status.opponent.name} · Elo ${status.opponent.elo}. Você joga de ${status.team === 'orange' ? 'laranja' : 'azul'}.`;
          connectOnlineMatch(status);
        } else if (status.status === 'waiting') {
          onlineStatus.textContent = `Aguardando adversário · ${status.waitingSeconds}s`;
          await refreshOnlineLobby();
        } else if (status.status === 'idle') {
          if (matchmakingPoll) window.clearInterval(matchmakingPoll);
          matchmakingPoll = null;
          onlineCancelButton.classList.add('is-hidden');
          onlineMatchButton.classList.remove('is-hidden');
        }
      } catch (error) {
        showOnlineError(
          `Falha ao consultar a partida: ${error.message}`,
          error,
          'Consultando a partida',
          new URL('/api/matchmaking/status', location.href).href
        );
        if (matchmakingPoll) window.clearInterval(matchmakingPoll);
        matchmakingPoll = null;
      }
    }

    async function leaveOnlineQueue() {
      if (matchmakingPoll) window.clearInterval(matchmakingPoll);
      matchmakingPoll = null;
      try {
        await apiRequest('/api/matchmaking/leave', { method: 'POST', body: '{}' });
        onlineStatus.textContent = 'Busca cancelada.';
        onlineCancelButton.classList.add('is-hidden');
        onlineMatchButton.classList.remove('is-hidden');
        await refreshOnlineLobby();
      } catch (error) {
        showOnlineError(
          `Não foi possível cancelar a busca: ${error.message}`,
          error,
          'Cancelando a busca',
          new URL('/api/matchmaking/leave', location.href).href
        );
      }
    }

    function connectOnlineMatch(status) {
      onlineTeam = status.team;
      onlineMatchId = status.matchId;
      onlineOpponent = status.opponent;
      onlineGameStartPending = false;
      gameMode = 'online';
      humanTeam = onlineTeam;
      aiTeam = null;
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      const socketEndpoint = `${protocol}//${location.host}/ws/game`;
      try {
        onlineSocket = new WebSocket(
          `${socketEndpoint}?matchId=${encodeURIComponent(onlineMatchId)}&token=${encodeURIComponent(onlineToken)}`
        );
      } catch (error) {
        showOnlineError(
          `Não foi possível abrir a conexão da partida: ${error.message}`,
          addOnlineErrorDetails(error, {
            stage: 'Abrindo WebSocket da partida',
            endpoint: socketEndpoint
          }),
          'Abrindo WebSocket da partida',
          socketEndpoint
        );
        return;
      }
      onlineSocket.addEventListener('open', () => {
        updateWarAvailability();
        onlineStatus.textContent = 'Conectado ao servidor da partida.';
      });
      onlineSocket.addEventListener('message', (event) => {
        try {
          receiveOnlineMessage(JSON.parse(event.data));
        } catch (error) {
          onlineStatus.textContent = `Mensagem online inválida: ${error.message}`;
        }
      });
      onlineSocket.addEventListener('close', () => {
        onlineGameStartPending = false;
        onlineStatus.textContent = 'Conexão com a partida encerrada.';
        updateWarAvailability();
        updateTurnState();
      });
      onlineSocket.addEventListener('error', () => {
        const error = addOnlineErrorDetails(
          new Error('O navegador não conseguiu estabelecer o WebSocket da partida.'),
          {
            stage: 'Conectando ao WebSocket da partida',
            endpoint: socketEndpoint
          }
        );
        showOnlineError(
          'Falha na conexão online. Verifique a rede e o endereço do servidor.',
          error,
          'Conectando ao WebSocket da partida',
          socketEndpoint
        );
      });
    }

    function startOnlineMatchWhenReady() {
      if (!onlineGameStartPending || !allRegionMasks ||
          !onlineSocket || onlineSocket.readyState !== WebSocket.OPEN) return;
      onlineGameStartPending = false;
      if (!selectedStartSpeed) selectedStartSpeed = '1';
      beginConfiguredGame();
    }

    function receiveOnlineMessage(message) {
      if (message.type === 'error') {
        if (onlineSurrenderPending) {
          onlineSurrenderPending = false;
          confirmAbandonMatchButton.disabled = false;
        }
        onlineStatus.textContent = message.message || 'Erro na partida online.';
        return;
      }
      if (message.type === 'match_ready') {
        if (message.team !== onlineTeam || message.matchId !== onlineMatchId) {
          onlineStatus.textContent = 'O servidor retornou uma partida diferente da esperada.';
          return;
        }
        if (onlineTeam === 'orange' && message.gameStarted !== true) {
          onlineGameStartPending = true;
          onlineStatus.textContent = 'Partida encontrada. Preparando o tabuleiro...';
          startOnlineMatchWhenReady();
        } else if (onlineTeam === 'blue') {
          onlineStatus.textContent = message.gameStarted === true
            ? 'Partida em andamento. Sincronizando estado...'
            : 'Conectado. Aguardando o anfitrião iniciar a partida...';
        } else {
          onlineStatus.textContent = 'Partida em andamento. Sincronizando estado...';
        }
        return;
      }
      if (message.type === 'game_action') {
        applyBluetoothAction(message);
        return;
      }
      if (message.type === 'game_start' || message.type === 'game_state') {
        if (!message.state?.regionPiecesByRegion) {
          onlineStatus.textContent = 'Estado recebido do servidor está inválido.';
          return;
        }
        gameMode = 'online';
        localStorage.setItem('will-of-many-save', JSON.stringify({
          ...message.state,
          gameMode: 'online',
          humanTeam: onlineTeam,
          aiTeam: null
        }));
        if (!loadSavedGame()) return;
        gameMode = 'online';
        humanTeam = onlineTeam;
        aiTeam = null;
        recalculateRegionForces();
        refreshRegionVisuals();
        renderPiecePurchaseButtons();
        focusStrongestRegionForTeam(currentTeam);
        updateRotationControls();
        updateTurnState();
        updateWarAvailability();
        updateSelectedRegionPanel(selectedRegionCode);
        if (message.type === 'game_start') {
          onlineStatus.textContent = `Partida iniciada contra ${onlineOpponent?.name || 'adversário'}.`;
          showGameBoard();
        } else if (message.state.lastRoundResult?.round === currentTurn - 1) {
          showTurnTransition(message.state.lastRoundResult);
        }
        return;
      }
      if (message.type === 'war_request' && onlineTeam === 'orange') {
        startWar(false);
        return;
      }
      if (message.type === 'war_start' && onlineTeam === 'blue' && !isWarRunning) {
        startWar(false, true);
        return;
      }
      if (message.type === 'game_over') {
        onlineSurrenderPending = false;
        confirmAbandonMatchButton.disabled = false;
        const scores = message.victoryPoints;
        if (scores && typeof scores === 'object') {
          victoryPoints = {
            orange: Math.max(0, Number(scores.orange) || 0),
            blue: Math.max(0, Number(scores.blue) || 0)
          };
        }
        finishGame(message.winner === 'orange' || message.winner === 'blue' ? message.winner : null,
          message.reason === 'center' ? 'center' :
            message.reason === 'inactivity' ? 'inactivity' :
              message.reason === 'surrender' ? 'surrender' : 'turn30', false);
        const resultMessage = message.reason === 'inactivity'
          ? message.inactiveTeam === onlineTeam
            ? 'Você perdeu por ficar mais de 40 segundos sem interagir.'
            : 'Seu adversário perdeu por inatividade.'
          : message.reason === 'surrender'
            ? message.surrenderingTeam === onlineTeam
              ? 'Você abandonou a partida. Derrota registrada.'
              : 'Seu adversário abandonou a partida. Vitória por abandono.'
            : 'Partida encerrada.';
        onlineStatus.textContent = `${resultMessage} Elo atualizado: Laranja ${message.orange?.elo ?? '-'} · Azul ${message.blue?.elo ?? '-'}.`;
      }
    }

    function refreshBluetoothDeviceList(devices) {
      bluetoothDevices.replaceChildren();
      devices.forEach((device) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'start-confirm';
        button.textContent = device.name || device.address;
        button.addEventListener('click', () => {
          bluetoothRole = 'guest';
          startMessage.textContent = `Conectando a ${device.name || device.address}...`;
          window.AndroidBluetooth.connect(device.address);
        });
        bluetoothDevices.appendChild(button);
      });
    }

    function applyBluetoothAction(message) {
      const { action, state } = message;
      if (!action || !state?.regionPiecesByRegion || !action.type || !action.team) {
        startMessage.textContent = 'Ação Bluetooth recebida em formato inválido.';
        return;
      }
      if (action.team !== state.currentTeam) {
        startMessage.textContent = 'Ação Bluetooth ignorada: equipe incompatível com o estado da partida.';
        return;
      }

      if (action.source) focusActionRegion(action.source, action.target);
      const source = action.source;
      const rotationVersion = rotationAnimationVersion;
      isApplyingBluetoothAction = true;
      try {
        if (action.type === 'buy' && source && action.stage) {
          selectedRegionCode = source;
          addPiece(action.team, action.stage);
        } else if (action.type === 'move' && source && action.target && Number.isInteger(action.amount)) {
          selectedRegionCode = source;
          performMoveTo(action.target, action.amount);
        } else if (action.type === 'promote' && source && action.target && Number.isInteger(action.amount)) {
          selectedRegionCode = source;
          performPromotion(action.target, action.amount);
        } else if (action.type === 'relegate' && source && action.target && action.stage) {
          selectedRegionCode = source;
          performRelegation(action.target, action.stage);
        } else if (action.type === 'recycle' && source && action.stage) {
          selectedRegionCode = source;
        } else if (action.type === 'rotate' && Number.isInteger(action.layer)) {
          updateRotationControls();
          const direction = action.direction === 'left' ? 'left' : 'right';
          let button = [...controls.querySelectorAll('.layer-button[data-rotation-block]')]
            .find((candidate) =>
              candidate.dataset.rotationBlock === action.block &&
              candidate.dataset.disco === action.disco &&
              Number(candidate.dataset.layer) === action.layer &&
              candidate.dataset.direction === direction);
          let circularDisksOnLayer = 0;
          if (!button && !action.block && !action.disco) {
            const layerDisks = new Map();
            getRotatableCircularBlocks().forEach((block) => {
              (block.regions || []).forEach((region) => {
                const layer = Number(region.layer ||
                  String(region.rank || region.code || region.name).match(/L(\d+)/)?.[1]);
                if (layer === action.layer) {
                  layerDisks.set(getCircularDiskKey(block.name, getRegionDiskName(region)), {
                    block: block.name,
                    disco: getRegionDiskName(region)
                  });
                }
              });
            });
            circularDisksOnLayer = layerDisks.size;
            if (layerDisks.size === 1) {
              const [{ block, disco }] = layerDisks.values();
              button = [...controls.querySelectorAll('.layer-button[data-rotation-block]')]
                .find((candidate) => candidate.dataset.rotationBlock === block &&
                  candidate.dataset.disco === disco &&
                  candidate.dataset.direction === direction);
            }
          }
          if (!button && !action.block && !action.disco && circularDisksOnLayer === 0) {
            button = [...controls.querySelectorAll('.layer-button:not([data-rotation-block])')]
              .find((candidate) => Number(candidate.dataset.layer) === action.layer &&
                candidate.dataset.direction === direction);
          }
          if (!button && circularDisksOnLayer > 1) {
            startMessage.textContent = 'A rotação recebida não identifica qual disco circular deve girar.';
          }
          if (button) button.click();
        } else {
          startMessage.textContent = 'Ação Bluetooth desconhecida; atualizando o estado recebido.';
        }
      } finally {
        isApplyingBluetoothAction = false;
      }

      localStorage.setItem('will-of-many-save', JSON.stringify(state));
      if (!loadSavedGame()) {
        startMessage.textContent = 'Não foi possível aplicar o estado recebido pelo Bluetooth.';
        return;
      }
      const regionChangedByRotation = action.type === 'rotate' && rotationAnimationVersion > rotationVersion;
      if (!regionChangedByRotation) {
        recalculateRegionForces();
        refreshRegionVisuals();
      }
      selectedRegionCode = action.target || action.source || selectedRegionCode;
      if (selectedRegionCode && action.type !== 'rotate') focusRegion(selectedRegionCode);
      updateRotationControls();
      renderPiecePurchaseButtons();
      updateTurnState();
      updateWarAvailability();
      updateSelectedRegionPanel(selectedRegionCode);
      if (action.type === 'recycle' &&
          Object.prototype.hasOwnProperty.call(soldierWeights, action.stage)) {
        const refund = getRecycleRefund(source, action.stage);
        showActionFeedback(source, refund, 'recycle', '+');
      }
      const teamLabel = action.team === 'orange' ? 'Laranja' : 'Azul';
      const actionLabel = {
        buy: `comprou uma peça ${String(action.stage || '').toUpperCase()} em ${source}`,
        move: `moveu ${action.amount} unidade(s): ${source} → ${action.target}`,
        promote: `promoveu ${action.amount} unidade(s): ${source} → ${action.target}`,
        relegate: `rebaixou uma peça ${String(action.stage || '').toUpperCase()}: ${source} → ${action.target}`,
        recycle: `reciclou uma peça ${String(action.stage || '').toUpperCase()} em ${source}`,
        rotate: `girou o disco L${action.layer} para a ${action.direction === 'left' ? 'esquerda' : 'direita'}`
      }[action.type] || 'realizou uma ação';
      readout.textContent = `${teamLabel} ${actionLabel}.`;
      if (!isOnlineGame()) finishIfCenterConquered(false);
    }

    function receiveBluetoothMessage(message) {
      if (!message || typeof message !== 'object') return;
      if (message.type === 'game_over') {
        const scores = message.victoryPoints;
        if (scores && typeof scores === 'object') {
          victoryPoints = {
            orange: Math.max(0, Number(scores.orange) || 0),
            blue: Math.max(0, Number(scores.blue) || 0)
          };
        }
        const winner = message.winner === 'orange' || message.winner === 'blue'
          ? message.winner
          : null;
        finishGame(winner, message.reason === 'center' ? 'center' : 'turn30', false);
        return;
      }
      if (message.type === 'game_action') {
        applyBluetoothAction(message);
        return;
      }
      if (message.type === 'game_start' || message.type === 'game_state') {
        if (!message.state || !message.state.regionPiecesByRegion) {
          startMessage.textContent = 'O outro aparelho enviou um estado de jogo inválido.';
          return;
        }
        gameMode = 'bluetooth';
        if (bluetoothRole !== 'host') bluetoothRole = 'guest';
        humanTeam = bluetoothRole === 'host' ? 'orange' : 'blue';
        aiTeam = null;
        localStorage.setItem('will-of-many-save', JSON.stringify(message.state));
        if (!loadSavedGame()) {
          startMessage.textContent = 'Não foi possível carregar o estado recebido pelo Bluetooth.';
          return;
        }
        recalculateRegionForces();
        refreshRegionVisuals();
        renderPiecePurchaseButtons();
        updateRotationControls();
        if (message.type === 'game_start') {
          showGameBoard();
        } else {
          focusStrongestRegionForTeam(currentTeam);
          updateTurnState();
          updateWarAvailability();
          updateSelectedRegionPanel(selectedRegionCode);
          if (currentTurn === 30 && !isWarRunning && !isGameOver) startWar(true);
        }
        startMessage.textContent = '';
        return;
      }
      if (message.type === 'request_game' && bluetoothRole === 'host' && startScreen.classList.contains('is-hidden')) {
        sendBluetoothMessage({
          type: 'game_start',
          state: JSON.parse(localStorage.getItem('will-of-many-save'))
        });
        return;
      }
      if (message.type === 'request_game' && bluetoothRole === 'host' && !startScreen.classList.contains('is-hidden')) {
        beginConfiguredGame();
        return;
      }
      if (message.type === 'war_request' && bluetoothRole === 'host' && isGameStarted) {
        startWar(false);
        return;
      }
      if (message.type === 'war_start' && bluetoothRole === 'guest' && isGameStarted && !isWarRunning) {
        startWar(false);
      }
    }

    window.onBluetoothEvent = (eventPayload) => {
      let event;
      try {
        event = typeof eventPayload === 'string' ? JSON.parse(eventPayload) : eventPayload;
      } catch (error) {
        startMessage.textContent = `Mensagem Bluetooth inválida: ${error.message}`;
        return;
      }
      if (event.type === 'status') {
        const message = event.message || '';
        startMessage.textContent = message;
        if (isGameStarted) readout.textContent = message;
      } else if (event.type === 'error') {
        const message = event.message || 'Falha na conexão Bluetooth.';
        startMessage.textContent = message;
        if (isGameStarted) readout.textContent = message;
      } else if (event.type === 'devices') {
        refreshBluetoothDeviceList(event.devices || []);
        startMessage.textContent = event.devices?.length ? 'Selecione o aparelho anfitrião.' : 'Nenhum aparelho encontrado. Deixe a sala visível e tente novamente.';
      } else if (event.type === 'connected') {
        bluetoothConnected = true;
        startMessage.textContent = 'Bluetooth conectado.';
        if (bluetoothRole === 'host') {
          if (startScreen.classList.contains('is-hidden')) {
            sendBluetoothMessage({
              type: 'game_start',
              state: JSON.parse(localStorage.getItem('will-of-many-save'))
            });
          } else {
            beginConfiguredGame();
          }
        } else {
          sendBluetoothMessage({ type: 'request_game' });
        }
      } else if (event.type === 'disconnected') {
        bluetoothConnected = false;
        startMessage.textContent = 'Conexão Bluetooth encerrada.';
        if (isGameStarted) {
          readout.textContent = 'Conexão Bluetooth encerrada. Ações bloqueadas até reconectar.';
          updateTurnState();
          updateWarAvailability();
          updateRotationControls();
        }
      } else if (event.type === 'message') {
        try {
          receiveBluetoothMessage(JSON.parse(event.message));
        } catch (error) {
          startMessage.textContent = `Mensagem de partida inválida: ${error.message}`;
        }
      }
    };

    document.querySelectorAll('#game-mode-options button').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.mode === 'online' &&
            location.protocol === 'file:' &&
            window.AndroidBluetooth?.openOnlineGame) {
          startMessage.textContent = 'Abrindo a versão online segura...';
          window.AndroidBluetooth.openOnlineGame();
          return;
        }
        gameMode = button.dataset.mode;
        if (gameMode === 'online' || gameMode === 'campaign') selectedStartSpeed = '1';
        if (gameMode === 'campaign') {
          selectedStartColor = 'orange';
          selectedCampaignLevelId = getUnlockedCampaignLevelId();
        }
        updateStartModeSelection();
        startMessage.textContent = gameMode === 'bluetooth' && !window.AndroidBluetooth
          ? 'O modo Bluetooth está disponível somente no aplicativo Android.'
          : '';
        if (gameMode === 'online') {
          loadGoogleIdentityButton();
          if (onlineToken) restoreOnlineSession();
          if (lobbyPoll) window.clearInterval(lobbyPoll);
          lobbyPoll = window.setInterval(refreshOnlineLobby, 5000);
        } else if (lobbyPoll) {
          window.clearInterval(lobbyPoll);
          lobbyPoll = null;
        }
      });
    });

    onlineMatchButton.addEventListener('click', enterOnlineQueue);
    onlineCancelButton.addEventListener('click', leaveOnlineQueue);
    abandonMatchButton.addEventListener('click', () => {
      if (!isOnlineGame() || !isGameStarted || isGameOver || onlineSurrenderPending) return;
      abandonMatchModal.classList.remove('is-hidden');
      confirmAbandonMatchButton.focus({ preventScroll: true });
    });
    confirmAbandonMatchButton.addEventListener('click', () => {
      if (!isOnlineGame() || !isGameStarted || isGameOver || onlineSurrenderPending) return;
      confirmAbandonMatchButton.disabled = true;
      const sent = sendOnlineMessage({ type: 'game_surrender' });
      if (!sent) {
        confirmAbandonMatchButton.disabled = false;
        return;
      }
      onlineSurrenderPending = true;
      onlineStatus.textContent = 'Enviando pedido para abandonar a partida...';
      closeModal(abandonMatchModal);
    });
    onlineCopyDiagnosticsButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(onlineDiagnosticsText.textContent);
        onlineCopyDiagnosticsButton.textContent = 'Diagnóstico copiado';
      } catch (error) {
        onlineCopyDiagnosticsButton.textContent = 'Selecione o texto acima e copie';
      }
    });

    bluetoothHostButton.addEventListener('click', () => {
      if (!selectedStartSpeed) {
        startMessage.textContent = 'Escolha a velocidade de moedas antes de criar a sala.';
        return;
      }
      if (!window.AndroidBluetooth) {
        startMessage.textContent = 'O modo Bluetooth está disponível somente no aplicativo Android.';
        return;
      }
      bluetoothRole = 'host';
      bluetoothConnected = false;
      gameMode = 'bluetooth';
      gameSpeed = Number(selectedStartSpeed);
      startMessage.textContent = 'Preparando sala Bluetooth...';
      window.AndroidBluetooth.createRoom();
    });

    bluetoothSearchButton.addEventListener('click', () => {
      if (!window.AndroidBluetooth) {
        startMessage.textContent = 'O modo Bluetooth está disponível somente no aplicativo Android.';
        return;
      }
      bluetoothRole = 'guest';
      bluetoothConnected = false;
      bluetoothDevices.replaceChildren();
      startMessage.textContent = 'Procurando salas Bluetooth próximas...';
      window.AndroidBluetooth.discover();
    });

    async function beginConfiguredGame() {
      if (gameMode === 'campaign') {
        try {
          await loadBoardFile(campaignLevelFiles[selectedCampaignLevelId] || campaignLevelFiles['tabuleiro-01']);
        } catch (error) {
          startMessage.textContent = `Não foi possível carregar o level da campanha: ${error.message}`;
          return;
        }
      }
      if ((gameMode === 'ai' && !selectedStartColor) ||
          (gameMode === 'campaign' && !campaignBoardConfig) ||
          (!selectedStartSpeed && !isOnlineGame()) || !allRegionMasks) {
        startMessage.textContent = 'Escolha as opções da partida antes de começar.';
        return;
      }
      humanTeam = gameMode === 'online' ? onlineTeam :
        gameMode === 'bluetooth' ? 'orange' :
          (gameMode === 'ai' ? selectedStartColor : 'orange');
      aiTeam = gameMode === 'ai' ? (humanTeam === 'orange' ? 'blue' : 'orange')
        : gameMode === 'campaign' ? 'blue' : null;
      gameSpeed = isOnlineGame() || gameMode === 'campaign' ? 1 : Number(selectedStartSpeed);
      activeCampaignLevel = gameMode === 'campaign' ? campaignBoardConfig : null;
      localStorage.removeItem('will-of-many-save');
      resetGameState();
      placeBoardInitialPieces();
      if (isCampaignGame()) {
        campaignObjectiveRegions = [...(activeCampaignLevel.objectiveRegions || [])];
        campaignIntroPending = activeCampaignLevel.id === 'tabuleiro-01';
        campaignGuideStep = campaignIntroPending
          ? 'intro'
          : activeCampaignLevel.id === 'tabuleiro-02' ? 'level2-intro' : 'complete';
        campaignLevel2SeenSectors = [];
        if (!campaignObjectiveRegions.length) {
          startMessage.textContent = 'O level da campanha não define regiões iniciais azuis para conquistar.';
          isGameStarted = false;
          return;
        }
        const startingCoins = Number(activeCampaignLevel.initialCoins);
        const campaignStartingBalance = Number.isFinite(startingCoins)
          ? Math.max(0, startingCoins)
          : getCampaignCoinsPerTurn(activeCampaignLevel);
        pontosDoTurn.orange = campaignStartingBalance;
        pontosDoTurn.blue = activeCampaignLevel.aiActionsEnabled === false
          ? 0
          : campaignStartingBalance;
      }
      renderBoardLayers();
      for (let layer = 1; layer <= 8; layer += 1) {
        if (allRegionMasks[layer]) recomputeNeighborCacheForLayer(layer);
      }
      recalculateRegionForces();
      if (isCampaignGame()) focusStrongestRegionForTeam('orange');
      const wheatReport = isCampaignGame() ? null : applyWheatForTurn(currentTeam);
      refreshRegionVisuals();
      updateRotationControls();
      updateSelectedRegionPanel();
      saveGame();
      showGameBoard();
      const wheatMessage = getWheatShortageMessage(wheatReport);
      if (wheatMessage) readout.textContent = wheatMessage;
      if (gameMode === 'bluetooth' && bluetoothRole === 'host') {
        sendBluetoothMessage({
          type: 'game_start',
          state: JSON.parse(localStorage.getItem('will-of-many-save'))
        });
      }
      if (isOnlineGame() && onlineTeam === 'orange') {
        sendOnlineMessage({
          type: 'game_start',
          state: JSON.parse(localStorage.getItem('will-of-many-save'))
        });
      }
    }

    function updateStartModeSelection() {
      selectStartOption('#game-mode-options button', 'mode', gameMode);
      colorOptionsGroup.classList.toggle('is-hidden', gameMode !== 'ai');
      document.querySelector('#color-choice-label').classList.toggle('is-hidden', gameMode !== 'ai');
      localModeHint.classList.toggle('is-hidden', gameMode !== 'local');
      bluetoothOptions.classList.toggle('is-hidden', gameMode !== 'bluetooth');
      onlineOptions.classList.toggle('is-hidden', gameMode !== 'online');
      document.querySelector('#speed-options').classList.toggle('is-hidden', gameMode === 'online' || gameMode === 'campaign');
      document.querySelector('#speed-choice-label').classList.toggle('is-hidden', gameMode === 'online' || gameMode === 'campaign');
      startGameButton.classList.toggle('is-hidden', gameMode === 'bluetooth' || gameMode === 'online');
      startGameButton.disabled = gameMode === 'ai'
        ? !selectedStartColor || !selectedStartSpeed
        : gameMode === 'campaign' ? false : !selectedStartSpeed;
      bluetoothDevices.replaceChildren();
    }

    async function continueSavedGame() {
      let saved;
      try {
        saved = JSON.parse(localStorage.getItem('will-of-many-save') || 'null');
      } catch (error) {
        startMessage.textContent = `Não foi possível ler o jogo salvo: ${error.message}`;
        return;
      }
      if (saved?.gameMode === 'bluetooth' && !bluetoothConnected) {
        startMessage.textContent = 'Uma partida Bluetooth desconectada não pode ser retomada. Inicie uma nova sala.';
        return;
      }
      if (saved?.gameMode === 'campaign') {
        selectedCampaignLevelId = campaignLevelFiles[saved.campaignLevelId]
          ? saved.campaignLevelId
          : getUnlockedCampaignLevelId();
        try {
          await loadBoardFile(campaignLevelFiles[selectedCampaignLevelId]);
        } catch (error) {
          startMessage.textContent = `Não foi possível carregar o level salvo: ${error.message}`;
          return;
        }
      }
      if (!loadSavedGame()) {
        startMessage.textContent = 'Nenhum jogo salvo foi encontrado.';
        return;
      }
      refreshRegionVisuals();
      recalculateRegionForces();
      updateSelectedRegionPanel(selectedRegionCode);
      showGameBoard();
    }

    startMenu.addEventListener('click', (event) => {
      const action = event.target.closest('button')?.dataset.startAction;
      if (action === 'new') {
        startMenu.classList.add('is-hidden');
        newGameOptions.classList.remove('is-hidden');
        startMessage.textContent = '';
      }
      if (action === 'continue') continueSavedGame();
      if (action === 'exit') {
        startMessage.textContent = 'Até a próxima partida.';
        startMenu.classList.add('is-hidden');
        window.setTimeout(() => {
          window.close();
          startMenu.classList.remove('is-hidden');
        }, 250);
      }
    });
    function renderTutorialSlide(index) {
      currentTutorialSlide = Math.max(0, Math.min(index, tutorialSlides.length - 1));
      tutorialSlides.forEach((slide, slideIndex) => {
        slide.hidden = slideIndex !== currentTutorialSlide;
      });
      tutorialDots.forEach((dot, dotIndex) => {
        if (dotIndex === currentTutorialSlide) dot.setAttribute('aria-current', 'step');
        else dot.removeAttribute('aria-current');
      });
      tutorialCounter.textContent = `${currentTutorialSlide + 1} / ${tutorialSlides.length}`;
      tutorialPreviousButton.disabled = currentTutorialSlide === 0;
      tutorialNextButton.textContent = currentTutorialSlide === tutorialSlides.length - 1 ? 'Concluir' : 'Próximo';
    }

    function closeTutorial() {
      tutorialModal.classList.add('is-hidden');
      tutorialModal.setAttribute('aria-hidden', 'true');
      tutorialOpenButton.focus({ preventScroll: true });
    }

    tutorialOpenButton.addEventListener('click', () => {
      renderTutorialSlide(0);
      tutorialModal.classList.remove('is-hidden');
      tutorialModal.setAttribute('aria-hidden', 'false');
      tutorialCloseButton.focus({ preventScroll: true });
    });
    tutorialCloseButton.addEventListener('click', closeTutorial);
    tutorialPreviousButton.addEventListener('click', () => renderTutorialSlide(currentTutorialSlide - 1));
    tutorialNextButton.addEventListener('click', () => {
      if (currentTutorialSlide === tutorialSlides.length - 1) closeTutorial();
      else renderTutorialSlide(currentTutorialSlide + 1);
    });
    tutorialDots.forEach((dot) => {
      dot.addEventListener('click', () => renderTutorialSlide(Number(dot.dataset.tutorialGoto)));
    });
    tutorialModal.addEventListener('click', (event) => {
      if (event.target === tutorialModal) closeTutorial();
    });
    document.addEventListener('keydown', (event) => {
      if (tutorialModal.classList.contains('is-hidden')) return;
      if (event.key === 'Escape') closeTutorial();
      if (event.key === 'ArrowLeft') renderTutorialSlide(currentTutorialSlide - 1);
      if (event.key === 'ArrowRight') {
        if (currentTutorialSlide === tutorialSlides.length - 1) closeTutorial();
        else renderTutorialSlide(currentTutorialSlide + 1);
      }
    });
    document.querySelectorAll('#color-options button').forEach((button) => {
      button.addEventListener('click', () => {
        selectedStartColor = button.dataset.color;
        selectStartOption('#color-options button', 'color', selectedStartColor);
        startGameButton.disabled = !selectedStartSpeed || gameMode !== 'ai';
      });
    });
    document.querySelectorAll('#speed-options button').forEach((button) => {
      button.addEventListener('click', () => {
        selectedStartSpeed = button.dataset.speed;
        selectStartOption('#speed-options button', 'speed', selectedStartSpeed);
        startGameButton.disabled = !selectedStartSpeed || (gameMode === 'ai' && !selectedStartColor);
      });
    });
    startGameButton.addEventListener('click', beginConfiguredGame);
    campaignMenuButton.addEventListener('click', returnCampaignToMenu);
    campaignRestartButton.addEventListener('click', restartCampaignLevel);
    finalRestartCampaignButton.addEventListener('click', restartCampaignLevel);
    campaignIntroDismiss.addEventListener('click', dismissCampaignIntro);
    campaignGuideContinue.addEventListener('click', continueCampaignGuide);
    ['pointerdown', 'click'].forEach((eventType) => {
      document.addEventListener(eventType, (event) => {
        if (!isCampaignGame() || campaignGuide.classList.contains('is-hidden') ||
            isCampaignGuideActionAllowed(event.target, eventType)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      }, true);
    });
    window.addEventListener('resize', updateCampaignGuideSpotlights);
    window.addEventListener('scroll', () => {
      if (!campaignGuide.classList.contains('is-hidden')) {
        window.requestAnimationFrame(updateCampaignGuideSpotlights);
      }
    }, true);
    stage.addEventListener('transitionend', (event) => {
      if (event.target === stage && event.propertyName === 'transform' &&
          !campaignGuide.classList.contains('is-hidden')) {
        updateCampaignGuideSpotlights();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !campaignIntro.classList.contains('is-hidden')) {
        dismissCampaignIntro();
      }
    });
    campaignNextLevelButton.addEventListener('click', async () => {
      if (!campaignNextLevelId) return;
      selectedCampaignLevelId = campaignNextLevelId;
      gameMode = 'campaign';
      finalModal.classList.add('is-hidden');
      campaignNextLevelId = null;
      await beginConfiguredGame();
    });
    startBackButton.addEventListener('click', () => {
      if (window.AndroidBluetooth && bluetoothRole && !isGameStarted) {
        window.AndroidBluetooth.disconnect();
      }
      bluetoothConnected = false;
      bluetoothRole = null;
      newGameOptions.classList.add('is-hidden');
      startMenu.classList.remove('is-hidden');
      startMessage.textContent = '';
    });
    finalMenuButton.addEventListener('click', () => {
      if (isCampaignGame()) {
        returnCampaignToMenu();
        return;
      }
      if (window.AndroidBluetooth && bluetoothConnected) {
        window.AndroidBluetooth.disconnect();
      }
      bluetoothConnected = false;
      bluetoothRole = null;
      finalModal.classList.add('is-hidden');
      app.classList.add('is-hidden');
      startMenu.classList.remove('is-hidden');
      newGameOptions.classList.add('is-hidden');
      startScreen.classList.remove('is-hidden');
      startMessage.textContent = '';
    });
    updateStartModeSelection();
    app.classList.add('is-hidden');
    updateReadout();
    updateSelectedRegionPanel();
    loadRegionMasks();
    if (new URLSearchParams(location.search).get('mode') === 'online') {
      document.querySelector('[data-start-action="new"]').click();
      document.querySelector('#game-mode-options [data-mode="online"]').click();
    }
