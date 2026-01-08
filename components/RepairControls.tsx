
import React from 'react';
import { MEMORIAL_OUTFITS, MEMORIAL_BACKGROUNDS } from '../constants';
import type { RepairSubMode } from '../types';
import ImageUploader from './ImageUploader';

interface RepairControlsProps {
    subMode: RepairSubMode;
    setSubMode: (mode: RepairSubMode) => void;
    selectedOutfit: string | null;
    setSelectedOutfit: (prompt: string) => void;
    selectedBackground: string | null;
    setSelectedBackground: (prompt: string) => void;
    isNightMode: boolean;
    setIsNightMode: (isNight: boolean) => void;
    outfitImage: string | null;
    onOutfitImageUpload: (imageData: string | null) => void;
}


const RepairControls: React.FC<RepairControlsProps> = ({
    subMode,
    setSubMode,
    selectedOutfit,
    setSelectedOutfit,
    selectedBackground,
    setSelectedBackground,
    isNightMode,
    setIsNightMode,
    outfitImage,
    onOutfitImageUpload,
}) => {

    if (subMode === 'selection') {
        return (
            <>
                <h2 className="text-xl font-bold mb-6 text-slate-800 text-center font-['Outfit']">เลือกประเภทการแก้ไข (Select Repair Type)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <button 
                        onClick={() => setSubMode('restore')} 
                        className="cyber-button secondary p-6 flex flex-col items-center justify-center h-32 text-center hover:border-blue-500 group bg-white"
                    >
                        <span className="text-lg font-bold text-slate-700 group-hover:text-blue-600">ฟื้นฟูสภาพ (Restore)</span>
                        <span className="text-sm text-slate-400 mt-2">ซ่อมรอยขีดข่วน, แก้ไขสีซีด</span>
                    </button>
                    <button 
                        onClick={() => setSubMode('enhance')} 
                        className="cyber-button secondary p-6 flex flex-col items-center justify-center h-32 text-center hover:border-blue-500 group bg-white"
                    >
                        <span className="text-lg font-bold text-slate-700 group-hover:text-blue-600">Upscale & Enhance</span>
                        <span className="text-sm text-slate-400 mt-2">เพิ่มความละเอียดสูง, คมชัด</span>
                    </button>
                    <button 
                        onClick={() => setSubMode('memorial')} 
                        className="cyber-button primary text-white p-6 flex flex-col items-center justify-center h-32 text-center shadow-lg shadow-blue-200"
                    >
                        <span className="text-lg font-bold">งานพิธี (Memorial)</span>
                        <span className="text-sm text-blue-100 mt-2">สร้างภาพหน้าตรง, เปลี่ยนชุด</span>
                    </button>
                </div>
            </>
        );
    }

    if (subMode === 'restore') {
        return (
            <>
                <button onClick={() => setSubMode('selection')} className="text-sm text-blue-600 hover:text-blue-800 font-bold mb-4 flex items-center gap-1"> 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                    ย้อนกลับ
                </button>
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-slate-800">ฟื้นฟูสภาพภาพถ่าย</h2>
                    <p className="text-slate-500 max-w-md mx-auto">AI จะวิเคราะห์และซ่อมแซมรอยขีดข่วน ปรับสีที่ซีดจางให้กลับมาสดใสโดยอัตโนมัติ</p>
                </div>
            </>
        );
    }
    
    if (subMode === 'enhance') {
        return (
             <>
                <button onClick={() => setSubMode('selection')} className="text-sm text-blue-600 hover:text-blue-800 font-bold mb-4 flex items-center gap-1"> 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                    ย้อนกลับ
                </button>
                <h2 className="text-2xl font-bold mb-2 text-slate-800 text-center">Upscale & Enhance</h2>
                <p className="text-center text-slate-500 mb-8">เพิ่มความละเอียด 4K/8K และปรับปรุงความคมชัด</p>
                
                <div className="flex items-center justify-center bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-md mx-auto">
                    <label htmlFor="night-mode-toggle" className="flex items-center cursor-pointer justify-between w-full">
                        <span className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                            Night Mode Transform
                        </span>
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                id="night-mode-toggle" 
                                className="sr-only" 
                                checked={isNightMode}
                                onChange={(e) => setIsNightMode(e.target.checked)}
                            />
                            <div className={`block w-14 h-8 rounded-full transition-colors ${isNightMode ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform shadow-sm ${isNightMode ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                    </label>
                </div>
            </>
        )
    }

    if (subMode === 'memorial') {
         return (
            <>
                <button onClick={() => setSubMode('selection')} className="text-sm text-blue-600 hover:text-blue-800 font-bold mb-4 flex items-center gap-1"> 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                    ย้อนกลับ
                </button>
                <h2 className="text-xl font-bold mb-6 text-slate-800">สร้างภาพหน้าตรง (งานพิธี)</h2>
                <div className="space-y-8">
                    <div>
                        <h3 className="text-md font-semibold text-slate-500 mb-3 uppercase tracking-wider text-xs">เลือกชุด (Clothing)</h3>
                        
                        {/* Custom Upload Option */}
                        <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                อัปโหลดภาพชุดที่ต้องการ (Optional)
                            </label>
                            <div className="w-full h-32">
                                <ImageUploader imagePreview={outfitImage} onImageSelect={onOutfitImageUpload} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {MEMORIAL_OUTFITS.map(outfit => (
                                <button 
                                    key={outfit.label} 
                                    onClick={() => setSelectedOutfit(outfit.prompt)} 
                                    className={`beatpad-btn text-sm ${selectedOutfit === outfit.prompt ? 'active' : ''}`}
                                    disabled={!!outfitImage}
                                >
                                    <span>{outfit.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-slate-500 mb-3 uppercase tracking-wider text-xs">เลือกฉากหลัง (Background)</h3>
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {MEMORIAL_BACKGROUNDS.map(bg => (
                                <button key={bg.label} onClick={() => setSelectedBackground(bg.prompt)} className={`beatpad-btn text-sm ${selectedBackground === bg.prompt ? 'active' : ''}`}>
                                    <span>{bg.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }
    
    return null;
};

export default RepairControls;
