import React, { useState, useCallback, useEffect } from 'react';

interface ResultDisplayProps {
  prompt: string;
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate: () => void;
  history?: string[];
  onHistorySelect?: (img: string) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ prompt, generatedImage, isLoading, error, onRegenerate, history = [], onHistorySelect }) => {
  const [copyText, setCopyText] = useState('Copy');

  const handleCopy = useCallback(async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyText('Done!');
      setTimeout(() => setCopyText('Copy'), 2000);
    } catch (err) { console.error(err); }
  }, [prompt]);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'ai-photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage]);

  return (
    <div className='flex flex-col h-full p-4 gap-4'>
      <div className="flex-grow flex flex-col lg:flex-row gap-5 overflow-hidden">
          
          {/* Canvas Area (Left/Top) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-3 min-h-[300px]">
             <div className="flex-grow nm-inset rounded-2xl flex items-center justify-center relative overflow-hidden bg-white/10">
                {isLoading && (
                   <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                      <span className="font-black text-indigo-500 text-[10px] tracking-widest uppercase">AI Rendering...</span>
                   </div>
                )}
                
                {generatedImage && !isLoading && (
                   <img src={generatedImage} alt="Result" className="max-w-full max-h-full object-contain p-2 transition-transform hover:scale-[1.02] duration-500" />
                )}

                {!generatedImage && !isLoading && (
                   <div className="text-slate-300 font-black text-center uppercase tracking-widest opacity-40 text-[10px] flex flex-col items-center gap-2">
                      <svg className="w-10 h-10 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Main Canvas
                   </div>
                )}
                
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center p-6 bg-red-50/90 backdrop-blur-sm z-20 text-center">
                    <p className="text-red-500 text-xs font-bold leading-relaxed">{error}</p>
                  </div>
                )}
             </div>

             {/* History Bar */}
             {history.length > 0 && (
                <div className="flex gap-2.5 overflow-x-auto py-1 custom-scrollbar">
                   {history.map((img, i) => (
                      <button 
                        key={i} 
                        onClick={() => onHistorySelect?.(img)} 
                        className={`w-14 h-18 flex-shrink-0 nm-button rounded-xl overflow-hidden p-1 transition-all
                          ${generatedImage === img ? 'nm-inset opacity-100 ring-2 ring-indigo-300' : 'opacity-70 hover:opacity-100'}`}
                      >
                         <img src={img} className="w-full h-full object-cover rounded-lg" />
                      </button>
                   ))}
                </div>
             )}
          </div>

          {/* Prompt Area (Right/Bottom) */}
          <div className="w-full lg:w-[35%] flex flex-col gap-4">
              <div className="flex-grow nm-inset rounded-2xl p-4 relative group">
                  <div className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">AI Prompt Output</div>
                  <textarea 
                    className="w-full h-[calc(100%-20px)] bg-transparent border-none focus:ring-0 text-[11px] leading-relaxed font-medium text-slate-600 resize-none" 
                    placeholder="// Waiting for draft..."
                    value={prompt}
                    readOnly
                  ></textarea>
                  <button 
                    onClick={handleCopy} 
                    className="absolute top-4 right-4 nm-button px-2.5 py-1 text-[9px] font-black rounded-lg text-slate-500 hover:text-indigo-600 uppercase tracking-tighter"
                  >
                    {copyText}
                  </button>
              </div>
              
              <div className="flex gap-3 flex-shrink-0">
                 <button 
                    onClick={handleDownload} 
                    disabled={!generatedImage} 
                    className="flex-1 nm-button py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 rounded-xl disabled:opacity-30"
                  >
                    Download
                  </button>
                 <button 
                    onClick={onRegenerate} 
                    disabled={!generatedImage} 
                    className="flex-1 nm-button py-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 rounded-xl disabled:opacity-30"
                  >
                    Regen
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ResultDisplay;