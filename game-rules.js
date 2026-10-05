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
  const promotionCostBySourceLayer = Object.freeze({
    8: 3,
    7: 9,
    6: 27,
    5: 81,
    4: 243,
    3: 729,
    2: 2197
  });

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

  function buildWarConflicts(regionOrder, neighborsByRegion, dominators) {
    const consumedRegions = new Set();
    const conflicts = [];

    regionOrder.forEach((regionCode) => {
      if (consumedRegions.has(regionCode)) return;
      const attacker = dominators[regionCode];
      if (attacker !== 'orange' && attacker !== 'blue') return;

      const alliedRegions = [regionCode];
      const enemyRegions = [];
      (neighborsByRegion[regionCode] || []).forEach((neighborCode) => {
        if (consumedRegions.has(neighborCode)) return;
        const neighborDominator = dominators[neighborCode];
        if (neighborDominator === attacker) alliedRegions.push(neighborCode);
        if (neighborDominator !== 'free' && neighborDominator !== attacker) {
          enemyRegions.push(neighborCode);
        }
      });
      if (!enemyRegions.length) return;

      const conflict = {
        regionCode,
        alliedRegions: [...new Set(alliedRegions)],
        enemyRegions: [...new Set(enemyRegions)],
        attacker
      };
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

  return Object.freeze({
    soldierWeights,
    stageOrder,
    promotionCostBySourceLayer,
    mergeTeamCounts,
    getFinalPieceCountForTeam,
    buildStageCountsFromSoldierTotal,
    getSoldierCount,
    getPieceCount,
    areAxisAlignedCellsNeighbors,
    rotateQuadrilateralMatrix,
    rotateQuadrilateralMatrixPath,
    getQuadrilateralMatrixRingPath,
    getQuadrilateralMatrixRotationGroups,
    getQuadrilateralMatrixLinearPaths,
    getQuadrilateralMatrixHorizontalPath,
    getRegionLayer,
    getWarRegionOrder,
    buildWarConflicts,
    getRecruitmentCost,
    getRelegationRefund,
    getRecycleRefund
  });
});
