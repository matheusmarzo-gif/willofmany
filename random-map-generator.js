var WillOfManyMapGenerator = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // gameMapExport.ts
  var gameMapExport_exports = {};
  __export(gameMapExport_exports, {
    generateRandomBoard: () => generateRandomBoard
  });

  // types/map.ts
  var DEFAULT_RANK_CONTRIBUTION_MATRIX = {
    8: { 8: 8, 7: 3 },
    7: { 7: 7, 6: 2.5, 8: 1 },
    6: { 6: 6, 5: 2, 7: 1 },
    5: { 5: 5, 4: 1.5, 6: 1 },
    4: { 4: 4, 3: 1, 5: 1 },
    3: { 3: 3, 2: 1, 4: 1 },
    2: { 2: 2, 1: 1, 3: 1 },
    1: { 1: 1, 2: 1 }
  };
  var RANK_COLORS = {
    8: "#ef4444",
    // Vermelho
    7: "#f97316",
    // Laranja
    6: "#eab308",
    // Amarelo
    5: "#22c55e",
    // Verde
    4: "#3b82f6",
    // Azul
    3: "#6366f1",
    // Anil
    2: "#a855f7",
    // Violeta
    1: "#f8fafc"
    // Branco
  };
  var RANK_POINTS = {
    8: 1,
    7: 11,
    6: 86,
    5: 543,
    4: 2796,
    3: 11427,
    2: 23e3,
    1: 5e4
  };
  var POVOADO_YIELD = {
    1: 10,
    2: 50,
    3: 250,
    4: 1e3,
    5: 4e3
  };
  var FAZENDA_YIELD = {
    1: 250,
    2: 1e3,
    3: 4e3,
    4: 16e3,
    5: 5e4
  };
  var BUILDING_PREFERRED_RANKS = {
    1: [7, 8],
    2: [6, 7],
    3: [5],
    4: [4, 3],
    5: [2, 1]
  };

  // topologyGenerator.ts
  var posKey = (x, y) => `${x},${y}`;
  var parseKey = (k) => {
    const [x, y] = k.split(",").map(Number);
    return [x, y];
  };
  function createCellsForBlock(blockId, size, originX, originY, structureTag) {
    const result = [];
    if (structureTag === "grid") {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          result.push({
            x: originX + c,
            y: originY + r,
            structureTag: "grid",
            blockId,
            blockSize: size
          });
        }
      }
    } else if (structureTag === "l_shape") {
      const rot = Math.floor(Math.random() * 4);
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const isL = i === 0 || j === 0;
          if (isL) {
            let rx = i;
            let ry = j;
            if (rot === 1) {
              rx = size - 1 - j;
              ry = i;
            } else if (rot === 2) {
              rx = size - 1 - i;
              ry = size - 1 - j;
            } else if (rot === 3) {
              rx = j;
              ry = size - 1 - i;
            }
            result.push({
              x: originX + rx,
              y: originY + ry,
              structureTag: "l_shape",
              blockId,
              blockSize: size
            });
          }
        }
      }
    } else if (structureTag === "circular") {
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
              structureTag: "circular",
              blockId,
              blockSize: size
            });
          }
        }
      }
      if (result.length < 4) {
        return createCellsForBlock(blockId, size, originX, originY, "grid");
      }
    } else {
      const mid = Math.floor(size / 2);
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (r === mid || c === mid) {
            result.push({
              x: originX + c,
              y: originY + r,
              structureTag: "cross",
              blockId,
              blockSize: size
            });
          }
        }
      }
    }
    return result;
  }
  function generateTopology(params) {
    return generateTopologyAttempt(params, 0);
  }
  function generateTopologyAttempt(params, retry) {
    const target = Math.min(900, Math.max(25, params.targetRegions));
    const cellsMap = /* @__PURE__ */ new Map();
    const blocksList = [];
    let wGrid = params.weightGrid;
    let wL = params.weightL;
    let wCirc = params.weightCircular;
    let wCross = params.weightCross;
    if (params.topologyPreset === "quadricular") {
      wGrid = 100;
      wL = 0;
      wCirc = 0;
      wCross = 0;
    } else if (params.topologyPreset === "l_shape") {
      wGrid = 0;
      wL = 100;
      wCirc = 0;
      wCross = 0;
    } else if (params.topologyPreset === "circular") {
      wGrid = 0;
      wL = 0;
      wCirc = 100;
      wCross = 0;
    } else if (params.topologyPreset === "cross_bridge") {
      wGrid = 20;
      wL = 20;
      wCirc = 10;
      wCross = 50;
    }
    const totalWeight = Math.max(1, wGrid + wL + wCirc + wCross);
    const pickStructureType = () => {
      const rnd = Math.random() * totalWeight;
      if (rnd < wGrid) return "grid";
      if (rnd < wGrid + wL) return "l_shape";
      if (rnd < wGrid + wL + wCirc) return "circular";
      return "cross";
    };
    const pickBlockSize = () => {
      const r = Math.random();
      if (r < 0.6) return 3;
      if (r < 0.85) return 4;
      return 5;
    };
    const b0Size = pickBlockSize();
    const b0Type = pickStructureType();
    const b0Id = "block-0";
    const b0Cells = createCellsForBlock(b0Id, b0Size, 0, 0, b0Type);
    const b0RegionIds = [];
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
      regionIds: b0RegionIds
    });
    let blockIndex = 1;
    let attempts = 0;
    const maxAttempts = Math.max(1500, Math.ceil(target / 4) * 12);
    while (cellsMap.size < target && attempts < maxAttempts) {
      attempts++;
      const parentBlock = blocksList[Math.floor(Math.random() * blocksList.length)];
      const newSize = pickBlockSize();
      const newType = pickStructureType();
      const newId = `block-${blockIndex}`;
      const side = Math.floor(Math.random() * 4);
      let newOriginX = 0;
      let newOriginY = 0;
      if (side === 0) {
        newOriginX = parentBlock.originX + parentBlock.size;
        newOriginY = parentBlock.originY + Math.floor(Math.random() * (parentBlock.size - newSize + 1));
      } else if (side === 1) {
        newOriginX = parentBlock.originX + Math.floor(Math.random() * (parentBlock.size - newSize + 1));
        newOriginY = parentBlock.originY + parentBlock.size;
      } else if (side === 2) {
        newOriginX = parentBlock.originX - newSize;
        newOriginY = parentBlock.originY + Math.floor(Math.random() * (parentBlock.size - newSize + 1));
      } else {
        newOriginX = parentBlock.originX + Math.floor(Math.random() * (parentBlock.size - newSize + 1));
        newOriginY = parentBlock.originY - newSize;
      }
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
      let newBlockCells = createCellsForBlock(newId, newSize, newOriginX, newOriginY, newType);
      let minD = Infinity;
      let bestCellInNew = newBlockCells[0];
      let bestCellInParent = cellsMap.get(parentBlock.regionIds[0]);
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
      if (minD > 1) {
        if (side === 0) {
          const touchY = Math.max(newOriginY, parentBlock.originY);
          const parentEdgeKey = posKey(parentBlock.originX + parentBlock.size - 1, touchY);
          const newEdgeKey = posKey(newOriginX, touchY);
          if (!cellsMap.has(parentEdgeKey)) {
            const addCell = {
              x: parentBlock.originX + parentBlock.size - 1,
              y: touchY,
              structureTag: parentBlock.structureTag,
              blockId: parentBlock.id,
              blockSize: parentBlock.size
            };
            cellsMap.set(parentEdgeKey, addCell);
            parentBlock.regionIds.push(parentEdgeKey);
          }
          if (!newBlockCells.some((c) => c.x === newOriginX && c.y === touchY)) {
            newBlockCells.push({
              x: newOriginX,
              y: touchY,
              structureTag: newType,
              blockId: newId,
              blockSize: newSize
            });
          }
        } else if (side === 1) {
          const touchX = Math.max(newOriginX, parentBlock.originX);
          const parentEdgeKey = posKey(touchX, parentBlock.originY + parentBlock.size - 1);
          const newEdgeKey = posKey(touchX, newOriginY);
          if (!cellsMap.has(parentEdgeKey)) {
            const addCell = {
              x: touchX,
              y: parentBlock.originY + parentBlock.size - 1,
              structureTag: parentBlock.structureTag,
              blockId: parentBlock.id,
              blockSize: parentBlock.size
            };
            cellsMap.set(parentEdgeKey, addCell);
            parentBlock.regionIds.push(parentEdgeKey);
          }
          if (!newBlockCells.some((c) => c.x === touchX && c.y === newOriginY)) {
            newBlockCells.push({
              x: touchX,
              y: newOriginY,
              structureTag: newType,
              blockId: newId,
              blockSize: newSize
            });
          }
        } else if (side === 2) {
          const touchY = Math.max(newOriginY, parentBlock.originY);
          const parentEdgeKey = posKey(parentBlock.originX, touchY);
          if (!cellsMap.has(parentEdgeKey)) {
            const addCell = {
              x: parentBlock.originX,
              y: touchY,
              structureTag: parentBlock.structureTag,
              blockId: parentBlock.id,
              blockSize: parentBlock.size
            };
            cellsMap.set(parentEdgeKey, addCell);
            parentBlock.regionIds.push(parentEdgeKey);
          }
          if (!newBlockCells.some((c) => c.x === newOriginX + newSize - 1 && c.y === touchY)) {
            newBlockCells.push({
              x: newOriginX + newSize - 1,
              y: touchY,
              structureTag: newType,
              blockId: newId,
              blockSize: newSize
            });
          }
        } else {
          const touchX = Math.max(newOriginX, parentBlock.originX);
          const parentEdgeKey = posKey(touchX, parentBlock.originY);
          if (!cellsMap.has(parentEdgeKey)) {
            const addCell = {
              x: touchX,
              y: parentBlock.originY,
              structureTag: parentBlock.structureTag,
              blockId: parentBlock.id,
              blockSize: parentBlock.size
            };
            cellsMap.set(parentEdgeKey, addCell);
            parentBlock.regionIds.push(parentEdgeKey);
          }
          if (!newBlockCells.some((c) => c.x === touchX && c.y === newOriginY + newSize - 1)) {
            newBlockCells.push({
              x: touchX,
              y: newOriginY + newSize - 1,
              structureTag: newType,
              blockId: newId,
              blockSize: newSize
            });
          }
        }
      }
      const thisBlockRegionIds = [];
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
        regionIds: thisBlockRegionIds
      });
      blockIndex++;
    }
    const connectedKeys = getLargestConnectedComponent(cellsMap);
    const finalBlocks = [];
    const prunedCells = /* @__PURE__ */ new Map();
    for (const b of blocksList) {
      const validRegions = b.regionIds.filter((id) => connectedKeys.has(id));
      if (validRegions.length > 0) {
        b.regionIds = validRegions;
        finalBlocks.push(b);
        for (const id of validRegions) {
          prunedCells.set(id, cellsMap.get(id));
        }
      }
    }
    if (prunedCells.size < target) {
      if (retry >= 5) {
        throw new Error(`N\xE3o foi poss\xEDvel gerar um mapa conectado com ${target} regi\xF5es.`);
      }
      return generateTopologyAttempt(params, retry + 1);
    }
    trimConnectedCellsToTarget(prunedCells, finalBlocks, target);
    for (let index = finalBlocks.length - 1; index >= 0; index -= 1) {
      if (!finalBlocks[index].regionIds.length) finalBlocks.splice(index, 1);
    }
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const c of prunedCells.values()) {
      if (c.x < minX) minX = c.x;
      if (c.x > maxX) maxX = c.x;
      if (c.y < minY) minY = c.y;
      if (c.y > maxY) maxY = c.y;
    }
    const normalizedCells = /* @__PURE__ */ new Map();
    for (const c of prunedCells.values()) {
      const nx = c.x - minX;
      const ny = c.y - minY;
      normalizedCells.set(posKey(nx, ny), {
        ...c,
        x: nx,
        y: ny
      });
    }
    for (const b of finalBlocks) {
      b.originX -= minX;
      b.originY -= minY;
      b.regionIds = b.regionIds.map((oldId) => {
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
      height: maxY - minY + 1
    };
    const startingPoints = pickOppositeStartingPoints(normalizedCells, normBounds);
    return {
      cells: normalizedCells,
      blocks: finalBlocks,
      startingPoints,
      bounds: normBounds
    };
  }
  function trimConnectedCellsToTarget(cells, blocks, target) {
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const getNeighborKeys = (key) => {
      const [x, y] = parseKey(key);
      return directions.map(([dx, dy]) => posKey(x + dx, y + dy)).filter((neighbor) => cells.has(neighbor));
    };
    const staysConnected = (removedKey) => {
      const startKey = Array.from(cells.keys()).find((key) => key !== removedKey);
      if (!startKey) return target === 0;
      const visited = /* @__PURE__ */ new Set([startKey]);
      const queue = [startKey];
      while (queue.length) {
        const key = queue.shift();
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
        throw new Error(`N\xE3o foi poss\xEDvel reduzir o mapa conectado para ${target} regi\xF5es.`);
      }
      const removedCell = cells.get(removable);
      cells.delete(removable);
      const block = blocks.find((entry) => entry.id === removedCell.blockId);
      if (block) block.regionIds = block.regionIds.filter((key) => key !== removable);
    }
  }
  function getLargestConnectedComponent(cells) {
    const visited = /* @__PURE__ */ new Set();
    let largest = [];
    const cardDirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const startKey of cells.keys()) {
      if (visited.has(startKey)) continue;
      const component = [];
      const queue = [startKey];
      visited.add(startKey);
      while (queue.length > 0) {
        const cur = queue.shift();
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
  function pickOppositeStartingPoints(cells, bounds) {
    const allKeys = Array.from(cells.keys());
    if (allKeys.length < 2) {
      const k1 = allKeys[0] || "0,0";
      const [x1, y1] = parseKey(k1);
      return [
        { regionId: k1, x: x1, y: y1, team: 1, piece: "g", rank: 8 },
        { regionId: k1, x: x1, y: y1, team: 2, piece: "g", rank: 8 }
      ];
    }
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const scored = allKeys.map((k) => {
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
        piece: "g",
        rank: 8
      },
      {
        regionId: bestSP2.key,
        x: bestSP2.x,
        y: bestSP2.y,
        team: 2,
        piece: "g",
        rank: 8
      }
    ];
  }

  // rankPropagation.ts
  function calculateGraphDistances(startKey, allKeys) {
    const distances = /* @__PURE__ */ new Map();
    const queue = [[startKey, 0]];
    distances.set(startKey, 0);
    const cardDirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (queue.length > 0) {
      const [currentKey, dist] = queue.shift();
      const [cx, cy] = parseKey(currentKey);
      for (const [dx, dy] of cardDirs) {
        const neighborKey = posKey(cx + dx, cy + dy);
        if (allKeys.has(neighborKey) && !distances.has(neighborKey)) {
          distances.set(neighborKey, dist + 1);
          queue.push([neighborKey, dist + 1]);
        }
      }
    }
    return distances;
  }
  function propagateRanks(cellsMap, startingPoints, bounds, matrix = DEFAULT_RANK_CONTRIBUTION_MATRIX) {
    const allKeys = new Set(cellsMap.keys());
    const regions = /* @__PURE__ */ new Map();
    const ranked = /* @__PURE__ */ new Map();
    const tileOrigin = /* @__PURE__ */ new Map();
    const tileStep = /* @__PURE__ */ new Map();
    const stepsHistory = [];
    const adjacency = /* @__PURE__ */ new Map();
    const cardDirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const k of allKeys) {
      const [x, y] = parseKey(k);
      const nbrs = [];
      for (const [dx, dy] of cardDirs) {
        const nk = posKey(x + dx, y + dy);
        if (allKeys.has(nk)) {
          nbrs.push(nk);
        }
      }
      adjacency.set(k, nbrs);
    }
    const distSP1 = calculateGraphDistances(startingPoints[0].regionId, allKeys);
    const distSP2 = calculateGraphDistances(startingPoints[1].regionId, allKeys);
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const sp1Key = startingPoints[0].regionId;
    const sp2Key = startingPoints[1].regionId;
    ranked.set(sp1Key, 8);
    tileOrigin.set(sp1Key, "team1");
    tileStep.set(sp1Key, 0);
    ranked.set(sp2Key, 8);
    tileOrigin.set(sp2Key, "team2");
    tileStep.set(sp2Key, 0);
    stepsHistory.push({
      step: 0,
      newlyRanked: [
        { id: sp1Key, rank: 8, origin: "team1" },
        { id: sp2Key, rank: 8, origin: "team2" }
      ]
    });
    const unranked = new Set(allKeys);
    unranked.delete(sp1Key);
    unranked.delete(sp2Key);
    let currentStep = 1;
    while (unranked.size > 0) {
      const frontTeam1 = /* @__PURE__ */ new Set();
      const frontTeam2 = /* @__PURE__ */ new Set();
      for (const key of unranked) {
        const nbrs = adjacency.get(key) || [];
        for (const n of nbrs) {
          if (ranked.has(n)) {
            const orig = tileOrigin.get(n);
            if (orig === "team1") frontTeam1.add(key);
            else if (orig === "team2") frontTeam2.add(key);
            else if (orig === "meeting_point") {
              frontTeam1.add(key);
              frontTeam2.add(key);
            }
          }
        }
      }
      const currentFrontierKeys = /* @__PURE__ */ new Set([...frontTeam1, ...frontTeam2]);
      if (currentFrontierKeys.size === 0) {
        const orphan = unranked.values().next().value;
        if (orphan) {
          ranked.set(orphan, 4);
          tileOrigin.set(orphan, "meeting_point");
          tileStep.set(orphan, currentStep);
          unranked.delete(orphan);
        }
        currentStep++;
        continue;
      }
      const stepNewRanked = [];
      for (const tileKey of currentFrontierKeys) {
        const nbrs = adjacency.get(tileKey) || [];
        let touchesTeam1 = false;
        let touchesTeam2 = false;
        const weights = {
          8: 0,
          7: 0,
          6: 0,
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0
        };
        let totalWeight = 0;
        for (const n of nbrs) {
          const neighborRank = ranked.get(n);
          if (neighborRank !== void 0) {
            const neighborOrig = tileOrigin.get(n);
            if (neighborOrig === "team1") touchesTeam1 = true;
            if (neighborOrig === "team2") touchesTeam2 = true;
            if (neighborOrig === "meeting_point") {
              touchesTeam1 = true;
              touchesTeam2 = true;
            }
            const contrib = (matrix || DEFAULT_RANK_CONTRIBUTION_MATRIX)[neighborRank] || {};
            for (const [targetRankStr, points] of Object.entries(contrib)) {
              const targetRank = Number(targetRankStr);
              if (typeof points === "number" && points > 0) {
                weights[targetRank] += points;
                totalWeight += points;
              }
            }
          }
        }
        let origin = "meeting_point";
        if (touchesTeam1 && touchesTeam2) {
          origin = "meeting_point";
        } else if (touchesTeam1) {
          origin = "team1";
        } else if (touchesTeam2) {
          origin = "team2";
        }
        let chosenRank = 4;
        if (totalWeight > 0) {
          let randVal = Math.random() * totalWeight;
          for (let r = 8; r >= 1; r--) {
            const rL = r;
            randVal -= weights[rL];
            if (randVal <= 1e-4) {
              chosenRank = rL;
              break;
            }
          }
        }
        ranked.set(tileKey, chosenRank);
        tileOrigin.set(tileKey, origin);
        tileStep.set(tileKey, currentStep);
        unranked.delete(tileKey);
        stepNewRanked.push({ id: tileKey, rank: chosenRank, origin });
      }
      stepsHistory.push({
        step: currentStep,
        newlyRanked: stepNewRanked
      });
      currentStep++;
    }
    for (const k of allKeys) {
      const [x, y] = parseKey(k);
      const rank = ranked.get(k) || 4;
      const isSP1 = k === sp1Key;
      const isSP2 = k === sp2Key;
      const isStartingPoint = isSP1 || isSP2;
      const cell = cellsMap.get(k);
      const d1 = distSP1.get(k) ?? 0;
      const d2 = distSP2.get(k) ?? 0;
      const dNearest = Math.min(d1, d2);
      const dCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const origin = tileOrigin.get(k) || "meeting_point";
      const step = tileStep.get(k) || 0;
      const tile = {
        id: k,
        x,
        y,
        rank,
        points: RANK_POINTS[rank],
        color: RANK_COLORS[rank],
        isStartingPoint,
        team: isSP1 ? 1 : isSP2 ? 2 : null,
        piece: isStartingPoint ? "g" : null,
        building: null,
        structureTag: cell?.structureTag,
        blockId: cell?.blockId || "block-0",
        blockSize: cell?.blockSize || 3,
        distToSP1: d1,
        distToSP2: d2,
        distToNearestSP: dNearest,
        distToCenter: dCenter,
        propagationStep: step,
        propagationOrigin: origin
      };
      regions.set(k, tile);
    }
    return { regions, adjacency, stepsHistory };
  }

  // buildingPlacer.ts
  function getRankDistance(regionRank, level) {
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
  function getSpatialDistance(tile, level, maxSPDist, maxCenterDist) {
    const safeMaxSP = maxSPDist > 0 ? maxSPDist : 1;
    const safeMaxCenter = maxCenterDist > 0 ? maxCenterDist : 1;
    if (level === 1 || level === 2) {
      const dist = tile.distToNearestSP ?? 0;
      return Math.min(1, Math.max(0, dist / safeMaxSP));
    } else if (level === 4 || level === 5) {
      const dist = tile.distToCenter ?? 0;
      return Math.min(1, Math.max(0, dist / safeMaxCenter));
    } else {
      const normCenter = Math.min(1, (tile.distToCenter ?? 0) / safeMaxCenter);
      return Math.min(1, Math.abs(normCenter - 0.5) * 2);
    }
  }
  function placeBuildings(regionsMap, params) {
    const regions = Array.from(regionsMap.values());
    let totalPoints = 0;
    const rankCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0
    };
    for (const tile of regions) {
      totalPoints += RANK_POINTS[tile.rank];
      rankCounts[tile.rank]++;
      tile.building = null;
    }
    const desirableCoins = Math.round(totalPoints / 15);
    const desirableWheat = Math.round(totalPoints / 2);
    let maxSPDist = 1;
    let maxCenterDist = 1;
    for (const t of regions) {
      if ((t.distToNearestSP ?? 0) > maxSPDist) maxSPDist = t.distToNearestSP;
      if ((t.distToCenter ?? 0) > maxCenterDist) maxCenterDist = t.distToCenter;
    }
    const densityFraction = Math.max(0.05, Math.min(0.9, params.buildingDensity / 100));
    const maxAvailable = params.allowBuildingsOnStartingPoints ? regions.length : regions.filter((r) => !r.isStartingPoint).length;
    const totalBuildingsToPlace = Math.max(1, Math.round(maxAvailable * densityFraction));
    const povoadoRatio = Math.max(0.1, Math.min(0.9, params.povoadoRatio / 100));
    let povoadosToPlace = Math.round(totalBuildingsToPlace * povoadoRatio);
    let fazendasToPlace = totalBuildingsToPlace - povoadosToPlace;
    if (povoadosToPlace <= 0) povoadosToPlace = 1;
    if (fazendasToPlace <= 0) fazendasToPlace = 1;
    let currentCoins = 0;
    let currentWheat = 0;
    const buildingsByLevel = {
      povoado: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      fazenda: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
    let available = regions.filter((r) => {
      if (!params.allowBuildingsOnStartingPoints && r.isStartingPoint) {
        return false;
      }
      return r.building === null;
    });
    const queue = [];
    let pLeft = povoadosToPlace;
    let fLeft = fazendasToPlace;
    while (pLeft > 0 || fLeft > 0) {
      if (pLeft > 0) {
        queue.push("povoado");
        pLeft--;
      }
      if (fLeft > 0) {
        queue.push("fazenda");
        fLeft--;
      }
    }
    const alpha = Math.max(0.1, params.alpha);
    const beta = Math.max(0.1, params.beta);
    const baseTau = Math.max(0.1, params.tau);
    for (let step = 0; step < queue.length; step++) {
      if (available.length === 0) break;
      const bType = queue[step];
      const remainingSlotsOfThisType = queue.slice(step).filter((t) => t === bType).length;
      const currentProd = bType === "povoado" ? currentCoins : currentWheat;
      const targetProd = bType === "povoado" ? desirableCoins : desirableWheat;
      const delta = Math.max(0, targetProd - currentProd);
      const yieldTable = bType === "povoado" ? POVOADO_YIELD : FAZENDA_YIELD;
      const targetPerSlot = remainingSlotsOfThisType > 0 ? delta / remainingSlotsOfThisType : delta;
      const tauUnitScale = bType === "povoado" ? 250 : 2500;
      const tau = baseTau * tauUnitScale;
      const levelWeights = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let sumLevelWeights = 0;
      for (let lvl = 1; lvl <= 5; lvl++) {
        const bLvl = lvl;
        const yL = yieldTable[bLvl];
        const eL = Math.abs(targetPerSlot - yL);
        const wL = Math.exp(-eL / tau);
        levelWeights[bLvl] = wL;
        sumLevelWeights += wL;
      }
      let chosenLevel = 1;
      let rSample = Math.random() * sumLevelWeights;
      for (let lvl = 1; lvl <= 5; lvl++) {
        const bLvl = lvl;
        rSample -= levelWeights[bLvl];
        if (rSample <= 1e-4) {
          chosenLevel = bLvl;
          break;
        }
      }
      const regionWeights = [];
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
      let targetTile = regionWeights[0].tile;
      let rRegSample = Math.random() * sumRegionWeights;
      for (const rw of regionWeights) {
        rRegSample -= rw.weight;
        if (rRegSample <= 1e-4) {
          targetTile = rw.tile;
          break;
        }
      }
      const producedCoins = bType === "povoado" ? POVOADO_YIELD[chosenLevel] : 0;
      const producedWheat = bType === "fazenda" ? FAZENDA_YIELD[chosenLevel] : 0;
      const building = {
        type: bType,
        level: chosenLevel,
        coinsPerTurn: producedCoins,
        wheatPerTurn: producedWheat
      };
      targetTile.building = building;
      currentCoins += producedCoins;
      currentWheat += producedWheat;
      buildingsByLevel[bType][chosenLevel]++;
      available = available.filter((t) => t.id !== targetTile.id);
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
      rankCounts
    };
  }

  // mapGenerator.ts
  var DEFAULT_PARAMETERS = {
    targetRegions: 150,
    topologyPreset: "hybrid",
    weightGrid: 35,
    weightL: 30,
    weightCircular: 25,
    weightCross: 10,
    alpha: 1.5,
    beta: 0.8,
    tau: 1,
    buildingDensity: 28,
    povoadoRatio: 50,
    allowBuildingsOnStartingPoints: false
  };
  function generateFullMap(params = DEFAULT_PARAMETERS) {
    const topology = generateTopology(params);
    const { regions: regionsMap, adjacency: adjMap, stepsHistory } = propagateRanks(
      topology.cells,
      topology.startingPoints,
      topology.bounds,
      params.rankContributionMatrix || DEFAULT_RANK_CONTRIBUTION_MATRIX
    );
    const economy = placeBuildings(regionsMap, params);
    const adjacency = {};
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
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      stepsHistory
    };
  }
  function buildQuadrilateralBlocksExport(mapState, options = {}) {
    const L1 = options.L1 ?? 500;
    const L2 = options.L2 ?? 500;
    const rotationEnabled = options.rotationEnabled ?? false;
    const linearRotationEnabled = options.linearRotationEnabled ?? false;
    const globalLayerCounters = {
      8: 0,
      7: 0,
      6: 0,
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };
    const blocks = mapState.blocks.map((b, blockIdx) => {
      const blockName = `BQ${String(blockIdx + 1).padStart(2, "0")}`;
      const matrixSize = b.size;
      const C_inicial = {
        x: b.originX * L1 + Math.round(L1 / 2),
        y: b.originY * L2 + Math.round(L2 / 2)
      };
      const blockRegions = b.regionIds.map((id) => mapState.regionsMap.get(id)).filter((r) => !!r);
      const sortedRegions = [...blockRegions].sort((r1, r2) => {
        const row1 = r1.y - b.originY;
        const row2 = r2.y - b.originY;
        if (row1 !== row2) return row1 - row2;
        const col1 = r1.x - b.originX;
        const col2 = r2.x - b.originX;
        return col1 - col2;
      });
      const matrix = Array.from(
        { length: matrixSize },
        () => Array(matrixSize).fill(null)
      );
      const regions = sortedRegions.map((r) => {
        const layer = r.rank;
        globalLayerCounters[layer] = (globalLayerCounters[layer] || 0) + 1;
        const regionIndex = globalLayerCounters[layer];
        const code = `L${layer}-${regionIndex}`;
        const localRow = r.y - b.originY + 1;
        const localCol = r.x - b.originX + 1;
        if (localRow >= 1 && localRow <= matrixSize && localCol >= 1 && localCol <= matrixSize) {
          matrix[localRow - 1][localCol - 1] = code;
        }
        const initialPieces = [];
        if (r.team === 1 || r.isStartingPoint && r.team !== 2) {
          initialPieces.push({ team: "blue", stage: r.piece || "g" });
        } else if (r.team === 2) {
          initialPieces.push({ team: "orange", stage: r.piece || "g" });
        }
        const regionData = {
          name: code,
          code,
          rank: `L${layer}`,
          layer,
          region: regionIndex,
          shape: "quadrilateral",
          positions: [[localRow, localCol]],
          maxPieces: layer,
          initialPieces
        };
        if (r.building) {
          if (r.building.type === "fazenda") {
            regionData.farmBuildingLevel = r.building.level;
          } else if (r.building.type === "povoado") {
            regionData.villageBuildingLevel = r.building.level;
          }
        }
        return regionData;
      });
      return {
        name: blockName,
        type: "quadrilateral",
        matrixSize,
        matrix,
        L1,
        L2,
        C_inicial,
        rotationEnabled,
        linearRotationEnabled,
        regions
      };
    });
    return { blocks };
  }

  // gameMapExport.ts
  function generateRandomBoard(targetRegions, rotationsEnabled = false) {
    if (!Number.isFinite(targetRegions)) {
      throw new RangeError("A meta de regi\xF5es precisa ser um n\xFAmero finito.");
    }
    const normalizedTarget = Math.min(900, Math.max(25, Math.round(targetRegions)));
    const mapState = generateFullMap({
      ...DEFAULT_PARAMETERS,
      targetRegions: normalizedTarget,
      topologyPreset: "hybrid",
      allowBuildingsOnStartingPoints: false
    });
    const { blocks } = buildQuadrilateralBlocksExport(mapState, {
      L1: 1e3,
      L2: 500,
      rotationEnabled: rotationsEnabled,
      linearRotationEnabled: rotationsEnabled
    });
    const configuredBlocks = blocks.map((block) => ({
      ...block,
      rotationEnabled: rotationsEnabled,
      linearRotationEnabled: rotationsEnabled && [3, 5].includes(block.matrixSize)
    }));
    return {
      boardType: "quadrilateral",
      version: 1,
      name: `Mapa estrat\xE9gico \xB7 ${mapState.regions.length} regi\xF5es`,
      displayScale: 1,
      coordinateSystem: {
        tileColumns: 226,
        tileRows: 226,
        tileSize: 4,
        tileCenterOffset: 2
      },
      blocks: configuredBlocks,
      randomMap: {
        generator: "cartografo-estrategico",
        generatedAt: mapState.generatedAt,
        targetRegions: normalizedTarget,
        actualRegions: mapState.regions.length,
        rotationsEnabled
      }
    };
  }
  return __toCommonJS(gameMapExport_exports);
})();
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
if (typeof module !== "undefined" && module.exports) module.exports = WillOfManyMapGenerator;
