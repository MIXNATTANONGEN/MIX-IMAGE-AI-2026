import React, { useRef, useCallback, useState } from 'react';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageSelect: (src: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ imagePreview, onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleContainerClick = useCallback(() => {
    if (!imagePreview && !isLoading) {
       fileInputRef.current?.click();
    }
  }, [imagePreview, isLoading]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !imagePreview && !isLoading) {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  }, [imagePreview, isLoading]);

  const processFile = useCallback((file: File | null) => {
    if (!file || !file.type.startsWith('image/')) {
        setIsDragging(false);
        return;
    }
    
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onImageSelect(reader.result as string);
      setIsLoading(false);
    };
    reader.onerror = () => {
        console.error("Failed to read file.");
        setIsLoading(false);
    }
    reader.readAsDataURL(file);
  }, [onImageSelect]);


  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0] ?? null);
    e.target.value = ''; 
  }, [processFile]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading && !imagePreview && e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, [isLoading, imagePreview]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (isLoading || imagePreview) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [processFile, isLoading, imagePreview]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (isLoading || imagePreview) return;
    
    if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                processFile(file);
                e.preventDefault();
                break;
            }
        }
    }
  }, [isLoading, imagePreview, processFile]);

  const handleClearImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onImageSelect(null);
  };

  const uploaderClass = `
    uploader-container p-1 w-full h-full image-container 
    flex items-center justify-center flex-col 
    relative group overflow-hidden
    ${isDragging ? 'dragging border-indigo-300 bg-indigo-50/50' : ''}
    ${imagePreview ? 'has-image' : ''}
    ${!imagePreview && !isLoading ? 'cursor-pointer focus:outline-none' : ''}
  `;

  return (
    <>
      <div 
        className={uploaderClass}
        onClick={handleContainerClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onPaste={handlePaste}
        role="button"
        tabIndex={!imagePreview && !isLoading ? 0 : -1}
      >
        {imagePreview && !isLoading && (
            <>
                <img 
                    src={imagePreview} 
                    className="max-w-full max-h-full w-full h-full object-contain rounded-lg"
                    alt="Preview"
                />
                <button 
                    onClick={handleClearImage} 
                    className="absolute top-1 right-1 bg-white/80 backdrop-blur-sm text-slate-500 rounded-full p-1.5 hover:text-red-500 transition-all nm-button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </>
        )}

        {isLoading && (
            <div role="status" className="text-center text-slate-400">
                <svg className="mx-auto h-5 w-5 animate-spin text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        )}
        
        {!imagePreview && !isLoading && (
            <div className="text-center text-slate-400 pointer-events-none p-1">
              <svg className="h-5 w-5 mx-auto mb-1 opacity-40" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4 4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <p className="font-bold text-[10px] uppercase tracking-tight">UPLOAD PHOTO</p>
              <p className="text-[8px] mt-0">Click or drop</p>
            </div>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />
    </>
  );
};

export default ImageUploader;