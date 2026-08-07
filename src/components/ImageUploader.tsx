import React, { useState, useCallback, useId } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../cropImage';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (base64String: string) => void;
  aspectRatio?: number;
  placeholder?: string;
}

export default function ImageUploader({ label, value, onChange, aspectRatio = 4 / 3, placeholder }: ImageUploaderProps) {
  const instanceId = useId();
  const cleanId = instanceId.replace(/[^a-zA-Z0-9]/g, '');
  const fieldId = `uploader-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${cleanId}`;

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || null);
        setIsModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
    // reset input
    e.target.value = '';
  };

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, aspectRatio);
      onChange(croppedImage);
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      alert("Error al procesar la imagen");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 flex items-center justify-between pr-4">
        {label}
      </label>
      <div className="flex gap-2 items-center">
        {/* Preview thumbnail */}
        <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-5 h-5 text-zinc-600" />
          )}
        </div>
        
        {/* URL Input (read-only if base64, editable if normal URL) */}
        <input
          id={fieldId}
          name={fieldId}
          type="text"
          value={value?.startsWith('data:image') ? '[Imagen Recortada y Subida]' : value || ''}
          onChange={(e) => {
            if (!value?.startsWith('data:image')) {
               onChange(e.target.value);
            }
          }}
          disabled={value?.startsWith('data:image')}
          className={`flex-1 bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 focus:border-primary outline-none transition-all text-white text-sm truncate ${value?.startsWith('data:image') ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder={placeholder || "/assets/imagen.jpg"}
        />

        {/* Upload Button */}
        <label htmlFor={`${fieldId}-file`} className="bg-primary/20 hover:bg-primary/40 text-primary border border-primary/20 rounded-2xl py-3.5 px-4 cursor-pointer transition-colors flex items-center justify-center shrink-0" title="Subir y recortar">
          <Upload className="w-5 h-5" />
          <input 
            id={`${fieldId}-file`}
            name={`${fieldId}-file`}
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </label>
        
        {/* Clear Button */}
        {value?.startsWith('data:image') && (
           <button type="button" onClick={() => onChange('')} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl py-3.5 px-4 cursor-pointer transition-colors shrink-0">
             <X className="w-5 h-5" />
           </button>
        )}
      </div>

      {/* Cropper Modal */}
      {isModalOpen && imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-sans">
          <div className="max-w-3xl w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl relative flex flex-col h-[80vh]">
            
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-xl font-display font-black uppercase tracking-tight text-white">
                Recortar Imagen: <span className="text-primary">{label}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 relative bg-black/50 rounded-2xl overflow-hidden mb-6">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="shrink-0 flex items-center gap-4">
              <div className="flex-1">
                <label htmlFor={`${fieldId}-zoom`} className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Zoom</label>
                <input
                  id={`${fieldId}-zoom`}
                  name={`${fieldId}-zoom`}
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSaveCrop}
                className="btn-primary px-8 py-4 font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-[0_10px_20px_rgba(194,164,114,0.3)]"
              >
                {isProcessing ? 'Procesando...' : <Check size={18} />} Usar Recorte
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
