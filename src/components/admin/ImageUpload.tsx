'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  onStatusChange?: (status: string) => void;
  className?: string;
  recommendedSize?: string;
}

export function ImageUpload({
  label = 'Upload Image',
  value,
  onChange,
  onStatusChange,
  className = '',
  recommendedSize = 'Recommended: PNG, JPG, or WebP with transparent background',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    if (onStatusChange) onStatusChange(`Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
        if (onStatusChange) onStatusChange(`Uploaded successfully: ${data.url}`);
      } else {
        if (onStatusChange) onStatusChange(`Upload error: ${data.error || 'Failed to upload'}`);
        alert(data.error || 'Failed to upload image. Please ensure it is a valid PNG, JPG, or JPEG file.');
      }
    } catch (err: any) {
      if (onStatusChange) onStatusChange('Network error during upload');
      alert('Network error while uploading image');
    } finally {
      setIsUploading(false);
      // Reset input so re-uploading the same file works
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-semibold text-text-muted">{label}</label>}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
        className="hidden"
      />

      {value ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-bg-surface border border-border-subtle rounded-lg">
          {/* Logo visual preview box with dark contrast background */}
          <div className="h-16 w-36 shrink-0 bg-slate-950/80 border border-white/10 rounded flex items-center justify-center p-2 overflow-hidden shadow-inner">
            <img
              src={value}
              alt="Logo preview"
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                // In case image fails to load
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 space-y-1">
            <p className="text-xs font-mono text-text-secondary truncate max-w-xs">{value}</p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1 bg-brand-secondary/20 text-brand-secondary rounded text-xs font-semibold hover:bg-brand-secondary/30 transition-colors flex items-center gap-1.5"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-3 w-3" />
                    <span>Change Image</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                disabled={isUploading}
                className="px-2.5 py-1 bg-brand-rose/20 text-brand-rose rounded text-xs font-semibold hover:bg-brand-rose/30 transition-colors flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                <span>Remove</span>
              </button>

              <button
                type="button"
                onClick={() => setShowManualUrl(!showManualUrl)}
                className="text-[11px] text-text-muted hover:text-text-primary underline"
              >
                {showManualUrl ? 'Hide URL' : 'Edit URL'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border-subtle hover:border-brand-primary/60 bg-bg-surface/50 hover:bg-bg-surface rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-all text-center group"
        >
          {isUploading ? (
            <div className="flex items-center gap-2 text-brand-secondary py-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-xs font-bold">Uploading file...</span>
            </div>
          ) : (
            <>
              <div className="h-10 w-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-text-primary">Click to Upload Logo File</p>
              <p className="text-[11px] text-text-muted mt-1">{recommendedSize}</p>
              <div className="mt-2 text-[10px] text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded">
                PNG, JPG, JPEG accepted
              </div>
            </>
          )}
        </div>
      )}

      {showManualUrl && (
        <div className="pt-1">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/brand/example.png or https://..."
            className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary font-mono"
          />
        </div>
      )}
    </div>
  );
}
