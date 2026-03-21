import { profileRules } from "./profile";

describe("profileRules", () => {
  it("requires nickname and limits text lengths", () => {
    expect(profileRules.nickname.required).toBe("昵称不能为空");
    expect(profileRules.nickname.maxLength).toEqual({
      value: 20,
      message: "昵称最多20个字符",
    });
    expect(profileRules.bio.maxLength).toEqual({
      value: 200,
      message: "简介最多200个字符",
    });
  });

  it("accepts empty links and http/https urls, but rejects invalid links", () => {
    const linkPattern = profileRules.link1.pattern?.value;

    expect(linkPattern?.test("")).toBe(true);
    expect(linkPattern?.test("https://example.com")).toBe(true);
    expect(linkPattern?.test("http://example.com")).toBe(true);
    expect(linkPattern?.test("ftp://example.com")).toBe(false);
    expect(profileRules.link2.pattern?.message).toBe("请输入有效的URL");
    expect(profileRules.link3.pattern?.message).toBe("请输入有效的URL");
  });
});
