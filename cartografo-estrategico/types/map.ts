/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RankLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type BuildingType = 'povoado' | 'fazenda';
export type BuildingLevel = 1 | 2 | 3 | 4 | 5;

export interface BuildingData {
  type: BuildingType;
  level: BuildingLevel;
  coinsPerTurn: number;
  wheatPerTurn: number;
}

export type BlockSize = 3 | 4 | 5;

export interface MapBlock {
  id: string; // e.g. "bloco-1"
  name: string; // e.g. "Bloco 3x3 #1"
  size: BlockSize; // 3, 4, or 5
  originX: number;
  originY: number;
  structureTag: string; // 'grid' | 'l_shape' | 'circular' | 'cross'
  regionIds: string[];
}

export interface RegionTile {
  id: string; // e.g. "x,y"
  x: number;
  y: number;
  rank: RankLevel;
  points: number;
  color: string;
  isStartingPoint: boolean;
  team: 1 | 2 | null;
  piece: 'g' | null;
  building: BuildingData | null;
  structureTag?: string; // e.g. 'grid', 'l_shape', 'circular', 'bridge'
  blockId: string; // Mandatory block ownership (3x3, 4x4, or 5x5)
  blockSize: BlockSize;
  distToSP1?: number;
  distToSP2?: number;
  distToNearestSP?: number;
  distToCenter?: number;
  propagationStep?: number;
  propagationOrigin?: 'team1' | 'team2' | 'meeting_point';
}

export interface StartingPoint {
  regionId: string;
  x: number;
  y: number;
  team: 1 | 2;
  piece: 'g';
  rank: 8;
}

export type RankContributionMatrix = Record<RankLevel, Partial<Record<RankLevel, number>>>;

export const DEFAULT_RANK_CONTRIBUTION_MATRIX: RankContributionMatrix = {
  8: { 8: 8, 7: 3 },
  7: { 7: 7, 6: 2.5, 8: 1 },
  6: { 6: 6, 5: 2, 7: 1 },
  5: { 5: 5, 4: 1.5, 6: 1 },
  4: { 4: 4, 3: 1, 5: 1 },
  3: { 3: 3, 2: 1, 4: 1 },
  2: { 2: 2, 1: 1, 3: 1 },
  1: { 1: 1, 2: 1 },
};

export interface GeneratorParameters {
  targetRegions: number;
  topologyPreset: 'hybrid' | 'quadricular' | 'l_shape' | 'circular' | 'cross_bridge';
  weightGrid: number; // 0 to 100
  weightL: number;    // 0 to 100
  weightCircular: number; // 0 to 100
  weightCross: number; // 0 to 100
  alpha: number; // Rank preference weight (default 1.5)
  beta: number;  // Spatial preference weight (default 0.8)
  tau: number;   // Randomness tolerance for production error (default 500)
  buildingDensity: number; // % of regions with buildings (e.g. 25%)
  povoadoRatio: number; // % povoados vs fazendas (default 50%)
  allowBuildingsOnStartingPoints: boolean;
  sectorSize?: number;
  rankContributionMatrix?: RankContributionMatrix;
  seed?: number;
}

export interface EconomySummary {
  totalPoints: number;
  desirableCoins: number;
  desirableWheat: number;
  actualCoins: number;
  actualWheat: number;
  coinError: number;
  wheatError: number;
  totalPovoados: number;
  totalFazendas: number;
  buildingsByLevel: Record<BuildingType, Record<BuildingLevel, number>>;
  rankCounts: Record<RankLevel, number>;
}

export interface BlockRegionExportData {
  id: string;
  x: number;
  y: number;
  localRow: number; // 1 to size (M(row, col))
  localCol: number; // 1 to size
  matrixNotation: string; // e.g. "M(1,2)"
  rank: RankLevel;
  points: number;
  color: string;
  isStartingPoint: boolean;
  team: 1 | 2 | null;
  piece: 'g' | null;
  building: BuildingData | null;
}

export interface QuadrilateralRegionPiece {
  team: string;
  stage: string;
}

export interface QuadrilateralRegionData {
  name: string; // e.g. "L8-1"
  code: string; // e.g. "L8-1"
  rank: string; // e.g. "L8"
  layer: number; // 8
  region: number; // 1
  shape: 'quadrilateral';
  positions: [number, number][]; // [[row, col]] (1-based, e.g. [[1, 3]])
  maxPieces: number; // e.g. 8
  farmBuildingLevel?: number; // e.g. 1
  villageBuildingLevel?: number; // e.g. 1 (povoado)
  settlementBuildingLevel?: number; // Legacy export field
  initialPieces: QuadrilateralRegionPiece[];
}

export interface QuadrilateralBlockData {
  name: string; // e.g. "BQ01"
  type: 'quadrilateral';
  matrixSize: number;
  matrix: (string | null)[][];
  L1: number;
  L2: number;
  C_inicial: { x: number; y: number };
  rotationEnabled: boolean;
  linearRotationEnabled: boolean;
  regions: QuadrilateralRegionData[];
}

export interface QuadrilateralBlocksExport {
  blocks: QuadrilateralBlockData[];
}

export interface BlockExportData {
  id: string;
  name: string;
  size: BlockSize;
  originX: number;
  originY: number;
  totalRegions: number;
  rotationFormula: string; // e.g. "M(1,1) -> M(1,2) -> M(1,3) -> M(2,3) -> M(3,3) -> M(3,2) -> M(3,1) -> M(2,1) -> M(1,1)"
  regionIds: string[];
  regions: (RegionTile & { localRow?: number; localCol?: number; matrixNotation?: string })[];
}

export interface MapExportFormat {
  version: string;
  generatedAt: string;
  app: string;
  metadata: {
    name: string;
    description: string;
    totalRegions: number;
    totalBlocks: number;
    parameters: GeneratorParameters;
    economy: EconomySummary;
  };
  blocks: BlockExportData[];
  startingPoints: StartingPoint[];
  regions: RegionTile[];
  adjacency: Record<string, string[]>;
}

// Official rank color spec:
// L8 = vermelho, L7 = laranja, L6 = amarelo, L5 = verde, L4 = azul, L3 = aníl, L2 = violeta, L1 = branco
export const RANK_COLORS: Record<RankLevel, string> = {
  8: '#ef4444', // Vermelho
  7: '#f97316', // Laranja
  6: '#eab308', // Amarelo
  5: '#22c55e', // Verde
  4: '#3b82f6', // Azul
  3: '#6366f1', // Anil
  2: '#a855f7', // Violeta
  1: '#f8fafc', // Branco
};

export const RANK_NAMES: Record<RankLevel, string> = {
  8: 'Rank 8 (Vermelho)',
  7: 'Rank 7 (Laranja)',
  6: 'Rank 6 (Amarelo)',
  5: 'Rank 5 (Verde)',
  4: 'Rank 4 (Azul)',
  3: 'Rank 3 (Anil)',
  2: 'Rank 2 (Violeta)',
  1: 'Rank 1 (Branco)',
};

// Official points per region type
export const RANK_POINTS: Record<RankLevel, number> = {
  8: 1,
  7: 11,
  6: 86,
  5: 543,
  4: 2796,
  3: 11427,
  2: 23000,
  1: 50000,
};

// Official Povoado yield: moedas por turn
export const POVOADO_YIELD: Record<BuildingLevel, number> = {
  1: 10,
  2: 50,
  3: 250,
  4: 1000,
  5: 4000,
};

// The game rules define the official wheat production for each farm level.
export const FAZENDA_YIELD: Record<BuildingLevel, number> = {
  1: 250,
  2: 1000,
  3: 4000,
  4: 16000,
  5: 50000,
};

// Building preferred ranks per level
export const BUILDING_PREFERRED_RANKS: Record<BuildingLevel, RankLevel[]> = {
  1: [7, 8],
  2: [6, 7],
  3: [5],
  4: [4, 3],
  5: [2, 1],
};
