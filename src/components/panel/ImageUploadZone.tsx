import { useRef, useState, type CSSProperties, type DragEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { MEAL_COLORS } from '../../types/ui';

interface Props {
  disabled?: boolean;
  onFileSelect?: (file: File | null) => void;
}

export function ImageUploadZone({ disabled, onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const previewImage = useUIStore((s) => s.previewImage);
  const setPreviewImage = useUIStore((s) => s.setPreviewImage);
  const selectedMeal = useUIStore((s) => s.selectedMeal);
  const mealToken = MEAL_COLORS[selectedMeal];

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    onFileSelect?.(file);
  };

  const clearImage = () => {
    if (previewImage) URL.revokeObjectURL(previewImage);
    setPreviewImage(null);
    onFileSelect?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    dragCounter.current += 1;
    if (e.dataTransfer.types.includes('Files')) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    if (disabled) return;
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div
      className={isDragging ? 'upload-zone upload-zone-dragging' : 'upload-zone'}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="upload-zone-input"
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {previewImage ? (
        <div className="upload-zone-preview">
          <img src={previewImage} alt="上傳預覽" />
          <button type="button" className="upload-zone-clear" onClick={clearImage} disabled={disabled}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="upload-zone-placeholder upload-zone-placeholder-meal"
          disabled={disabled}
          style={
            {
              '--meal-color': mealToken.primary,
              '--meal-glow': mealToken.glow,
            } as CSSProperties
          }
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus size={20} />
          <span>{isDragging ? '放開以上傳照片' : '上傳食物照片'}</span>
          <small>拖曳或點擊上傳 · AI 將自動辨識餐點名稱與營養成分</small>
        </button>
      )}
    </div>
  );
}
