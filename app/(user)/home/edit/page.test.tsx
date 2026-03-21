import React from "react";
import { createEvent, fireEvent, render, screen } from "@testing-library/react";

import EditPage from "./page";

const mockRefresh = jest.fn();
const mockUseFilePicker = jest.fn();
const mockUserProfileState = {
  profile: {
    nickname: "Tester",
    email: "tester@example.com",
    dep: null,
    org: null,
    avatar: null,
    bio: "",
    link: null,
    badge: null,
    hide: null,
  },
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock("@/store/use-user-profile-store", () => ({
  useUserProfileStore: (selector: (state: unknown) => unknown) =>
    selector(mockUserProfileState),
}));

jest.mock("@/lib/api/user", () => ({
  uploadAvatar: jest.fn(() => Promise.resolve()),
  editProfile: jest.fn(() => Promise.resolve()),
}));

jest.mock("use-file-picker", () => ({
  useFilePicker: (options: unknown) => {
    mockUseFilePicker(options);
    return {
      openFilePicker: () => {
        const config = mockUseFilePicker.mock.calls.at(-1)?.[0] as {
          onFilesSuccessfullySelected?: (files: { plainFiles: File[] }) => void;
        };
        config?.onFilesSuccessfullySelected?.({
          plainFiles: [new File(["avatar"], "avatar.png", { type: "image/png" })],
        });
      },
    };
  },
}));

jest.mock("react-avatar-editor", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const MockAvatarEditor = React.forwardRef<
    { getImageScaledToCanvas: () => HTMLCanvasElement },
    { scale: number }
  >(({ scale }, ref) => {
    React.useImperativeHandle(ref, () => ({
      getImageScaledToCanvas: () => document.createElement("canvas"),
    }));

    return (
      <div data-testid="avatar-editor" data-scale={String(scale)}>
        avatar editor
      </div>
    );
  });

  MockAvatarEditor.displayName = "MockAvatarEditor";
  return MockAvatarEditor;
});

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    open,
    children,
  }: {
    open: boolean;
    children: React.ReactNode;
  }) => (open ? <div data-testid="avatar-dialog">{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/components/ui/slider", () => ({
  Slider: ({
    value,
    onValueChange,
  }: {
    value: number[];
    onValueChange: (value: number[]) => void;
  }) => (
    <input
      data-testid="zoom-slider"
      type="range"
      value={value[0]}
      onChange={(event) => onValueChange([Number(event.target.value)])}
    />
  ),
}));

describe("EditPage avatar editor", () => {
  it("zooms the avatar editor with mouse wheel and keeps the slider in sync", () => {
    render(<EditPage />);

    fireEvent.click(screen.getByRole("button", { name: /更换头像/i }));

    const editor = screen.getByTestId("avatar-editor");
    const editorSurface = editor.parentElement as HTMLDivElement;
    const wheelEvent = createEvent.wheel(editorSurface, {
      deltaY: -100,
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = jest.spyOn(wheelEvent, "preventDefault");

    fireEvent(editorSurface, wheelEvent);

    expect(screen.getByTestId("avatar-editor")).toHaveAttribute("data-scale", "1.1");
    expect(screen.getByTestId("zoom-slider")).toHaveValue("1.1");
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("clamps wheel zoom at the configured maximum scale", () => {
    render(<EditPage />);

    fireEvent.click(screen.getByRole("button", { name: /更换头像/i }));

    const slider = screen.getByTestId("zoom-slider");
    fireEvent.change(slider, { target: { value: "5" } });

    const editorSurface = screen.getByTestId("avatar-editor").parentElement as HTMLDivElement;
    fireEvent(
      editorSurface,
      createEvent.wheel(editorSurface, {
        deltaY: -100,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(screen.getByTestId("avatar-editor")).toHaveAttribute("data-scale", "5");
    expect(screen.getByTestId("zoom-slider")).toHaveValue("5");
  });
});
