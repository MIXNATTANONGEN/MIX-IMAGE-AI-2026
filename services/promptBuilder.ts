
import type { Gender, SelectedStyles, AspectRatio } from '../types';

interface BuildIdPhotoPromptArgs {
    gender: Gender;
    selections: SelectedStyles;
    details: string;
    hasFaceImage: boolean;
    hasOutfitImage: boolean;
    aspectRatio: AspectRatio;
    isHalfBody?: boolean;
}

// Implements "Mode 2: Style Transfer" + V4 Upgrade
export function buildIdPhotoPrompt({
    gender,
    selections,
    details,
    hasOutfitImage,
    aspectRatio,
    isHalfBody = false,
}: BuildIdPhotoPromptArgs): string {
    
    // 1. Subject Description (Layer 1) - Enforce framing here
    const framingDesc = isHalfBody
        ? "Framing: Half-body Portrait. Visible from belt/waist line up to head. (Generate body/torso if missing in source)."
        : "Framing: Professional ID Photo. Visible from chest/shoulders up to head. (Generate shoulders if missing).";

    const subjectDesc = `Portrait of a ${gender === 'ชาย' ? 'male' : 'female'} subject. ${framingDesc}`;

    // Updated Identity Rule with Strict Corrections
    const identityRule = `CRITICAL: Maintain Consistent Identity. Use the facial features (eyes, nose, mouth, face shape) from the reference image 100%. 
    CORRECTION: If source image has tilted head, generate perfectly straight/upright head. 
    EXPRESSION: If source image shows teeth, generate a closed-mouth smile (no teeth visible).`;

    // 2. Environment/Background (Layer 2)
    const bgPrompt = selections.background 
        ? `[Background]: ${selections.background}` 
        : `[Background]: Professional studio backdrop, neutral tone.`;

    // 3. Art Style/Medium (Layer 2) - V4 AUTOMATIC INJECTION
    const stylePrompt = `[Art Style]: Photorealistic photography, 8k resolution, sharp focus, high fidelity, Masterpiece, Award-winning photography.`;

    // 4. Lighting/Atmosphere (Layer 3) - V4 AUTOMATIC INJECTION
    const baseLighting = 'Cinematic Lighting, Softbox, even illumination, volumetric lighting, global illumination';
    const lightingPrompts = selections.lighting && selections.lighting.length > 0
        ? `${baseLighting}, ${selections.lighting.join(', ')}`
        : baseLighting;
    const lightingSection = `[Lighting]: ${lightingPrompts}.`;

    // 5. Camera/Composition (Layer 4)
    const cameraPrompt = `[Camera]: 85mm portrait lens, f/1.8 aperture, depth of field. Pose: Straight-on, looking directly at camera (Face Correction applied).`;

    // 6. Details (Layer 5 - Clothing & Hair)
    let clothingSection = "";
    if (hasOutfitImage) {
        clothingSection = `[Clothing]: Use the outfit from the reference image exactly. Fit naturally to the subject's body.`;
    } else if (selections.clothes) {
        let clothes = selections.clothes;
        if (clothes.includes('{color}')) {
             clothes = clothes.replace('{color}', selections.clothes_color || 'polite color');
        }
        clothingSection = `[Clothing]: ${clothes}. Ensure correct anatomy of collar and shoulders.`;
    }

    let hairSection = "";
    if (selections.hairstyle) hairSection += `[Hair]: ${selections.hairstyle}. `;
    if (selections.hair_color) hairSection += `[Hair Color]: ${selections.hair_color}.`;

    // Special Instructions / Retouching
    const retouching = selections.retouching ? selections.retouching.join(', ') : "";
    const extraDetails = details ? `User specific instruction: "${details}" (Integrate naturally).` : "";

    // Construct final prompt structure based on Mode 2
    return `
Task: "Apply the subject's facial features to a new style/context."
Structure:
${subjectDesc}
${identityRule}
${clothingSection}
${hairSection}
${bgPrompt}
${stylePrompt}
${lightingSection}
${cameraPrompt}
${retouching}
${extraDetails}
Output Ratio: ${aspectRatio}
    `.trim();
}

// Implements "Mode 1: Re-Creation" from PDF (for Restoration)
export function buildRestorePrompt(): string {
    return `
Task: "Reverse Engineer this image into a high-fidelity prompt for Restoration."
Instructions:
1. Analyze the image using the 5-Layer Framework.
2. Goal: Restore image quality to original condition.
[Action]: Repair scratches, tears, and creases.
[Color]: Restore faded colors to natural vibrancy (Color Restoration).
[Quality]: Reduce noise and grain. sharpen details. 8K Resolution. Cinematic Lighting.
[Identity]: Maintain 100% original facial features and composition.
Result: A clean, high-resolution version of the original photo.
    `.trim();
}

interface BuildMemorialPromptArgs {
    gender: Gender;
    outfitPrompt: string | null;
    backgroundPrompt: string;
    hasOutfitImage: boolean;
}

// Implements "Mode 2: Style Transfer" adapted for Memorial
export function buildMemorialPrompt({ gender, outfitPrompt, backgroundPrompt, hasOutfitImage }: BuildMemorialPromptArgs): string {
    const clothingInstruction = hasOutfitImage
        ? `[Clothing]: Use the outfit from the second reference image.`
        : `[Clothing]: ${outfitPrompt}`;

    return `
Task: "Create a Memorial Portrait (Funeral Photo) with high dignity."
Subject: ${gender === 'ชาย' ? 'Male' : 'Female'} subject.
[Identity]: Strictly maintain facial features from reference. Expression: Calm, peaceful, slight smile.
[Correction]: Ensure head is straight and mouth is closed (no teeth).
${clothingInstruction}
[Background]: ${backgroundPrompt}.
[Style]: Traditional Memorial Portrait, soft lighting, respectful atmosphere, 8k resolution, Photorealistic.
[Pose]: Straight-on (Face correction applied), looking at camera.
[Quality]: High resolution, smooth skin texture, clear eyes.
    `.trim();
}

interface BuildEnhancePromptArgs {
    isNightMode: boolean;
}

export function buildEnhancePrompt({ isNightMode }: BuildEnhancePromptArgs): string {
    const nightModeInstruction = isNightMode 
        ? `[Special Instruction]: Transform into Night Mode. 
           - Lighting: Cinematic Moon lighting, street lights, neon glow.
           - Tone: Cool, dark, cinematic blue/teal shadows.
           - Shadows: Deep, dramatic contrast.`
        : `[Special Instruction]: Enhance daylight/standard lighting quality, Cinematic lighting.`;

    return `
Task: "Upscale and Enhance Image Quality."
instructions:
1. Upscale resolution to 4K/8K equivalent.
2. [Details]: Sharpen textures (skin, fabric, background).
3. [Repair]: Fix any artifacts, noise, or blur.
${nightModeInstruction}
4. Keep original composition and identity 100%.
    `.trim();
}

// Implements "Mode 3: Image Editor" logic hook
export function buildEditorPrompt(details: string): string {
    return `
Task: "Edit specific elements of the image based on user command."
User Command: "${details}"
Instructions:
- Identify specific region/object to change.
- Maintain original style/lighting elsewhere.
- Execute change seamlessly with high fidelity (8K Resolution, Cinematic Lighting).
    `.trim();
}
