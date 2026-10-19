/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { ControlSidebar } from './components/ControlSidebar';
import { MapCanvas, MapViewMode } from './components/MapCanvas';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { TileInspector } from './components/TileInspector';
import { JsonExportModal } from './components/JsonExportModal';
import { RankMatrixModal } from './components/RankMatrixModal';
import { DownloadProjectModal } from './components/DownloadProjectModal';
import {
  DEFAULT_PARAMETERS,
  FullMapState,
  generateFullMap,
} from './utils/mapGenerator';
import { placeBuildings } from './utils/buildingPlacer';
import { GeneratorParameters, RankContributionMatrix, RegionTile } from './types/map';
import { getSectorForCoord, rotateSector } from './utils/sectorRotation';

export default function App() {
  const [parameters, setParameters] = useState<GeneratorParameters>(DEFAULT_PARAMETERS);
  const [mapState, setMapState] = useState<FullMapState>(() => generateFullMap(DEFAULT_PARAMETERS));
  const [selectedTile, setSelectedTile] = useState<RegionTile | null>(null);
  const [viewMode, setViewMode] = useState<MapViewMode>('ranks');
  const [showCoordinates, setShowCoordinates] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [isRankMatrixModalOpen, setIsRankMatrixModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [jsonModalTab, setJsonModalTab] = useState<'export' | 'import'>('export');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [sectorSize, setSectorSize] = useState<number>(3);
  const [showSectorGrid, setShowSectorGrid] = useState<boolean>(true);

  // Generate a fresh map
  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    // Use timeout to allow UI transition
    setTimeout(() => {
      try {
        const nextMap = generateFullMap(parameters);
        setMapState(nextMap);
        setSelectedTile(null);
      } catch (err) {
        console.error('Erro gerando mapa:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 40);
  }, [parameters]);

  // Update a single tile from Inspector and recalculate economy
  const handleUpdateTile = (updated: RegionTile) => {
    const updatedMap = new Map(mapState.regionsMap);
    updatedMap.set(updated.id, updated);

    // Recalculate economy summary
    const updatedEconomy = placeBuildings(updatedMap, {
      ...parameters,
      // Pass allowSP so recalculation respects rules
    });

    // Reconstruct updated regions array
    const updatedRegions = Array.from(updatedMap.values());

    setMapState(prev => ({
      ...prev,
      regions: updatedRegions,
      regionsMap: updatedMap,
      economy: updatedEconomy,
    }));

    setSelectedTile(updated);
  };

  const handleOpenExport = () => {
    setJsonModalTab('export');
    setIsJsonModalOpen(true);
  };

  const handleOpenImport = () => {
    setJsonModalTab('import');
    setIsJsonModalOpen(true);
  };

  const handleImportSuccess = (imported: FullMapState) => {
    setMapState(imported);
    setParameters(imported.parameters);
    setSelectedTile(null);
  };

  // Active Square Sector
  const activeSector = useMemo(() => {
    if (!selectedTile) return null;
    const parentBlock = mapState.blocks.find(b => b.id === selectedTile.blockId);
    if (parentBlock) {
      const blockTiles = parentBlock.regionIds
        .map(id => mapState.regionsMap.get(id))
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
    return getSectorForCoord(selectedTile.x, selectedTile.y, sectorSize, mapState.regionsMap);
  }, [selectedTile, sectorSize, mapState.regionsMap, mapState.blocks]);

  // Sector rotation handler
  const handleRotateCurrentSector = useCallback(
    (mode: 'perimeter_1step' | 'block_90deg' = 'perimeter_1step') => {
      if (!activeSector) return;
      const updated = rotateSector(
        mapState,
        activeSector,
        mode
      );
      setMapState(updated);
      if (selectedTile) {
        // Keep selection active if tile still exists at location or moved
        const fresh = updated.regionsMap.get(selectedTile.id);
        if (fresh) {
          setSelectedTile(fresh);
        }
      }
    },
    [activeSector, mapState, selectedTile]
  );

  // Save new probability weights matrix and regenerate
  const handleSaveRankMatrix = (newMatrix: RankContributionMatrix) => {
    const nextParams: GeneratorParameters = {
      ...parameters,
      rankContributionMatrix: newMatrix,
    };
    setParameters(nextParams);
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const nextMap = generateFullMap(nextParams);
        setMapState(nextMap);
        setSelectedTile(null);
      } catch (err) {
        console.error('Erro regenerando mapa com nova matriz de ranks:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 40);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'r' || e.key === 'R') {
        handleGenerate();
      } else if (e.key === 'g' || e.key === 'G') {
        if (activeSector) {
          handleRotateCurrentSector('perimeter_1step');
        }
      } else if (e.key === 'Escape') {
        setSelectedTile(null);
        setShowAnalytics(false);
        setIsJsonModalOpen(false);
        setIsRankMatrixModalOpen(false);
        setIsDownloadModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate, activeSector, handleRotateCurrentSector]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* 3-Zone Header Contract */}
      <Header
        onGenerate={handleGenerate}
        onOpenExportModal={handleOpenExport}
        onOpenImportModal={handleOpenImport}
        onOpenDownloadProjectModal={() => setIsDownloadModalOpen(true)}
        onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
        showAnalytics={showAnalytics}
        totalRegions={mapState.regions.length}
        totalPoints={mapState.economy.totalPoints}
      />

      {/* Main Workspace: Control Sidebar + Map Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Generator Controls */}
        <ControlSidebar
          parameters={parameters}
          onChangeParameters={setParameters}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          sectorSize={sectorSize}
          onChangeSectorSize={setSectorSize}
          showSectorGrid={showSectorGrid}
          onToggleSectorGrid={() => setShowSectorGrid(!showSectorGrid)}
          activeSector={activeSector}
          onRotateSector={handleRotateCurrentSector}
          onOpenRankMatrixModal={() => setIsRankMatrixModalOpen(true)}
        />

        {/* Map Canvas Viewport */}
        <main className="flex-1 relative h-full">
          <MapCanvas
            regions={mapState.regions}
            startingPoints={mapState.startingPoints}
            bounds={mapState.bounds}
            blocks={mapState.blocks}
            selectedTile={selectedTile}
            onSelectTile={setSelectedTile}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            showCoordinates={showCoordinates}
            onToggleCoordinates={() => setShowCoordinates(!showCoordinates)}
            sectorSize={sectorSize}
            showSectorGrid={showSectorGrid}
            onToggleSectorGrid={() => setShowSectorGrid(!showSectorGrid)}
            onRotateCurrentSector={handleRotateCurrentSector}
          />

          {/* Tile Inspector Overlay */}
          <TileInspector
            tile={selectedTile}
            onClose={() => setSelectedTile(null)}
            onUpdateTile={handleUpdateTile}
            sectorSize={sectorSize}
            sectorInfo={activeSector}
            onRotateSector={handleRotateCurrentSector}
          />
        </main>

        {/* Slide-out Analytics Panel */}
        <AnalyticsPanel
          economy={mapState.economy}
          totalRegions={mapState.regions.length}
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />
      </div>

      {/* Export / Import Modal */}
      <JsonExportModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        mapState={mapState}
        onImportSuccess={handleImportSuccess}
        initialTab={jsonModalTab}
      />

      {/* Probability Matrix Weights Modal */}
      <RankMatrixModal
        isOpen={isRankMatrixModalOpen}
        onClose={() => setIsRankMatrixModalOpen(false)}
        currentMatrix={parameters.rankContributionMatrix}
        onSave={handleSaveRankMatrix}
      />

      {/* Download Project Source Code ZIP Modal */}
      <DownloadProjectModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
}
