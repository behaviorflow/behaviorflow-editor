import React, { createContext, useContext } from "react";

type SettingsContextType = {
  showNodeIds: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ value, children }: { value: SettingsContextType; children: React.ReactNode }) {
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettingsContext(): SettingsContextType {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }
  return ctx;
}
