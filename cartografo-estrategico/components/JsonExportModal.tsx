/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Upload,
  AlertCircle,
  FileText,
  Layers,
  Grid3X3,
  Database,
  Sliders,
  Box,
} from 'lucide-react';
import {
  FullMapState,
  exportMapToJSON,
  importMapFromJSON,
  ExportFormatType,
  QuadrilateralExportOptions,
} from '../utils/mapGenerator';

interface JsonExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mapState: FullMapState;
  onImportSuccess: (importedState: FullMapState) => void;
  initialTab?: 'export' | 'import';
}

export const JsonExportModal: React.FC<JsonExportModalProps> = ({
  isOpen,
  onClose,
  mapState,
  onImportSuccess,
  initialTab = 'export',
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>(initialTab);
  const [exportFormat, setExportFormat] = useState<ExportFormatType>('quadrilateral_spec');
  const [l1, setL1] = useState<number>(500);
  const [l2, setL2] = useState<number>(500);
  const [rotationEnabled, setRotationEnabled] = useState<boolean>(false);
  const [linearRotationEnabled, setLinearRotationEnabled] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [importInput, setImportInput] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const exportOptions: QuadrilateralExportOptions = {
    L1: l1,
    L2: l2,
    rotationEnabled,
    linearRotationEnabled,
  };

  const jsonString = exportMapToJSON(mapState, exportFormat, exportOptions);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    link.href = url;
    link.download = `mapa-estrategico-${mapState.regions.length}r-${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    setImportError(null);
    try {
      if (!importInput.trim()) {
        setImportError('Cole um JSON válido no campo abaixo.');
        return;
      }
      const imported = importMapFromJSON(importInput);
      onImportSuccess(imported);
      onClose();
    } catch (err: any) {
      setImportError(err.message || 'Erro ao processar o JSON.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        setImportInput(content);
        const imported = importMapFromJSON(content);
        onImportSuccess(imported);
        onClose();
      } catch (err: any) {
        setImportError('Arquivo inválido: ' + (err.message || 'Erro de parsing.'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] text-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('export')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'export'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Mapa (JSON)</span>
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'import'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Importar JSON</span>
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'export' ? (
            <div className="space-y-3">
              {/* Format Selector Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 px-1 uppercase tracking-wider">Formato:</span>
                  <button
                    onClick={() => setExportFormat('quadrilateral_spec')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                      exportFormat === 'quadrilateral_spec'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>Especificação BQ (Matriz 2D & Ranks)</span>
                  </button>
                  <button
                    onClick={() => setExportFormat('blocks_detail')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                      exportFormat === 'blocks_detail'
                        ? 'bg-red-600/90 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                    <span>Blocos & Matrizes M(r,c)</span>
                  </button>
                  <button
                    onClick={() => setExportFormat('compact_blocks')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                      exportFormat === 'compact_blocks'
                        ? 'bg-red-600/90 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Blocos Compacto</span>
                  </button>
                  <button
                    onClick={() => setExportFormat('standard_full')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                      exportFormat === 'standard_full'
                        ? 'bg-red-600/90 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Completo (Com Adjacências)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopy}
                    className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
                    title="Copiar JSON completo para a área de transferência"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="py-1 px-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar</span>
                  </button>
                </div>
              </div>

              {/* Quadrilateral Parameters Bar */}
              {exportFormat === 'quadrilateral_spec' && (
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-red-400" />
                    <span className="font-semibold text-slate-300">Parâmetros BQ:</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label className="text-slate-400">L1 (px):</label>
                    <input
                      type="number"
                      min={50}
                      max={2000}
                      step={50}
                      value={l1}
                      onChange={e => setL1(Math.max(1, Number(e.target.value) || 500))}
                      className="w-16 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-200 text-center focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label className="text-slate-400">L2 (px):</label>
                    <input
                      type="number"
                      min={50}
                      max={2000}
                      step={50}
                      value={l2}
                      onChange={e => setL2(Math.max(1, Number(e.target.value) || 500))}
                      className="w-16 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-200 text-center focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="text-slate-400 flex items-center gap-1">
                    <span>C_inicial M(1,1):</span>
                    <span className="font-mono text-slate-300 text-[11px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800" title="Centro de M(1,1) calculado como (originX * L1 + L1/2, originY * L2 + L2/2) para ancorar cada bloco no espaço geográfico">
                      âncora por bloco (L1/2, L2/2)
                    </span>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
                    <input
                      type="checkbox"
                      checked={rotationEnabled}
                      onChange={e => setRotationEnabled(e.target.checked)}
                      className="rounded border-slate-700 text-red-600 focus:ring-0 bg-slate-900"
                    />
                    <span>rotationEnabled</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
                    <input
                      type="checkbox"
                      checked={linearRotationEnabled}
                      onChange={e => setLinearRotationEnabled(e.target.checked)}
                      className="rounded border-slate-700 text-red-600 focus:ring-0 bg-slate-900"
                    />
                    <span>linearRotationEnabled</span>
                  </label>
                </div>
              )}

              <p className="text-[11px] text-slate-400">
                {exportFormat === 'quadrilateral_spec' &&
                  'Formato oficial BQ: coordenadas C_inicial do centro de M(1,1) de cada bloco no espaço geográfico, códigos de regiões únicos e sem repetição em todo o mapa (ex: apenas um L8-1, L8-2...), farmBuildingLevel e villageBuildingLevel para fazendas e povoados, posições [[row, col]] 1-based e initialPieces.'}
                {exportFormat === 'blocks_detail' &&
                  'Cada bloco 3x3, 4x4 ou 5x5 discrimina suas regiões, fórmula de rotação perimétrica M(1,1)->... e coordenadas relativas locais M(row,col).'}
                {exportFormat === 'compact_blocks' &&
                  'Exportação limpa e direta estruturada por blocos com coordenadas de origem, regiões e starting points.'}
                {exportFormat === 'standard_full' &&
                  'Estrutura com grafo de adjacências completo, métricas de economia, metadados e blocos discriminados.'}
              </p>

              {/* Code preview area */}
              <div className="relative">
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 max-h-[50vh] overflow-auto select-all leading-relaxed">
                  {jsonString}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Cole o código JSON de um mapa exportado anteriormente ou faça upload de um arquivo <code className="text-red-400 font-mono">.json</code> para carregar e renderizar instantaneamente.
              </p>

              {/* File upload dropzone */}
              <div className="p-4 border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-xl bg-slate-950/50 text-center transition-colors">
                <label className="cursor-pointer block">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span className="text-xs font-semibold text-slate-200">
                    Selecione um arquivo .json do seu computador
                  </span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Textarea paste */}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">
                  Ou cole o conteúdo JSON aqui:
                </label>
                <textarea
                  value={importInput}
                  onChange={e => setImportInput(e.target.value)}
                  placeholder='{"version": "1.0.0", "regions": [...], "startingPoints": [...]}'
                  className="w-full h-48 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {importError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{importError}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleImportSubmit}
                  className="py-2 px-5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Processar e Carregar Mapa</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
