'use client'

import { useCallback, useEffect, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { X, ZoomIn, ZoomOut, Check } from 'lucide-react'
import { getCroppedImageDataUrl } from '../lib/cropImage'

interface AvatarCropperModalProps {
  imageSrc: string
  onClose: () => void
  onComplete: (dataUrl: string) => Promise<void> | void
}

export function AvatarCropperModal({
  imageSrc,
  onClose,
  onComplete,
}: AvatarCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isApplying) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isApplying, onClose])

  const handleApply = async () => {
    if (!croppedAreaPixels || isApplying) return
    setIsApplying(true)
    try {
      const dataUrl = await getCroppedImageDataUrl({
        imageSrc,
        crop: croppedAreaPixels,
        outputSize: 512,
        mimeType: 'image/jpeg',
        quality: 0.92,
      })
      await onComplete(dataUrl)
    } catch {
      // The caller is responsible for surfacing save errors.
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Crop avatar"
      className="no-print fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div className="w-full max-w-[560px] rounded-2xl border border-[var(--primaryBorderColor)] bg-[var(--backgroundColor)] shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[var(--transparentBorder)]">
          <div>
            <h2 className="text-[17px] font-medium text-[var(--grey1)] leading-tight">
              Crop profile photo
            </h2>
            <p className="text-[12px] text-[var(--grey3)] mt-0.5">
              Adjust the square crop. The circle shows how your avatar will
              appear.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] -mr-2 -mt-1 flex items-center justify-center text-[var(--grey3)] hover:text-[var(--grey1)] rounded-lg transition-colors"
            aria-label="Close cropper"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="relative w-full aspect-square max-h-[420px] rounded-xl overflow-hidden bg-black avatar-cropper">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="rect"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="contain"
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <ZoomOut
              className="w-4 h-4 text-[var(--grey3)] shrink-0"
              aria-hidden="true"
            />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[var(--grey1)]"
              aria-label="Zoom"
            />
            <ZoomIn
              className="w-4 h-4 text-[var(--grey3)] shrink-0"
              aria-hidden="true"
            />
          </div>

          <p className="mt-3 text-[11px] text-[var(--grey3)]">
            The photo is saved as a 512×512 image in your local profile
            database.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--transparentBorder)] bg-[var(--wash1)]/40">
          <button
            type="button"
            onClick={onClose}
            disabled={isApplying}
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-xl text-sm font-medium text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--grey5)] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying || !croppedAreaPixels}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl text-sm font-medium bg-[var(--grey1)] text-[var(--backgroundColor)] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {isApplying ? 'Saving...' : 'Save photo'}
          </button>
        </div>
      </div>

      <style>{`
        .avatar-cropper .reactEasyCrop_CropArea {
          color: rgba(255, 255, 255, 0.9) !important;
          border: 2px solid rgba(255, 255, 255, 0.95) !important;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55) !important;
        }
        .avatar-cropper .reactEasyCrop_CropArea::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 2px dashed rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  )
}
