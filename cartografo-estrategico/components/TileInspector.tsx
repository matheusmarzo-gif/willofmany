/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  RegionTile,
  RankLevel,
  RANK_COLORS,
  RANK_NAMES,
  RANK_POINTS,
  BuildingType,
  BuildingLevel,
  POVOADO_YIELD,
  FAZENDA_YIELD,
} from '../types/map';
import { X, Check, Trash2, Shield, Coins, Wheat, Grid3X3, RotateCw } from 'lucide-react';
import { SectorInfo } from '../utils/sectorRotation';

interface TileInspectorProps {
  tile: RegionTile | null;
  onClose: () => void;
  onUpdateTile: (updatedTile: RegionTile) => void;
  sectorSize?: number;
  sectorInfo?: SectorInfo | null;
  onRotateSector?: (mode: 'perimeter_1step' | 'block_90deg') => void;
}

export const TileInspector: React.FC<TileInspectorProps> = ({
  tile,
  onClose,
  onUpdateTile,
  sectorSize = 3,
  sectorInfo,
  onRotateSector,
}) => {
  if (!tile) return null;

  const [editRank, setEditRank] = useState<RankLevel>(tile.rank);
  const [editBuildingType, setEditBuildingType] = useState<BuildingType | 'none'>(
    tile.building ? tile.building.type : 'none'
  );
  const [editBuildingLevel, setEditBuildingLevel] = useState<BuildingLevel>(
    tile.building ? tile.building.level : 1
  );

  useEffect(() => {
    setEditRank(tile.rank);
    setEditBuildingType(tile.building ? tile.building.type : 'none');
    setEditBuildingLevel(tile.building ? tile.building.level : 1);
  }, [tile.id]);

  const handleSave = () => {
    let building = null;
    if (editBuildingType !== 'none') {
      building = {
        type: editBuildingType,
        level: editBuildingLevel,
        coinsPerTurn: editBuildingType === 'povoado' ? POVOADO_YIELD[editBuildingLevel] : 0,
        wheatPerTurn: editBuildingType === 'fazenda' ? FAZENDA_YIELD[editBuildingLevel] : 0,
      };
    }

    const updated: RegionTile = {
      ...tile,
      rank: editRank,
      points: RANK_POINTS[editRank],
      color: RANK_COLORS[editRank],
      building,
    };

    onUpdateTile(updated);
  };

  return (
    <div className="absolute bottom-6 left-6 z-30 w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl p-4 text-xs text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-md border border-slate-700"
            style={{ backgroundColor: RANK_COLORS[editRank] }}
          />
          <span className="font-bold text-white text-sm">
            Região ({tile.x}, {tile.y})
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Starting point badge */}
      {tile.isStartingPoint && (
        <div className="mt-2.5 p-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 flex items-center gap-2">
          <Shield className="w-4 h-4 shrink-0 text-red-400" />
          <div>
            <div className="font-bold">Starting Point - Equipe {tile.team}</div>
            <div className="text-[11px] text-red-200/80">Guardião / Peça 'g' presente</div>
          </div>
        </div>
      )}

      {/* Editor Controls */}
      <div className="mt-3 space-y-3">
        {/* Rank Select */}
        <div>
          <label className="text-slate-400 font-medium block mb-1.5">
            Rank da Região:
          </label>
          <div className="grid grid-cols-4 gap-1">
            {([8, 7, 6, 5, 4, 3, 2, 1] as RankLevel[]).map(r => (
              <button
                key={`rank-btn-${r}`}
                type="button"
                onClick={() => setEditRank(r)}
                className={`py-1.5 px-2 rounded-lg font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                  editRank === r
                    ? 'ring-2 ring-white text-white font-extrabold shadow-sm'
                    : 'text-slate-300 opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: RANK_COLORS[r],
                  color: r === 1 ? '#0f172a' : '#ffffff',
                }}
              >
                L{r}
              </button>
            ))}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex justify-between">
            <span>Pontos:</span>
            <span className="font-mono font-bold text-white">
              {RANK_POINTS[editRank].toLocaleString('pt-BR')} pts
            </span>
          </div>
        </div>

        {/* Building Editor */}
        <div className="pt-2 border-t border-slate-800">
          <label className="text-slate-400 font-medium block mb-1.5">
            Construção / Recurso:
          </label>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setEditBuildingType('none')}
              className={`py-1.5 px-2 rounded-lg text-center transition-colors ${
                editBuildingType === 'none'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Vazio
            </button>
            <button
              onClick={() => setEditBuildingType('povoado')}
              className={`py-1.5 px-2 rounded-lg text-center transition-colors flex items-center justify-center gap-1 ${
                editBuildingType === 'povoado'
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-amber-200'
              }`}
            >
              <Coins className="w-3 h-3 text-amber-400" />
              <span>Povoado</span>
            </button>
            <button
              onClick={() => setEditBuildingType('fazenda')}
              className={`py-1.5 px-2 rounded-lg text-center transition-colors flex items-center justify-center gap-1 ${
                editBuildingType === 'fazenda'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-emerald-200'
              }`}
            >
              <Wheat className="w-3 h-3 text-emerald-400" />
              <span>Fazenda</span>
            </button>
          </div>

          {/* Level selector if building is active */}
          {editBuildingType !== 'none' && (
            <div className="mt-2.5">
              <label className="text-slate-400 text-[11px] block mb-1">
                Nível da Construção (1 a 5):
              </label>
              <div className="grid grid-cols-5 gap-1">
                {([1, 2, 3, 4, 5] as BuildingLevel[]).map(lvl => (
                  <button
                    key={`lvl-btn-${lvl}`}
                    onClick={() => setEditBuildingLevel(lvl)}
                    className={`py-1 rounded-md font-mono font-bold transition-colors ${
                      editBuildingLevel === lvl
                        ? 'bg-slate-700 text-white ring-1 ring-slate-400'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    N{lvl}
                  </button>
                ))}
              </div>

              <div className="mt-1.5 text-[11px] text-slate-300 flex justify-between font-mono">
                <span>Rendimento por Turno:</span>
                <span className="font-bold text-amber-300">
                  {editBuildingType === 'povoado'
                    ? `+${POVOADO_YIELD[editBuildingLevel]} moedas`
                    : `+${FAZENDA_YIELD[editBuildingLevel].toLocaleString('pt-BR')} trigo`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Square Sector Section */}
        {sectorInfo && onRotateSector && (
          <div className="pt-2.5 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-cyan-300">
              <span className="flex items-center gap-1.5 font-semibold">
                <Grid3X3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{sectorInfo.name || `Quadrado ${sectorInfo.size}x${sectorInfo.size}`}</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {sectorInfo.tiles.length} regiões ({sectorInfo.size}x{sectorInfo.size})
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              Rotação perimetral cíclica: M(1,1)→M(1,2)→M(1,3)→M(2,3)→M(3,3)→M(3,2)→M(3,1)→M(2,1).
            </p>

            <div className="flex items-center gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => onRotateSector('perimeter_1step')}
                className="flex-1 py-1.5 px-2 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors text-[11px]"
                title={`Girar o perímetro do quadrado ${sectorInfo.size}x${sectorInfo.size} em 1 passo`}
              >
                <RotateCw className="w-3 h-3 text-cyan-300" />
                <span>Girar Quadrado ↻ (G)</span>
              </button>
              <button
                type="button"
                onClick={() => onRotateSector('block_90deg')}
                className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium transition-colors"
                title="Girar em bloco 90 graus"
              >
                90°
              </button>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Salvar Alteração</span>
          </button>
        </div>
      </div>
    </div>
  );
};
