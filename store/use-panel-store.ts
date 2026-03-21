import { create } from "zustand";

interface PanelState {
  homeInfoPanel: boolean;
  setHomeInfoPanel: (open: boolean) => void;
}

export const usePanelStore = create<PanelState>()((set) => ({
  homeInfoPanel: false,
  setHomeInfoPanel: (open) => set({ homeInfoPanel: open }),
}));
