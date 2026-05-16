import React from "react";

export default function HeaderSection() {
  return (
    <div className="mb-4 md:mb-6 text-start">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground">
        Daily Tracking
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
        Enter your daily health metrics to maintain an accurate clinical profile.
      </p>
    </div>
  );
}
