import React, { useRef, useState } from 'react';
import { Upload, X, Camera, Loader2 } from 'lucide-react';
import { validateImageFile, createPreviewUrl, formatFileSize } from '@/utils/fileUpload';

interface ImageUploadProps {
  value?: string | null;
  onChange: (file: File | null, preview: string | null) => void;
  onUpload?: (file: File) => Promise<string>;
  maxSizeMB?: number;
  className?: string;
  shape?: 'circle' | 'square';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  hint?: string;
}

const sizeClasses = {
  sm: 'w-20 h-20',
  md: 'w-32 h-32',
  lg: 'w-40 h-40',
  xl: 'w-48 h-48',
};

export default function ImageUpload({
  value,
  onChange,
  onUpload,
  maxSizeMB = 5,
  className = '',
  shape = 'circle',
  size = 'lg',
  label,
  hint,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);

    // Validate file
    const validation = validateImageFile(file, maxSizeMB);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // Create preview
    const previewUrl = createPreviewUrl(file);
    setPreview(previewUrl);

    // If upload handler provided, upload to server
    if (onUpload) {
      setIsUploading(true);
      try {
        const uploadedUrl = await onUpload(file);
        onChange(file, uploadedUrl);
      } catch (err) {
        setError('Upload failed. Please try again.');
        setPreview(null);
      } finally {
        setIsUploading(false);
      }
    } else {
      onChange(file, previewUrl);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null, null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          ${sizeClasses[size]}
          ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}
          relative cursor-pointer overflow-hidden
          border-2 border-dashed
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
          ${error ? 'border-red-500' : ''}
          transition-all duration-200
          group
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleChange}
          className="hidden"
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClick}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Camera className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>

            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            {isUploading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-xs text-center px-2">
                  Click or drag image
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {hint && !error && (
        <p className="text-xs text-gray-500 mt-2">{hint}</p>
      )}

      {error && (
        <p className="text-xs text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
}