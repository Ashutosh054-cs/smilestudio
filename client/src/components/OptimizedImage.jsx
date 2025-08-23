import React from 'react';

const OptimizedImage = ({ src, alt, className }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  // Remove optimization for Supabase URLs to avoid CORS issues
  const isSupabaseUrl = src?.includes('supabase');

  return (
    <div className={`relative ${className} ${loading ? 'bg-gray-100' : ''}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 
          ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-sm text-gray-500">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;