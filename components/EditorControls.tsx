
import React from 'react';
import ImageUploader from './ImageUploader';

interface EditorControlsProps {
  editorPrompt: string;
  setEditorPrompt: (prompt: string) => void;
  onAnalyze: () => void;
  onEnhance: () => void;
  isProcessingAnalysis: boolean;
  isProcessingEnhancement: boolean;
  hasImage: boolean;
  referenceImages: string[];
  onAddReferenceImage: (img: string) => void;
  onRemoveReferenceImage: (index: number) => void;
}

const EXAMPLE_PROMPTS = [
  "เปลี่ยนท้องฟ้าเป็นตอนกลางคืน",
  "ทำให้ภาพดูวินเทจ",
  "ลบคนข้างหลังออก",
  "เพิ่มแว่นกันแดด",
  "เปลี่ยนพื้นหลังเป็นเบลอ",
];

const EditorControls: React.FC<EditorControlsProps> = ({ 
  editorPrompt, 
  setEditorPrompt,
  onAnalyze,
  onEnhance,
  isProcessingAnalysis,
  isProcessingEnhancement,
  hasImage,
  referenceImages,
  onAddReferenceImage,
  onRemoveReferenceImage
}) => {
  const isProcessing = isProcessingAnalysis || isProcessingEnhancement;

  return (
    <>
      <h2 className="text-xl font-bold mb-3 text-slate-800 text-center font-['Outfit']">AI Magic Editor</h2>
      <p className="text-center text-slate-500 mb-6 text-sm">
        สั่งงานด้วยข้อความเพื่อแก้ไขภาพ หรือให้ AI ช่วยวิเคราะห์ภาพก่อน
      </p>
      
      {/* Reference Images Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-stone-700 mb-2">
            รูปภาพอ้างอิง (Reference Images)
            <span className="text-xs font-normal text-stone-400 ml-2">สำหรับสไตล์หรือองค์ประกอบเพิ่มเติม</span>
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {referenceImages.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 flex-shrink-0 border border-slate-200 rounded-lg overflow-hidden group">
                    <img src={img} alt={`Ref ${idx}`} className="w-full h-full object-cover" />
                    <button 
                        onClick={() => onRemoveReferenceImage(idx)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            ))}
            <div className="w-20 h-20 flex-shrink-0">
                <ImageUploader 
                    imagePreview={null} 
                    onImageSelect={(img) => { if(img) onAddReferenceImage(img) }} 
                />
            </div>
        </div>
      </div>

      <textarea
        id="editor-prompt-input"
        className="w-full p-4 text-lg"
        placeholder="พิมพ์คำสั่งแก้ไขที่นี่... (เช่น: เปลี่ยนเสื้อเป็นสีแดง)"
        rows={3}
        value={editorPrompt}
        onChange={(e) => setEditorPrompt(e.target.value)}
        aria-label="AI image editing prompt"
      />
      
      <div className="flex flex-wrap justify-center gap-4 mt-5">
        <button 
            onClick={onAnalyze} 
            disabled={isProcessing || (!hasImage && referenceImages.length === 0)} 
            className="cyber-button secondary py-3 px-6 font-semibold flex items-center gap-2"
            title={(!hasImage && referenceImages.length === 0) ? "กรุณาอัปโหลดรูปภาพก่อน" : ""}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            {isProcessingAnalysis ? 'กำลังวิเคราะห์...' : 'วิเคราะห์ภาพ'}
        </button>
        <button 
            onClick={onEnhance} 
            disabled={isProcessing || !editorPrompt} 
            className="cyber-button primary py-3 px-6 font-bold flex items-center gap-2"
            title={!editorPrompt ? "กรุณาใส่คำสั่งก่อน" : ""}
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.046A4.993 4.993 0 0116.954 8H18a1 1 0 110 2h-1.046A4.993 4.993 0 0112 16.954V18a1 1 0 11-2 0v-1.046A4.993 4.993 0 013.046 12H2a1 1 0 110-2h1.046A4.993 4.993 0 018 3.046V2a1 1 0 011.414-.924l.434.217a1 1 0 011.452 0l.434-.217zM12 4.569a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-3.82 5.68a1.5 1.5 0 10-2.836 1.414 6.493 6.493 0 002.836-1.414zm7.64 0a6.493 6.493 0 002.836 1.414 1.5 1.5 0 10-2.836-1.414zM12 15.431a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" /></svg>
            {isProcessingEnhancement ? 'Improving...' : 'ปรับปรุงพรอมต์ (AI)'}
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">Quick Ideas</p>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_PROMPTS.map(prompt => (
            <button
              key={prompt}
              onClick={() => setEditorPrompt(prompt)}
              className="text-sm bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all hover:shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default EditorControls;
