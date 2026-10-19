/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BlockExportData,
  BlockSize,
  DEFAULT_RANK_CONTRIBUTION_MATRIX,
  EconomySummary,
  FAZENDA_YIELD,
  POVOADO_YIELD,
  GeneratorParameters,
  MapBlock,
  MapExportFormat,
  QuadrilateralBlockData,
  QuadrilateralBlocksExport,
  QuadrilateralRegionData,
  QuadrilateralRegionPiece,
  RANK_COLORS,
  RANK_POINTS,
  RankLevel,
  RegionTile,
  StartingPoint,
} from './types/map';
import { generateTopology } from './topologyGenerator';
import { propagateRanks, PropagationStepInfo } from './rankPropagation';
import { placeBuildings } from './buildingPlacer';
import { getPerimeterCycle } from './sectorRotation';

export interface FullMapState {
  regions: RegionTile[];
  regionsMap: Map<string, RegionTile>;
  blocks: MapBlock[];
  startingPoints: [StartingPoint, StartingPoint];
  bounds: { minX: number; maxX: number; minY: number; maxY: number; width: number; height: number };
  adjacency: Record<string, string[]>;
  economy: EconomySummary;
  parameters: GeneratorParameters;
  generatedAt: string;
  stepsHistory: PropagationStepInfo[];
}

export const DEFAULT_PARAMETERS: GeneratorParameters = {
  targetRegions: 150,
  topologyPreset: 'hybrid',
  weightGrid: 35,
  weightL: 30,
  weightCircular: 25,
  weightCross: 10,
  alpha: 1.5,
  beta: 0.8,
  tau: 1.0,
  buildingDensity: 28,
  povoadoRatio: 50,
  allowBuildingsOnStartingPoints: false,
};

/**
 * Generates a complete strategic map following all user constraints
 */
export function generateFullMap(params: GeneratorParameters = DEFAULT_PARAMETERS): FullMapState {
  // 1. Generate Topology and choose the 2 Starting Points at opposite extremes
  const topology = generateTopology(params);

  // 2. Propagate Ranks simultaneously from both Starting Points (L8) across all neighborhoods
  const { regions: regionsMap, adjacency: adjMap, stepsHistory } = propagateRanks(
    topology.cells,
    topology.startingPoints,
    topology.bounds,
    params.rankContributionMatrix || DEFAULT_RANK_CONTRIBUTION_MATRIX
  );

  // 3. Place Povoados and Fazendas according to the mathematical probability model
  const economy = placeBuildings(regionsMap, params);

  // 4. Convert adjacency Map to serializable record
  const adjacency: Record<string, string[]> = {};
  for (const [k, v] of adjMap.entries()) {
    adjacency[k] = v;
  }

  const regions = Array.from(regionsMap.values());

  return {
    regions,
    regionsMap,
    blocks: topology.blocks,
    startingPoints: topology.startingPoints,
    bounds: topology.bounds,
    adjacency,
    economy,
    parameters: { ...params },
    generatedAt: new Date().toISOString(),
    stepsHistory,
  };
}

export interface QuadrilateralExportOptions {
  L1?: number; // width in pixels (default 500)
  L2?: number; // length in pixels (default 500)
  rotationEnabled?: boolean; // default false
  linearRotationEnabled?: boolean; // default false
}

export type ExportFormatType = 'quadrilateral_spec' | 'blocks_detail' | 'compact_blocks' | 'standard_full';

/**
 * Builds the official Quadrilateral blocks export format:
 * "blocks": [
 *   {
 *     "name": "BQ01",
 *     "type": "quadrilateral",
 *     "matrixSize": 6,
 *     "matrix": [ [null, null, "L8-1", ...], ... ],
 *     "L1": 500,
 *     "L2": 500,
 *     "C_inicial": { "x": 250, "y": 250 },
 *     "rotationEnabled": false,
 *     "linearRotationEnabled": false,
 *     "regions": [ ... ]
 *   }
 * ]
 */
export function buildQuadrilateralBlocksExport(
  mapState: FullMapState,
  options: QuadrilateralExportOptions = {}
): QuadrilateralBlocksExport {
  const L1 = options.L1 ?? 500;
  const L2 = options.L2 ?? 500;
  const rotationEnabled = options.rotationEnabled ?? false;
  const linearRotationEnabled = options.linearRotationEnabled ?? false;

  // 1-based sequential region counter per layer (L8, L7, ...) across the ENTIRE map
  // Ensures every region in the whole map has a strictly unique code (e.g. only one L8-1, only one L8-5, etc.)
  const globalLayerCounters: Record<number, number> = {
    8: 0, 7: 0, 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0,
  };

  const blocks: QuadrilateralBlockData[] = mapState.blocks.map((b, blockIdx) => {
    const blockName = `BQ${String(blockIdx + 1).padStart(2, '0')}`;
    const matrixSize = b.size;

    // Initial center coordinates of the region in cell M(1,1) of this block.
    // Anchors the block in geographic/canvas pixel space so the user application can reconstruct block positions.
    // Notice M(1,1) may be null in the block's matrix, but C_inicial anchors cell (1,1) so any M(row,col)
    // center is simply (C_inicial.x + (col - 1) * L1, C_inicial.y + (row - 1) * L2).
    const C_inicial = {
      x: b.originX * L1 + Math.round(L1 / 2),
      y: b.originY * L2 + Math.round(L2 / 2),
    };

    // Get all regions belonging to this block
    const blockRegions = b.regionIds
      .map(id => mapState.regionsMap.get(id))
      .filter((r): r is RegionTile => !!r);

    // Sort regions row-major: top to bottom (y), then left to right (x)
    const sortedRegions = [...blockRegions].sort((r1, r2) => {
      const row1 = r1.y - b.originY;
      const row2 = r2.y - b.originY;
      if (row1 !== row2) return row1 - row2;
      const col1 = r1.x - b.originX;
      const col2 = r2.x - b.originX;
      return col1 - col2;
    });

    // Initialize 2D matrix of matrixSize x matrixSize filled with null
    const matrix: (string | null)[][] = Array.from({ length: matrixSize }, () =>
      Array(matrixSize).fill(null)
    );

    const regions: QuadrilateralRegionData[] = sortedRegions.map(r => {
      const layer = r.rank;
      globalLayerCounters[layer] = (globalLayerCounters[layer] || 0) + 1;
      const regionIndex = globalLayerCounters[layer];
      const code = `L${layer}-${regionIndex}`;

      const localRow = (r.y - b.originY) + 1;
      const localCol = (r.x - b.originX) + 1;

      if (localRow >= 1 && localRow <= matrixSize && localCol >= 1 && localCol <= matrixSize) {
        matrix[localRow - 1][localCol - 1] = code;
      }

      const initialPieces: QuadrilateralRegionPiece[] = [];
      if (r.team === 1 || (r.isStartingPoint && r.team !== 2)) {
        initialPieces.push({ team: 'blue', stage: r.piece || 'g' });
      } else if (r.team === 2) {
        initialPieces.push({ team: 'orange', stage: r.piece || 'g' });
      }

      const regionData: QuadrilateralRegionData = {
        name: code,
        code,
        rank: `L${layer}`,
        layer,
        region: regionIndex,
        shape: 'quadrilateral',
        positions: [[localRow, localCol]],
        maxPieces: layer,
        initialPieces,
      };

      if (r.building) {
        if (r.building.type === 'fazenda') {
          regionData.farmBuildingLevel = r.building.level;
        } else if (r.building.type === 'povoado') {
          regionData.villageBuildingLevel = r.building.level;
        }
      }

      return regionData;
    });

    return {
      name: blockName,
      type: 'quadrilateral',
      matrixSize,
      matrix,
      L1,
      L2,
      C_inicial,
      rotationEnabled,
      linearRotationEnabled,
      regions,
    };
  });

  return { blocks };
}

/**
 * Formats full map into clean, portable JSON for export.
 * Defaults to the official quadrilateral block specification requested by user.
 */
export function exportMapToJSON(
  mapState: FullMapState,
  formatType: ExportFormatType = 'quadrilateral_spec',
  options?: QuadrilateralExportOptions
): string {
  if (formatType === 'quadrilateral_spec') {
    const quadExport = buildQuadrilateralBlocksExport(mapState, options);
    return JSON.stringify(quadExport, null, 2);
  }

  const blocksExport: BlockExportData[] = mapState.blocks.map(b => {
    const cycle = getPerimeterCycle(b.size);
    const rotationFormula = cycle.map(([c, r]) => `M(${r + 1},${c + 1})`).join(' -> ') + ' -> M(1,1)';

    const blockRegions = b.regionIds
      .map(id => mapState.regionsMap.get(id))
      .filter((r): r is RegionTile => !!r)
      .map(r => {
        const localRow = (r.y - b.originY) + 1;
        const localCol = (r.x - b.originX) + 1;
        return {
          ...r,
          localRow,
          localCol,
          matrixNotation: `M(${localRow},${localCol})`,
        };
      });

    return {
      id: b.id,
      name: b.name,
      size: b.size,
      originX: b.originX,
      originY: b.originY,
      totalRegions: blockRegions.length,
      rotationFormula,
      regionIds: b.regionIds,
      regions: blockRegions,
    };
  });

  if (formatType === 'compact_blocks') {
    const compactExport = {
      app: 'CartografoEstrategico',
      generatedAt: mapState.generatedAt,
      totalRegions: mapState.regions.length,
      totalBlocks: mapState.blocks.length,
      startingPoints: mapState.startingPoints,
      blocks: blocksExport.map(b => ({
        id: b.id,
        name: b.name,
        size: b.size,
        origin: { x: b.originX, y: b.originY },
        rotationFormula: b.rotationFormula,
        totalRegions: b.totalRegions,
        regions: b.regions.map(r => ({
          id: r.id,
          x: r.x,
          y: r.y,
          local: { row: r.localRow, col: r.localCol, notation: r.matrixNotation },
          rank: r.rank,
          points: r.points,
          isStartingPoint: r.isStartingPoint,
          team: r.team,
          piece: r.piece,
          building: r.building,
        })),
      })),
    };
    return JSON.stringify(compactExport, null, 2);
  }

  const exportData: MapExportFormat = {
    version: '1.0.0',
    generatedAt: mapState.generatedAt,
    app: 'CartografoEstrategico',
    metadata: {
      name: `Mapa Estratégico (${mapState.regions.length} Regiões · ${mapState.blocks.length} Blocos)`,
      description: `Mapa gerado proceduralmente com ${mapState.regions.length} regiões particionadas em ${mapState.blocks.length} blocos (3x3, 4x4, 5x5), 2 starting points L8 com peça 'g', propagação estocástica de ranks e alocação de povoados e fazendas.`,
      totalRegions: mapState.regions.length,
      totalBlocks: mapState.blocks.length,
      parameters: mapState.parameters,
      economy: mapState.economy,
    },
    blocks: blocksExport,
    startingPoints: mapState.startingPoints,
    regions: mapState.regions,
    adjacency: mapState.adjacency,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Parses and validates an imported JSON map.
 * Supports standard format, block-centric format, quadrilateral BQ spec, and loose region lists.
 */
export function importMapFromJSON(jsonString: string): FullMapState {
  const parsed = JSON.parse(jsonString) as any;

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Conteúdo JSON inválido.');
  }

  const rawBlocks = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.blocks)
    ? parsed.blocks
    : null;

  // Extract regions either from top-level `regions` array or flattened from `blocks[].regions`
  let regions: RegionTile[] = [];
  let reconstructedBlocks: MapBlock[] = [];

  if (Array.isArray(parsed.regions) && parsed.regions.length > 0) {
    regions = parsed.regions;
  } else if (rawBlocks && rawBlocks.length > 0) {
    const gridCols = Math.ceil(Math.sqrt(rawBlocks.length));

    rawBlocks.forEach((b: any, blockIdx: number) => {
      const bSize: BlockSize = (b.matrixSize || b.size || 3) as BlockSize;
      const bL1 = b.L1 || 500;
      const bL2 = b.L2 || 500;
      const blockCol = blockIdx % gridCols;
      const blockRow = Math.floor(blockIdx / gridCols);

      let originX = b.origin?.x ?? b.originX;
      let originY = b.origin?.y ?? b.originY;

      // If C_inicial is available, accurately derive grid origin from C_inicial coordinates
      if (originX === undefined && b.C_inicial?.x !== undefined) {
        originX = Math.round((b.C_inicial.x - bL1 / 2) / bL1);
      }
      if (originY === undefined && b.C_inicial?.y !== undefined) {
        originY = Math.round((b.C_inicial.y - bL2 / 2) / bL2);
      }

      if (originX === undefined) originX = blockCol * (bSize + 1);
      if (originY === undefined) originY = blockRow * (bSize + 1);

      const blockId = b.id || b.name || `block-${blockIdx + 1}`;
      const blockRegionIds: string[] = [];

      if (Array.isArray(b.regions)) {
        for (const br of b.regions) {
          const localRow = br.positions?.[0]?.[0] ?? br.local?.row ?? 1;
          const localCol = br.positions?.[0]?.[1] ?? br.local?.col ?? 1;
          const rX = br.x ?? (originX + (localCol - 1));
          const rY = br.y ?? (originY + (localRow - 1));

          let rankNum = br.layer;
          if (rankNum === undefined) {
            if (typeof br.rank === 'string') {
              rankNum = parseInt(br.rank.replace(/\D/g, ''), 10);
            } else if (typeof br.rank === 'number') {
              rankNum = br.rank;
            }
          }
          const rank = ((rankNum && rankNum >= 1 && rankNum <= 8) ? rankNum : 1) as RankLevel;

          let isStartingPoint = !!br.isStartingPoint;
          let team: 1 | 2 | null = br.team ?? null;
          let piece: 'g' | null = br.piece ?? null;

          if (Array.isArray(br.initialPieces) && br.initialPieces.length > 0) {
            const firstPiece = br.initialPieces[0];
            isStartingPoint = true;
            team = (firstPiece.team === 'blue' || firstPiece.team === '1' || firstPiece.team === 1) ? 1 : 2;
            piece = 'g';
          }

          const farmLevel = br.farmBuildingLevel ?? (br.building?.type === 'fazenda' ? br.building.level : undefined);
          const villageLevel = br.villageBuildingLevel ?? br.settlementBuildingLevel ??
            (br.building?.type === 'povoado' ? br.building.level : undefined);

          let building = null;
          if (villageLevel) {
            const lvl = (villageLevel >= 1 && villageLevel <= 5 ? villageLevel : 1) as 1 | 2 | 3 | 4 | 5;
            building = {
              type: 'povoado' as const,
              level: lvl,
              coinsPerTurn: POVOADO_YIELD[lvl] || 10,
              wheatPerTurn: 0,
            };
          } else if (farmLevel) {
            const lvl = (farmLevel >= 1 && farmLevel <= 5 ? farmLevel : 1) as 1 | 2 | 3 | 4 | 5;
            building = {
              type: 'fazenda' as const,
              level: lvl,
              coinsPerTurn: 0,
              wheatPerTurn: FAZENDA_YIELD[lvl] || 100,
            };
          } else if (br.building) {
            building = br.building;
          }

          const tileId = br.id || `${rX},${rY}`;
          blockRegionIds.push(tileId);

          const tile: RegionTile = {
            id: tileId,
            x: rX,
            y: rY,
            rank,
            points: br.points || RANK_POINTS[rank] || 1,
            color: br.color || RANK_COLORS[rank] || '#f8fafc',
            isStartingPoint,
            team,
            piece,
            building,
            blockId,
            blockSize: bSize,
          };
          regions.push(tile);
        }
      }

      reconstructedBlocks.push({
        id: blockId,
        name: b.name || `Bloco ${bSize}x${bSize} #${blockIdx + 1}`,
        size: bSize,
        originX,
        originY,
        structureTag: 'grid',
        regionIds: blockRegionIds,
      });
    });
  }

  if (regions.length === 0) {
    throw new Error('Nenhuma região encontrada no JSON importado.');
  }

  // Starting points resolution
  let startingPoints: [StartingPoint, StartingPoint];
  if (Array.isArray(parsed.startingPoints) && parsed.startingPoints.length >= 2) {
    startingPoints = [parsed.startingPoints[0], parsed.startingPoints[1]];
  } else {
    const spFromRegions = regions.filter(r => r.isStartingPoint);
    if (spFromRegions.length >= 2) {
      const sp1 = spFromRegions.find(r => r.team === 1) || spFromRegions[0];
      const sp2 = spFromRegions.find(r => r.team === 2) || spFromRegions[1];
      startingPoints = [
        {
          regionId: sp1.id,
          x: sp1.x,
          y: sp1.y,
          team: 1,
          piece: 'g',
          rank: 8,
        },
        {
          regionId: sp2.id,
          x: sp2.x,
          y: sp2.y,
          team: 2,
          piece: 'g',
          rank: 8,
        },
      ];
    } else {
      const first = regions[0];
      const last = regions[regions.length - 1];
      first.isStartingPoint = true;
      first.team = 1;
      first.piece = 'g';
      first.rank = 8;
      last.isStartingPoint = true;
      last.team = 2;
      last.piece = 'g';
      last.rank = 8;
      startingPoints = [
        { regionId: first.id, x: first.x, y: first.y, team: 1, piece: 'g', rank: 8 },
        { regionId: last.id, x: last.x, y: last.y, team: 2, piece: 'g', rank: 8 },
      ];
    }
  }

  const regionsMap = new Map<string, RegionTile>();
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  for (const r of regions) {
    regionsMap.set(r.id, r);
    if (r.x < minX) minX = r.x;
    if (r.x > maxX) maxX = r.x;
    if (r.y < minY) minY = r.y;
    if (r.y > maxY) maxY = r.y;
  }

  const bounds = {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };

  const economy = parsed.metadata?.economy || placeBuildings(
    regionsMap,
    parsed.metadata?.parameters || DEFAULT_PARAMETERS
  );

  // If blocks weren't reconstructed from rawBlocks, construct them from regions
  if (reconstructedBlocks.length === 0) {
    if (Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
      reconstructedBlocks = parsed.blocks.map((b: any) => ({
        id: b.id,
        name: b.name || `Bloco ${b.size || 3}x${b.size || 3}`,
        size: b.size || 3,
        originX: b.origin?.x ?? b.originX ?? 0,
        originY: b.origin?.y ?? b.originY ?? 0,
        structureTag: 'grid',
        regionIds: b.regionIds || (b.regions ? b.regions.map((r: any) => r.id) : []),
      }));
    } else {
      const blockMap = new Map<string, { size: BlockSize; ids: string[]; minX: number; minY: number }>();
      for (const r of regions) {
        const bId = r.blockId || 'block-0';
        const bSz = r.blockSize || 3;
        if (!blockMap.has(bId)) {
          blockMap.set(bId, { size: bSz, ids: [], minX: r.x, minY: r.y });
        }
        const entry = blockMap.get(bId)!;
        entry.ids.push(r.id);
        if (r.x < entry.minX) entry.minX = r.x;
        if (r.y < entry.minY) entry.minY = r.y;
      }

      reconstructedBlocks = Array.from(blockMap.entries()).map(([bId, val], idx) => ({
        id: bId,
        name: `Bloco ${val.size}x${val.size} #${idx + 1}`,
        size: val.size,
        originX: val.minX,
        originY: val.minY,
        structureTag: 'grid',
        regionIds: val.ids,
      }));
    }
  }

  return {
    regions,
    regionsMap,
    blocks: reconstructedBlocks,
    startingPoints,
    bounds,
    adjacency: parsed.adjacency || {},
    economy,
    parameters: parsed.metadata?.parameters || DEFAULT_PARAMETERS,
    generatedAt: parsed.generatedAt || new Date().toISOString(),
    stepsHistory: [],
  };
}
