'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Link as LinkIcon, Check, Sun, Moon } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  onStatusChange?: (status: string) => void;
  className?: string;
  recommendedSize?: string;
}

const BRAND_PRESETS = [
  { name: 'White Logo', url: '/brand/WhiteLogo.png' },
  { name: 'Standard Logo', url: '/brand/StandardLogo.png' },
  { name: 'Copy of AIX Logo', url: '/brand/CopyofAIXLogo.png' },
  { name: 'QDB White Logo', url: '/brand/QDBWhiteLogo-1792318335528.png' },
  { name: 'Dark Transparent', url: '/brand/aix-roundtables-dark-transparent.png' },
  { name: 'Light Transparent', url: '/brand/aix-roundtables-light-transparent.png' },
];

export function ImageUpload({
  label = 'Upload Image',
  value,
  onChange,
  onStatusChange,
  className = '',
  recommendedSize = 'Recommended: PNG, JPG, WebP, or SVG with transparent background',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [previewDark, setPreviewDark] = useState(true);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    if (onStatusChange) onStatusChange(`Processing ${file.name}...`);

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
        if (onStatusChange) onStatusChange(`Uploaded successfully: ${file.name}`);
        return;
      }
      throw new Error(data.error || 'Server upload failed');
    } catch (err: any) {
      console.warn('Server upload not available, using client-side data URL fallback:', err);
      // Seamless client-side fallback: Convert file to Base64 Data URL so the user is never blocked
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          if (dataUrl) {
            onChange(dataUrl);
            if (onStatusChange) {
              onStatusChange(`Loaded ${file.name} locally. Click "Save" to persist to CMS.`);
            }
          }
        };
        reader.onerror = () => {
          if (onStatusChange) onStatusChange('Could not read image file');
          alert('Could not read file. Please select a valid PNG, JPG, JPEG, or SVG image.');
        };
        reader.readAsDataURL(file);
      } catch (fallbackErr: any) {
        if (onStatusChange) onStatusChange('Could not process image');
        alert('Could not process image. Please try entering an image URL directly.');
      }
    } finally {
      setIsUploading(false);
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
        accept="image/png,image/jpeg,image/jpg,image/webp,image/avif,image/svg+xml,.svg"
        className="hidden"
      />

      {value ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-bg-surface border border-border-subtle rounded-lg">
          {/* Logo visual preview box with toggleable dark/light contrast */}
          <div
            className={`h-16 w-36 shrink-0 border border-white/10 rounded flex items-center justify-center p-2 overflow-hidden shadow-inner relative transition-colors ${
              previewDark ? 'bg-slate-950/90' : 'bg-slate-200'
            }`}
          >
            <img
              src={value}
              alt="Logo preview"
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                // If image fails to load, keep box but show text
                (e.currentTarget as HTMLElement).style.opacity = '0.3';
              }}
            />
            <button
              type="button"
              onClick={() => setPreviewDark(!previewDark)}
              title={previewDark ? 'Switch to light preview' : 'Switch to dark preview'}
              className="absolute top-1 right-1 p-0.5 rounded bg-black/40 text-white/70 hover:text-white text-[10px]"
            >
              {previewDark ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
            </button>
          </div>

          <div className="flex-1 space-y-1 min-w-0">
            <p className="text-xs font-mono text-text-secondary truncate max-w-xs" title={value}>
              {value.startsWith('data:') ? `[Direct Image Data: ${value.slice(0, 32)}...]` : value}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
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
                className="text-[11px] text-text-muted hover:text-text-primary underline flex items-center gap-1 ml-1"
              >
                <LinkIcon className="h-3 w-3" />
                <span>{showManualUrl ? 'Hide URL' : 'Edit URL'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
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
                  PNG, JPG, JPEG, WebP, SVG accepted
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between text-xs px-1">
            <button
              type="button"
              onClick={() => setShowManualUrl(!showManualUrl)}
              className="text-text-muted hover:text-text-primary underline flex items-center gap-1"
            >
              <LinkIcon className="h-3 w-3" />
              <span>{showManualUrl ? 'Hide URL input' : 'Or enter image URL directly'}</span>
            </button>
          </div>
        </div>
      )}

      {showManualUrl && (
        <div className="p-3 bg-bg-surface border border-border-subtle rounded-lg space-y-2 mt-2">
          <div>
            <label className="block text-[11px] font-semibold text-text-muted mb-1">
              Custom Image URL, /brand/... path, or external HTTPS link:
            </label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/brand/WhiteLogo.png or https://example.com/logo.png"
              className="w-full p-2 bg-bg-base border border-border-subtle rounded text-xs text-text-primary font-mono"
            />
          </div>

          <div>
            <span className="block text-[10px] font-semibold text-text-muted mb-1 uppercase tracking-wider">
              Quick Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {BRAND_PRESETS.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => onChange(preset.url)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                    value === preset.url
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-bg-base border-border-subtle text-text-secondary hover:text-text-primary hover:border-brand-secondary'
                  }`}
                >
                  {value === preset.url && <Check className="h-2.5 w-2.5" />}
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
