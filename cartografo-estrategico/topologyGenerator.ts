/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockSize, GeneratorParameters, MapBlock, StartingPoint } from './types/map';

export interface TopologyCell {
  x: number;
  y: number;
  structureTag: string;
  blockId: string;
  blockSize: BlockSize;
}

export interface GeneratedTopology {
  cells: Map<string, TopologyCell>; // key: "x,y"
  blocks: MapBlock[];
  startingPoints: [StartingPoint, StartingPoint];
  bounds: { minX: number; maxX: number; minY: number; maxY: number; width: number; height: number };
}

// Helper to create grid key
export const posKey = (x: number, y: number) => `${x},${y}`;
export const parseKey = (k: string): [number, number] => {
  const [x, y] = k.split(',').map(Number);
  return [x, y];
};

/**
 * Creates internal cells for a block of size S (3, 4, or 5)
 */
function createCellsForBlock(
  blockId: string,
  size: BlockSize,
  originX: number,
  originY: number,
  structureTag: 'grid' | 'l_shape' | 'circular' | 'cross'
): TopologyCell[] {
  const result: TopologyCell[] = [];

  if (structureTag === 'grid') {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        result.push({
          x: originX + c,
          y: originY + r,
          structureTag: 'grid',
          blockId,
          blockSize: size,
        });
      }
    }
  } else if (structureTag === 'l_shape') {
    // Rotation: 0, 1, 2, 3
    const rot = Math.floor(Math.random() * 4);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const isL = (i === 0 || j === 0);
        if (isL) {
          let rx = i;
          let ry = j;
          if (rot === 1) { rx = size - 1 - j; ry = i; }
          else if (rot === 2) { rx = size - 1 - i; ry = size - 1 - j; }
          else if (rot === 3) { rx = j; ry = size - 1 - i; }

          result.push({
            x: originX + rx,
            y: originY + ry,
            structureTag: 'l_shape',
            blockId,
            blockSize: size,
          });
        }
      }
    }
  } else if (structureTag === 'circular') {
    const center = (size - 1) / 2;
    const maxR = size / 2;
    const minR = size >= 4 ? 0.7 : 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const dist = Math.sqrt(Math.pow(c - center, 2) + Math.pow(r - center, 2));
        if (dist <= maxR && (dist >= minR || size === 3)) {
          result.push({
            x: originX + c,
            y: originY + r,
            structureTag: 'circular',
            blockId,
            blockSize: size,
          });
        }
      }
    }
    // Ensure at least 4 cells in circle
    if (result.length < 4) {
      return createCellsForBlock(blockId, size, originX, originY, 'grid');
    }
  } else {
    // Cross structure
    const mid = Math.floor(size / 2);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (r === mid || c === mid) {
          result.push({
            x: originX + c,
            y: originY + r,
            structureTag: 'cross',
            blockId,
            blockSize: size,
          });
        }
      }
    }
  }

  return result;
}

/**
 * Builds the whole connected map strictly from blocks of size 3x3, 4x4, or 5x5
 * Supports target regions up to 900.
 */
export function generateTopology(params: GeneratorParameters): GeneratedTopology {
  return generateTopologyAttempt(params, 0);
}

function generateTopologyAttempt(
  params: GeneratorParameters,
  retry: number
): GeneratedTopology {
  const target = Math.min(900, Math.max(25, params.targetRegions));
  const cellsMap = new Map<string, TopologyCell>();
  const blocksList: MapBlock[] = [];

  // Determine structural weighting
  let wGrid = params.weightGrid;
  let wL = params.weightL;
  let wCirc = params.weightCircular;
  let wCross = params.weightCross;

  if (params.topologyPreset === 'quadricular') {
    wGrid = 100; wL = 0; wCirc = 0; wCross = 0;
  } else if (params.topologyPreset === 'l_shape') {
    wGrid = 0; wL = 100; wCirc = 0; wCross = 0;
  } else if (params.topologyPreset === 'circular') {
    wGrid = 0; wL = 0; wCirc = 100; wCross = 0;
  } else if (params.topologyPreset === 'cross_bridge') {
    wGrid = 20; wL = 20; wCirc = 10; wCross = 50;
  }

  const totalWeight = Math.max(1, wGrid + wL + wCirc + wCross);

  const pickStructureType = (): 'grid' | 'l_shape' | 'circular' | 'cross' => {
    const rnd = Math.random() * totalWeight;
    if (rnd < wGrid) return 'grid';
    if (rnd < wGrid + wL) return 'l_shape';
    if (rnd < wGrid + wL + wCirc) return 'circular';
    return 'cross';
  };

  const pickBlockSize = (): BlockSize => {
    const r = Math.random();
    if (r < 0.6) return 3; // 60% 3x3
    if (r < 0.85) return 4; // 25% 4x4
    return 5; // 15% 5x5
  };

  // 1. Initial Block 0 at (0, 0)
  const b0Size = pickBlockSize();
  const b0Type = pickStructureType();
  const b0Id = 'block-0';
  const b0Cells = createCellsForBlock(b0Id, b0Size, 0, 0, b0Type);

  const b0RegionIds: string[] = [];
  for (const c of b0Cells) {
    const k = posKey(c.x, c.y);
    cellsMap.set(k, c);
    b0RegionIds.push(k);
  }

  blocksList.push({
    id: b0Id,
    name: `Bloco ${b0Size}x${b0Size} #0`,
    size: b0Size,
    originX: 0,
    originY: 0,
    structureTag: b0Type,
    regionIds: b0RegionIds,
  });

  // 2. Iteratively attach adjacent blocks until target is reached
  let blockIndex = 1;
  let attempts = 0;
  const maxAttempts = Math.max(1500, Math.ceil(target / 4) * 12);

  while (cellsMap.size < target && attempts < maxAttempts) {
    attempts++;
    // Pick an existing block to attach to
    const parentBlock = blocksList[Math.floor(Math.random() * blocksList.length)];
    const newSize = pickBlockSize();
    const newType = pickStructureType();
    const newId = `block-${blockIndex}`;

    // Choose side to place new block (0: right, 1: bottom, 2: left, 3: top)
    const side = Math.floor(Math.random() * 4);
    let newOriginX = 0;
    let newOriginY = 0;

    if (side === 0) {
      // Right of parent
      newOriginX = parentBlock.originX + parentBlock.size;
      newOriginY = parentBlock.originY + Math.floor(Math.random() * (parentBlock.size - newSize + 1));
    } else if (side === 1) {
      // Bottom of parent
      newOriginX = parentBlock.originX + Math.floor(Math.random() * (parentBlock.size - newSize + 1));
      newOriginY = parentBlock.originY + parentBlock.size;
    } else if (side === 2) {
      // Left of parent
      newOriginX = parentBlock.originX - newSize;
      newOriginY = parentBlock.originY + Math.floor(Math.random() * (parentBlock.size - newSize + 1));
    } else {
      // Top of parent
      newOriginX = parentBlock.originX + Math.floor(Math.random() * (parentBlock.size - newSize + 1));
      newOriginY = parentBlock.originY - newSize;
    }

    // Check if new block overlaps with any existing block
    let overlapsExistingBlock = false;
    for (const b of blocksList) {
      const xOverlap = Math.max(0, Math.min(newOriginX + newSize, b.originX + b.size) - Math.max(newOriginX, b.originX));
      const yOverlap = Math.max(0, Math.min(newOriginY + newSize, b.originY + b.size) - Math.max(newOriginY, b.originY));
      if (xOverlap > 0 && yOverlap > 0) {
        overlapsExistingBlock = true;
        break;
      }
    }

    if (overlapsExistingBlock) {
      continue;
    }

    // Generate internal cells of the new block
    let newBlockCells = createCellsForBlock(newId, newSize, newOriginX, newOriginY, newType);

    // Ensure connectivity between new block and parent block:
    // Connect closest border cells
    let minD = Infinity;
    let bestCellInNew = newBlockCells[0];
    let bestCellInParent = cellsMap.get(parentBlock.regionIds[0])!;

    for (const cNew of newBlockCells) {
      for (const pId of parentBlock.regionIds) {
        const cParent = cellsMap.get(pId);
        if (cParent) {
          const d = Math.abs(cNew.x - cParent.x) + Math.abs(cNew.y - cParent.y);
          if (d < minD) {
            minD = d;
            bestCellInNew = cNew;
            bestCellInParent = cParent;
          }
        }
      }
    }

    // If gap between internal structures, add internal cells within their own block boundary
    // to touch the common boundary
    if (minD > 1) {
      // Add a border cell on parent block side if missing
      // And add a border cell on new block side if missing
      // (Both strictly inside their own block boundaries!)
      if (side === 0) { // New is on right of parent
        const touchY = Math.max(newOriginY, parentBlock.originY);
        const parentEdgeKey = posKey(parentBlock.originX + parentBlock.size - 1, touchY);
        const newEdgeKey = posKey(newOriginX, touchY);

        if (!cellsMap.has(parentEdgeKey)) {
          const addCell: TopologyCell = {
            x: parentBlock.originX + parentBlock.size - 1,
            y: touchY,
            structureTag: parentBlock.structureTag,
            blockId: parentBlock.id,
            blockSize: parentBlock.size,
          };
          cellsMap.set(parentEdgeKey, addCell);
          parentBlock.regionIds.push(parentEdgeKey);
        }

        if (!newBlockCells.some(c => c.x === newOriginX && c.y === touchY)) {
          newBlockCells.push({
            x: newOriginX,
            y: touchY,
            structureTag: newType,
            blockId: newId,
            blockSize: newSize,
          });
        }
      } else if (side === 1) { // New is on bottom
        const touchX = Math.max(newOriginX, parentBlock.originX);
        const parentEdgeKey = posKey(touchX, parentBlock.originY + parentBlock.size - 1);
        const newEdgeKey = posKey(touchX, newOriginY);

        if (!cellsMap.has(parentEdgeKey)) {
          const addCell: TopologyCell = {
            x: touchX,
            y: parentBlock.originY + parentBlock.size - 1,
            structureTag: parentBlock.structureTag,
            blockId: parentBlock.id,
            blockSize: parentBlock.size,
          };
          cellsMap.set(parentEdgeKey, addCell);
          parentBlock.regionIds.push(parentEdgeKey);
        }

        if (!newBlockCells.some(c => c.x === touchX && c.y === newOriginY)) {
          newBlockCells.push({
            x: touchX,
            y: newOriginY,
            structureTag: newType,
            blockId: newId,
            blockSize: newSize,
          });
        }
      } else if (side === 2) { // New is on left
        const touchY = Math.max(newOriginY, parentBlock.originY);
        const parentEdgeKey = posKey(parentBlock.originX, touchY);

        if (!cellsMap.has(parentEdgeKey)) {
          const addCell: TopologyCell = {
            x: parentBlock.originX,
            y: touchY,
            structureTag: parentBlock.structureTag,
            blockId: parentBlock.id,
            blockSize: parentBlock.size,
          };
          cellsMap.set(parentEdgeKey, addCell);
          parentBlock.regionIds.push(parentEdgeKey);
        }

        if (!newBlockCells.some(c => c.x === newOriginX + newSize - 1 && c.y === touchY)) {
          newBlockCells.push({
            x: newOriginX + newSize - 1,
            y: touchY,
            structureTag: newType,
            blockId: newId,
            blockSize: newSize,
          });
        }
      } else { // New is on top
        const touchX = Math.max(newOriginX, parentBlock.originX);
        const parentEdgeKey = posKey(touchX, parentBlock.originY);

        if (!cellsMap.has(parentEdgeKey)) {
          const addCell: TopologyCell = {
            x: touchX,
            y: parentBlock.originY,
            structureTag: parentBlock.structureTag,
            blockId: parentBlock.id,
            blockSize: parentBlock.size,
          };
          cellsMap.set(parentEdgeKey, addCell);
          parentBlock.regionIds.push(parentEdgeKey);
        }

        if (!newBlockCells.some(c => c.x === touchX && c.y === newOriginY + newSize - 1)) {
          newBlockCells.push({
            x: touchX,
            y: newOriginY + newSize - 1,
            structureTag: newType,
            blockId: newId,
            blockSize: newSize,
          });
        }
      }
    }

    // Add new block cells
    const thisBlockRegionIds: string[] = [];
    for (const c of newBlockCells) {
      const k = posKey(c.x, c.y);
      cellsMap.set(k, c);
      thisBlockRegionIds.push(k);
    }

    blocksList.push({
      id: newId,
      name: `Bloco ${newSize}x${newSize} #${blockIndex}`,
      size: newSize,
      originX: newOriginX,
      originY: newOriginY,
      structureTag: newType,
      regionIds: thisBlockRegionIds,
    });

    blockIndex++;
  }

  // 3. Ensure global connectivity & keep largest component
  const connectedKeys = getLargestConnectedComponent(cellsMap);

  // Prune blocks whose cells are not in connectedKeys
  const finalBlocks: MapBlock[] = [];
  const prunedCells = new Map<string, TopologyCell>();

  for (const b of blocksList) {
    const validRegions = b.regionIds.filter(id => connectedKeys.has(id));
    if (validRegions.length > 0) {
      b.regionIds = validRegions;
      finalBlocks.push(b);
      for (const id of validRegions) {
        prunedCells.set(id, cellsMap.get(id)!);
      }
    }
  }

  if (prunedCells.size < target) {
    if (retry >= 5) {
      throw new Error(`Não foi possível gerar um mapa conectado com ${target} regiões.`);
    }
    return generateTopologyAttempt(params, retry + 1);
  }
  trimConnectedCellsToTarget(prunedCells, finalBlocks, target);
  for (let index = finalBlocks.length - 1; index >= 0; index -= 1) {
    if (!finalBlocks[index].regionIds.length) finalBlocks.splice(index, 1);
  }

  // 4. Shift coordinates so minX = 0, minY = 0
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const c of prunedCells.values()) {
    if (c.x < minX) minX = c.x;
    if (c.x > maxX) maxX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.y > maxY) maxY = c.y;
  }

  const normalizedCells = new Map<string, TopologyCell>();
  for (const c of prunedCells.values()) {
    const nx = c.x - minX;
    const ny = c.y - minY;
    normalizedCells.set(posKey(nx, ny), {
      ...c,
      x: nx,
      y: ny,
    });
  }

  // Shift block origins to match normalized coordinates
  for (const b of finalBlocks) {
    b.originX -= minX;
    b.originY -= minY;
    b.regionIds = b.regionIds.map(oldId => {
      const [ox, oy] = parseKey(oldId);
      return posKey(ox - minX, oy - minY);
    });
  }

  const normBounds = {
    minX: 0,
    maxX: maxX - minX,
    minY: 0,
    maxY: maxY - minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };

  // 5. Starting points at opposite extremes of the map
  const startingPoints = pickOppositeStartingPoints(normalizedCells, normBounds);

  return {
    cells: normalizedCells,
    blocks: finalBlocks,
    startingPoints,
    bounds: normBounds,
  };
}

function trimConnectedCellsToTarget(
  cells: Map<string, TopologyCell>,
  blocks: MapBlock[],
  target: number
): void {
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const getNeighborKeys = (key: string): string[] => {
    const [x, y] = parseKey(key);
    return directions
      .map(([dx, dy]) => posKey(x + dx, y + dy))
      .filter((neighbor) => cells.has(neighbor));
  };
  const staysConnected = (removedKey: string): boolean => {
    const startKey = Array.from(cells.keys()).find((key) => key !== removedKey);
    if (!startKey) return target === 0;
    const visited = new Set([startKey]);
    const queue = [startKey];
    while (queue.length) {
      const key = queue.shift()!;
      getNeighborKeys(key).forEach((neighbor) => {
        if (neighbor !== removedKey && !visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      });
    }
    return visited.size === cells.size - 1;
  };

  while (cells.size > target) {
    const keys = Array.from(cells.keys());
    let removable = keys.find((key) => getNeighborKeys(key).length <= 1);
    if (!removable) removable = keys.find(staysConnected);
    if (!removable) {
      throw new Error(`Não foi possível reduzir o mapa conectado para ${target} regiões.`);
    }
    const removedCell = cells.get(removable)!;
    cells.delete(removable);
    const block = blocks.find((entry) => entry.id === removedCell.blockId);
    if (block) block.regionIds = block.regionIds.filter((key) => key !== removable);
  }
}

/**
 * Returns set of keys belonging to largest connected component
 */
function getLargestConnectedComponent(cells: Map<string, TopologyCell>): Set<string> {
  const visited = new Set<string>();
  let largest: string[] = [];

  const cardDirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  for (const startKey of cells.keys()) {
    if (visited.has(startKey)) continue;

    const component: string[] = [];
    const queue = [startKey];
    visited.add(startKey);

    while (queue.length > 0) {
      const cur = queue.shift()!;
      component.push(cur);
      const [cx, cy] = parseKey(cur);

      for (const [dx, dy] of cardDirs) {
        const nk = posKey(cx + dx, cy + dy);
        if (cells.has(nk) && !visited.has(nk)) {
          visited.add(nk);
          queue.push(nk);
        }
      }
    }

    if (component.length > largest.length) {
      largest = component;
    }
  }

  return new Set(largest);
}

/**
 * Picks 2 starting points located at opposite extremes of the map
 */
function pickOppositeStartingPoints(
  cells: Map<string, TopologyCell>,
  bounds: { width: number; height: number }
): [StartingPoint, StartingPoint] {
  const allKeys = Array.from(cells.keys());
  if (allKeys.length < 2) {
    const k1 = allKeys[0] || '0,0';
    const [x1, y1] = parseKey(k1);
    return [
      { regionId: k1, x: x1, y: y1, team: 1, piece: 'g', rank: 8 },
      { regionId: k1, x: x1, y: y1, team: 2, piece: 'g', rank: 8 },
    ];
  }

  const centerX = bounds.width / 2;
  const centerY = bounds.height / 2;

  const scored = allKeys.map(k => {
    const [x, y] = parseKey(k);
    const dX = x - centerX;
    const dY = y - centerY;
    const distSq = dX * dX + dY * dY;
    return { key: k, x, y, distSq };
  });

  scored.sort((a, b) => b.distSq - a.distSq);
  const sp1Candidate = scored[0];

  let bestSP2 = scored[1];
  let maxDistance = -1;

  for (let i = 1; i < scored.length; i++) {
    const cand = scored[i];
    const dx = cand.x - sp1Candidate.x;
    const dy = cand.y - sp1Candidate.y;
    const dist = dx * dx + dy * dy;
    if (dist > maxDistance) {
      maxDistance = dist;
      bestSP2 = cand;
    }
  }

  return [
    {
      regionId: sp1Candidate.key,
      x: sp1Candidate.x,
      y: sp1Candidate.y,
      team: 1,
      piece: 'g',
      rank: 8,
    },
    {
      regionId: bestSP2.key,
      x: bestSP2.x,
      y: bestSP2.y,
      team: 2,
      piece: 'g',
      rank: 8,
    },
  ];
}
