import React, { useState, useRef } from 'react';
import { Upload, X, Star, Image as ImageIcon, Link as LinkIcon, Plus, Loader2, Check, AlertCircle, Layers } from 'lucide-react';
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
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // Image Link state
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkInput, setBulkInput] = useState('');

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

  const handleAddSingleUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setUrlError(null);
    const cleanUrl = urlInput.trim();

    if (!cleanUrl) {
      setUrlError('Please enter an image URL.');
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('data:image/')) {
      setUrlError('URL must start with http://, https:// or data:image/');
      return;
    }

    const updated = [...images, cleanUrl];
    const newPrimary = primaryImage || cleanUrl;
    onChange(updated, newPrimary);
    setUrlInput('');
  };

  const handleAddBulkUrls = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setUrlError(null);

    const validUrls = bulkInput
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:image/')));

    if (validUrls.length === 0) {
      setUrlError('No valid URLs found. Make sure URLs start with http:// or https://');
      return;
    }

    const updated = [...images, ...validUrls];
    const newPrimary = primaryImage || updated[0] || '';
    onChange(updated, newPrimary);
    setBulkInput('');
    setBulkMode(false);
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
      {/* Header with Option Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-[#E8E2D8]">
        <div>
          <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider">
            Product Images & Gallery
          </label>
          <p className="text-xs text-[#786D60] mt-0.5">
            Upload from device or paste direct image web links (Unsplash, Pinterest, CDN, Drive, etc.).
          </p>
        </div>

        {/* Input Method Toggle */}
        <div className="flex items-center bg-[#F0EAE0] p-1 rounded-xl border border-[#D9CFBE] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              inputMode === 'upload'
                ? 'bg-white text-[#1E1A17] shadow-xs'
                : 'text-[#786D60] hover:text-[#1E1A17]'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-[#BA9541]" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              inputMode === 'url'
                ? 'bg-white text-[#1E1A17] shadow-xs'
                : 'text-[#786D60] hover:text-[#1E1A17]'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-[#BA9541]" />
            <span>Paste Image Link</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Device File Upload Dropzone */}
      {inputMode === 'upload' && (
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
              <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-[#BA9541] group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#1E1A17]">
                Click to browse or drag & drop jewellery photos
              </p>
              <p className="text-[11px] text-[#786D60]">
                Supports JPG, PNG, WebP up to 10MB each (Stored on Firebase Storage)
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setInputMode('url');
                }}
                className="mt-1 text-xs text-[#BA9541] hover:underline font-semibold flex items-center gap-1 mx-auto"
              >
                <LinkIcon className="w-3 h-3" />
                <span>Or enter image URL link instead</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Direct Image URL Link Input */}
      {inputMode === 'url' && (
        <div className="bg-[#FAF8F5] border border-[#E0D7C9] rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FAF3E0] text-[#BA9541] flex items-center justify-center">
                <LinkIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#1E1A17]">
                {bulkMode ? 'Add Multiple Image URLs' : 'Add Image by Direct Web Link'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setBulkMode(!bulkMode);
                setUrlError(null);
              }}
              className="text-[11px] font-semibold text-[#BA9541] hover:underline flex items-center gap-1"
            >
              <Layers className="w-3 h-3" />
              <span>{bulkMode ? 'Switch to Single URL' : '+ Paste Multiple URLs'}</span>
            </button>
          </div>

          {urlError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{urlError}</span>
            </div>
          )}

          {!bulkMode ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <ImageIcon className="w-4 h-4 text-[#8C7F70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setUrlError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSingleUrl();
                    }
                  }}
                  placeholder="https://images.unsplash.com/... or https://example.com/jewellery.jpg"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-xs text-[#1E1A17] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleAddSingleUrl()}
                className="bg-[#1E1A17] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>Add Image Link</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                rows={3}
                value={bulkInput}
                onChange={(e) => {
                  setBulkInput(e.target.value);
                  setUrlError(null);
                }}
                placeholder="Paste one image URL per line or separated by commas:&#10;https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                className="w-full p-3 bg-white border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-xs text-[#1E1A17] focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleAddBulkUrls()}
                  className="bg-[#1E1A17] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Add All Image Links</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Demo Previews */}
          <div className="pt-2 border-t border-[#EDE6DC] flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] text-[#8C8072] font-medium">Sample Jewellery Links:</span>
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
            <button
              type="button"
              onClick={() => handleAddSampleImage('https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85')}
              className="px-2 py-0.5 rounded bg-[#F0EAE0] hover:bg-[#E2D8C6] text-[10px] font-semibold text-[#5A4F42]"
            >
              + Peacock Jhumkas
            </button>
          </div>
        </div>
      )}

      {/* Image Gallery & Primary Selector */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-[#786D60]">
            <span className="font-semibold">Current Gallery ({images.length} image{images.length > 1 ? 's' : ''}):</span>
            <span className="text-[11px]">Click ⭐ on an image to set it as Primary Cover</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((imgUrl, idx) => {
              const isPrimary = (primaryImage || images[0]) === imgUrl;
              return (
                <div
                  key={idx}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-white group shadow-xs transition-all ${
                    isPrimary ? 'border-[#BA9541] ring-2 ring-[#BA9541]/30 scale-[1.02]' : 'border-[#E5DDD0] hover:border-[#BA9541]/50'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Product ${idx + 1}`}
                    onError={(e) => {
                      // Fallback broken image placeholder
                      (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1000&q=85');
                    }}
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Primary Badge */}
                  {isPrimary && (
                    <span className="absolute top-2 left-2 bg-[#BA9541] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow uppercase flex items-center gap-1 z-10">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>Primary</span>
                    </span>
                  )}

                  {/* Action Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 z-20">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetPrimary(imgUrl);
                        }}
                        className="p-1.5 rounded-full bg-white text-[#BA9541] hover:bg-[#FAF3E0] shadow-sm cursor-pointer"
                        title="Set as primary cover image"
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
                      className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-sm cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

