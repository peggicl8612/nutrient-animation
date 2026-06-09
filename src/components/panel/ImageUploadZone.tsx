import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';

interface Props {
  disabled?: boolean;
  onFileSelect?: (file: File | null) => void;
}

export function ImageUploadZone({ disabled, onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewImage = useUIStore((s) => s.previewImage);
  const setPreviewImage = useUIStore((s) => s.setPreviewImage);

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
          className="upload-zone-placeholder"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus size={20} />
          <span>上傳食物照片</span>
          <small>檔名含 salad / bento / dessert 會對應不同 Mock 結果</small>
        </button>
      )}
    </div>
  );
}
