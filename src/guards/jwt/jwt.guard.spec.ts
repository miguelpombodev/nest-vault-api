import { JwtGuardGuard } from "./jwt.guard";

describe("JwtGuardGuard", () => {
  it("should be defined", () => {
    expect(new JwtGuardGuard()).toBeDefined();
  });
});
