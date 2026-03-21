import {
  loginAccountSchema,
  loginPasswordSchema,
  registerPasswordSchema,
  registerStudentIdSchema,
  verificationCodeSchema,
} from "./auth";

describe("auth validation schemas", () => {
  it("accepts student ids or emails for login accounts", () => {
    expect(loginAccountSchema.safeParse("123456789").success).toBe(true);
    expect(loginAccountSchema.safeParse("student@njupt.edu.cn").success).toBe(true);
    expect(loginAccountSchema.safeParse("bad account").success).toBe(false);
  });

  it("requires a 5 digit verification code and a non-empty password", () => {
    expect(verificationCodeSchema.safeParse("12345").success).toBe(true);
    expect(verificationCodeSchema.safeParse("1234").success).toBe(false);
    expect(loginPasswordSchema.safeParse(" ").success).toBe(false);
  });

  it("requires a 9 digit student id and stronger matching passwords for registration", () => {
    expect(registerStudentIdSchema.safeParse("123456789").success).toBe(true);
    expect(registerStudentIdSchema.safeParse("1234").success).toBe(false);

    expect(
      registerPasswordSchema.safeParse({
        password: "Password123",
        confirmPassword: "Password123",
      }).success,
    ).toBe(true);
    expect(
      registerPasswordSchema.safeParse({
        password: "short",
        confirmPassword: "short",
      }).success,
    ).toBe(false);
    expect(
      registerPasswordSchema.safeParse({
        password: "Password123",
        confirmPassword: "Password456",
      }).success,
    ).toBe(false);
  });
});
