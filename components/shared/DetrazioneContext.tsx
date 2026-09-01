"use client";

import React, { createContext, useState, useContext, type ReactNode } from "react";

interface DetrazioneContextType {
  net: boolean;
  setNet: (val: boolean) => void;
}

const DetrazioneContext = createContext<DetrazioneContextType | undefined>(undefined);

export const DetrazioneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [net, setNet] = useState(false);

  return (
    <DetrazioneContext.Provider value={{ net, setNet }}>
      {children}
    </DetrazioneContext.Provider>
  );
};

export const useDetrazione = () => {
  const context = useContext(DetrazioneContext);
  if (context === undefined) {
    throw new Error("useDetrazione must be used within a DetrazioneProvider");
  }
  return context;
};
