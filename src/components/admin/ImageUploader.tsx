import React, { useState, useRef } from 'react';
import { Upload, X, Star, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { uploadProductImage } from '../../firebase/storage';

interface ImageUploaderProps {
  images: string[];
  primaryImage: string;
  slug: string;
  onChange: (images: string[], primaryImage: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  primaryImage,
  slug,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(`Optimizing and uploading ${files.length} image(s)...`);

    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}...`);
      try {
        const downloadUrl = await uploadProductImage(file, slug || 'jewellery');
        newUrls.push(downloadUrl);
      } catch (err) {
        console.error('Failed to upload image:', file.name, err);
      }
    }

    const updatedImages = [...images, ...newUrls];
    const newPrimary = primaryImage || updatedImages[0] || '';

    onChange(updatedImages, newPrimary);
    setIsUploading(false);
    setUploadProgress('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const removedUrl = images[indexToRemove];
    const updated = images.filter((_, idx) => idx !== indexToRemove);

    let newPrimary = primaryImage;
    if (primaryImage === removedUrl) {
      newPrimary = updated[0] || '';
    }

    onChange(updated, newPrimary);
  };

  const handleSetPrimary = (url: string) => {
    onChange(images, url);
  };

  const handleAddSampleImage = (sampleUrl: string) => {
    const updated = [...images, sampleUrl];
    const newPrimary = primaryImage || sampleUrl;
    onChange(updated, newPrimary);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider">
            Product Images & Gallery (Firebase Storage)
          </label>
          <p className="text-xs text-[#786D60] mt-0.5">
            Auto-compressed to WebP format. Click the star icon to set primary thumbnail.
          </p>
        </div>

        {/* Quick Sample Jewellery Assets */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-[#8C8072]">Add Demo Image:</span>
          <button
            type="button"
            onClick={() => handleAddSampleImage('https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1000&q=85')}
            className="px-2 py-0.5 rounded bg-[#F0EAE0] hover:bg-[#E2D8C6] text-[10px] font-semibold text-[#5A4F42]"
          >
            + Gold Mangalsutra
          </button>
          <button
            type="button"
            onClick={() => handleAddSampleImage('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85')}
            className="px-2 py-0.5 rounded bg-[#F0EAE0] hover:bg-[#E2D8C6] text-[10px] font-semibold text-[#5A4F42]"
          >
            + Kundan Choker
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#D4C7B2] hover:border-[#BA9541] bg-[#FAF6EE] hover:bg-[#F6EEDC] p-6 sm:p-8 rounded-2xl text-center cursor-pointer transition-all group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFilesSelected}
          multiple
          accept="image/*"
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 text-[#BA9541] animate-spin" />
            <p className="text-xs font-semibold text-[#1E1A17]">{uploadProgress}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center text-[#BA9541] group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#1E1A17]">
              Click to browse or drag & drop high-resolution jewellery photos
            </p>
            <p className="text-[11px] text-[#786D60]">
              Supports JPG, PNG, WebP up to 10MB each
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
          {images.map((imgUrl, idx) => {
            const isPrimary = (primaryImage || images[0]) === imgUrl;
            return (
              <div
                key={idx}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-white group shadow-sm ${
                  isPrimary ? 'border-[#BA9541] ring-2 ring-[#BA9541]/30' : 'border-[#E5DDD0]'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Product ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                />

                {/* Primary Tag */}
                {isPrimary && (
                  <span className="absolute top-2 left-2 bg-[#BA9541] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow uppercase">
                    Primary
                  </span>
                )}

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetPrimary(imgUrl);
                      }}
                      className="p-1.5 rounded-full bg-white text-[#BA9541] hover:bg-[#FAF3E0] shadow"
                      title="Set as primary image"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
                    className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
