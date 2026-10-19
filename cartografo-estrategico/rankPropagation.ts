/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DEFAULT_RANK_CONTRIBUTION_MATRIX,
  RankContributionMatrix,
  RankLevel,
  RANK_COLORS,
  RANK_POINTS,
  RegionTile,
  StartingPoint,
} from './types/map';
import { posKey, parseKey, TopologyCell } from './topologyGenerator';

// Exact probability points contribution matrix from prompt:
export const RANK_CONTRIBUTION_MATRIX: RankContributionMatrix = DEFAULT_RANK_CONTRIBUTION_MATRIX;

export interface PropagationStepInfo {
  step: number;
  newlyRanked: { id: string; rank: RankLevel; origin: 'team1' | 'team2' | 'meeting_point' }[];
}

/**
 * Calculates graph distance (BFS) from a source key to all reachable keys
 */
export function calculateGraphDistances(
  startKey: string,
  allKeys: Set<string>
): Map<string, number> {
  const distances = new Map<string, number>();
  const queue: [string, number][] = [[startKey, 0]];
  distances.set(startKey, 0);

  const cardDirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  while (queue.length > 0) {
    const [currentKey, dist] = queue.shift()!;
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

/**
 * Propagates ranks simultaneously from BOTH Starting Points (Team 1 & Team 2),
 * advancing in lockstep wavefronts until they collide in the middle of the map.
 */
export function propagateRanks(
  cellsMap: Map<string, TopologyCell>,
  startingPoints: [StartingPoint, StartingPoint],
  bounds: { width: number; height: number },
  matrix: RankContributionMatrix = DEFAULT_RANK_CONTRIBUTION_MATRIX
): {
  regions: Map<string, RegionTile>;
  adjacency: Map<string, string[]>;
  stepsHistory: PropagationStepInfo[];
} {
  const allKeys = new Set(cellsMap.keys());
  const regions = new Map<string, RegionTile>();
  const ranked = new Map<string, RankLevel>();
  const tileOrigin = new Map<string, 'team1' | 'team2' | 'meeting_point'>();
  const tileStep = new Map<string, number>();
  const stepsHistory: PropagationStepInfo[] = [];

  // Adjacency map
  const adjacency = new Map<string, string[]>();
  const cardDirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  for (const k of allKeys) {
    const [x, y] = parseKey(k);
    const nbrs: string[] = [];
    for (const [dx, dy] of cardDirs) {
      const nk = posKey(x + dx, y + dy);
      if (allKeys.has(nk)) {
        nbrs.push(nk);
      }
    }
    adjacency.set(k, nbrs);
  }

  // Pre-calculate distances from both Starting Points and Center
  const distSP1 = calculateGraphDistances(startingPoints[0].regionId, allKeys);
  const distSP2 = calculateGraphDistances(startingPoints[1].regionId, allKeys);

  const centerX = bounds.width / 2;
  const centerY = bounds.height / 2;

  // Initialize Starting Points as Rank 8 on their respective sides
  const sp1Key = startingPoints[0].regionId;
  const sp2Key = startingPoints[1].regionId;

  ranked.set(sp1Key, 8);
  tileOrigin.set(sp1Key, 'team1');
  tileStep.set(sp1Key, 0);

  ranked.set(sp2Key, 8);
  tileOrigin.set(sp2Key, 'team2');
  tileStep.set(sp2Key, 0);

  stepsHistory.push({
    step: 0,
    newlyRanked: [
      { id: sp1Key, rank: 8, origin: 'team1' },
      { id: sp2Key, rank: 8, origin: 'team2' },
    ],
  });

  const unranked = new Set(allKeys);
  unranked.delete(sp1Key);
  unranked.delete(sp2Key);

  let currentStep = 1;

  // Simultaneous dual-front expansion loop
  while (unranked.size > 0) {
    // 1. Identify unranked neighbors adjacent to Team 1 front
    const frontTeam1 = new Set<string>();
    // 2. Identify unranked neighbors adjacent to Team 2 front
    const frontTeam2 = new Set<string>();

    for (const key of unranked) {
      const nbrs = adjacency.get(key) || [];
      for (const n of nbrs) {
        if (ranked.has(n)) {
          const orig = tileOrigin.get(n);
          if (orig === 'team1') frontTeam1.add(key);
          else if (orig === 'team2') frontTeam2.add(key);
          else if (orig === 'meeting_point') {
            // Meeting points can propagate to remaining unranked nodes
            frontTeam1.add(key);
            frontTeam2.add(key);
          }
        }
      }
    }

    // Combined frontier for this step
    const currentFrontierKeys = new Set<string>([...frontTeam1, ...frontTeam2]);

    if (currentFrontierKeys.size === 0) {
      // Safety: if any orphan remains, assign default and continue
      const orphan = unranked.values().next().value;
      if (orphan) {
        ranked.set(orphan, 4);
        tileOrigin.set(orphan, 'meeting_point');
        tileStep.set(orphan, currentStep);
        unranked.delete(orphan);
      }
      currentStep++;
      continue;
    }

    const stepNewRanked: { id: string; rank: RankLevel; origin: 'team1' | 'team2' | 'meeting_point' }[] = [];

    // Rank all nodes in the simultaneous frontier
    for (const tileKey of currentFrontierKeys) {
      const nbrs = adjacency.get(tileKey) || [];

      // Check whether this tile touches Team 1, Team 2, or both (meeting point)
      let touchesTeam1 = false;
      let touchesTeam2 = false;

      // Sum weight contributions from all ranked neighbors
      const weights: Record<RankLevel, number> = {
        8: 0, 7: 0, 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0,
      };
      let totalWeight = 0;

      for (const n of nbrs) {
        const neighborRank = ranked.get(n);
        if (neighborRank !== undefined) {
          const neighborOrig = tileOrigin.get(n);
          if (neighborOrig === 'team1') touchesTeam1 = true;
          if (neighborOrig === 'team2') touchesTeam2 = true;
          if (neighborOrig === 'meeting_point') {
            touchesTeam1 = true;
            touchesTeam2 = true;
          }

          const contrib = (matrix || DEFAULT_RANK_CONTRIBUTION_MATRIX)[neighborRank] || {};
          for (const [targetRankStr, points] of Object.entries(contrib)) {
            const targetRank = Number(targetRankStr) as RankLevel;
            if (typeof points === 'number' && points > 0) {
              weights[targetRank] += points;
              totalWeight += points;
            }
          }
        }
      }

      // Determine origin: if touched by both wavefronts, it is in the meeting zone!
      let origin: 'team1' | 'team2' | 'meeting_point' = 'meeting_point';
      if (touchesTeam1 && touchesTeam2) {
        origin = 'meeting_point';
      } else if (touchesTeam1) {
        origin = 'team1';
      } else if (touchesTeam2) {
        origin = 'team2';
      }

      // Sample rank probabilistically
      let chosenRank: RankLevel = 4;
      if (totalWeight > 0) {
        let randVal = Math.random() * totalWeight;
        for (let r = 8; r >= 1; r--) {
          const rL = r as RankLevel;
          randVal -= weights[rL];
          if (randVal <= 0.0001) {
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
      newlyRanked: stepNewRanked,
    });

    currentStep++;
  }

  // Construct RegionTile objects with bilateral origin and step metadata
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

    const origin = tileOrigin.get(k) || 'meeting_point';
    const step = tileStep.get(k) || 0;

    const tile: RegionTile = {
      id: k,
      x,
      y,
      rank,
      points: RANK_POINTS[rank],
      color: RANK_COLORS[rank],
      isStartingPoint,
      team: isSP1 ? 1 : isSP2 ? 2 : null,
      piece: isStartingPoint ? 'g' : null,
      building: null,
      structureTag: cell?.structureTag,
      blockId: cell?.blockId || 'block-0',
      blockSize: cell?.blockSize || 3,
      distToSP1: d1,
      distToSP2: d2,
      distToNearestSP: dNearest,
      distToCenter: dCenter,
      propagationStep: step,
      propagationOrigin: origin,
    };

    regions.set(k, tile);
  }

  return { regions, adjacency, stepsHistory };
}
