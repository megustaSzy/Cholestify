import React from "react";

export default function HeaderSection() {
  return (
    <div className="text-start">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground">
        Pengukuran Harian
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
        Masukkan pengukuran kesehatan harian Anda untuk menjaga profil klinis
        yang akurat.
      </p>
    </div>
  );
}
