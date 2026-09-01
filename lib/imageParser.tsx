export interface ParticleData {
  targetPositions: Float32Array;
  colors: Float32Array;
}

export const parseImageToParticles = (
  imageSrc: string,
  particleCount: number
): Promise<ParticleData> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      
      if (!ctx) return reject("Canvas context not supported");

      // Scale down to prevent memory crashes while processing 150k pixels
      const maxDim = 800; 
      const scale = Math.min(maxDim / img.width, maxDim / img.height);
      const width = Math.floor(img.width * scale);
      const height = Math.floor(img.height * scale);
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height).data;
      
      const targetPositions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      
      const step = Math.max(1, Math.floor(Math.sqrt((width * height) / particleCount)));
      let particleIndex = 0;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (particleIndex >= particleCount) break;

          const pixelIndex = (y * width + x) * 4;
          
          const r = imageData[pixelIndex] / 255;
          const g = imageData[pixelIndex + 1] / 255;
          const b = imageData[pixelIndex + 2] / 255;
          const a = imageData[pixelIndex + 3] / 255;

          // Skip transparent or pure black pixels to save GPU rendering power
          if (a < 0.1 || (r < 0.05 && g < 0.05 && b < 0.05)) continue;

          // Map 2D Canvas to 3D WebGL Space
          const webglX = ((x / width) - 0.5) * 10;
          const webglY = -((y / height) - 0.5) * (10 * (height / width)); 
          const webglZ = 0; 

          targetPositions[particleIndex * 3] = webglX;
          targetPositions[particleIndex * 3 + 1] = webglY;
          targetPositions[particleIndex * 3 + 2] = webglZ;

          colors[particleIndex * 3] = r;
          colors[particleIndex * 3 + 1] = g;
          colors[particleIndex * 3 + 2] = b;

          particleIndex++;
        }
      }

      resolve({ targetPositions, colors });
    };

    img.onerror = (err) => reject(err);
    img.src = imageSrc;
  });
};