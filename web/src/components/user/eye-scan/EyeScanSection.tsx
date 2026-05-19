"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CloudUpload, HelpCircle, ScanEye } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function EyeScanForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Drop Zone */}
      <div
        className={`m-4 rounded-xl border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center flex-1 min-h-64 ${
          dragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handleFileChange}
        />
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Eye preview"
            className="max-h-56 rounded-lg object-contain"
            width={400}
            height={400}
            unoptimized
          />
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <CloudUpload className="w-7 h-7 text-blue-500" />
            </div>
            <p className="text-gray-700 font-medium text-sm">
              Drag &amp; drop or click to upload
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Supports high-resolution JPG or PNG (Max 10MB)
            </p>
          </>
        )}
      </div>

      {/* Footer Row */}
      <div className="flex items-center justify-between px-4 pb-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <HelpCircle className="w-4 h-4" />
          <span>Siap Untuk AI analysis?</span>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 flex items-center gap-2 text-sm font-medium"
          disabled={!selectedFile}
        >
          <ScanEye className="w-4 h-4" />
          Analisis Photo
        </Button>
      </div>
    </div>
  );
}
