/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FullMapState } from './mapGenerator';
import { RegionTile, StartingPoint } from './types/map';
import { posKey, parseKey } from './topologyGenerator';
import { calculateGraphDistances } from './rankPropagation';
import { placeBuildings } from './buildingPlacer';

export interface SectorInfo {
  blockId?: string;
  name?: string;
  sectorX: number;
  sectorY: number;
  size: number;
  originX: number;
  originY: number;
  tiles: RegionTile[];
  tileIds: Set<string>;
}

/**
 * Returns the perimeter coordinate cycle for an N x N square matrix (local coordinates [0..N-1]).
 * For 3x3:
 * (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2) -> (1,2) -> (0,2) -> (0,1) -> back to (0,0)
 * Exactly matching user specification:
 * M(1,1) -> M(1,2) -> M(1,3) -> M(2,3) -> M(3,3) -> M(3,2) -> M(3,1) -> M(2,1) -> M(1,1)
 */
export function getPerimeterCycle(size: number): [number, number][] {
  const cycle: [number, number][] = [];

  // Top edge: left to right (c: 0 .. size - 2, r: 0) -> M(1,1) to M(1, size-1)
  for (let c = 0; c < size - 1; c++) {
    cycle.push([c, 0]);
  }
  // Right edge: top to bottom (c: size - 1, r: 0 .. size - 2) -> M(1, size) to M(size-1, size)
  for (let r = 0; r < size - 1; r++) {
    cycle.push([size - 1, r]);
  }
  // Bottom edge: right to left (c: size - 1 .. 1, r: size - 1) -> M(size, size) to M(size, 2)
  for (let c = size - 1; c > 0; c--) {
    cycle.push([c, size - 1]);
  }
  // Left edge: bottom to top (c: 0, r: size - 1 .. 1) -> M(size, 1) to M(2, 1)
  for (let r = size - 1; r > 0; r--) {
    cycle.push([0, r]);
  }

  return cycle;
}

/**
 * Computes sector information for a given coordinate and sector size
 */
export function getSectorForCoord(
  x: number,
  y: number,
  size: number,
  regionsMap: Map<string, RegionTile>
): SectorInfo {
  const sectorX = Math.floor(x / size);
  const sectorY = Math.floor(y / size);
  const originX = sectorX * size;
  const originY = sectorY * size;

  const tiles: RegionTile[] = [];
  const tileIds = new Set<string>();

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const k = posKey(originX + c, originY + r);
      const t = regionsMap.get(k);
      if (t) {
        tiles.push(t);
        tileIds.add(k);
      }
    }
  }

  return {
    sectorX,
    sectorY,
    size,
    originX,
    originY,
    tiles,
    tileIds,
  };
}

export type SectorRotationTarget =
  | { originX: number; originY: number; size: number; blockId?: string; name?: string }
  | { sectorX: number; sectorY: number; size: number; blockId?: string; name?: string };

/**
 * Rotates an N x N square sector.
 * Supports:
 * - 'perimeter_1step': 1 position shift along perimeter cycle
 *   M(1,1)->M(1,2)->M(1,3)->M(2,3)->M(3,3)->M(3,2)->M(3,1)->M(2,1)
 * - 'block_90deg': 90 degree clockwise rotation
 */
export function rotateSector(
  mapState: FullMapState,
  targetOrSectorX: SectorRotationTarget | number,
  sectorYOrMode: number | 'perimeter_1step' | 'block_90deg' = 'perimeter_1step',
  sizeArg: number = 3,
  modeArg: 'perimeter_1step' | 'block_90deg' = 'perimeter_1step'
): FullMapState {
  let originX = 0;
  let originY = 0;
  let size = 3;
  let mode: 'perimeter_1step' | 'block_90deg' = 'perimeter_1step';
  let targetBlockId: string | undefined = undefined;

  if (typeof targetOrSectorX === 'object') {
    if ('originX' in targetOrSectorX) {
      originX = targetOrSectorX.originX;
      originY = targetOrSectorX.originY;
      size = targetOrSectorX.size;
    } else {
      originX = targetOrSectorX.sectorX * targetOrSectorX.size;
      originY = targetOrSectorX.sectorY * targetOrSectorX.size;
      size = targetOrSectorX.size;
    }
    targetBlockId = targetOrSectorX.blockId;
    mode = typeof sectorYOrMode === 'string' ? sectorYOrMode : modeArg;
  } else {
    size = sizeArg;
    originX = targetOrSectorX * size;
    originY = (typeof sectorYOrMode === 'number' ? sectorYOrMode : 0) * size;
    mode = modeArg;
  }

  const nextRegionsMap = new Map<string, RegionTile>(mapState.regionsMap);

  // 1. Identify all cell positions inside the square sector
  const oldSectorTiles = new Map<string, RegionTile>();
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const k = posKey(originX + c, originY + r);
      const tile = mapState.regionsMap.get(k);
      if (tile) {
        oldSectorTiles.set(k, { ...tile });
        nextRegionsMap.delete(k); // remove old position from map
      }
    }
  }

  if (oldSectorTiles.size === 0) {
    return mapState;
  }

  // 2. Compute destination mappings for each local cell (c, r)
  const shiftSteps = mode === 'perimeter_1step' ? 1 : Math.max(1, size - 1);
  const newPositionsMap = new Map<string, [number, number]>();

  // Process concentric rings (outer perimeter, then inner rings if size >= 4)
  let currentSize = size;
  let offset = 0;

  while (currentSize > 1) {
    const cycle = getPerimeterCycle(currentSize);
    const L = cycle.length;

    for (let i = 0; i < L; i++) {
      const [srcC, srcR] = cycle[i];
      const worldSrcX = originX + offset + srcC;
      const worldSrcY = originY + offset + srcR;
      const srcKey = posKey(worldSrcX, worldSrcY);

      // Destination in cycle
      const destIndex = (i + shiftSteps) % L;
      const [destC, destR] = cycle[destIndex];
      const worldDestX = originX + offset + destC;
      const worldDestY = originY + offset + destR;

      newPositionsMap.set(srcKey, [worldDestX, worldDestY]);
    }

    currentSize -= 2;
    offset += 1;
  }

  // Center cell in odd-sized matrices (e.g. (1,1) in 3x3) stays in place
  if (currentSize === 1) {
    const worldCenterX = originX + offset;
    const worldCenterY = originY + offset;
    const centerKey = posKey(worldCenterX, worldCenterY);
    newPositionsMap.set(centerKey, [worldCenterX, worldCenterY]);
  }

  // 3. Move tiles to their new rotated locations
  const updatedStartingPoints: [StartingPoint, StartingPoint] = [
    { ...mapState.startingPoints[0] },
    { ...mapState.startingPoints[1] },
  ];

  for (const [oldKey, tile] of oldSectorTiles.entries()) {
    const dest = newPositionsMap.get(oldKey);
    if (!dest) continue;
    const [newX, newY] = dest;
    const newId = posKey(newX, newY);

    const updatedTile: RegionTile = {
      ...tile,
      id: newId,
      x: newX,
      y: newY,
    };

    nextRegionsMap.set(newId, updatedTile);

    // Update starting point if this tile was a starting point
    if (tile.isStartingPoint) {
      if (tile.team === 1) {
        updatedStartingPoints[0] = {
          ...updatedStartingPoints[0],
          regionId: newId,
          x: newX,
          y: newY,
        };
      } else if (tile.team === 2) {
        updatedStartingPoints[1] = {
          ...updatedStartingPoints[1],
          regionId: newId,
          x: newX,
          y: newY,
        };
      }
    }
  }

  // 4. Recalculate distance metrics and bounds
  const allKeys = new Set(nextRegionsMap.keys());
  const distSP1 = calculateGraphDistances(updatedStartingPoints[0].regionId, allKeys);
  const distSP2 = calculateGraphDistances(updatedStartingPoints[1].regionId, allKeys);

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const t of nextRegionsMap.values()) {
    if (t.x < minX) minX = t.x;
    if (t.x > maxX) maxX = t.x;
    if (t.y < minY) minY = t.y;
    if (t.y > maxY) maxY = t.y;
  }

  const bounds = {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };

  const centerX = bounds.width / 2;
  const centerY = bounds.height / 2;

  for (const t of nextRegionsMap.values()) {
    const d1 = distSP1.get(t.id) ?? t.distToSP1 ?? 0;
    const d2 = distSP2.get(t.id) ?? t.distToSP2 ?? 0;
    t.distToSP1 = d1;
    t.distToSP2 = d2;
    t.distToNearestSP = Math.min(d1, d2);
    t.distToCenter = Math.sqrt(Math.pow(t.x - centerX, 2) + Math.pow(t.y - centerY, 2));
  }

  // 5. Update adjacency map
  const cardDirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const adjacency: Record<string, string[]> = {};
  for (const k of allKeys) {
    const [x, y] = parseKey(k);
    const nbrs: string[] = [];
    for (const [dx, dy] of cardDirs) {
      const nk = posKey(x + dx, y + dy);
      if (allKeys.has(nk)) {
        nbrs.push(nk);
      }
    }
    adjacency[k] = nbrs;
  }

  // 6. Recalculate economy
  const updatedEconomy = placeBuildings(nextRegionsMap, mapState.parameters);
  const updatedRegions = Array.from(nextRegionsMap.values());

  // 7. Update block regionIds
  const updatedBlocks = mapState.blocks.map(b => {
    const isTargetBlock = (targetBlockId && b.id === targetBlockId) ||
      (b.originX === originX && b.originY === originY);

    if (isTargetBlock) {
      const newIds: string[] = [];
      for (let r = 0; r < b.size; r++) {
        for (let c = 0; c < b.size; c++) {
          const k = posKey(b.originX + c, b.originY + r);
          if (nextRegionsMap.has(k)) {
            newIds.push(k);
          }
        }
      }
      return {
        ...b,
        regionIds: newIds,
      };
    }
    return b;
  });

  return {
    ...mapState,
    regions: updatedRegions,
    regionsMap: nextRegionsMap,
    blocks: updatedBlocks,
    startingPoints: updatedStartingPoints,
    bounds,
    adjacency,
    economy: updatedEconomy,
  };
}
