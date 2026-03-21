import { handleError, type ErrorState } from "./form-helpers";

describe("handleError", () => {
  it("sets a new error when given an error message", () => {
    const update = handleError("invalid code");

    expect(update({ error: false })).toEqual({
      error: true,
      errMsg: "invalid code",
    });
  });

  it("returns the previous state when the same error is already set", () => {
    const prev: ErrorState = { error: true, errMsg: "invalid code" };
    const update = handleError("invalid code");

    expect(update(prev)).toBe(prev);
  });

  it("clears an existing error when passed false", () => {
    const update = handleError(false);

    expect(update({ error: true, errMsg: "invalid code" })).toEqual({
      error: false,
    });
    expect(update({ error: false })).toEqual({ error: false });
  });
});
