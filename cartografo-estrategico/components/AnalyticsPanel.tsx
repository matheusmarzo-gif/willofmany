/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  EconomySummary,
  RANK_COLORS,
  RANK_NAMES,
  RANK_POINTS,
  RankLevel,
  POVOADO_YIELD,
  FAZENDA_YIELD,
  BuildingLevel,
} from '../types/map';
import {
  Coins,
  Wheat,
  TrendingUp,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Shield,
  Layers,
} from 'lucide-react';

interface AnalyticsPanelProps {
  economy: EconomySummary;
  totalRegions: number;
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  economy,
  totalRegions,
  isOpen,
  onClose,
}) => {
  const [simulatedTurns, setSimulatedTurns] = useState<number>(10);
  const [accumulatedTurns, setAccumulatedTurns] = useState<number>(0);
  const [treasuryCoins, setTreasuryCoins] = useState<number>(0);
  const [treasuryWheat, setTreasuryWheat] = useState<number>(0);

  if (!isOpen) return null;

  const handleSimulate = (turns: number) => {
    setAccumulatedTurns(prev => prev + turns);
    setTreasuryCoins(prev => prev + economy.actualCoins * turns);
    setTreasuryWheat(prev => prev + economy.actualWheat * turns);
  };

  const handleResetSimulation = () => {
    setAccumulatedTurns(0);
    setTreasuryCoins(0);
    setTreasuryWheat(0);
  };

  // Percent fulfillment of target
  const coinFulfillment = economy.desirableCoins > 0
    ? Math.round((economy.actualCoins / economy.desirableCoins) * 100)
    : 100;

  const wheatFulfillment = economy.desirableWheat > 0
    ? Math.round((economy.actualWheat / economy.desirableWheat) * 100)
    : 100;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-slate-900/98 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-40 flex flex-col text-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="w-5 h-5 text-red-400" />
          <h2 className="text-base font-bold text-white tracking-wide">
            Estatísticas & Balanço Econômico
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Total Points & Economy Desirability Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Pontos Totais do Mapa</div>
            <div className="mt-1 text-lg font-mono font-bold text-white tabular-nums">
              {economy.totalPoints.toLocaleString('pt-BR')}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Soma ponderada dos ranks
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                Moedas / Turn
              </span>
              <span className="text-[10px] font-mono text-slate-400">{coinFulfillment}%</span>
            </div>
            <div className="mt-1 text-lg font-mono font-bold text-amber-300 tabular-nums">
              {economy.actualCoins.toLocaleString('pt-BR')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Meta (Pts/15): <span className="font-mono">{economy.desirableCoins.toLocaleString('pt-BR')}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Wheat className="w-3.5 h-3.5" />
                Trigo / Turn
              </span>
              <span className="text-[10px] font-mono text-slate-400">{wheatFulfillment}%</span>
            </div>
            <div className="mt-1 text-lg font-mono font-bold text-emerald-300 tabular-nums">
              {economy.actualWheat.toLocaleString('pt-BR')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Meta (Pts/2): <span className="font-mono">{economy.desirableWheat.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* Turn Simulator */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-red-400" />
              <span>Simulador de Produção por Turnos</span>
            </div>
            {accumulatedTurns > 0 && (
              <button
                onClick={handleResetSimulation}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Zerar</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400">Turnos Decorridos</div>
              <div className="text-sm font-mono font-bold text-white tabular-nums">
                {accumulatedTurns}
              </div>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <div className="text-[10px] text-amber-400">Tesouro em Moedas</div>
              <div className="text-sm font-mono font-bold text-amber-300 tabular-nums">
                {treasuryCoins.toLocaleString('pt-BR')}
              </div>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <div className="text-[10px] text-emerald-400">Celeiro de Trigo</div>
              <div className="text-sm font-mono font-bold text-emerald-300 tabular-nums">
                {treasuryWheat.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleSimulate(1)}
              className="flex-1 py-1.5 px-3 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              +1 Turno
            </button>
            <button
              onClick={() => handleSimulate(5)}
              className="flex-1 py-1.5 px-3 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              +5 Turnos
            </button>
            <button
              onClick={() => handleSimulate(20)}
              className="flex-1 py-1.5 px-3 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              +20 Turnos
            </button>
          </div>
        </div>

        {/* Rank Distribution Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-red-400" />
              <span>Distribuição de Ranks no Mapa ({totalRegions} regiões)</span>
            </h3>
          </div>

          <div className="space-y-1.5">
            {([8, 7, 6, 5, 4, 3, 2, 1] as RankLevel[]).map(rank => {
              const count = economy.rankCounts[rank] || 0;
              const pct = totalRegions > 0 ? (count / totalRegions) * 100 : 0;
              const pts = RANK_POINTS[rank];
              const totalRankPoints = count * pts;

              return (
                <div
                  key={`rank-row-${rank}`}
                  className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-sm border border-slate-700 shrink-0"
                        style={{ backgroundColor: RANK_COLORS[rank] }}
                      />
                      <span className="font-semibold text-white">L{rank}</span>
                      <span className="text-slate-400 text-[11px] font-mono">
                        ({pts.toLocaleString('pt-BR')} pts/cada)
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono tabular-nums">
                      <span className="text-slate-300 font-bold">{count} un.</span>
                      <span className="text-slate-400 text-[11px]">({pct.toFixed(1)}%)</span>
                      <span className="text-slate-400 text-[11px] w-20 text-right">
                        {totalRankPoints.toLocaleString('pt-BR')} pts
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor: RANK_COLORS[rank],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buildings Breakdown: Povoados & Fazendas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Povoados */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" />
                Povoados ({economy.totalPovoados})
              </span>
              <span className="text-[11px] font-mono text-amber-400">
                +{economy.actualCoins}/t
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              {([1, 2, 3, 4, 5] as BuildingLevel[]).map(lvl => (
                <div key={`p-lvl-${lvl}`} className="flex justify-between items-center text-slate-300">
                  <span>Nível {lvl} ({POVOADO_YIELD[lvl]} moedas/t):</span>
                  <span className="font-mono font-bold text-white">
                    {economy.buildingsByLevel.povoado[lvl] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fazendas */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5" />
                Fazendas ({economy.totalFazendas})
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                +{economy.actualWheat}/t
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              {([1, 2, 3, 4, 5] as BuildingLevel[]).map(lvl => (
                <div key={`f-lvl-${lvl}`} className="flex justify-between items-center text-slate-300">
                  <span>Nível {lvl} ({FAZENDA_YIELD[lvl].toLocaleString('pt-BR')} trigo/t):</span>
                  <span className="font-mono font-bold text-white">
                    {economy.buildingsByLevel.fazenda[lvl] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
