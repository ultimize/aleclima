"use client";

import React from "react";

interface ToggleProps {
  on: boolean;
  set: (val: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ on, set }) => {
  return (
    <div className="toggle-row">
      <button className="toggle" onClick={() => set(!on)} type="button">
        <span className={`sw${on ? " on" : ""}`}><i /></span>
        Mostra prezzo con detrazione fiscale 50%
      </button>
    </div>
  );
};
