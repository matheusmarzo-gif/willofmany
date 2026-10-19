/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Download, Upload, BarChart3, Play, Sparkles, FolderArchive } from 'lucide-react';

interface HeaderProps {
  onGenerate: () => void;
  onOpenExportModal: () => void;
  onOpenImportModal: () => void;
  onOpenDownloadProjectModal: () => void;
  onToggleAnalytics: () => void;
  showAnalytics: boolean;
  totalRegions: number;
  totalPoints: number;
}

export const Header: React.FC<HeaderProps> = ({
  onGenerate,
  onOpenExportModal,
  onOpenImportModal,
  onOpenDownloadProjectModal,
  onToggleAnalytics,
  showAnalytics,
  totalRegions,
  totalPoints,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900 border-b border-slate-800 text-slate-100 z-30 shrink-0">
      {/* Zone 1: Single text element wordmark with icon */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
          <Compass className="w-5 h-5 text-red-400" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            Cartógrafo Estratégico
          </span>
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
            <span>{totalRegions} Regiões</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{totalPoints.toLocaleString('pt-BR')} Pontos</span>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation / Modal actions */}
      <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300">
        <button
          onClick={onToggleAnalytics}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            showAnalytics ? 'text-red-400 font-semibold' : 'hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Estatísticas & Economia</span>
        </button>
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span>Exportar JSON</span>
        </button>
        <button
          onClick={onOpenImportModal}
          className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap"
        >
          <Upload className="w-4 h-4" />
          <span>Importar Mapa</span>
        </button>
        <button
          onClick={onOpenDownloadProjectModal}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 transition-all whitespace-nowrap text-xs font-semibold shadow-sm"
          title="Baixar todos os arquivos do projeto para rodar no seu PC"
        >
          <FolderArchive className="w-3.5 h-3.5" />
          <span>Baixar Projeto (.ZIP)</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onGenerate}
          className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 active:bg-red-700 transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gerar Novo Mapa</span>
        </button>
      </div>
    </header>
  );
};
