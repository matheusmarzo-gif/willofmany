import { buildQuadrilateralBlocksExport, DEFAULT_PARAMETERS, generateFullMap } from './mapGenerator';

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
