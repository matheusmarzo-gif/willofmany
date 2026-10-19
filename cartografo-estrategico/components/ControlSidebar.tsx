/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GeneratorParameters } from '../types/map';
import {
  Sliders,
  Grid,
  CornerDownRight,
  CircleDot,
  Plus,
  Sparkles,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  RotateCw,
  SlidersHorizontal,
} from 'lucide-react';
import { SectorInfo } from '../utils/sectorRotation';

interface ControlSidebarProps {
  parameters: GeneratorParameters;
  onChangeParameters: (params: GeneratorParameters) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  sectorSize?: number;
  onChangeSectorSize?: (size: number) => void;
  showSectorGrid?: boolean;
  onToggleSectorGrid?: () => void;
  activeSector?: SectorInfo | null;
  onRotateSector?: (mode: 'perimeter_1step' | 'block_90deg') => void;
  onOpenRankMatrixModal?: () => void;
}

export const ControlSidebar: React.FC<ControlSidebarProps> = ({
  parameters,
  onChangeParameters,
  onGenerate,
  isGenerating = false,
  sectorSize = 3,
  onChangeSectorSize,
  showSectorGrid = true,
  onToggleSectorGrid,
  activeSector,
  onRotateSector,
  onOpenRankMatrixModal,
}) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  const updateParam = <K extends keyof GeneratorParameters>(key: K, val: GeneratorParameters[K]) => {
    onChangeParameters({
      ...parameters,
      [key]: val,
    });
  };

  const applyPreset = (count: number, topology: GeneratorParameters['topologyPreset']) => {
    onChangeParameters({
      ...parameters,
      targetRegions: count,
      topologyPreset: topology,
    });
  };

  return (
    <div className="w-80 lg:w-96 h-full bg-slate-900 border-r border-slate-800 flex flex-col z-20 shrink-0 text-slate-200">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-red-400" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Configuração do Gerador
          </h2>
        </div>
        <button
          onClick={() => {
            onChangeParameters({
              targetRegions: 150,
              topologyPreset: 'hybrid',
              weightGrid: 35,
              weightL: 30,
              weightCircular: 25,
              weightCross: 10,
              alpha: 1.5,
              beta: 0.8,
              tau: 1.0,
              buildingDensity: 28,
              povoadoRatio: 50,
              allowBuildingsOnStartingPoints: false,
            });
          }}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          title="Restaurar padrões"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar</span>
        </button>
      </div>

      {/* Scrollable controls container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Preset Buttons */}
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-2">
            Arquétipos Rápidos
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => applyPreset(60, 'hybrid')}
              className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors ${
                parameters.targetRegions === 60
                  ? 'bg-red-500/10 border-red-500/50 text-red-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="font-semibold">Duelo Tático</div>
              <div className="text-[11px] text-slate-400">~60 regiões</div>
            </button>

            <button
              onClick={() => applyPreset(150, 'hybrid')}
              className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors ${
                parameters.targetRegions === 150
                  ? 'bg-red-500/10 border-red-500/50 text-red-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="font-semibold">Reino Padrão</div>
              <div className="text-[11px] text-slate-400">~150 regiões</div>
            </button>

            <button
              onClick={() => applyPreset(450, 'circular')}
              className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors ${
                parameters.targetRegions === 450
                  ? 'bg-red-500/10 border-red-500/50 text-red-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="font-semibold">Grande Império</div>
              <div className="text-[11px] text-slate-400">~450 regiões</div>
            </button>

            <button
              onClick={() => applyPreset(900, 'hybrid')}
              className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors ${
                parameters.targetRegions === 900
                  ? 'bg-red-500/10 border-red-500/50 text-red-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="font-semibold">Continente Colossal</div>
              <div className="text-[11px] text-slate-400">~900 regiões</div>
            </button>
          </div>
        </div>

        {/* Bilateral Wavefront Propagation Info Card & Weights Editor */}
        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Propagação Bilateral</span>
            </div>
            {parameters.rankContributionMatrix ? (
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                Personalizada
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-500">
                Padrão L8..L1
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            As ondas de probabilidade expandem-se de ambos os <strong className="text-red-400 font-medium">Starting Points (L8)</strong> ao mesmo tempo em ritmo sincronizado, colidindo na metade do mapa.
          </p>

          {/* Button to open Rank Matrix Editor */}
          {onOpenRankMatrixModal && (
            <button
              type="button"
              onClick={onOpenRankMatrixModal}
              className="w-full mt-1 py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-850 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors shadow-sm"
              title="Abrir editor completo de pesos de probabilidade de rank de cada região vizinha"
            >
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>Pesos de Probabilidade dos Ranks</span>
              </div>
              <span className="text-[11px] text-amber-400 font-mono">Editar →</span>
            </button>
          )}
        </div>

        {/* Target Regions Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Regiões Alvo</span>
            <span className="font-mono font-bold text-red-400">
              {parameters.targetRegions} regiões
            </span>
          </div>
          <input
            type="range"
            min={25}
            max={900}
            step={5}
            value={parameters.targetRegions}
            onChange={e => updateParam('targetRegions', Number(e.target.value))}
            className="w-full accent-red-500 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>25</span>
            <span>250</span>
            <span>500</span>
            <span>900</span>
          </div>
        </div>

        {/* Topology Structure Preset */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Topologia & Estruturas
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => updateParam('topologyPreset', 'hybrid')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                parameters.topologyPreset === 'hybrid'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Híbrido</span>
            </button>

            <button
              onClick={() => updateParam('topologyPreset', 'quadricular')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                parameters.topologyPreset === 'quadricular'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-blue-400" />
              <span>Quadricular</span>
            </button>

            <button
              onClick={() => updateParam('topologyPreset', 'l_shape')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                parameters.topologyPreset === 'l_shape'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CornerDownRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>Em "L"</span>
            </button>

            <button
              onClick={() => updateParam('topologyPreset', 'circular')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                parameters.topologyPreset === 'circular'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5 text-purple-400" />
              <span>Circular</span>
            </button>
          </div>
        </div>

        {/* Modular Structure Weights (if hybrid) */}
        {parameters.topologyPreset === 'hybrid' && (
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
            <div className="text-[11px] font-semibold text-slate-400">
              Distribuição dos Blocos Híbridos
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Matrizes Quadriculares</span>
                <span className="font-mono text-slate-400">{parameters.weightGrid}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={parameters.weightGrid}
                onChange={e => updateParam('weightGrid', Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Estruturas em L</span>
                <span className="font-mono text-slate-400">{parameters.weightL}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={parameters.weightL}
                onChange={e => updateParam('weightL', Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Discos Circulares</span>
                <span className="font-mono text-slate-400">{parameters.weightCircular}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={parameters.weightCircular}
                onChange={e => updateParam('weightCircular', Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Cruzamentos & Pontes</span>
                <span className="font-mono text-slate-400">{parameters.weightCross}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={parameters.weightCross}
                onChange={e => updateParam('weightCross', Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Square Sector Partitioning and Rotation */}
        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Grid3X3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Particionamento em Quadrados</span>
            </div>
            {onToggleSectorGrid && (
              <button
                type="button"
                onClick={onToggleSectorGrid}
                className={`text-[11px] px-2 py-0.5 rounded-md transition-colors ${
                  showSectorGrid
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {showSectorGrid ? 'Grade Ativa' : 'Grade Oculta'}
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            Clique em qualquer região para selecionar o quadrado e realizar movimentos de rotação perimetral <strong className="text-cyan-300 font-mono text-[10px]">M(1,1)→M(1,2)...</strong>
          </p>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-300">Tamanho da Matriz:</span>
            <div className="flex items-center gap-1">
              {[2, 3, 4].map(sz => (
                <button
                  key={`sector-sz-${sz}`}
                  type="button"
                  onClick={() => onChangeSectorSize?.(sz)}
                  className={`px-2 py-1 text-xs font-mono font-bold rounded-lg transition-colors ${
                    sectorSize === sz
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sz}x{sz}
                </button>
              ))}
            </div>
          </div>

          {activeSector && onRotateSector && (
            <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-cyan-300 font-semibold">
                  Quadrado [{activeSector.sectorX}, {activeSector.sectorY}] selecionado
                </span>
                <span className="font-mono text-slate-400">
                  {activeSector.tiles.length} regiões
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRotateSector('perimeter_1step')}
                className="w-full py-1.5 px-3 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5 text-cyan-300" />
                <span>Girar Quadrado Selecionado ↻</span>
              </button>
            </div>
          )}
        </div>

        {/* Building Density & Povoado vs Fazenda Ratio */}
        <div className="space-y-4">
          <label className="text-xs font-semibold text-slate-300 block">
            Alocação de Construções
          </label>

          {/* Density */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Densidade de Terrenos Ocupados</span>
              <span className="font-mono font-bold text-amber-400">
                {parameters.buildingDensity}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={70}
              step={1}
              value={parameters.buildingDensity}
              onChange={e => updateParam('buildingDensity', Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Esparso (10%)</span>
              <span>Equilibrado (30%)</span>
              <span>Denso (70%)</span>
            </div>
          </div>

          {/* Ratio */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Povoados vs Fazendas</span>
              <span className="font-mono text-slate-400">
                {parameters.povoadoRatio}% P / {100 - parameters.povoadoRatio}% F
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={85}
              step={5}
              value={parameters.povoadoRatio}
              onChange={e => updateParam('povoadoRatio', Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Mathematical Model Weights: Alpha, Beta, Tau */}
        <div className="space-y-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Parâmetros Estocásticos
            </span>
            <button
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <Info className="w-3 h-3 text-red-400" />
              <span>Fórmulas</span>
              {showFormulaDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {showFormulaDetails && (
            <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1 font-mono">
              <p className="text-slate-300 font-semibold font-sans">Função de Escolha de Região:</p>
              <p className="text-amber-300">P(r | l) ∝ e^[-α·d(r,l) - β·s(r,l)]</p>
              <p className="text-slate-300 font-semibold font-sans pt-1">Função de Escolha de Nível:</p>
              <p className="text-emerald-300">W_l = e^[-E_l / τ]</p>
            </div>
          )}

          {/* Alpha */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">α (Peso de Afinidade por Rank)</span>
              <span className="font-mono text-red-400 font-bold">{parameters.alpha.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={3.0}
              step={0.1}
              value={parameters.alpha}
              onChange={e => updateParam('alpha', Number(e.target.value))}
              className="w-full accent-red-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Beta */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">β (Peso de Afinidade Espacial)</span>
              <span className="font-mono text-blue-400 font-bold">{parameters.beta.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={2.5}
              step={0.1}
              value={parameters.beta}
              onChange={e => updateParam('beta', Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Tau */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">τ (Tolerância à Variação de Nível)</span>
              <span className="font-mono text-purple-400 font-bold">{parameters.tau.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={3.0}
              step={0.1}
              value={parameters.tau}
              onChange={e => updateParam('tau', Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Starting Point Building Policy */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allowSPBuildings"
            checked={parameters.allowBuildingsOnStartingPoints}
            onChange={e => updateParam('allowBuildingsOnStartingPoints', e.target.checked)}
            className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-red-500 focus:ring-0 cursor-pointer"
          />
          <label htmlFor="allowSPBuildings" className="text-xs text-slate-300 cursor-pointer">
            Permitir povoados/fazendas sobre os Starting Points
          </label>
        </div>
      </div>

      {/* Sidebar Footer CTA */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Calculando Topologia...' : 'Gerar Novo Mapa'}</span>
        </button>
      </div>
    </div>
  );
};
