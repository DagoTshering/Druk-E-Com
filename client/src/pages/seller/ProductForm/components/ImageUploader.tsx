import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { ImageItem } from '../utils/types';

interface ImageUploaderProps {
  images: ImageItem[];
  onUpload: (files: File[]) => void;
  onRemove: (index: number) => void;
  maxImages?: number;
  label?: string;
}

export function ImageUploader({
  images,
  onUpload,
  onRemove,
  maxImages = 5,
  label,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    onUpload(Array.from(files));
    e.target.value = '';
  };

  const isUploading = images.some(img => img.isUploading);
  const completedImages = images.filter(img => !img.isUploading);
  const canAddMore = completedImages.length < maxImages;

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-warm-white font-body font-medium">{label}</span>
          <span className="text-warm-gray text-sm">{completedImages.length}/{maxImages}</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((image, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-lg overflow-hidden group bg-dark-base"
          >
            {image.isUploading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Spinner className="size-8 text-gold" />
              </div>
            ) : (
              <>
                <img
                  src={image.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="aspect-square rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 hover:border-gold hover:bg-gold/5 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <span className="text-warm-gray text-xs font-body">Uploading...</span>
            ) : (
              <>
                <Upload className="w-6 h-6 text-warm-gray" />
                <span className="text-warm-gray text-xs font-body">Upload</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
