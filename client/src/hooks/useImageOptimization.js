import { useState, useEffect, useCallback } from 'react';

export const useImageOptimization = (initialSrc, options = {}) => {
  const {
    quality = 0.7,
    maxWidth = 1200,
    format = 'webp',
  } = options;

  const [optimizedSrc, setOptimizedSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const optimizeImage = useCallback(async (src) => {
    if (!src) {
      setError('No source provided');
      setLoading(false);
      return;
    }

    try {
      // For URLs that might have CORS issues, return the original
      if (src.startsWith('http') && !src.includes(window.location.hostname)) {
        setOptimizedSrc(src);
        setLoading(false);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      const imageLoaded = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });

      await imageLoaded;

      // Only optimize if the image is larger than maxWidth
      if (img.width <= maxWidth) {
        setOptimizedSrc(src);
        setLoading(false);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate new dimensions
      const ratio = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const optimized = canvas.toDataURL(`image/${format}`, quality);
      setOptimizedSrc(optimized);
      setLoading(false);

      // Cleanup
      canvas.remove();
    } catch (err) {
      console.warn('Image optimization skipped:', err);
      setOptimizedSrc(src); // Fallback to original
      setLoading(false);
    }
  }, [quality, maxWidth, format]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    optimizeImage(initialSrc);

    return () => {
      if (optimizedSrc?.startsWith('blob:')) {
        URL.revokeObjectURL(optimizedSrc);
      }
    };
  }, [initialSrc, optimizeImage]);

  return {
    src: optimizedSrc || initialSrc,
    loading,
    error
  };
};

// Usage example:
/*
const MyImage = ({ src, alt }) => {
  const { src: optimizedSrc, loading, error } = useImageOptimization(src, {
    quality: 0.8,
    maxWidth: 800,
    format: 'webp'
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading image</div>

  return <img src={optimizedSrc} alt={alt} />
}
*/