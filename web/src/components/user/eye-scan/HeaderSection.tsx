import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import React from "react";

export default function Header() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Detect Arcus Senilis
        </h1>
        <p className="text-gray-500 text-sm">
          Unggah foto iris mata anda berkualitas tinggi untuk menganalisis
          potensi tanda-tanda peningkatan kolesterol.
        </p>
      </div>
      {/* Disclaimer */}
      <Alert className="border border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
        <AlertDescription className="text-red-600 font-medium text-sm">
          <span className="font-bold">Disclaimer:</span> Analisis ini tidak 100%
          akurat dan hanya berfungsi sebagai alat bantu. Silakan berkonsultasi
          dengan profesional medis untuk diagnosis yang pasti.
        </AlertDescription>
      </Alert>
    </>
  );
}
