(function (root, factory) {
  const rules = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = rules;
  } else {
    root.WillOfManyRules = rules;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const soldierWeights = Object.freeze({
    g: 1,
    f: 7,
    e: 42,
    d: 210,
    c: 840,
    b: 2520,
    a: 5040
  });
  const stageOrder = Object.freeze(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
  const ascendingStages = Object.freeze(['g', 'f', 'e', 'd', 'c', 'b', 'a']);
  const mergeThresholds = Object.freeze({ g: 7, f: 6, e: 5, d: 4, c: 3, b: 2 });
  const farmProductionByLevel = Object.freeze({
    1: 250,
    2: 1000,
    3: 4000,
    4: 16000,
    5: 50000
  });
  const villageCoinProductionByLevel = Object.freeze({
    1: 10,
    2: 50,
    3: 250,
    4: 1000,
    5: 4000
  });
  const promotionCostBySourceLayer = Object.freeze({
    8: 3,
    7: 9,
    6: 27,
    5: 81,
    4: 243,
    3: 729,
    2: 2197
  });
  const rankChangeRules = Object.freeze({
    upgrade: Object.freeze({
      costBySourceLayer: Object.freeze({ 8: 1, 7: 4, 6: 20, 5: 100, 4: 350, 3: 1000, 2: 2000 }),
      minimumSoldiersBySourceLayer: Object.freeze({ 8: 32, 7: 28, 6: 24, 5: 15, 4: 12, 3: 9, 2: 5 })
    }),
    downgrade: Object.freeze({
      costBySourceLayer: Object.freeze({ 7: 1, 6: 4, 5: 20, 4: 100, 3: 350, 2: 1000, 1: 2000 }),
      minimumSoldiersBySourceLayer: Object.freeze({ 7: 35, 6: 24, 5: 20, 4: 12, 3: 9, 2: 7, 1: 6 })
    })
  });

  function getFarmBuildingLevel(region) {
    const explicitLevel = Number(region?.farmBuildingLevel ?? region?.farmLevel);
    if (Number.isInteger(explicitLevel) &&
        Object.prototype.hasOwnProperty.call(farmProductionByLevel, explicitLevel)) {
      return explicitLevel;
    }
    const production = Math.max(0, Number(region?.farmProductionPerTurn) || 0);
    if (!production) return 0;
    return Object.keys(farmProductionByLevel).map(Number).sort((first, second) => first - second)
      .find((level) => production <= farmProductionByLevel[level]) || 5;
  }

  function getVillageBuildingLevel(region) {
    const level = Number(region?.villageBuildingLevel);
    return Number.isInteger(level) &&
      Object.prototype.hasOwnProperty.call(villageCoinProductionByLevel, level)
      ? level
      : 0;
  }

  function mergeTeamCounts(counts) {
    for (const stage of ascendingStages.slice(0, -1)) {
      while (Number(counts[stage] || 0) >= mergeThresholds[stage]) {
        counts[stage] = Number(counts[stage] || 0) - mergeThresholds[stage];
        const nextStage = ascendingStages[ascendingStages.indexOf(stage) + 1];
        counts[nextStage] = Number(counts[nextStage] || 0) + 1;
      }
    }
    return counts;
  }

  function getFinalPieceCountForTeam(teamCounts) {
    const counts = {};
    ascendingStages.forEach((stage) => {
      counts[stage] = Number(teamCounts[stage] || 0);
    });
    mergeTeamCounts(counts);
    return ascendingStages.reduce((sum, stage) => sum + Number(counts[stage] || 0), 0);
  }

  function buildStageCountsFromSoldierTotal(totalSoldiers) {
    const counts = Object.fromEntries(ascendingStages.map((stage) => [stage, 0]));
    let remaining = Math.max(0, Math.floor(Number(totalSoldiers) || 0));
    for (const stage of stageOrder) {
      const weight = soldierWeights[stage] || 1;
      counts[stage] = Math.floor(remaining / weight);
      remaining %= weight;
    }
    return mergeTeamCounts(counts);
  }

  function getSoldierCount(teamCounts) {
    return ascendingStages.reduce((total, stage) => {
      return total + (Number(teamCounts[stage] || 0) * (soldierWeights[stage] || 0));
    }, 0);
  }

  function getPieceCount(teamCounts) {
    return ascendingStages.reduce((total, stage) => total + Number(teamCounts[stage] || 0), 0);
  }

  function getRankChangeRequirements(type, sourceLayer) {
    const rules = rankChangeRules[type];
    const layer = Number(sourceLayer);
    if (!rules || !Number.isInteger(layer) ||
        !Object.prototype.hasOwnProperty.call(rules.costBySourceLayer, layer)) {
      return null;
    }
    return {
      sourceLayer: layer,
      targetLayer: type === 'upgrade' ? layer - 1 : layer + 1,
      cost: rules.costBySourceLayer[layer],
      minimumSoldiers: rules.minimumSoldiersBySourceLayer[layer]
    };
  }

  function calculateRankChangeSoldierTotal(type, sourceLayer, originalSoldiers) {
    const requirements = getRankChangeRequirements(type, sourceLayer);
    const soldiers = Number(originalSoldiers);
    if (!requirements || !Number.isFinite(soldiers) || soldiers < 0) return null;
    const { sourceLayer: layer, targetLayer } = requirements;
    const converted = type === 'upgrade'
      ? Math.floor((soldiers - 2 * layer + 1) / layer)
      : Math.floor((soldiers - 2 * targetLayer + 1) * layer / 3);
    return Math.max(0, converted);
  }

  function areAxisAlignedCellsNeighbors(
    firstCell,
    secondCell,
    tolerance = 1,
    includeCornerContact = false
  ) {
    if (!firstCell || !secondCell) return false;
    const firstLeft = Number(firstCell.x) - Number(firstCell.width) / 2;
    const firstRight = Number(firstCell.x) + Number(firstCell.width) / 2;
    const firstTop = Number(firstCell.y) - Number(firstCell.height) / 2;
    const firstBottom = Number(firstCell.y) + Number(firstCell.height) / 2;
    const secondLeft = Number(secondCell.x) - Number(secondCell.width) / 2;
    const secondRight = Number(secondCell.x) + Number(secondCell.width) / 2;
    const secondTop = Number(secondCell.y) - Number(secondCell.height) / 2;
    const secondBottom = Number(secondCell.y) + Number(secondCell.height) / 2;
    const epsilon = Math.max(0, Number(tolerance) || 0);
    const verticalOverlap = Math.min(firstBottom, secondBottom) -
      Math.max(firstTop, secondTop);
    const horizontalOverlap = Math.min(firstRight, secondRight) -
      Math.max(firstLeft, secondLeft);
    const minimumOverlap = includeCornerContact ? -epsilon : epsilon;
    return (
      (Math.abs(firstRight - secondLeft) <= epsilon ||
        Math.abs(secondRight - firstLeft) <= epsilon) &&
      verticalOverlap > minimumOverlap
    ) || (
      (Math.abs(firstBottom - secondTop) <= epsilon ||
        Math.abs(secondBottom - firstTop) <= epsilon) &&
      horizontalOverlap > minimumOverlap
    );
  }

  function rotateQuadrilateralMatrix(matrix, direction, rotationArea = null) {
    if (!Array.isArray(matrix) || !matrix.length ||
        matrix.some((row) => !Array.isArray(row) || row.length !== matrix.length)) {
      throw new TypeError('A matriz de rotação deve ser quadrada.');
    }
    if (!['left', 'right'].includes(direction)) {
      throw new TypeError(`Direção de rotação inválida: ${direction}`);
    }

    const area = rotationArea || { row: 1, column: 1, size: matrix.length };
    const top = Number(area.row) - 1;
    const left = Number(area.column) - 1;
    const size = Number(area.size);
    if (!Number.isInteger(top) || !Number.isInteger(left) ||
        !Number.isInteger(size) || size < 1 ||
        top < 0 || left < 0 || top + size > matrix.length || left + size > matrix.length) {
      throw new RangeError('A área de rotação deve ser um quadrado válido dentro da matriz.');
    }

    const rotated = matrix.map((row) => [...row]);
    const rotateRing = (ringTop, ringLeft, ringSize) => {
      if (ringSize <= 1) return;
      const perimeter = [];
      for (let column = ringLeft; column < ringLeft + ringSize; column += 1) {
        perimeter.push([ringTop, column]);
      }
      for (let row = ringTop + 1; row < ringTop + ringSize; row += 1) {
        perimeter.push([row, ringLeft + ringSize - 1]);
      }
      for (let column = ringLeft + ringSize - 2; column >= ringLeft; column -= 1) {
        perimeter.push([ringTop + ringSize - 1, column]);
      }
      for (let row = ringTop + ringSize - 2; row > ringTop; row -= 1) {
        perimeter.push([row, ringLeft]);
      }
      const values = perimeter.map(([row, column]) => matrix[row][column]);
      const offset = direction === 'right' ? 1 : -1;
      perimeter.forEach(([row, column], index) => {
        const destination = perimeter[(index + offset + perimeter.length) % perimeter.length];
        rotated[destination[0]][destination[1]] = values[index];
      });
      rotateRing(ringTop + 1, ringLeft + 1, ringSize - 2);
    };
    rotateRing(top, left, size);
    return rotated;
  }

  function rotateQuadrilateralMatrixPath(matrix, direction, rotationPath) {
    if (!Array.isArray(matrix) || !matrix.length ||
        matrix.some((row) => !Array.isArray(row) || row.length !== matrix.length)) {
      throw new TypeError('A matriz de rotação deve ser quadrada.');
    }
    if (!['left', 'right'].includes(direction)) {
      throw new TypeError(`Direção de rotação inválida: ${direction}`);
    }
    if (!Array.isArray(rotationPath) || rotationPath.length < 2) {
      throw new RangeError('O percurso de rotação deve conter pelo menos duas células.');
    }

    const path = rotationPath.map((position) => {
      if (!Array.isArray(position) || position.length !== 2 ||
          !position.every(Number.isInteger)) {
        throw new RangeError('Cada posição do percurso deve conter linha e coluna inteiras.');
      }
      const [row, column] = position;
      if (row < 1 || row > matrix.length || column < 1 || column > matrix.length) {
        throw new RangeError('O percurso de rotação deve ficar dentro da matriz.');
      }
      return [row - 1, column - 1];
    });
    const pathKeys = path.map(([row, column]) => `${row}:${column}`);
    if (new Set(pathKeys).size !== pathKeys.length) {
      throw new RangeError('O percurso de rotação não pode repetir células.');
    }

    const rotated = matrix.map((row) => [...row]);
    const values = path.map(([row, column]) => matrix[row][column]);
    const offset = direction === 'right' ? 1 : -1;
    path.forEach(([row, column], index) => {
      const destination = path[(index + offset + path.length) % path.length];
      rotated[destination[0]][destination[1]] = values[index];
    });
    return rotated;
  }

  function getQuadrilateralMatrixRingPath(matrix, position) {
    if (!Array.isArray(matrix) || !matrix.length ||
        matrix.some((row) => !Array.isArray(row) || row.length !== matrix.length)) {
      throw new TypeError('A matriz de rotação deve ser quadrada.');
    }
    if (!Array.isArray(position) || position.length !== 2 ||
        !position.every(Number.isInteger)) {
      throw new RangeError('A posição deve conter linha e coluna inteiras.');
    }
    const [row, column] = position.map((value) => value - 1);
    if (row < 0 || row >= matrix.length || column < 0 || column >= matrix.length) {
      throw new RangeError('A posição deve ficar dentro da matriz.');
    }
    const ring = Math.min(row, column, matrix.length - row - 1, matrix.length - column - 1);
    const top = ring;
    const left = ring;
    const size = matrix.length - ring * 2;
    if (size <= 1) return null;
    const path = [];
    for (let currentColumn = left; currentColumn < left + size; currentColumn += 1) {
      path.push([top + 1, currentColumn + 1]);
    }
    for (let currentRow = top + 1; currentRow < top + size; currentRow += 1) {
      path.push([currentRow + 1, left + size]);
    }
    for (let currentColumn = left + size - 2; currentColumn >= left; currentColumn -= 1) {
      path.push([top + size, currentColumn + 1]);
    }
    for (let currentRow = top + size - 2; currentRow > top; currentRow -= 1) {
      path.push([currentRow + 1, left + 1]);
    }
    return path;
  }

  function getQuadrilateralMatrixRotationGroups(matrix, regionCode, linearRotationEnabled = false) {
    if (!Array.isArray(matrix) || !matrix.length ||
        matrix.some((row) => !Array.isArray(row) || row.length !== matrix.length)) {
      throw new TypeError('A matriz de rotação deve ser quadrada.');
    }
    if (typeof regionCode !== 'string' || !regionCode) {
      throw new TypeError('A região dos grupos de rotação é inválida.');
    }

    let position = null;
    matrix.forEach((row, rowIndex) => row.forEach((code, columnIndex) => {
      if (code !== regionCode) return;
      if (position !== null) {
        throw new RangeError(`A região ${regionCode} aparece mais de uma vez na matriz.`);
      }
      position = [rowIndex, columnIndex];
    }));
    if (position === null) return [];

    const [row, column] = position;
    const ring = Math.min(row, column, matrix.length - row - 1, matrix.length - column - 1);
    const ringSize = matrix.length - ring * 2;
    const groups = ringSize > 1 ? [{ type: 'ring', index: ring + 1 }] : [];
    const center = Math.floor(matrix.length / 2);
    if (linearRotationEnabled && matrix.length % 2 === 1 &&
        (row === center || column === center)) {
      groups.push({ type: 'linear', index: center + 1 });
    }
    return groups;
  }

  function getQuadrilateralMatrixLinearPaths(matrix, regionCode) {
    if (!Array.isArray(matrix) || !matrix.length ||
        matrix.some((row) => !Array.isArray(row) || row.length !== matrix.length)) {
      throw new TypeError('A matriz de rotação deve ser quadrada.');
    }
    if (typeof regionCode !== 'string' || !regionCode) {
      throw new TypeError('A região dos percursos lineares é inválida.');
    }

    let position = null;
    matrix.forEach((row, rowIndex) => row.forEach((code, columnIndex) => {
      if (code !== regionCode) return;
      if (position !== null) {
        throw new RangeError(`A região ${regionCode} aparece mais de uma vez na matriz.`);
      }
      position = [rowIndex + 1, columnIndex + 1];
    }));
    if (position === null) return null;
    const [row, column] = position;
    return {
      horizontal: matrix[row - 1].map((value, columnIndex) => [row, columnIndex + 1]),
      vertical: matrix.map((matrixRow, rowIndex) => [rowIndex + 1, column])
    };
  }

  function getQuadrilateralMatrixHorizontalPath(matrix, regionCode) {
    return getQuadrilateralMatrixLinearPaths(matrix, regionCode)?.horizontal || null;
  }

  function getRegionLayer(regionCode) {
    if (!regionCode) return 0;
    const match = String(regionCode).match(/^L(\d+)-/);
    return match ? Number(match[1]) : 0;
  }

  function getWarRegionOrder(regionCodes) {
    return [...regionCodes].sort((firstCode, secondCode) => {
      const firstLayer = getRegionLayer(firstCode);
      const secondLayer = getRegionLayer(secondCode);
      if (firstLayer !== secondLayer) return firstLayer - secondLayer;
      const firstRegion = Number(String(firstCode).match(/-(\d+)$/)?.[1]);
      const secondRegion = Number(String(secondCode).match(/-(\d+)$/)?.[1]);
      if (Number.isFinite(firstRegion) && Number.isFinite(secondRegion)) {
        return secondRegion - firstRegion;
      }
      if (Number.isFinite(firstRegion)) return -1;
      if (Number.isFinite(secondRegion)) return 1;
      return String(firstCode).localeCompare(String(secondCode));
    });
  }

  function buildWarConflictForRegion(regionCode, neighborsByRegion, dominators) {
    const attacker = dominators[regionCode];
    if (attacker !== 'orange' && attacker !== 'blue') return null;

    const alliedRegions = [regionCode];
    const enemyRegions = [];
    (neighborsByRegion[regionCode] || []).forEach((neighborCode) => {
      const neighborDominator = dominators[neighborCode];
      if (neighborDominator === attacker) alliedRegions.push(neighborCode);
      if (neighborDominator !== 'free' && neighborDominator !== attacker) {
        enemyRegions.push(neighborCode);
      }
    });
    if (!enemyRegions.length) return null;

    return {
      regionCode,
      alliedRegions: [...new Set(alliedRegions)],
      enemyRegions: [...new Set(enemyRegions)],
      attacker
    };
  }

  function buildWarConflicts(regionOrder, neighborsByRegion, dominators) {
    const consumedRegions = new Set();
    const conflicts = [];

    regionOrder.forEach((regionCode) => {
      if (consumedRegions.has(regionCode)) return;
      const neighbors = (neighborsByRegion[regionCode] || [])
        .filter((neighborCode) => !consumedRegions.has(neighborCode));
      const conflict = buildWarConflictForRegion(
        regionCode,
        { [regionCode]: neighbors },
        dominators
      );
      if (!conflict) return;

      conflicts.push(conflict);
      conflict.alliedRegions.concat(conflict.enemyRegions)
        .forEach((participant) => consumedRegions.add(participant));
    });

    return conflicts;
  }

  function getRecruitmentCost(targetLayer, stage) {
    if (!Object.prototype.hasOwnProperty.call(soldierWeights, stage)) return Infinity;
    if (!targetLayer) return Infinity;
    let promotionCost = 0;
    for (let sourceLayer = 8; sourceLayer > targetLayer; sourceLayer -= 1) {
      promotionCost += promotionCostBySourceLayer[sourceLayer] || 0;
    }
    return soldierWeights[stage] * (promotionCost + 1);
  }

  function getRelegationRefund(sourceCost, targetCost) {
    return Math.max(0, sourceCost / 2 - targetCost);
  }

  function getRecycleRefund(cost) {
    return Math.floor(cost / 2);
  }

  function getQuadrilateralCellDimensions(block, useCartographerAxes = false) {
    const firstAxis = Number(block?.L1);
    const secondAxis = Number(block?.L2);
    return useCartographerAxes
      ? { width: firstAxis, height: secondAxis }
      : { width: secondAxis, height: firstAxis };
  }

  function getQuadrilateralCellSlots(cells, maxSlots = 8) {
    const slotLimit = Math.min(8, Math.max(0, Math.floor(Number(maxSlots) || 0)));
    if (!Array.isArray(cells) || !slotLimit) return [];
    return cells.flatMap((cell) => {
      if (![cell?.x, cell?.y, cell?.width, cell?.height].every(Number.isFinite) ||
          cell.width <= 0 || cell.height <= 0) return [];
      const slots = [];
      for (let row = 0; row < 2; row += 1) {
        for (let column = 0; column < 4; column += 1) {
          slots.push({
            x: (cell.x + ((column + 0.5) / 4 - 0.5) * cell.width) / 908 * 100,
            y: (cell.y + ((row + 0.5) / 2 - 0.5) * cell.height) / 908 * 100
          });
        }
      }
      return slots;
    }).slice(0, slotLimit);
  }

  function getQuadrilateralCellFocusScale(cells, panelWidth, minimumScale = 1.8) {
    const cell = Array.isArray(cells) ? cells.find((candidate) =>
      [candidate?.width, candidate?.height].every(Number.isFinite) &&
      candidate.width > 0 && candidate.height > 0) : null;
    const availableWidth = Number(panelWidth);
    const scaleFloor = Number.isFinite(Number(minimumScale)) && Number(minimumScale) > 0
      ? Number(minimumScale)
      : 1.8;
    if (!cell || !Number.isFinite(availableWidth) || availableWidth <= 0) return scaleFloor;
    const minCellWidth = 128;
    const minCellHeight = 64;
    return Math.max(
      scaleFloor,
      minCellWidth * 908 / (cell.width * availableWidth),
      minCellHeight * 908 / (cell.height * availableWidth)
    );
  }

  function getAnnularSectorCentroid({ centerX, centerY, innerRadius, outerRadius, startAngle, endAngle }) {
    if (![centerX, centerY, innerRadius, outerRadius, startAngle, endAngle].every(Number.isFinite) ||
        innerRadius < 0 || outerRadius <= innerRadius ||
        endAngle <= startAngle || endAngle - startAngle > 360) {
      throw new RangeError('Invalid annular sector geometry.');
    }
    const angleSpan = (endAngle - startAngle) * Math.PI / 180;
    const midpointAngle = (startAngle + endAngle) / 2 * Math.PI / 180;
    const centroidRadius = (4 * Math.sin(angleSpan / 2) / (3 * angleSpan)) *
      ((outerRadius ** 3 - innerRadius ** 3) /
        (outerRadius ** 2 - innerRadius ** 2));
    return {
      x: centerX + centroidRadius * Math.cos(midpointAngle),
      y: centerY + centroidRadius * Math.sin(midpointAngle)
    };
  }

  return Object.freeze({
    soldierWeights,
    stageOrder,
    farmProductionByLevel,
    villageCoinProductionByLevel,
    getFarmBuildingLevel,
    getVillageBuildingLevel,
    promotionCostBySourceLayer,
    rankChangeRules,
    mergeTeamCounts,
    getFinalPieceCountForTeam,
    buildStageCountsFromSoldierTotal,
    getSoldierCount,
    getPieceCount,
    getRankChangeRequirements,
    calculateRankChangeSoldierTotal,
    areAxisAlignedCellsNeighbors,
    rotateQuadrilateralMatrix,
    rotateQuadrilateralMatrixPath,
    getQuadrilateralMatrixRingPath,
    getQuadrilateralMatrixRotationGroups,
    getQuadrilateralMatrixLinearPaths,
    getQuadrilateralMatrixHorizontalPath,
    getRegionLayer,
    getWarRegionOrder,
    buildWarConflictForRegion,
    buildWarConflicts,
    getRecruitmentCost,
    getRelegationRefund,
    getRecycleRefund,
    getQuadrilateralCellDimensions,
    getQuadrilateralCellSlots,
    getQuadrilateralCellFocusScale,
    getAnnularSectorCentroid
  });
});
