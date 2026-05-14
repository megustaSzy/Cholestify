import React from "react";

export default function HeaderSection() {
  return (
    <div className="mb-4 md:mb-6 text-start">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground">
        Log Biometrics
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
        Enter your most recent physical measurements to ensure your clinical
        profile reflects accurate, up-to-date health data.
      </p>
    </div>
  );
}
