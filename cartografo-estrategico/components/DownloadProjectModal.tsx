/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Download,
  FolderArchive,
  Terminal,
  Check,
  Copy,
  Info,
  Loader2,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { generateProjectZip, triggerDownload } from '../utils/projectDownloader';

interface DownloadProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadProjectModal: React.FC<DownloadProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateProjectZip();
      triggerDownload(blob, 'cartografo-estrategico.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Erro ao gerar arquivo zip:', err);
      // Fallback: try direct API route if available
      window.open('/api/download-zip', '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(id);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-100 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <FolderArchive className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Baixar Projeto Completo
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Pronto para Rodar
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Execute o Cartógrafo Estratégico localmente no seu computador (PC / Mac / Linux)
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Note about AI Studio interface */}
          <div className="p-3.5 rounded-lg bg-blue-950/40 border border-blue-800/40 text-blue-200 text-xs flex gap-3 items-start">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-300">Sobre os botões no topo da tela:</span>
              <p className="mt-0.5 text-slate-300 leading-relaxed">
                As opções <strong>&quot;Remix&quot;</strong>, <strong>&quot;Share&quot;</strong> e <strong>&quot;Publish&quot;</strong> são opções do Google AI Studio para duplicar o app na nuvem ou publicá-lo. Para baixar os arquivos diretamente para o seu PC, utilize o botão abaixo.
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-red-400" />
                Arquivo ZIP com Código Fonte
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Inclui React, Vite, TypeScript, Tailwind CSS, utilitários, todos os componentes e README.
              </p>
            </div>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white active:scale-95'
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compactando arquivos...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Download Iniciado!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar ZIP do Projeto</span>
                </>
              )}
            </button>
          </div>

          {/* Step by step guide */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-red-400" />
              Passo a Passo para Executar no seu PC
            </h3>

            <div className="space-y-2.5">
              {/* Step 1 */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/70">
                <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>1. Ter o Node.js instalado</span>
                  <a
                    href="https://nodejs.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-400 hover:underline text-[11px]"
                  >
                    nodejs.org ↗
                  </a>
                </div>
                <p className="text-xs text-slate-400">
                  Certifique-se de que tem o Node.js (versão 18 ou superior) instalado no seu computador.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/70">
                <div className="text-xs font-medium text-slate-300 mb-1">
                  2. Extrair o arquivo baixado
                </div>
                <p className="text-xs text-slate-400">
                  Clique com botão direito no arquivo <code className="text-slate-200 bg-slate-900 px-1 rounded">cartografo-estrategico.zip</code> e selecione &quot;Extrair Tudo...&quot;.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/70">
                <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
                  <span>3. Abrir o terminal na pasta e instalar dependências:</span>
                  <button
                    onClick={() => copyToClipboard('npm install', 'npm-install')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedStep === 'npm-install' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-2 bg-slate-900 rounded font-mono text-xs text-emerald-400 overflow-x-auto">
                  npm install
                </pre>
              </div>

              {/* Step 4 */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/70">
                <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
                  <span>4. Iniciar o servidor local:</span>
                  <button
                    onClick={() => copyToClipboard('npm run dev', 'npm-dev')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedStep === 'npm-dev' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-2 bg-slate-900 rounded font-mono text-xs text-emerald-400 overflow-x-auto">
                  npm run dev
                </pre>
                <p className="text-[11px] text-slate-400 mt-2">
                  Depois é só acessar <strong className="text-slate-200">http://localhost:3000</strong> no seu navegador (Chrome, Edge, Firefox, etc.).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Código 100% autônomo, não requer nenhuma chave externa para rodar.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
