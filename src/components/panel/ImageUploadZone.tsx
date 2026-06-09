import { useRef, type CSSProperties } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { MEAL_COLORS } from '../../types/ui';

interface Props {
  disabled?: boolean;
  onFileSelect?: (file: File | null) => void;
}

export function ImageUploadZone({ disabled, onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewImage = useUIStore((s) => s.previewImage);
  const setPreviewImage = useUIStore((s) => s.setPreviewImage);
  const imageMealName = useUIStore((s) => s.imageMealName);
  const setImageMealName = useUIStore((s) => s.setImageMealName);
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

  return (
    <div className="upload-zone">
      <label className="manual-meal-name upload-meal-name">
        <span>餐點名稱</span>
        <input
          type="text"
          placeholder="例：蔬菜沙拉、雞腿便當"
          disabled={disabled}
          value={imageMealName}
          onChange={(e) => setImageMealName(e.target.value)}
        />
      </label>

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
          <span>上傳食物照片</span>
         {/*  <small>餐點名稱或檔名含 沙拉 / 便當 / 蛋糕 會對應不同 Mock 結果</small> */}
        </button>
      )}
    </div>
  );
}
