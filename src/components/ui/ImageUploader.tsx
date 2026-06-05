"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export default function ImageUploader({ value, onChange, max = 6 }: ImageUploaderProps) {
  const { isRTL } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const token = localStorage.getItem("souq-token");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data?.url ?? null;
  };

  const handleFiles = useCallback(async (files: FileList) => {
    if (value.length >= max) return;
    const toUpload = Array.from(files).slice(0, max - value.length);
    setUploading(true);
    const urls = await Promise.all(toUpload.map(uploadFile));
    const valid = urls.filter(Boolean) as string[];
    onChange([...value, ...valid]);
    setUploading(false);
  }, [value, max, onChange]);

  const remove = (i: number) => {
    const next = [...value];
    next.splice(i, 1);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-sand-100 group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button onClick={() => remove(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={12} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-sand-400 text-night-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {isRTL ? "رئيسية" : "Principale"}
                </span>
              )}
            </div>
          ))}
          {value.length < max && (
            <button onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-sand-300 flex flex-col items-center justify-center text-sand-400 hover:border-sand-400 hover:text-sand-500 transition-colors">
              <Upload size={20} />
              <span className="text-[10px] mt-1">{isRTL ? "إضافة" : "Ajouter"}</span>
            </button>
          )}
        </div>
      )}

      {/* Drop zone */}
      {value.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragOver ? "border-sand-400 bg-sand-50" : "border-sand-200 hover:border-sand-300"
          }`}>
          {uploading ? (
            <Loader2 size={32} className="text-sand-400 animate-spin" />
          ) : (
            <>
              <ImageIcon size={32} className="text-sand-300 mb-2" />
              <p className="text-sm font-semibold text-night-500">{isRTL ? "أضف صوراً" : "Ajoutez des photos"}</p>
              <p className="text-xs text-night-400 mt-1">{isRTL ? "اسحب وأفلت أو انقر" : "Glissez-déposez ou cliquez"}</p>
              <p className="text-xs text-night-300 mt-0.5">{isRTL ? `حتى ${max} صور، 5 ميجا بايت كحد أقصى` : `Jusqu'à ${max} photos • 5 MB max`}</p>
            </>
          )}
        </div>
      )}

      {uploading && value.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-sand-500">
          <Loader2 size={14} className="animate-spin" />
          {isRTL ? "جارٍ التحميل..." : "Téléchargement en cours..."}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}
