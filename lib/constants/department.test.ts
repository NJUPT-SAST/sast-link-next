import { departmentMap } from "./department";

describe("departmentMap", () => {
  it("includes the known software teams in order", () => {
    expect(departmentMap[0]).toEqual(["软件研发部", "C#组"]);
    expect(departmentMap).toContainEqual(["软件研发部", "前端组"]);
    expect(departmentMap).toContainEqual(["软件研发部", "安全组"]);
  });

  it("keeps departments without sub-teams as empty-string entries", () => {
    expect(departmentMap).toContainEqual(["办公室", ""]);
    expect(departmentMap).toContainEqual(["主席团", ""]);
  });
});
