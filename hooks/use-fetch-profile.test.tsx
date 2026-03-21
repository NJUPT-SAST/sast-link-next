import { renderHook } from "@testing-library/react";

const useSWR = jest.fn();
const getUserProfile = jest.fn();
const getToken = jest.fn();
const setProfile = jest.fn();
const setCurrentUser = jest.fn();
const updateAccount = jest.fn();

jest.mock("swr", () => ({
  __esModule: true,
  default: (...args: unknown[]) => useSWR(...args),
}));

jest.mock("@/lib/api/user", () => ({
  getUserProfile: (...args: unknown[]) => getUserProfile(...args),
}));

jest.mock("@/lib/token", () => ({
  getToken: () => getToken(),
}));

jest.mock("@/store/use-user-profile-store", () => ({
  useUserProfileStore: (selector: (state: { setProfile: typeof setProfile }) => unknown) =>
    selector({ setProfile }),
}));

jest.mock("@/store/use-auth-store", () => ({
  useAuthStore: (selector: (state: { setCurrentUser: typeof setCurrentUser }) => unknown) =>
    selector({ setCurrentUser }),
}));

jest.mock("@/store/use-user-list-store", () => ({
  useUserListStore: (selector: (state: { updateAccount: typeof updateAccount }) => unknown) =>
    selector({ updateAccount }),
}));

import { useFetchProfile } from "./use-fetch-profile";

describe("useFetchProfile", () => {
  beforeEach(() => {
    useSWR.mockReset();
    getUserProfile.mockReset();
    getToken.mockReset();
    setProfile.mockReset();
    setCurrentUser.mockReset();
    updateAccount.mockReset();
  });

  it("disables SWR fetching when there is no token", () => {
    getToken.mockReturnValue(null);
    useSWR.mockReturnValue({ data: undefined });

    renderHook(() => useFetchProfile());

    expect(useSWR).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      { revalidateOnFocus: false },
    );

    const keyFactory = useSWR.mock.calls[0][0] as () => string | null;
    expect(keyFactory()).toBeNull();
  });

  it("fetches profile data and syncs all stores on success", async () => {
    const profile = {
      nickname: "Alice",
      email: "alice@example.com",
      avatar: "/avatar.png",
      dep: null,
      org: null,
      bio: null,
      link: null,
      badge: null,
      hide: null,
    };

    getToken.mockReturnValue("token");
    getUserProfile.mockResolvedValue({
      data: {
        Success: true,
        Data: profile,
      },
    });
    useSWR.mockImplementation((keyFactory, fetcher, options) => ({
      key: keyFactory(),
      fetcher,
      options,
    }));

    const { result } = renderHook(() => useFetchProfile());
    const data = await result.current.fetcher();

    expect(result.current.key).toBe("getProfile");
    expect(result.current.options).toEqual({ revalidateOnFocus: false });
    expect(data).toEqual(profile);
    expect(setProfile).toHaveBeenCalledWith(profile);
    expect(setCurrentUser).toHaveBeenCalledWith({
      username: "Alice",
      email: "alice@example.com",
    });
    expect(updateAccount).toHaveBeenCalledWith({
      email: "alice@example.com",
      nickName: "Alice",
      avatar: "/avatar.png",
    });
  });

  it("throws when the backend response is unsuccessful", async () => {
    getToken.mockReturnValue("token");
    getUserProfile.mockResolvedValue({
      data: {
        Success: false,
        Data: null,
      },
    });
    useSWR.mockImplementation((keyFactory, fetcher) => ({
      key: keyFactory(),
      fetcher,
    }));

    const { result } = renderHook(() => useFetchProfile());

    await expect(result.current.fetcher()).rejects.toThrow(
      "Failed to fetch profile",
    );
    expect(setProfile).not.toHaveBeenCalled();
    expect(setCurrentUser).not.toHaveBeenCalled();
    expect(updateAccount).not.toHaveBeenCalled();
  });
});
