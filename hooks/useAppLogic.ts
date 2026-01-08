
import { useState, useCallback, useEffect } from 'react';
import type { Gender, SelectedStyles, AspectRatio, ImageSize, SavedPreset, OperatingMode, RepairSubMode, SavedClothing, Style, StyleCategory } from '../types';
import { 
    generateEditedImage, 
    analyzeGenderFromImage, 
    analyzeImage, 
    enhanceEditPrompt,
    draftPromptWithAI 
} from '../services/gemini';
import { resizeImageToAspectRatio } from '../services/imageUtils';
import { storage } from '../services/storage';

export const useAppLogic = () => {
  // State
  const [activeMode, setActiveMode] = useState<OperatingMode>('studio');
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number>(0);
  const [isHowAiWorksModalOpen, setIsHowAiWorksModalOpen] = useState(false);

  const [isPromptReady, setIsPromptReady] = useState<boolean>(false);
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const [isPhotoshopConfirmed, setIsPhotoshopConfirmed] = useState<boolean>(false);

  const [outfitImagePreview, setOutfitImagePreview] = useState<string | null>(null);
  const [analyzedGender, setAnalyzedGender] = useState<Gender | null>(null);
  const [isAnalyzingGender, setIsAnalyzingGender] = useState<boolean>(false);
  const [genderAnalysisError, setGenderAnalysisError] = useState<string | null>(null);
  
  const [selectedStyles, setSelectedStyles] = useState<SelectedStyles>({ retouching: [], lighting: [] });
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [useThinking, setUseThinking] = useState<boolean>(false);
  const [details, setDetails] = useState<string>('');
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);
  const [savedClothes, setSavedClothes] = useState<SavedClothing[]>([]);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);
  
  const [repairSubMode, setRepairSubMode] = useState<RepairSubMode>('selection');
  const [memorialOutfit, setMemorialOutfit] = useState<string | null>(null);
  const [memorialBackground, setMemorialBackground] = useState<string | null>(null);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  
  const [editorPrompt, setEditorPrompt] = useState<string>('');
  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);
  const [isProcessingEnhancement, setIsProcessingEnhancement] = useState(false);
  const [editorReferenceImages, setEditorReferenceImages] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  // Effects
  useEffect(() => {
    // Load data from storage service
    setSavedPresets(storage.getPresets());
    setSavedClothes(storage.getClothes());
  }, []);

  useEffect(() => {
    if (retryAfter > 0) {
      const timer = setInterval(() => setRetryAfter((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [retryAfter]);
  
  useEffect(() => {
    setPrimaryImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setError(null);
    setRetryAfter(0);
    setAnalyzedGender(null);
    setIsPromptReady(false); 
    setIsPhotoshopConfirmed(false); 
    setOutfitImagePreview(null);
    setGenderAnalysisError(null);
    setIsLoading(false);
    setRepairSubMode('selection');
    setMemorialOutfit(null);
    setMemorialBackground(null);
    setIsNightMode(false);
    setEditorPrompt('');
    setEditorReferenceImages([]);
  }, [activeMode]);

  useEffect(() => {
    if ((primaryImage || (activeMode === 'editor' && editorReferenceImages.length > 0)) && isPromptReady) {
        setIsPromptReady(false);
    }
  }, [selectedStyles, details, outfitImagePreview, repairSubMode, memorialOutfit, memorialBackground, editorPrompt, aspectRatio, imageSize, useThinking, primaryImage, editorReferenceImages, activeMode]);

  // Error Handler Helper
  const getFriendlyErrorMessage = (error: any) => {
    const defaultMessage = "เกิดข้อผิดพลาดที่ไม่คาดคิดระหว่างการสร้างภาพ กรุณาลองใหม่อีกครั้งค่ะ";
    if (!error) return { message: defaultMessage };
    const errorMessage = String(error.message || error);
    const lowerCaseErrorMessage = errorMessage.toLowerCase();
    
    // Check for API Key issues
    if (lowerCaseErrorMessage.includes('requested entity was not found') || lowerCaseErrorMessage.includes('api key not valid')) {
        return { message: "API Key ไม่ถูกต้องหรือโปรเจกต์ไม่พบ กรุณาเลือก API Key ใหม่ค่ะ", shouldResetKey: true };
    }
    // Resource Exhausted
    if (lowerCaseErrorMessage.includes('resource_exhausted') || lowerCaseErrorMessage.includes('429')) {
        return { message: "โควต้าเต็มชั่วคราว กรุณารอสักครู่แล้วลองใหม่", retryAfter: 60 };
    }
    // Safety
    if (lowerCaseErrorMessage.includes('safety') || lowerCaseErrorMessage.includes('blocked')) {
        return { message: "AI ปฏิเสธการสร้างภาพเนื่องจากนโยบายความปลอดภัย" };
    }
    return { message: errorMessage || defaultMessage };
  };

  // Handlers
  const handlePrimaryImageSelect = useCallback(async (imageData: string | null) => {
    setPrimaryImage(imageData);
    setGeneratedImage(null);
    setError(null);
    setGenderAnalysisError(null);
    setPrompt('');
    setIsPromptReady(false);
    setIsPhotoshopConfirmed(false); 
    
    if (activeMode === 'studio' || activeMode === 'headshot' || activeMode === 'repair') {
        setAnalyzedGender(null);
        setSelectedStyles(prev => ({...prev, clothes: undefined, hairstyle: undefined}));
        if (!imageData) return;

        setIsAnalyzingGender(true);
        try {
            const gender = await analyzeGenderFromImage(imageData);
            setAnalyzedGender(gender);
        } catch (err: any) {
            const { message } = getFriendlyErrorMessage(err);
            setGenderAnalysisError(`ไม่สามารถวิเคราะห์เพศได้: ${message}`);
        } finally {
            setIsAnalyzingGender(false);
        }
    }
  }, [activeMode]);

  const handleOutfitImageUpload = useCallback((imageData: string | null) => {
    setOutfitImagePreview(imageData);
    setPrompt('');
    setIsPromptReady(false);
    if (activeMode === 'studio') {
        setSelectedStyles(prev => {
          const { clothes, ...rest } = prev;
          return rest;
        });
    }
    if (activeMode === 'repair' && repairSubMode === 'memorial') {
        setMemorialOutfit(null);
    }
  }, [activeMode, repairSubMode]);

  const handleStyleSelect = useCallback((category: StyleCategory, value: string, payload?: any) => {
    if (category === 'saved') {
        setSelectedStyles(payload as SelectedStyles);
        setGeneratedImage(null);
        setError(null);
        setRetryAfter(0);
        return;
    }

    setSelectedStyles(prev => {
      const newStyles = { ...prev };
      switch (category) {
        case 'retouching':
        case 'lighting': {
          const currentSelection = newStyles[category] || [];
          if (currentSelection.includes(value)) {
            newStyles[category] = currentSelection.filter(p => p !== value);
          } else {
            newStyles[category] = [...currentSelection, value];
          }
          break;
        }
        case 'clothes_color': {
            if (newStyles.clothes_color === value) delete newStyles.clothes_color;
            else newStyles.clothes_color = value;
            break;
        }
        case 'clothes':
        case 'background':
        case 'hair_color':
        case 'hairstyle':
        case 'pose': {
          if (newStyles[category] === value) {
            delete newStyles[category];
            if (category === 'clothes') delete newStyles.clothes_color;
          } else {
            newStyles[category] = value;
            if (category === 'clothes') delete newStyles.clothes_color;
          }
          break;
        }
      }
      return newStyles;
    });
  }, []);

  const handleSaveStyle = useCallback(() => {
    const name = window.prompt("ตั้งชื่อสไตล์ที่บันทึก:");
    if (name && name.trim()) {
        const newPreset = { name: name.trim(), styles: selectedStyles };
        const updatedPresets = [...savedPresets, newPreset];
        setSavedPresets(updatedPresets);
        try {
            storage.savePresets(updatedPresets);
            setSaveNotification('บันทึกสไตล์สำเร็จ!');
            setTimeout(() => setSaveNotification(null), 3000);
        } catch (e) {
             setError("ไม่สามารถบันทึกสไตล์ได้ พื้นที่จัดเก็บอาจเต็ม");
        }
    }
  }, [selectedStyles, savedPresets]);

  const handleDeletePreset = useCallback((presetName: string) => {
    const updatedPresets = savedPresets.filter(p => p.name !== presetName);
    setSavedPresets(updatedPresets);
    try {
        storage.savePresets(updatedPresets);
    } catch (e) {
        setError("ไม่สามารถลบสไตล์ได้");
    }
  }, [savedPresets]);

  const handleToggleSavedClothing = useCallback((clothingStyle: Style, gender: Gender) => {
    setSavedClothes(prev => {
        const isSaved = prev.some(item => item.prompt === clothingStyle.prompt && item.gender === gender);
        let updatedClothes;
        if (isSaved) {
            updatedClothes = prev.filter(item => !(item.prompt === clothingStyle.prompt && item.gender === gender));
        } else {
            updatedClothes = [...prev, { ...clothingStyle, gender }];
        }
        try {
            storage.saveClothes(updatedClothes);
        } catch (e) {
             setError("ไม่สามารถบันทึกเสื้อผ้าได้ พื้นที่จัดเก็บอาจเต็ม");
        }
        return updatedClothes;
    });
  }, []);

  const handleAnalyzeAndDraft = useCallback(async () => {
    const hasAnyImage = !!primaryImage || (activeMode === 'editor' && editorReferenceImages.length > 0);

    if (!hasAnyImage) {
        setError("กรุณาอัปโหลดรูปภาพก่อนครับ (สำหรับโหมดแก้ไข สามารถใช้รูปภาพอ้างอิงได้)");
        return;
    }
    
    setIsDrafting(true);
    setError(null);
    setPrompt('');

    const currentStyles = { ...selectedStyles };
    if (activeMode === 'repair' && repairSubMode === 'memorial') {
        if (memorialOutfit) currentStyles.clothes = memorialOutfit;
        if (memorialBackground) currentStyles.background = memorialBackground;
    }
    
    let currentDetails = details;
    if (activeMode === 'editor') {
        if (!editorPrompt) {
             setError("กรุณาระบุคำสั่งแก้ไขภาพในช่องข้อความครับ");
             setIsDrafting(false);
             return;
        }
        let refMsg = "";
        if (editorReferenceImages.length > 0) {
            refMsg = ` [User provided ${editorReferenceImages.length} reference images.]`;
        }
        currentDetails = editorPrompt + refMsg;
    }

    try {
        const aiPrompt = await draftPromptWithAI(
            primaryImage,
            activeMode,
            repairSubMode,
            analyzedGender,
            currentStyles,
            currentDetails,
            outfitImagePreview,
            aspectRatio,
            editorReferenceImages,
            useThinking
        );
        setPrompt(aiPrompt);
        setIsPromptReady(true);
    } catch (e: any) {
        const { message, shouldResetKey } = getFriendlyErrorMessage(e);
        setError(`การเขียนพรอมต์ล้มเหลว: ${message}`);
        if (shouldResetKey && window.aistudio) {
            window.aistudio.openSelectKey().catch(console.error);
        }
    } finally {
        setIsDrafting(false);
    }
  }, [primaryImage, activeMode, repairSubMode, analyzedGender, selectedStyles, details, outfitImagePreview, aspectRatio, useThinking, memorialOutfit, memorialBackground, editorPrompt, editorReferenceImages]);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt || !isPromptReady) return;
    if (activeMode !== 'editor' && !primaryImage) return;
    if (activeMode === 'editor' && !primaryImage && editorReferenceImages.length === 0) {
        setError("กรุณาอัปโหลดรูปภาพหลักหรือรูปภาพอ้างอิงอย่างน้อย 1 รูปครับ");
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
        let processedImage: string | null = null;
        if (primaryImage) {
            processedImage = await resizeImageToAspectRatio(primaryImage, aspectRatio);
        }

        let resultImage: string;
        const finalPrompt = prompt; 

        if (activeMode === 'studio' || activeMode === 'headshot') {
             const outfitForGen = activeMode === 'studio' ? outfitImagePreview : null;
             if (!processedImage) throw new Error("Missing primary image");
             resultImage = await generateEditedImage(finalPrompt, processedImage, outfitForGen, activeMode, [], aspectRatio, imageSize);
        } else if (activeMode === 'editor') {
             resultImage = await generateEditedImage(finalPrompt, processedImage, null, activeMode, editorReferenceImages, aspectRatio, imageSize);
        } else {
             const outfitForRepair = (repairSubMode === 'memorial' && outfitImagePreview) ? outfitImagePreview : null;
             if (!processedImage) throw new Error("Missing primary image");
             resultImage = await generateEditedImage(finalPrompt, processedImage, outfitForRepair, activeMode, [], aspectRatio, imageSize);
        }

        setGeneratedImage(resultImage);
        setHistory(prev => [resultImage, ...prev].slice(0, 5));
    } catch (e: any) {
        const { message, retryAfter: delay, shouldResetKey } = getFriendlyErrorMessage(e);
        setError(message);
        if (delay) setRetryAfter(delay);
        if (shouldResetKey && window.aistudio) {
            window.aistudio.openSelectKey().catch(console.error);
        }
    } finally {
        setIsLoading(false);
    }
  }, [prompt, isPromptReady, activeMode, primaryImage, aspectRatio, imageSize, outfitImagePreview, repairSubMode, editorReferenceImages]);

  const handleAnalyzeImage = useCallback(async () => {
    const hasAnyImage = !!primaryImage || (activeMode === 'editor' && editorReferenceImages.length > 0);
    if (!hasAnyImage) {
        setError("กรุณาอัปโหลดรูปภาพเพื่อวิเคราะห์");
        return;
    }
    setIsProcessingAnalysis(true);
    setError(null);
    try {
        const description = await analyzeImage(primaryImage, editorReferenceImages, useThinking);
        setEditorPrompt(description);
    } catch (e) {
        const { message, shouldResetKey } = getFriendlyErrorMessage(e);
        setError(`การวิเคราะห์ภาพล้มเหลว: ${message}`);
        if (shouldResetKey && window.aistudio) {
            window.aistudio.openSelectKey().catch(console.error);
        }
    } finally {
        setIsProcessingAnalysis(false);
    }
  }, [primaryImage, activeMode, editorReferenceImages, useThinking]);

  const handleEnhancePrompt = useCallback(async () => {
      if (!editorPrompt) {
          setError("กรุณาใส่พรอมต์เพื่อปรับปรุง");
          return;
      }
      setIsProcessingEnhancement(true);
      setError(null);
      try {
          const enhanced = await enhanceEditPrompt(editorPrompt);
          setEditorPrompt(enhanced);
      } catch (e) {
          const { message, shouldResetKey } = getFriendlyErrorMessage(e);
          setError(`การปรับปรุงพรอมต์ล้มเหลว: ${message}`);
          if (shouldResetKey && window.aistudio) {
             window.aistudio.openSelectKey().catch(console.error);
          }
      } finally {
          setIsProcessingEnhancement(false);
      }
  }, [editorPrompt]);

  const handleAddReferenceImage = useCallback((img: string) => {
    setEditorReferenceImages(prev => [...prev, img]);
  }, []);

  const handleRemoveReferenceImage = useCallback((index: number) => {
    setEditorReferenceImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    state: {
        activeMode, primaryImage, generatedImage, prompt, isLoading, error, retryAfter, isHowAiWorksModalOpen,
        isPromptReady, isDrafting, isPhotoshopConfirmed, outfitImagePreview, analyzedGender, isAnalyzingGender,
        genderAnalysisError, selectedStyles, aspectRatio, imageSize, useThinking, details, savedPresets, savedClothes, saveNotification,
        repairSubMode, memorialOutfit, memorialBackground, isNightMode, editorPrompt, isProcessingAnalysis,
        isProcessingEnhancement, editorReferenceImages, history
    },
    setters: {
        setActiveMode, setPrimaryImage, setGeneratedImage, setPrompt, setIsHowAiWorksModalOpen, setIsPhotoshopConfirmed,
        setAspectRatio, setImageSize, setUseThinking, setDetails, setRepairSubMode, setMemorialOutfit, setMemorialBackground, setIsNightMode,
        setEditorPrompt, setOutfitImagePreview
    },
    handlers: {
        handlePrimaryImageSelect, handleOutfitImageUpload, handleStyleSelect, handleSaveStyle, handleDeletePreset,
        handleToggleSavedClothing, handleAnalyzeAndDraft, handleGenerateImage, handleAnalyzeImage, handleEnhancePrompt,
        handleAddReferenceImage, handleRemoveReferenceImage
    }
  };
};
