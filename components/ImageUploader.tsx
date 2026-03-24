'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  /** Folder on Cloudinary: 'routes' | 'blog' | 'general' */
  folder?: string;
  /** Current image URL (initial value) */
  value?: string;
  /** Callback fired when upload succeeds */
  onChange: (url: string) => void;
  /** Remove current image */
  onRemove?: () => void;
  /** Aspect ratio class for the preview (e.g. 'aspect-video', 'aspect-square') */
  aspectRatio?: string;
  label?: string;
}

export default function ImageUploader({
  folder = 'general',
  value,
  onChange,
  onRemove,
  aspectRatio = 'aspect-video',
  label = 'Upload Image',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError('');
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error || 'Upload failed');
          return;
        }

        onChange(data.data.url);
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  return (
    <div className="w-full">
      {label && <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>}

      {value ? (
        /* Preview khi đã có ảnh */
        <div className={`relative w-full ${aspectRatio} rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group`}>
          <Image src={value} alt="Uploaded image" fill className="object-cover" />
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 bg-white text-gray-900 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              <Upload className="w-4 h-4" />
              Replace
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-2 bg-red-500 text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-red-600"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Drop zone khi chưa có ảnh */
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`relative w-full ${aspectRatio} rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            uploading
              ? 'border-orange-300 bg-orange-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50 bg-gray-50'
          } flex flex-col items-center justify-center gap-3`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <p className="text-sm font-medium text-orange-600">Uploading...</p>
            </>
          ) : (
            <>
              <div className="p-3 bg-gray-100 rounded-full">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  <span className="text-orange-500">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP — max 10MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
        disabled={uploading}
      />

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
