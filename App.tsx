
import React, { useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import ResultDisplay from './components/ResultDisplay';
import AspectRatioSelector from './components/AspectRatioSelector';
import ImageSizeSelector from './components/ImageSizeSelector';
import ThinkingToggle from './components/ThinkingToggle';
import ModeSelector from './components/ModeSelector';
import RepairControls from './components/RepairControls';
import EditorControls from './components/EditorControls';
import { useAppLogic } from './hooks/useAppLogic';

const App: React.FC = () => {
  useEffect(() => {
    document.title = "MIX-IMAGE AI | Neumorphic Edition";
  }, []);

  const { state, setters, handlers } = useAppLogic();
  const isStudioLikeMode = state.activeMode === 'studio' || state.activeMode === 'headshot';

  return (
    <div className="bg-[#e6e9ef] main-wrapper">
      <div className="nm-raised p-5 w-full h-full flex flex-col overflow-hidden rounded-[32px]">
        <Header />
        <ModeSelector activeMode={state.activeMode} onModeChange={setters.setActiveMode} />
        
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow min-h-0 overflow-hidden px-1">
          {/* Controls Column */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
            
            <section className="p-4 nm-raised rounded-[24px]">
                <div className="flex flex-col gap-3">
                  <div className="h-24 nm-inset p-1.5 rounded-xl">
                      <ImageUploader imagePreview={state.primaryImage} onImageSelect={handlers.handlePrimaryImageSelect} />
                  </div>
                  {state.activeMode === 'studio' && (
                    <div className="h-24 nm-inset p-1.5 rounded-xl">
                      <ImageUploader imagePreview={state.outfitImagePreview} onImageSelect={handlers.handleOutfitImageUpload} />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-4">
                    <AspectRatioSelector selectedRatio={state.aspectRatio} setRatio={setters.setAspectRatio} />
                    <ImageSizeSelector selectedSize={state.imageSize} setSize={setters.setImageSize} />
                    <ThinkingToggle enabled={state.useThinking} onToggle={setters.setUseThinking} />
                </div>
            </section>
            
            {isStudioLikeMode && (
              <section className="p-4 nm-raised rounded-[24px] flex-grow flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-2 flex-shrink-0">
                    <h2 className="text-xs font-black text-slate-500 uppercase tracking-tight">Style Library</h2>
                    <button className="nm-button px-3 py-1 text-[9px] font-black rounded-full text-indigo-600 uppercase" onClick={handlers.handleSaveStyle}>Save</button>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar -mx-1 px-1">
                  <StyleSelector 
                    selectedStyles={state.selectedStyles} 
                    onStyleSelect={handlers.handleStyleSelect}
                    onDeletePreset={handlers.handleDeletePreset}
                    isOutfitUploaded={state.activeMode === 'studio' && !!state.outfitImagePreview}
                    savedPresets={state.savedPresets}
                    analyzedGender={state.analyzedGender}
                    savedClothes={state.savedClothes}
                    onToggleSavedClothing={handlers.handleToggleSavedClothing}
                  />
                </div>
                <div className="mt-3 flex-shrink-0">
                  <textarea
                    className="w-full p-2.5 rounded-xl nm-inset text-[10px] leading-relaxed"
                    placeholder="คำสั่งพิเศษ... (เช่น: เพิ่มฟิลเตอร์ย้อนยุค)"
                    rows={2}
                    value={state.details}
                    onChange={(e) => setters.setDetails(e.target.value)}
                  ></textarea>
                </div>
              </section>
            )}

            {state.activeMode === 'editor' && (
              <section className="p-4 nm-raised rounded-[24px] flex-grow flex flex-col min-h-0">
                <EditorControls 
                  editorPrompt={state.editorPrompt}
                  setEditorPrompt={setters.setEditorPrompt}
                  onAnalyze={handlers.handleAnalyzeImage}
                  onEnhance={handlers.handleEnhancePrompt}
                  isProcessingAnalysis={state.isProcessingAnalysis}
                  isProcessingEnhancement={state.isProcessingEnhancement}
                  hasImage={!!state.primaryImage}
                  referenceImages={state.editorReferenceImages}
                  onAddReferenceImage={handlers.handleAddReferenceImage}
                  onRemoveReferenceImage={handlers.handleRemoveReferenceImage}
                />
              </section>
            )}

            {state.activeMode === 'repair' && (
              <section className="p-4 nm-raised rounded-[24px] flex-grow flex flex-col min-h-0">
                <RepairControls 
                  subMode={state.repairSubMode}
                  setSubMode={setters.setRepairSubMode}
                  selectedOutfit={state.memorialOutfit}
                  setSelectedOutfit={setters.setMemorialOutfit}
                  selectedBackground={state.memorialBackground}
                  setSelectedBackground={setters.setMemorialBackground}
                  isNightMode={state.isNightMode}
                  setIsNightMode={setters.setIsNightMode}
                  outfitImage={state.outfitImagePreview}
                  onOutfitImageUpload={setters.setOutfitImagePreview}
                />
              </section>
            )}

            <div className="flex flex-col gap-3 mt-auto pb-2 flex-shrink-0">
                <button
                  className={`nm-button py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-600 flex items-center justify-center gap-2 ${state.isDrafting ? 'nm-inset' : ''}`}
                  onClick={handlers.handleAnalyzeAndDraft}
                  disabled={state.isDrafting || (!state.primaryImage && state.editorReferenceImages.length === 0)}
                >
                  {state.isDrafting ? 'Thinking...' : '1. Analyze & Draft'}
                </button>

                <button
                  className={`py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all
                    ${!state.isPromptReady ? 'bg-slate-300 opacity-50 cursor-not-allowed' : 'bg-indigo-600 shadow-lg shadow-indigo-200 hover:scale-[1.01] active:scale-[0.98]'}`}
                  onClick={handlers.handleGenerateImage}
                  disabled={!state.isPromptReady || state.isLoading}
                >
                  {state.isLoading ? 'Rendering...' : '2. Render Final'}
                </button>
            </div>
          </div>
          
          {/* Preview Column */}
          <section className="lg:col-span-8 xl:col-span-9 flex flex-col min-h-0 nm-raised rounded-[32px] overflow-hidden">
              <ResultDisplay 
                prompt={state.prompt}
                generatedImage={state.generatedImage}
                isLoading={state.isLoading}
                error={state.error}
                onRegenerate={handlers.handleGenerateImage}
                history={state.history}
                onHistorySelect={setters.setGeneratedImage}
              />
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
