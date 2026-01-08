
import { GoogleGenAI, Modality, Type, Schema } from '@google/genai';
import type { Gender, SelectedStyles, AspectRatio, OperatingMode, RepairSubMode, ImageSize } from '../types';

function dataUrlToPart(dataUrl: string) {
    const [meta, data] = dataUrl.split(',');
    const mimeType = meta.match(/:(.*?);/)?.[1];
    if (!mimeType || !data) {
        throw new Error('Invalid data URL for conversion');
    }
    return {
        inlineData: {
            mimeType,
            data
        }
    };
}

const PROMPT_PACK_SYSTEM_INSTRUCTION = `You are "Prompt Generator for Portrait Enhancement".
Your goal is to generate a high-quality, English "positive_prompt" for an image generation model based on the user's request.

CRITICAL RULES (STRICT ENFORCEMENT):
1. IDENTITY LOCK: Strictly "maintain same person, same age, same facial proportions, no face reshape". 
2. SKIN TEXTURE: Enforce "natural skin texture with pores visible, healthy glow". Ban "plastic skin", "beauty filter", "unrealistic smoothing".
3. HAIR: Keep selected hairstyle exactly. If specific hair selected (e.g. bun), force it. If not, "no bun if not specified". "No different hairstyle".
4. CLOTHING: "crisp collar, no insignia (unless specified), no patterns, no blurred buttons". "Neutral light blue collared shirt" or as specified.
5. BACKGROUND: Use specific tone (e.g. "plain pastel light blue", "studio grey gradient"). Ban "plain white" if color selected. Ban "shadows", "textures" for ID photos.
6. POSE: "professional ID photo, straight posture, neutral expression, head straight, eyes parallel to horizon". Ban "tilted head", "teeth visible".
7. CROPPING:
   - If ID_PHOTO (3:4): "chest-up portrait framed from mid-chest to head".
   - If HALF_BODY: "half-body portrait framed from waist up, a little space above the head".

Return ONLY the raw English prompt text.`;

const NEGATIVE_CONSTRAINTS = `Negative constraints: face reshape, different person, aging, face slimming, plastic skin, beauty filter, over-smooth, blurry details, blurred collar, distorted anatomy, extra fingers, warped ears, asymmetrical eyes, cartoon, illustration, lowres, blur, noise, harsh shadows, heavy vignette, color cast, teeth visible, tilted head, cropping off top of head, full body, plain white background (unless requested).`;

export async function draftPromptWithAI(
    base64Image: string | null,
    mode: OperatingMode,
    subMode: RepairSubMode,
    gender: Gender | null,
    selectedStyles: SelectedStyles,
    details: string,
    outfitImage: string | null,
    aspectRatio: AspectRatio,
    referenceImages: string[] = [],
    useThinking: boolean = false
): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const parts: any[] = [];

    if (base64Image) parts.push(dataUrlToPart(base64Image));
    if (referenceImages && referenceImages.length > 0) {
        referenceImages.forEach((img) => parts.push(dataUrlToPart(img)));
    }

    let stylePreset = "CORPORATE_CLEAN"; 
    let croppingInstruction = "Standard framing";

    if (mode === 'studio') {
        if (aspectRatio === '3:4') {
            stylePreset = "ID_STANDARD"; 
            croppingInstruction = "Crop: Chest-up portrait, Standard ID Photo framing.";
        } else {
             stylePreset = "CORPORATE_CLEAN";
             croppingInstruction = "Crop: Standard portrait.";
        }
    } else if (mode === 'headshot') {
        stylePreset = "CORPORATE_CLEAN";
        croppingInstruction = "Crop: Half-body portrait framed from waist up, space above head.";
    } else if (mode === 'repair') {
        if (subMode === 'memorial') {
            stylePreset = "MEMORIAL";
            croppingInstruction = "Crop: Straight posture, chest-up.";
        }
        else stylePreset = "RESTORATION";
    } else if (mode === 'editor') {
        stylePreset = "CREATIVE_EDIT";
        croppingInstruction = "Crop: Maintain original composition.";
    }

    const userRequirements = `
    [JOB_BRIEF]
    - Job Type: ${mode.toUpperCase()}
    - Style Preset: ${stylePreset}
    - Gender: ${gender || 'Detect from image'}
    - Target Output: ${aspectRatio}
    - Cropping: ${croppingInstruction}
    - Outfit/Style: ${selectedStyles.clothes || 'Maintain original or use reference'}
    - Background: ${selectedStyles.background || 'Professional Studio'}
    - Extra Notes: "${details}"
    
    Instruction: Write the 'positive_prompt' following the CRITICAL RULES.
    `;

    parts.push({ text: userRequirements });

    if (outfitImage) {
        parts.push(dataUrlToPart(outfitImage));
        parts.push({ text: "Reference Outfit (Apply this clothing to subject):" });
    }

    try {
        const config: any = {
            systemInstruction: PROMPT_PACK_SYSTEM_INSTRUCTION,
            temperature: 0.7,
        };

        if (useThinking) {
            config.thinkingConfig = { thinkingBudget: 32768 };
        }

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', 
            contents: { parts },
            config
        });
        
        const generatedPrompt = response.text || "";
        return `${generatedPrompt.trim()} ${NEGATIVE_CONSTRAINTS}`;
    } catch (error) {
        console.error("Prompt drafting error:", error);
        throw error;
    }
}

export async function analyzeGenderFromImage(base64ImageData: string): Promise<Gender> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: {
                parts: [
                    dataUrlToPart(base64ImageData),
                    { text: "Identify gender: ชาย or หญิง. Return JSON: {\"gender\": \"ชาย\"}" }
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { gender: { type: Type.STRING, enum: ['ชาย', 'หญิง'] } },
                    required: ['gender']
                }
            }
        });
        const result = JSON.parse(response.text || "{}");
        return result.gender || 'ชาย';
    } catch (error) {
        console.error("Gender analysis error:", error);
        throw error;
    }
}

export async function generateEditedImage(
    prompt: string, 
    faceImage: string | null,
    outfitImage: string | null, 
    mode: OperatingMode = 'studio',
    referenceImages: string[] = [],
    aspectRatio?: AspectRatio,
    imageSize: ImageSize = '1K'
): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const parts: any[] = [];
    
    const enhancedPromptText = `High-fidelity, Photorealistic ${imageSize === '4K' ? '8K' : '4K'}. Cinematic Lighting. maintain same person, same age, facial proportions. straight posture. closed mouth. Prompt: ${prompt.replace(/`/g, '')}`;
    
    if (faceImage) parts.push(dataUrlToPart(faceImage));
    if (referenceImages) referenceImages.forEach(img => parts.push(dataUrlToPart(img)));
    if (outfitImage) parts.push(dataUrlToPart(outfitImage));
    parts.push({ text: enhancedPromptText });

    const model = 'gemini-3-pro-image-preview';
    try {
        const config: any = { 
            responseModalities: [Modality.IMAGE],
            imageConfig: {
                aspectRatio: aspectRatio || "1:1",
                imageSize: imageSize
            }
        };

        const response = await ai.models.generateContent({
            model, 
            contents: { parts },
            config
        });

        const candidate = response.candidates?.[0];
        const imagePart = candidate?.content?.parts?.find(p => p.inlineData && p.inlineData.mimeType.startsWith('image/'));

        if (imagePart?.inlineData) return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        if (candidate?.finishReason === 'SAFETY') throw new Error("SAFETY_BLOCK");
        
        throw new Error("NO_IMAGE_RETURNED");
    } catch (e: any) {
        // Fallback to flash-image if pro-image fails (except for safety)
        if (e.message.includes("SAFETY_BLOCK")) throw e;
        
        console.warn(`Fallback to Nano Banana due to:`, e.message);
        const fallbackAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const fallbackResponse = await fallbackAi.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts }
        });
        const fbCandidate = fallbackResponse.candidates?.[0];
        const fbImagePart = fbCandidate?.content?.parts?.find(p => p.inlineData && p.inlineData.mimeType.startsWith('image/'));
        if (fbImagePart?.inlineData) return `data:${fbImagePart.inlineData.mimeType};base64,${fbImagePart.inlineData.data}`;
        
        throw e;
    }
}

export async function analyzeImage(base64Image: string | null, referenceImages: string[] = [], useThinking: boolean = false): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const parts: any[] = [];
    if (base64Image) parts.push(dataUrlToPart(base64Image));
    referenceImages.forEach(img => parts.push(dataUrlToPart(img)));

    try {
        const config: any = {
            responseMimeType: "application/json",
            responseSchema: {
                 type: Type.OBJECT,
                 properties: { generated_prompt: { type: Type.STRING } }
            },
            temperature: 0.4 
        };

        if (useThinking) {
            config.thinkingConfig = { thinkingBudget: 32768 };
        }

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', 
            contents: { 
                parts: [...parts, { text: "Reverse engineer this into a high-fidelity prompt. Output JSON with 'generated_prompt'." }] 
            },
            config
        });
        const result = JSON.parse(response.text || "{}");
        return result.generated_prompt || "";
    } catch (e) {
        console.error("Image analysis error:", e);
        throw e;
    }
}

export async function enhanceEditPrompt(userPrompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: `Enhance this image editing command into a professional prompt: "${userPrompt}"`,
        config: {
            systemInstruction: "You are MixVision Pro. Improve editing prompts with high-fidelity terminology. Output ONLY the string.",
        }
    });
    return (response.text || "").trim().replace(/^"|"$/g, '');
}
