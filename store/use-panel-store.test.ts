import { usePanelStore } from "./use-panel-store";

describe("usePanelStore", () => {
  beforeEach(() => {
    usePanelStore.setState({ homeInfoPanel: false });
  });

  it("toggles the home info panel state", () => {
    expect(usePanelStore.getState().homeInfoPanel).toBe(false);

    usePanelStore.getState().setHomeInfoPanel(true);
    expect(usePanelStore.getState().homeInfoPanel).toBe(true);

    usePanelStore.getState().setHomeInfoPanel(false);
    expect(usePanelStore.getState().homeInfoPanel).toBe(false);
  });
});
