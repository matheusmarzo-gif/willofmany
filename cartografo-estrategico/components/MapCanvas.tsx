/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import {
  RegionTile,
  StartingPoint,
  RANK_COLORS,
  RANK_POINTS,
} from '../types/map';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Coins,
  Wheat,
  Shield,
  Eye,
  Layers,
  Radio,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Grid3X3,
  RotateCw,
  X,
} from 'lucide-react';
import { getSectorForCoord, SectorInfo } from '../utils/sectorRotation';
import { MapBlock } from '../types/map';

export type MapViewMode = 'ranks' | 'buildings' | 'distance' | 'yield' | 'waves';

interface MapCanvasProps {
  regions: RegionTile[];
  startingPoints: [StartingPoint, StartingPoint];
  bounds: { minX: number; maxX: number; minY: number; maxY: number; width: number; height: number };
  blocks?: MapBlock[];
  selectedTile: RegionTile | null;
  onSelectTile: (tile: RegionTile | null) => void;
  viewMode: MapViewMode;
  onChangeViewMode: (mode: MapViewMode) => void;
  showCoordinates: boolean;
  onToggleCoordinates: () => void;
  sectorSize: number;
  showSectorGrid: boolean;
  onToggleSectorGrid: () => void;
  onRotateCurrentSector: (mode: 'perimeter_1step' | 'block_90deg') => void;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  regions,
  startingPoints,
  bounds,
  blocks = [],
  selectedTile,
  onSelectTile,
  viewMode,
  onChangeViewMode,
  showCoordinates,
  onToggleCoordinates,
  sectorSize = 3,
  showSectorGrid = true,
  onToggleSectorGrid,
  onRotateCurrentSector,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredTile, setHoveredTile] = useState<RegionTile | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Animation state for simultaneous propagation playback
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animStep, setAnimStep] = useState<number | null>(null);

  // Tile dimensions in SVG units
  const TILE_SIZE = 36;
  const GAP = 3;
  const STEP = TILE_SIZE + GAP;

  // Maximum propagation step
  const maxStep = useMemo(() => {
    let maxS = 0;
    for (const r of regions) {
      if ((r.propagationStep ?? 0) > maxS) maxS = r.propagationStep!;
    }
    return maxS;
  }, [regions]);

  // Fast map lookup
  const regionsMap = useMemo(() => {
    const map = new Map<string, RegionTile>();
    for (const r of regions) {
      map.set(r.id, r);
    }
    return map;
  }, [regions]);

  // Selected Square Sector / Block Info
  const activeSector: SectorInfo | null = useMemo(() => {
    if (!selectedTile) return null;
    const parentBlock = blocks.find(b => b.id === selectedTile.blockId);
    if (parentBlock) {
      const blockTiles = parentBlock.regionIds
        .map(id => regionsMap.get(id))
        .filter((r): r is RegionTile => !!r);
      return {
        blockId: parentBlock.id,
        name: parentBlock.name,
        sectorX: Math.floor(parentBlock.originX / parentBlock.size),
        sectorY: Math.floor(parentBlock.originY / parentBlock.size),
        size: parentBlock.size,
        originX: parentBlock.originX,
        originY: parentBlock.originY,
        tiles: blockTiles,
        tileIds: new Set(parentBlock.regionIds),
      };
    }
    return getSectorForCoord(selectedTile.x, selectedTile.y, sectorSize, regionsMap);
  }, [selectedTile, sectorSize, regionsMap, blocks]);

  // Auto-fit map in viewport without any clipping on large maps (up to 900+ regions)
  const fitMap = useCallback(() => {
    if (!containerRef.current || regions.length === 0) return;
    const { clientWidth, clientHeight } = containerRef.current;
    if (clientWidth === 0 || clientHeight === 0) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const r of regions) {
      if (r.x < minX) minX = r.x;
      if (r.x > maxX) maxX = r.x;
      if (r.y < minY) minY = r.y;
      if (r.y > maxY) maxY = r.y;
    }

    const totalWidth = (maxX - minX + 1) * STEP;
    const totalHeight = (maxY - minY + 1) * STEP;

    // Generous padding so borders and badges are never cropped
    const paddingX = Math.max(50, clientWidth * 0.06);
    const paddingY = Math.max(60, clientHeight * 0.08);
    const availableW = Math.max(80, clientWidth - paddingX * 2);
    const availableH = Math.max(80, clientHeight - paddingY * 2);

    const scaleX = availableW / Math.max(STEP, totalWidth);
    const scaleY = availableH / Math.max(STEP, totalHeight);

    // Unclamped down to 0.01 so even 900+ region maps never get clipped
    const fitScale = Math.min(Math.max(0.01, Math.min(scaleX, scaleY)), 2.5);

    setZoom(fitScale);
    setPan({
      x: (clientWidth - totalWidth * fitScale) / 2 - minX * STEP * fitScale,
      y: (clientHeight - totalHeight * fitScale) / 2 - minY * STEP * fitScale,
    });
  }, [regions, STEP]);

  // Initial fit and whenever regions change
  useEffect(() => {
    const timer = setTimeout(() => {
      fitMap();
    }, 30);
    return () => clearTimeout(timer);
  }, [regions, bounds.width, bounds.height, fitMap]);

  // Active ResizeObserver to dynamically re-fit whenever container dimensions stabilize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let rafId: number;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect.width > 50 && entry.contentRect.height > 50) {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            fitMap();
          });
        }
      }
    });
    observer.observe(el);
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [fitMap]);

  // Animation timer
  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setAnimStep(prev => {
        const next = (prev ?? 0) + 1;
        if (next > maxStep) {
          setIsAnimating(false);
          return maxStep;
        }
        return next;
      });
    }, 280);
    return () => clearInterval(interval);
  }, [isAnimating, maxStep]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.14 : 0.88;
    setZoom(prev => Math.min(5, Math.max(0.03, prev * zoomFactor)));
  };

  // Drag pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left + 16;
      const rawY = e.clientY - rect.top + 16;
      const maxX = rect.width - 280;
      const maxY = rect.height - 210;
      setTooltipPos({
        x: Math.max(12, Math.min(rawX, maxX)),
        y: Math.max(12, Math.min(rawY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Maximum distance metrics for heatmaps
  const { maxSPDist, maxYield } = useMemo(() => {
    let maxSP = 1;
    let maxTotalYield = 1;
    for (const r of regions) {
      if ((r.distToNearestSP ?? 0) > maxSP) maxSP = r.distToNearestSP!;
      const y = (r.building?.coinsPerTurn ?? 0) + (r.building?.wheatPerTurn ?? 0);
      if (y > maxTotalYield) maxTotalYield = y;
    }
    return { maxSPDist: maxSP, maxYield: maxTotalYield };
  }, [regions]);

  // Compute tile fill color based on viewMode and animation state
  const getTileFill = (tile: RegionTile): string => {
    const isRevealed = animStep === null || (tile.propagationStep ?? 0) <= animStep;

    if (!isRevealed) {
      return '#0f172a';
    }

    if (viewMode === 'waves') {
      if (tile.isStartingPoint) {
        return tile.team === 1 ? '#dc2626' : '#2563eb';
      }
      if (tile.propagationOrigin === 'meeting_point') {
        return '#f59e0b';
      }
      if (tile.propagationOrigin === 'team1') {
        const stepPct = Math.min(1, (tile.propagationStep ?? 0) / (maxStep || 1));
        return `hsl(0, ${75 - stepPct * 25}%, ${45 + stepPct * 15}%)`;
      }
      if (tile.propagationOrigin === 'team2') {
        const stepPct = Math.min(1, (tile.propagationStep ?? 0) / (maxStep || 1));
        return `hsl(215, ${80 - stepPct * 25}%, ${45 + stepPct * 15}%)`;
      }
      return '#eab308';
    }

    if (viewMode === 'ranks') {
      return RANK_COLORS[tile.rank];
    }

    if (viewMode === 'buildings') {
      if (tile.building?.type === 'povoado') {
        const alphas = ['#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fef08a'];
        return alphas[tile.building.level - 1] || '#f59e0b';
      }
      if (tile.building?.type === 'fazenda') {
        const alphas = ['#047857', '#059669', '#10b981', '#34d399', '#a7f3d0'];
        return alphas[tile.building.level - 1] || '#10b981';
      }
      return '#1e293b';
    }

    if (viewMode === 'distance') {
      const norm = Math.min(1, (tile.distToNearestSP ?? 0) / maxSPDist);
      const hue = Math.round(180 - norm * 140);
      return `hsl(${hue}, 75%, ${40 + (1 - norm) * 20}%)`;
    }

    if (viewMode === 'yield') {
      const y = (tile.building?.coinsPerTurn ?? 0) + (tile.building?.wheatPerTurn ?? 0);
      if (y <= 0) return '#1e293b';
      const norm = Math.min(1, Math.log10(y + 1) / Math.log10(maxYield + 1));
      const lightness = 30 + norm * 45;
      return `hsl(45, 95%, ${lightness}%)`;
    }

    return RANK_COLORS[tile.rank];
  };

  // Distinct sectors present in current map
  const presentSectors = useMemo(() => {
    const set = new Set<string>();
    for (const r of regions) {
      const sx = Math.floor(r.x / sectorSize);
      const sy = Math.floor(r.y / sectorSize);
      set.add(`${sx},${sy}`);
    }
    return Array.from(set).map(k => {
      const [sx, sy] = k.split(',').map(Number);
      return { sx, sy, originX: sx * sectorSize, originY: sy * sectorSize };
    });
  }, [regions, sectorSize]);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsDragging(false);
        setHoveredTile(null);
      }}
      className={`relative w-full h-full overflow-hidden bg-slate-950 select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* View Mode & Sector Toolbar (Floating in top-left) */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl max-w-[calc(100vw-360px)]">
        <button
          onClick={() => onChangeViewMode('ranks')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            viewMode === 'ranks'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Visualizar mapa colorido pelos Ranks L8 a L1"
        >
          <Layers className="w-3.5 h-3.5 text-red-400" />
          <span>Ranks (L8-L1)</span>
        </button>

        <button
          onClick={() => onChangeViewMode('waves')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            viewMode === 'waves'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Ver as duas frentes simultâneas e o encontro no meio"
        >
          <Radio className="w-3.5 h-3.5 text-amber-400" />
          <span>Frentes Simultâneas</span>
        </button>

        <button
          onClick={() => onChangeViewMode('buildings')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            viewMode === 'buildings'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Destacar Povoados e Fazendas"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>Construções</span>
        </button>

        <button
          onClick={() => onChangeViewMode('distance')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            viewMode === 'distance'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Gradiente de distância aos Starting Points"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Distâncias</span>
        </button>

        <button
          onClick={() => onChangeViewMode('yield')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            viewMode === 'yield'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Concentração de Produção Econômica"
        >
          <Wheat className="w-3.5 h-3.5 text-emerald-400" />
          <span>Rendimento</span>
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1" />

        {/* Sector Grid Toggle */}
        <button
          onClick={onToggleSectorGrid}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            showSectorGrid
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Exibir ou ocultar partição dos Quadrados 3x3 no mapa"
        >
          <Grid3X3 className="w-3.5 h-3.5" />
          <span>Quadrados {sectorSize}x{sectorSize}</span>
        </button>

        <button
          onClick={onToggleCoordinates}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            showCoordinates
              ? 'bg-slate-800 text-slate-100'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Mostrar coordenadas dos eixos"
        >
          (X, Y)
        </button>
      </div>

      {/* Active Selected Sector Floating Control Bar (Top Center) */}
      {activeSector && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col sm:flex-row items-center gap-2.5 p-2 px-3.5 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-cyan-500/60 shadow-2xl text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 ring-4 ring-cyan-400/30 animate-pulse" />
            <span className="font-bold text-white tracking-wide">
              {activeSector.name || `Quadrado ${activeSector.size}x${activeSector.size}`}
            </span>
            <span className="text-cyan-300 font-mono text-[11px] font-semibold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              {activeSector.tiles.length} regiões ({activeSector.size}x{activeSector.size})
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1 font-mono text-[11px] text-amber-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">Ciclo ↻:</span>
            <span>M(1,1)→M(1,2)...→M(1,1)</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* User Rotation: Perimeter cycle M(1,1)->M(1,2)->... */}
            <button
              onClick={() => onRotateCurrentSector('perimeter_1step')}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-cyan-600/30 text-xs"
              title="Girar o perímetro do quadrado: M(1,1) -> M(1,2) -> M(1,3) -> M(2,3) -> M(3,3) -> M(3,2) -> M(3,1) -> M(2,1) -> M(1,1)"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Girar Quadrado ↻ (G)</span>
            </button>

            {/* 90-degree block rotation button */}
            <button
              onClick={() => onRotateCurrentSector('block_90deg')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium rounded-xl transition-colors text-xs"
              title="Girar bloco completo em 90 graus no sentido horário"
            >
              <span>90°</span>
            </button>

            <button
              onClick={() => onSelectTile(null)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-0.5"
              title="Fechar seleção do quadrado (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Simultaneous Propagation Playback Bar (Floating bottom-left) */}
      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl text-xs text-slate-200">
        <button
          onClick={() => {
            if (animStep === null) {
              setAnimStep(0);
              setIsAnimating(true);
            } else {
              setIsAnimating(!isAnimating);
            }
          }}
          className="p-1.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1 font-semibold"
          title={isAnimating ? 'Pausar animação' : 'Animar propagação simultânea'}
        >
          {isAnimating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">
            {isAnimating ? 'Pausar' : animStep === null ? 'Animar Propagação' : 'Continuar'}
          </span>
        </button>

        {animStep !== null && (
          <>
            <button
              onClick={() => {
                setAnimStep(prev => Math.min(maxStep, (prev ?? 0) + 1));
              }}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
              title="Avançar 1 passo"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                setIsAnimating(false);
                setAnimStep(null);
              }}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
              title="Mostrar mapa completo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1.5 px-2 font-mono text-[11px] text-slate-300 border-l border-slate-800">
              <span className="text-amber-400 font-bold">Passo {animStep}</span>
              <span className="text-slate-500">/</span>
              <span>{maxStep}</span>
            </div>
          </>
        )}
      </div>

      {/* Zoom / Pan Controls (Floating in bottom-right) */}
      <div className="absolute bottom-5 right-5 z-20 flex items-center gap-1 p-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl">
        <button
          onClick={() => setZoom(prev => Math.min(5, prev * 1.25))}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Aumentar Zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.03, prev / 1.25))}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Diminuir Zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={fitMap}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Ajustar Mapa à Tela (Sem Cortes)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <span className="px-2 text-xs font-mono tabular-nums text-slate-400 min-w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Starting Points & Meeting Point Legend */}
      <div className="absolute top-4 right-4 z-20 hidden xl:flex items-center gap-3 p-2 px-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-400/30" />
          <span className="text-slate-300 font-medium">Equipe 1 (SP1)</span>
          <span className="text-red-400 font-mono text-[11px] font-bold">Peça 'g'</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-400/30" />
          <span className="text-amber-300 font-medium">Encontro no Meio</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-400/30" />
          <span className="text-slate-300 font-medium">Equipe 2 (SP2)</span>
          <span className="text-blue-400 font-mono text-[11px] font-bold">Peça 'g'</span>
        </div>
      </div>

      {/* SVG Canvas with Infinite Transform Container (No clipping) */}
      <svg className="w-full h-full overflow-hidden block">
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Subtle grid background markings */}
          {showCoordinates && (
            <g opacity={0.15}>
              {Array.from({ length: bounds.width + 1 }).map((_, i) => (
                <line
                  key={`gx-${i}`}
                  x1={i * STEP}
                  y1={0}
                  x2={i * STEP}
                  y2={bounds.height * STEP}
                  stroke="#94a3b8"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              ))}
              {Array.from({ length: bounds.height + 1 }).map((_, i) => (
                <line
                  key={`gy-${i}`}
                  x1={0}
                  y1={i * STEP}
                  x2={bounds.width * STEP}
                  y2={i * STEP}
                  stroke="#94a3b8"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              ))}
            </g>
          )}

          {/* Square Blocks (3x3, 4x4, 5x5) Outlines */}
          {showSectorGrid && (
            <g>
              {(blocks && blocks.length > 0
                ? blocks.map(b => ({
                    key: b.id,
                    originX: b.originX,
                    originY: b.originY,
                    size: b.size,
                    name: b.name,
                    isActive: activeSector?.originX === b.originX && activeSector?.originY === b.originY,
                  }))
                : presentSectors.map(sec => ({
                    key: `sec-${sec.sx}-${sec.sy}`,
                    originX: sec.originX,
                    originY: sec.originY,
                    size: sectorSize,
                    name: `Bloco ${sectorSize}x${sectorSize}`,
                    isActive: activeSector?.sectorX === sec.sx && activeSector?.sectorY === sec.sy,
                  }))
              ).map(b => {
                const bx = b.originX * STEP - 2;
                const by = b.originY * STEP - 2;
                const bDim = b.size * STEP + 1;

                return (
                  <g key={b.key}>
                    <rect
                      x={bx}
                      y={by}
                      width={bDim}
                      height={bDim}
                      rx={8}
                      fill={b.isActive ? 'rgba(6, 182, 212, 0.08)' : 'none'}
                      stroke={b.isActive ? '#06b6d4' : 'rgba(100, 116, 139, 0.35)'}
                      strokeWidth={b.isActive ? 2 : 1}
                      strokeDasharray={b.isActive ? '4,3' : '2,3'}
                    />
                    <text
                      x={bx + 6}
                      y={by + 13}
                      fill={b.isActive ? '#22d3ee' : '#64748b'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {b.name}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Active Block Glowing Background Frame */}
          {activeSector && (
            <g className="pointer-events-none">
              <rect
                x={activeSector.originX * STEP - 4}
                y={activeSector.originY * STEP - 4}
                width={activeSector.size * STEP + 5}
                height={activeSector.size * STEP + 5}
                rx={12}
                fill="rgba(6, 182, 212, 0.12)"
                stroke="#06b6d4"
                strokeWidth={2.5}
                strokeDasharray="6,4"
              />
            </g>
          )}

          {/* Render All Regions */}
          {regions.map(tile => {
            const rx = tile.x * STEP;
            const ry = tile.y * STEP;
            const isSelected = selectedTile?.id === tile.id;
            const isHovered = hoveredTile?.id === tile.id;
            const isRevealed = animStep === null || (tile.propagationStep ?? 0) <= animStep;
            const isCurrentWaveFront =
              animStep !== null && (tile.propagationStep ?? 0) === animStep;

            // Check if this tile belongs to the currently active square sector
            const isInActiveSector = activeSector ? activeSector.tileIds.has(tile.id) : false;

            const fillColor = getTileFill(tile);
            const isWhite = tile.rank === 1 && viewMode === 'ranks' && isRevealed;

            // Opacity and lighting based on sector selection (clear visual distinction)
            let tileOpacity = 1;
            let filterStyle = undefined;

            if (activeSector) {
              if (isInActiveSector) {
                // Brighter / illuminated for regions of the selected square
                filterStyle = 'brightness(1.30) contrast(1.15) drop-shadow(0 0 4px rgba(34, 211, 238, 0.45))';
                tileOpacity = 1;
              } else {
                // Dim others to highlight the square
                tileOpacity = 0.32;
                filterStyle = 'grayscale(0.4)';
              }
            }

            return (
              <g
                key={tile.id}
                transform={`translate(${rx}, ${ry})`}
                opacity={tileOpacity}
                style={{ filter: filterStyle }}
                className="cursor-pointer transition-all duration-100"
                onMouseEnter={() => setHoveredTile(tile)}
                onClick={e => {
                  e.stopPropagation();
                  onSelectTile(isSelected ? null : tile);
                }}
              >
                {/* Tile Base Box */}
                <rect
                  width={TILE_SIZE}
                  height={TILE_SIZE}
                  rx={6}
                  fill={fillColor}
                  stroke={
                    isSelected
                      ? '#38bdf8'
                      : isInActiveSector
                      ? '#22d3ee'
                      : isCurrentWaveFront
                      ? '#f59e0b'
                      : isHovered
                      ? '#ffffff'
                      : isWhite
                      ? '#cbd5e1'
                      : !isRevealed
                      ? 'rgba(51, 65, 85, 0.4)'
                      : 'rgba(15, 23, 42, 0.7)'
                  }
                  strokeWidth={
                    isSelected ? 3 : isInActiveSector ? 2.5 : isCurrentWaveFront ? 2.5 : isHovered ? 2 : 1
                  }
                  strokeDasharray={!isRevealed ? '2,2' : undefined}
                  className="transition-colors"
                />

                {/* Starting Point Banner / Piece 'g' Indicator */}
                {isRevealed && tile.isStartingPoint && (
                  <g>
                    <circle
                      cx={TILE_SIZE / 2}
                      cy={TILE_SIZE / 2}
                      r={TILE_SIZE / 2 - 3}
                      fill="none"
                      stroke={tile.team === 1 ? '#ef4444' : '#3b82f6'}
                      strokeWidth={2}
                      strokeDasharray="3,2"
                    />
                    <rect
                      x={4}
                      y={4}
                      width={TILE_SIZE - 8}
                      height={TILE_SIZE - 8}
                      rx={4}
                      fill={tile.team === 1 ? '#b91c1c' : '#1d4ed8'}
                      opacity={0.9}
                    />
                    <text
                      x={TILE_SIZE / 2}
                      y={TILE_SIZE / 2 + 5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      g
                    </text>
                  </g>
                )}

                {/* Meeting Point icon in 'waves' mode */}
                {isRevealed &&
                  viewMode === 'waves' &&
                  !tile.isStartingPoint &&
                  tile.propagationOrigin === 'meeting_point' && (
                    <text
                      x={TILE_SIZE / 2}
                      y={TILE_SIZE / 2 + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      ⚡
                    </text>
                  )}

                {/* Building Icon & Level Indicator */}
                {isRevealed && viewMode !== 'waves' && !tile.isStartingPoint && tile.building && (
                  <g transform={`translate(${TILE_SIZE / 2}, ${TILE_SIZE / 2})`}>
                    <circle
                      cx={0}
                      cy={0}
                      r={11}
                      fill={tile.building.type === 'povoado' ? '#78350f' : '#064e3b'}
                      stroke={tile.building.type === 'povoado' ? '#f59e0b' : '#10b981'}
                      strokeWidth={1.5}
                    />
                    <text
                      x={-4}
                      y={3}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {tile.building.type === 'povoado' ? 'P' : 'F'}
                    </text>
                    <text
                      x={4}
                      y={4}
                      fill={tile.building.type === 'povoado' ? '#fde68a' : '#a7f3d0'}
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {tile.building.level}
                    </text>
                  </g>
                )}

                {/* Rank number in rank view if no building and revealed */}
                {isRevealed && !tile.isStartingPoint && !tile.building && viewMode === 'ranks' && (
                  <text
                    x={TILE_SIZE / 2}
                    y={TILE_SIZE / 2 + 4}
                    textAnchor="middle"
                    fill={isWhite ? '#0f172a' : '#ffffff'}
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="JetBrains Mono, monospace"
                    opacity={0.8}
                  >
                    L{tile.rank}
                  </text>
                )}

                {/* Unrevealed tile step indicator in animation */}
                {!isRevealed && (
                  <circle cx={TILE_SIZE / 2} cy={TILE_SIZE / 2} r={2} fill="#334155" />
                )}

                {/* Local Matrix Position Label M(row, col) & Perimeter Rotation Arrow */}
                {isInActiveSector && activeSector && (
                  (() => {
                    const localR = tile.y - activeSector.originY + 1;
                    const localC = tile.x - activeSector.originX + 1;

                    // Clockwise Perimeter cycle:
                    // M(1,1)->M(1,2)->M(1,3)->M(2,3)->M(3,3)->M(3,2)->M(3,1)->M(2,1)->M(1,1)
                    const isTop = localR === 1 && localC < activeSector.size;
                    const isRight = localC === activeSector.size && localR < activeSector.size;
                    const isBottom = localR === activeSector.size && localC > 1;
                    const isLeft = localC === 1 && localR > 1;

                    let arrowChar = '';
                    let ax = TILE_SIZE - 6;
                    let ay = 8;

                    if (isTop) {
                      arrowChar = '→';
                      ax = TILE_SIZE - 6;
                      ay = 8;
                    } else if (isRight) {
                      arrowChar = '↓';
                      ax = TILE_SIZE - 6;
                      ay = TILE_SIZE / 2 + 2;
                    } else if (isBottom) {
                      arrowChar = '←';
                      ax = 7;
                      ay = TILE_SIZE - 4;
                    } else if (isLeft) {
                      arrowChar = '↑';
                      ax = 7;
                      ay = TILE_SIZE / 2 + 2;
                    }

                    return (
                      <g className="pointer-events-none">
                        {/* Matrix label badge */}
                        <rect
                          x={1.5}
                          y={TILE_SIZE - 10.5}
                          width={TILE_SIZE - 3}
                          height={9}
                          rx={2.5}
                          fill="rgba(15, 23, 42, 0.88)"
                          stroke="rgba(34, 211, 238, 0.75)"
                          strokeWidth={0.6}
                        />
                        <text
                          x={TILE_SIZE / 2}
                          y={TILE_SIZE - 3.5}
                          textAnchor="middle"
                          fill="#38bdf8"
                          fontSize="7"
                          fontWeight="bold"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          M({localR},{localC})
                        </text>

                        {/* Perimeter rotation directional arrow */}
                        {arrowChar && (
                          <text
                            x={ax}
                            y={ay}
                            textAnchor="middle"
                            fill="#fbbf24"
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="sans-serif"
                            className="drop-shadow"
                          >
                            {arrowChar}
                          </text>
                        )}
                      </g>
                    );
                  })()
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredTile && !isDragging && (
        <div
          style={{
            position: 'absolute',
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            pointerEvents: 'none',
          }}
          className="z-50 w-72 p-3 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl text-xs text-slate-200"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-mono text-slate-400">
              Posição: ({hoveredTile.x}, {hoveredTile.y})
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: RANK_COLORS[hoveredTile.rank] }}
              />
              <span className="font-bold text-white">L{hoveredTile.rank}</span>
            </div>
          </div>

          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Pontos da Região:</span>
              <span className="font-mono font-bold text-white">
                {RANK_POINTS[hoveredTile.rank].toLocaleString('pt-BR')} pts
              </span>
            </div>

            {/* Square Sector Indicator */}
            <div className="flex justify-between text-[11px] text-cyan-300">
              <span className="text-slate-400">Quadrado {sectorSize}x{sectorSize}:</span>
              <span className="font-mono font-semibold">
                Setor [{Math.floor(hoveredTile.x / sectorSize)}, {Math.floor(hoveredTile.y / sectorSize)}]
              </span>
            </div>

            {/* Bilateral Propagation Info */}
            <div className="mt-1 pt-1 border-t border-slate-800">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Frente Simultânea:</span>
                <span
                  className={`font-semibold ${
                    hoveredTile.propagationOrigin === 'meeting_point'
                      ? 'text-amber-400'
                      : hoveredTile.propagationOrigin === 'team1'
                      ? 'text-red-400'
                      : 'text-blue-400'
                  }`}
                >
                  {hoveredTile.propagationOrigin === 'meeting_point'
                    ? '⚡ Encontro no Meio'
                    : hoveredTile.propagationOrigin === 'team1'
                    ? 'Equipe 1 (SP1)'
                    : 'Equipe 2 (SP2)'}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                <span>Passo da Difusão:</span>
                <span className="font-mono font-bold text-slate-200">
                  Passo #{hoveredTile.propagationStep ?? 0}
                </span>
              </div>
            </div>

            {hoveredTile.isStartingPoint && (
              <div className="mt-1 pt-1 border-t border-slate-800 text-red-400 font-semibold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>
                  Starting Point - Equipe {hoveredTile.team} (Peça '{hoveredTile.piece}')
                </span>
              </div>
            )}

            {hoveredTile.building && (
              <div className="mt-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span className="capitalize">
                    {hoveredTile.building.type} (Nível {hoveredTile.building.level})
                  </span>
                  {hoveredTile.building.type === 'povoado' ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      +{hoveredTile.building.coinsPerTurn}/t
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Wheat className="w-3 h-3" />
                      +{hoveredTile.building.wheatPerTurn}/t
                    </span>
                  )}
                </div>
              </div>
            )}

            {!hoveredTile.building && !hoveredTile.isStartingPoint && (
              <div className="text-slate-500 italic">Nenhuma construção alocada</div>
            )}

            <div className="mt-2 pt-1 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
              <span>Distância Starting Point:</span>
              <span className="font-mono">{hoveredTile.distToNearestSP ?? 0} casas</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
