import { useUserProfileStore } from "./use-user-profile-store";

const initialProfile = {
  nickname: "~",
  email: "~",
  dep: null,
  org: null,
  avatar: null,
  bio: null,
  link: null,
  badge: null,
  hide: null,
};

describe("useUserProfileStore", () => {
  beforeEach(() => {
    useUserProfileStore.setState({ profile: initialProfile });
  });

  it("replaces the profile with setProfile", () => {
    const profile = {
      ...initialProfile,
      nickname: "Alice",
      email: "alice@example.com",
      bio: "Hello",
    };

    useUserProfileStore.getState().setProfile(profile);

    expect(useUserProfileStore.getState().profile).toEqual(profile);
  });

  it("merges editable fields into the existing profile", () => {
    useUserProfileStore.setState({
      profile: {
        ...initialProfile,
        nickname: "Alice",
        email: "alice@example.com",
        bio: "Hello",
        link: ["https://old.example.com"],
      },
    });

    useUserProfileStore.getState().updateProfile({
      nickname: "Alicia",
      bio: "Updated bio",
      link: ["https://new.example.com"],
    });

    expect(useUserProfileStore.getState().profile).toEqual({
      ...initialProfile,
      nickname: "Alicia",
      email: "alice@example.com",
      bio: "Updated bio",
      link: ["https://new.example.com"],
    });
  });

  it("resets back to the initial placeholder profile", () => {
    useUserProfileStore.setState({
      profile: {
        ...initialProfile,
        nickname: "Alice",
        email: "alice@example.com",
      },
    });

    useUserProfileStore.getState().resetProfile();
    expect(useUserProfileStore.getState().profile).toEqual(initialProfile);
  });
});
