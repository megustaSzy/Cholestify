import React from "react";

export default function HeaderSection() {
  return (
    <div className="mx-auto mb-4 w-full max-w-[1120px] text-start md:mb-6">
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">
        Tabel Makanan
      </h1>

      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
        Berikut tabel makanan yang dikategorikan berdasarkan dampaknya terhadap
        kolesterol, kandungan lemak, dan serat.
      </p>
    </div>
  );
}
