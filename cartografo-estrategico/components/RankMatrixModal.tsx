/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DEFAULT_RANK_CONTRIBUTION_MATRIX,
  RankContributionMatrix,
  RankLevel,
  RANK_COLORS,
  RANK_NAMES,
} from '../types/map';
import { X, Check, RotateCcw, Sparkles, SlidersHorizontal, Info } from 'lucide-react';

interface RankMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMatrix?: RankContributionMatrix;
  onSave: (newMatrix: RankContributionMatrix) => void;
}

const ALL_RANKS: RankLevel[] = [8, 7, 6, 5, 4, 3, 2, 1];

export const RankMatrixModal: React.FC<RankMatrixModalProps> = ({
  isOpen,
  onClose,
  currentMatrix = DEFAULT_RANK_CONTRIBUTION_MATRIX,
  onSave,
}) => {
  const [matrix, setMatrix] = useState<RankContributionMatrix>(() => {
    // Deep clone
    const cloned: RankContributionMatrix = { ...DEFAULT_RANK_CONTRIBUTION_MATRIX };
    for (const r of ALL_RANKS) {
      cloned[r] = { ...(currentMatrix[r] || DEFAULT_RANK_CONTRIBUTION_MATRIX[r]) };
    }
    return cloned;
  });

  if (!isOpen) return null;

  const handleCellChange = (sourceRank: RankLevel, targetRank: RankLevel, valueStr: string) => {
    const num = parseFloat(valueStr);
    const safeNum = isNaN(num) || num < 0 ? 0 : num;

    setMatrix(prev => ({
      ...prev,
      [sourceRank]: {
        ...prev[sourceRank],
        [targetRank]: safeNum,
      },
    }));
  };

  const handleResetToDefault = () => {
    const cloned: RankContributionMatrix = { ...DEFAULT_RANK_CONTRIBUTION_MATRIX };
    for (const r of ALL_RANKS) {
      cloned[r] = { ...DEFAULT_RANK_CONTRIBUTION_MATRIX[r] };
    }
    setMatrix(cloned);
  };

  const handleApplyPreset = (preset: 'default' | 'high_decay' | 'strong_clustering') => {
    if (preset === 'default') {
      handleResetToDefault();
    } else if (preset === 'high_decay') {
      // Rapid decay to lower ranks
      setMatrix({
        8: { 8: 4, 7: 6 },
        7: { 7: 4, 6: 6, 8: 0.5 },
        6: { 6: 4, 5: 6, 7: 0.5 },
        5: { 5: 4, 4: 6, 6: 0.5 },
        4: { 4: 3, 3: 5, 5: 0.5 },
        3: { 3: 3, 2: 5, 4: 0.5 },
        2: { 2: 2, 1: 5, 3: 0.5 },
        1: { 1: 3, 2: 1 },
      });
    } else if (preset === 'strong_clustering') {
      // Very strong self-clustering
      setMatrix({
        8: { 8: 15, 7: 2 },
        7: { 7: 12, 6: 2, 8: 2 },
        6: { 6: 10, 5: 2, 7: 2 },
        5: { 5: 9, 4: 2, 6: 2 },
        4: { 4: 8, 3: 2, 5: 2 },
        3: { 3: 7, 2: 2, 4: 2 },
        2: { 2: 6, 1: 2, 3: 2 },
        1: { 1: 5, 2: 1 },
      });
    }
  };

  const handleSaveAndApply = () => {
    onSave(matrix);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] text-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Pesos de Probabilidade dos Ranks
              </h2>
              <p className="text-xs text-slate-400">
                Define quantos pontos cada rank de uma região vizinha contribui para determinar o rank das células adjacentes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar with Presets & Reset */}
        <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Predefinições:</span>
            <button
              onClick={() => handleApplyPreset('default')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md font-medium transition-colors"
            >
              Padrão Oficial
            </button>
            <button
              onClick={() => handleApplyPreset('high_decay')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md font-medium transition-colors"
            >
              Gradiente Acelerado
            </button>
            <button
              onClick={() => handleApplyPreset('strong_clustering')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md font-medium transition-colors"
            >
              Agrupamento Forte
            </button>
          </div>

          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Valores Padrão</span>
          </button>
        </div>

        {/* Matrix Grid Table */}
        <div className="flex-1 overflow-auto p-5">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="p-2 text-left bg-slate-950 sticky left-0 z-10 w-36">
                    Origem / Alvo
                  </th>
                  {ALL_RANKS.map(tr => (
                    <th key={`th-${tr}`} className="p-2 text-center min-w-16">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className="w-3 h-3 rounded-sm border border-slate-700"
                          style={{ backgroundColor: RANK_COLORS[tr] }}
                        />
                        <span className="font-bold text-white">L{tr}</span>
                      </div>
                    </th>
                  ))}
                  <th className="p-2 text-center text-slate-500 font-sans min-w-24">
                    Soma
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {ALL_RANKS.map(sourceRank => {
                  const rowWeights = matrix[sourceRank] || {};
                  const rowSum = Object.values(rowWeights).reduce((a, b) => (a || 0) + (b || 0), 0) || 0;

                  return (
                    <tr key={`row-${sourceRank}`} className="hover:bg-slate-800/30 transition-colors">
                      {/* Row Header */}
                      <td className="p-2 font-semibold bg-slate-950 sticky left-0 z-10 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-sm border border-slate-700 shrink-0"
                            style={{ backgroundColor: RANK_COLORS[sourceRank] }}
                          />
                          <span className="text-white font-bold">L{sourceRank}</span>
                          <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
                            contribui:
                          </span>
                        </div>
                      </td>

                      {/* Cells */}
                      {ALL_RANKS.map(targetRank => {
                        const val = rowWeights[targetRank] ?? 0;
                        const isNonZero = val > 0;

                        return (
                          <td key={`cell-${sourceRank}-${targetRank}`} className="p-1 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step={0.5}
                              value={val === 0 ? '' : val}
                              placeholder="0"
                              onChange={e => handleCellChange(sourceRank, targetRank, e.target.value)}
                              className={`w-14 p-1.5 text-center text-xs font-mono font-bold rounded-lg border focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors ${
                                isNonZero
                                  ? 'bg-slate-800 border-slate-700 text-amber-300'
                                  : 'bg-slate-950/80 border-slate-800 text-slate-600 focus:text-white'
                              }`}
                            />
                          </td>
                        );
                      })}

                      {/* Row Sum */}
                      <td className="p-2 text-center text-slate-400 font-mono text-[11px]">
                        {rowSum.toFixed(1)} pts
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300">Como funciona a influência de vizinhança:</strong> Quando uma célula sem rank está na fronteira, ela soma todos os pontos concedidos pelos vizinhos já rankeados para cada rank candidato de L1 a L8. A probabilidade de ela se tornar determinado rank é proporcional a essa soma de pontos acumulados.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveAndApply}
            className="py-2 px-5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Salvar & Aplicar Matriz</span>
          </button>
        </div>
      </div>
    </div>
  );
};
