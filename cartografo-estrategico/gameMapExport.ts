import { buildQuadrilateralBlocksExport, DEFAULT_PARAMETERS, generateFullMap } from './mapGenerator';

function ensureStartingPointPieces(
  blocks: ReturnType<typeof buildQuadrilateralBlocksExport>['blocks'],
  startingPoints: ReturnType<typeof generateFullMap>['startingPoints'],
  L1: number,
  L2: number
) {
  const teams = new Set<string>();
  const regions = new Set<string>();

  startingPoints.forEach((startingPoint) => {
    const team = startingPoint.team === 1
      ? 'blue'
      : startingPoint.team === 2
        ? 'orange'
        : null;
    if (!team || teams.has(team)) {
      throw new Error('O mapa precisa ter um starting point para cada equipe.');
    }

    const centerX = startingPoint.x * L1 + Math.round(L1 / 2);
    const centerY = startingPoint.y * L2 + Math.round(L2 / 2);
    const matches = blocks.flatMap((block) => block.regions.filter((region) => {
      const [row, column] = region.positions[0] || [];
      return Number.isInteger(row) && Number.isInteger(column) &&
        block.C_inicial.x + (column - 1) * block.L1 === centerX &&
        block.C_inicial.y + (row - 1) * block.L2 === centerY;
    }));

    if (matches.length !== 1 || matches[0].layer !== 8 || regions.has(matches[0].code)) {
      throw new Error('Não foi possível localizar os starting points do mapa gerado.');
    }

    matches[0].initialPieces = [{ team, stage: 'g' }];
    teams.add(team);
    regions.add(matches[0].code);
  });

  if (startingPoints.length !== 2 || teams.size !== 2 || regions.size !== 2) {
    throw new Error('O mapa precisa ter dois starting points distintos, um para cada equipe.');
  }
}

export function generateRandomBoard(targetRegions: number, rotationsEnabled = false) {
  if (!Number.isFinite(targetRegions)) {
    throw new RangeError('A meta de regiões precisa ser um número finito.');
  }
  const normalizedTarget = Math.min(900, Math.max(25, Math.round(targetRegions)));
  const mapState = generateFullMap({
    ...DEFAULT_PARAMETERS,
    targetRegions: normalizedTarget,
    topologyPreset: 'hybrid',
    allowBuildingsOnStartingPoints: false,
  });
  const { blocks } = buildQuadrilateralBlocksExport(mapState, {
    L1: 1000,
    L2: 500,
    rotationEnabled: rotationsEnabled,
    linearRotationEnabled: rotationsEnabled,
  });
  const configuredBlocks = blocks.map((block) => ({
    ...block,
    rotationEnabled: rotationsEnabled,
    linearRotationEnabled: rotationsEnabled && [3, 5].includes(block.matrixSize),
  }));
  ensureStartingPointPieces(configuredBlocks, mapState.startingPoints, 1000, 500);

  return {
    boardType: 'quadrilateral',
    version: 1,
    name: `Mapa estratégico · ${mapState.regions.length} regiões`,
    displayScale: 1,
    coordinateSystem: {
      tileColumns: 226,
      tileRows: 226,
      tileSize: 4,
      tileCenterOffset: 2,
    },
    blocks: configuredBlocks,
    randomMap: {
      generator: 'cartografo-estrategico',
      generatedAt: mapState.generatedAt,
      targetRegions: normalizedTarget,
      actualRegions: mapState.regions.length,
      rotationsEnabled,
    },
  };
}
