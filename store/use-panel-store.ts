import { create } from "zustand";

interface PanelState {
  homeAppPanel: boolean;
  homeInfoPanel: boolean;
  setHomeAppPanel: (open: boolean) => void;
  setHomeInfoPanel: (open: boolean) => void;
}

export const usePanelStore = create<PanelState>()((set) => ({
  homeAppPanel: false,
  homeInfoPanel: false,
  setHomeAppPanel: (open) => set({ homeAppPanel: open }),
  setHomeInfoPanel: (open) => set({ homeInfoPanel: open }),
}));
