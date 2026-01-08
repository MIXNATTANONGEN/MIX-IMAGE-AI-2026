
import type { AspectRatio } from '../types';

function getAspectRatioValue(ratio: AspectRatio): number {
    switch (ratio) {
        case '1:1': return 1;
        case '2:3': return 2 / 3;
        case '3:2': return 3 / 2;
        case '3:4': return 3 / 4;
        case '4:3': return 4 / 3;
        case '9:16': return 9 / 16;
        case '16:9': return 16 / 9;
        case '21:9': return 21 / 9;
        default: return 1;
    }
}

/**
 * Resizes an image to a specific aspect ratio by center-cropping the source image
 * and scaling the result to fill the target dimensions.
 * @param base64Image The source image as a base64 data URL.
 * @param targetRatio The desired aspect ratio.
 * @returns A promise that resolves with the new image as a base64 data URL.
 */
export function resizeImageToAspectRatio(
    base64Image: string, 
    targetRatio: AspectRatio
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error("Could not get canvas context"));
            }

            const targetAspectRatioValue = getAspectRatioValue(targetRatio);
            
            // Use a consistent, high-resolution base width for the canvas.
            const targetWidth = 1024;
            const targetHeight = Math.round(targetWidth / targetAspectRatioValue);

            canvas.width = targetWidth;
            canvas.height = targetHeight;
            
            const imgAspectRatio = img.width / img.height;
            
            let sWidth = img.width;
            let sHeight = img.height;
            let sx = 0;
            let sy = 0;

            // Logic to calculate the source rectangle for center-cropping
            if (imgAspectRatio > targetAspectRatioValue) {
                // Image is wider than target, crop the sides
                sWidth = img.height * targetAspectRatioValue;
                sx = (img.width - sWidth) / 2;
            } else if (imgAspectRatio < targetAspectRatioValue) {
                // Image is taller than target, crop the top and bottom
                sHeight = img.width / targetAspectRatioValue;
                sy = (img.height - sHeight) / 2;
            }
            
            ctx.drawImage(
                img,
                sx,
                sy,
                sWidth,
                sHeight,
                0,
                0,
                targetWidth,
                targetHeight
            );

            // Resolve with the new image as a JPEG data URL for efficiency.
            resolve(canvas.toDataURL('image/jpeg', 0.95)); 
        };
        img.onerror = () => {
            reject(new Error("Failed to load image for resizing."));
        };
        img.src = base64Image;
    });
}
