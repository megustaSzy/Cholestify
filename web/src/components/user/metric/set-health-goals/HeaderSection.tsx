import React from "react";

export default function HeaderSection() {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground">
        Set Health Goals
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
        Establish clinical targets to optimize your health outcomes. Consult
        with your physician before committing to aggressive lifestyle changes.
      </p>
    </div>
  );
}
