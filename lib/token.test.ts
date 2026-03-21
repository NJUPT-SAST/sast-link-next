describe("token helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reads, writes and clears the token from localStorage", async () => {
    const { getToken, setToken, clearToken } = await import("./token");

    expect(getToken()).toBeNull();

    setToken("abc");
    expect(localStorage.getItem("Token")).toBe(JSON.stringify("abc"));
    expect(getToken()).toBe("abc");

    clearToken();
    expect(getToken()).toBeNull();
  });

  it("returns null for invalid JSON payloads", async () => {
    const { getToken } = await import("./token");

    localStorage.setItem("Token", "not-json");
    expect(getToken()).toBeNull();
  });
});
