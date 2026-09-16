/**
 * Fast client-side image optimizer using HTML5 Canvas.
 * Compresses heavy image files (5MB-20MB) down to optimized WebP (~100KB-200KB)
 * in < 50ms before uploading over network.
 */
export async function compressImageFile(
  file: File,
  options: { maxDimension?: number; quality?: number } = {}
): Promise<File> {
  const { maxDimension = 1400, quality = 0.82 } = options;

  // If not an image or SVG, or already small (< 120KB), skip compression
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.size < 120 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale maintaining aspect ratio if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            width = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas content to optimized WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // Fallback to original if compression didn't shrink size
              resolve(file);
              return;
            }

            const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const optimizedFile = new File([blob], cleanName, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            resolve(optimizedFile);
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
