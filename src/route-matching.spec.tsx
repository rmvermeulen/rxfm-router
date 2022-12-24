import RxFM, { FC, WithChildren } from "rxfm";
import { getMatches, placeholderRegExp } from "./utils";
import { RouteMap } from "./types";

describe("route matching", () => {
  describe("placeholder regex", () => {
    it("exists", () => {
      expect(placeholderRegExp).toBeInstanceOf(RegExp);
    });
  });
  it("exists as a separate function", () => {
    expect(getMatches).toBeInstanceOf(Function);
  });
  it("works in this example", () => {
    const result = getMatches("/user/alice", {
      "user/:name": ({ name }) => <p>{name}</p>,
    });
    expect(result).toMatchObject({
      name: "alice",
    });
  });
  it("works in this example, too", () => {
    const result = getMatches("/user/alice", {
      user: {
        name: "User",
        view: <p>User</p>,
        children: {
          ":name": ({ name }) => <p>{name}</p>,
        },
      },
    });
    expect(result).toMatchObject({
      name: "alice",
    });
  });
});
