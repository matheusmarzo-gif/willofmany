/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BuildingData,
  BuildingLevel,
  BuildingType,
  BUILDING_PREFERRED_RANKS,
  EconomySummary,
  FAZENDA_YIELD,
  GeneratorParameters,
  POVOADO_YIELD,
  RankLevel,
  RANK_POINTS,
  RegionTile,
} from './types/map';

/**
 * Calculates rank distance d(r, l):
 * Minimum absolute difference between region rank and any of the preferred ranks for level l.
 */
export function getRankDistance(regionRank: RankLevel, level: BuildingLevel): number {
  const preferred = BUILDING_PREFERRED_RANKS[level];
  let minDiff = Infinity;
  for (const pr of preferred) {
    const diff = Math.abs(regionRank - pr);
    if (diff < minDiff) {
      minDiff = diff;
    }
  }
  return minDiff;
}

/**
 * Calculates normalized spatial distance s(r, l) in [0, 1]:
 * - Levels 1 and 2: distance to nearest starting point normalized
 * - Levels 4 and 5: distance to map center normalized
 * - Level 3: intermediate / balanced distance
 */
export function getSpatialDistance(
  tile: RegionTile,
  level: BuildingLevel,
  maxSPDist: number,
  maxCenterDist: number
): number {
  const safeMaxSP = maxSPDist > 0 ? maxSPDist : 1;
  const safeMaxCenter = maxCenterDist > 0 ? maxCenterDist : 1;

  if (level === 1 || level === 2) {
    // Closer to starting points -> s is small near SP
    const dist = tile.distToNearestSP ?? 0;
    return Math.min(1, Math.max(0, dist / safeMaxSP));
  } else if (level === 4 || level === 5) {
    // Closer to center -> s is small near center
    const dist = tile.distToCenter ?? 0;
    return Math.min(1, Math.max(0, dist / safeMaxCenter));
  } else {
    // Level 3: prefers middle ring (distance to center ~ 0.5)
    const normCenter = Math.min(1, (tile.distToCenter ?? 0) / safeMaxCenter);
    return Math.min(1, Math.abs(normCenter - 0.5) * 2);
  }
}

/**
 * Places Povoados and Fazendas according to the mathematical model
 */
export function placeBuildings(
  regionsMap: Map<string, RegionTile>,
  params: GeneratorParameters
): EconomySummary {
  const regions = Array.from(regionsMap.values());

  // 1. Calculate Total Points and Desirable production targets
  let totalPoints = 0;
  const rankCounts: Record<RankLevel, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0,
  };

  for (const tile of regions) {
    totalPoints += RANK_POINTS[tile.rank];
    rankCounts[tile.rank]++;
    // Reset any existing building
    tile.building = null;
  }

  const desirableCoins = Math.round(totalPoints / 75);
  const desirableWheat = Math.round(totalPoints / 10);

  // Maximum spatial distances for normalization
  let maxSPDist = 1;
  let maxCenterDist = 1;

  for (const t of regions) {
    if ((t.distToNearestSP ?? 0) > maxSPDist) maxSPDist = t.distToNearestSP!;
    if ((t.distToCenter ?? 0) > maxCenterDist) maxCenterDist = t.distToCenter!;
  }

  // 2. Determine how many buildings to place based on buildingDensity
  // density is a percentage (e.g. 25%)
  const densityFraction = Math.max(0.05, Math.min(0.9, params.buildingDensity / 100));
  const maxAvailable = params.allowBuildingsOnStartingPoints
    ? regions.length
    : regions.filter(r => !r.isStartingPoint).length;

  const totalBuildingsToPlace = Math.max(1, Math.round(maxAvailable * densityFraction));

  // Partition into Povoados and Fazendas
  const povoadoRatio = Math.max(0.1, Math.min(0.9, params.povoadoRatio / 100));
  let povoadosToPlace = Math.round(totalBuildingsToPlace * povoadoRatio);
  let fazendasToPlace = totalBuildingsToPlace - povoadosToPlace;
  if (povoadosToPlace <= 0) povoadosToPlace = 1;
  if (fazendasToPlace <= 0) fazendasToPlace = 1;

  let currentCoins = 0;
  let currentWheat = 0;

  // Track building counts
  const buildingsByLevel: Record<BuildingType, Record<BuildingLevel, number>> = {
    povoado: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    fazenda: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  // Set of candidate regions available for buildings
  let available = regions.filter(r => {
    if (!params.allowBuildingsOnStartingPoints && r.isStartingPoint) {
      return false;
    }
    return r.building === null;
  });

  // Interleave placing Povoados and Fazendas so both distribute harmoniously
  const queue: BuildingType[] = [];
  let pLeft = povoadosToPlace;
  let fLeft = fazendasToPlace;
  while (pLeft > 0 || fLeft > 0) {
    if (pLeft > 0) {
      queue.push('povoado');
      pLeft--;
    }
    if (fLeft > 0) {
      queue.push('fazenda');
      fLeft--;
    }
  }

  // Parameter constants
  const alpha = Math.max(0.1, params.alpha);
  const beta = Math.max(0.1, params.beta);
  const baseTau = Math.max(0.1, params.tau);

  for (let step = 0; step < queue.length; step++) {
    if (available.length === 0) break;
    const bType = queue[step];

    // Compute remaining target and remaining slots of this type
    const remainingSlotsOfThisType = queue.slice(step).filter(t => t === bType).length;
    const currentProd = bType === 'povoado' ? currentCoins : currentWheat;
    const targetProd = bType === 'povoado' ? desirableCoins : desirableWheat;
    const delta = Math.max(0, targetProd - currentProd);

    // Yield table for this building type
    const yieldTable = bType === 'povoado' ? POVOADO_YIELD : FAZENDA_YIELD;

    // Ideal chunk per remaining slot to avoid spending entire target in one go
    const targetPerSlot = remainingSlotsOfThisType > 0 ? delta / remainingSlotsOfThisType : delta;

    // Scaled tau for unit sensitivity:
    // Povoado yields: 10, 50, 250, 1000, 4000
    // Fazenda yields: 100, 500, 2500, 10000, 40000
    const tauUnitScale = bType === 'povoado' ? 250 : 2500;
    const tau = baseTau * tauUnitScale;

    // Step A: Decide level l for this building based on formula:
    // E_l = | targetPerSlot - y_l |
    // W_l = e^(-E_l / tau)
    const levelWeights: Record<BuildingLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sumLevelWeights = 0;

    for (let lvl = 1; lvl <= 5; lvl++) {
      const bLvl = lvl as BuildingLevel;
      const yL = yieldTable[bLvl];
      const eL = Math.abs(targetPerSlot - yL);
      // Softmin / Boltzmann weight
      const wL = Math.exp(-eL / tau);
      levelWeights[bLvl] = wL;
      sumLevelWeights += wL;
    }

    // Sample chosen level
    let chosenLevel: BuildingLevel = 1;
    let rSample = Math.random() * sumLevelWeights;
    for (let lvl = 1; lvl <= 5; lvl++) {
      const bLvl = lvl as BuildingLevel;
      rSample -= levelWeights[bLvl];
      if (rSample <= 0.0001) {
        chosenLevel = bLvl;
        break;
      }
    }

    // Step B: Decide which region r in A receives building of chosenLevel l
    // P(r | l) = e^(-alpha * d(r,l) - beta * s(r,l)) / sum(...)
    const regionWeights: { tile: RegionTile; weight: number }[] = [];
    let sumRegionWeights = 0;

    for (const tile of available) {
      const d = getRankDistance(tile.rank, chosenLevel);
      const s = getSpatialDistance(tile, chosenLevel, maxSPDist, maxCenterDist);

      const exponent = -alpha * d - beta * s;
      const weight = Math.exp(exponent);
      regionWeights.push({ tile, weight });
      sumRegionWeights += weight;
    }

    if (sumRegionWeights <= 0 || regionWeights.length === 0) {
      break;
    }

    // Sample region
    let targetTile = regionWeights[0].tile;
    let rRegSample = Math.random() * sumRegionWeights;
    for (const rw of regionWeights) {
      rRegSample -= rw.weight;
      if (rRegSample <= 0.0001) {
        targetTile = rw.tile;
        break;
      }
    }

    // Place building on targetTile
    const producedCoins = bType === 'povoado' ? POVOADO_YIELD[chosenLevel] : 0;
    const producedWheat = bType === 'fazenda' ? FAZENDA_YIELD[chosenLevel] : 0;

    const building: BuildingData = {
      type: bType,
      level: chosenLevel,
      coinsPerTurn: producedCoins,
      wheatPerTurn: producedWheat,
    };

    targetTile.building = building;
    currentCoins += producedCoins;
    currentWheat += producedWheat;
    buildingsByLevel[bType][chosenLevel]++;

    // Remove targetTile from available set
    available = available.filter(t => t.id !== targetTile.id);
  }

  const totalPovoados = Object.values(buildingsByLevel.povoado).reduce((a, b) => a + b, 0);
  const totalFazendas = Object.values(buildingsByLevel.fazenda).reduce((a, b) => a + b, 0);

  return {
    totalPoints,
    desirableCoins,
    desirableWheat,
    actualCoins: currentCoins,
    actualWheat: currentWheat,
    coinError: currentCoins - desirableCoins,
    wheatError: currentWheat - desirableWheat,
    totalPovoados,
    totalFazendas,
    buildingsByLevel,
    rankCounts,
  };
}
