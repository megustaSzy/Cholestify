import React from "react";

export default function HeaderSection() {
  return (
    <div className="mb-4 md:mb-6 text-start">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground">
        Food Table
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
        Berikut tabel makanan yang dikategorikan berdasarkan dampaknya
        terhadap kolesterol, kandungan lemak, dan serat.
      </p>
    </div>
  );
}
