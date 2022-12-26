import { A, ElementChild } from "rxfm";
import {
  SegmentType,
  classifySegment,
  getRouteVariables,
  matchPatternSegment,
} from "./route-matching";
import { RouteMap } from "./types";
import { flattenRouteMap, getMatch } from "./utils";

describe(matchPatternSegment, () => {
  it.each`
    patternSegment | routeSegments | result
    ${"user"}      | ${["user"]}   | ${[true, []]}
    ${"user"}      | ${[]}         | ${[false, []]}
    ${":value"}    | ${["user"]}   | ${[true, [], { value: "user" }]}
    ${"*"}         | ${["user"]}   | ${[true, []]}
    ${"**"}        | ${["user"]}   | ${[true, []]}
    ${"info"}      | ${["user"]}   | ${[false, ["user"]]}
  `(
    "consumes all matched route segments: $patternSegment <- $routeSegments = [$result.0, $result.1]",
    ({ patternSegment, routeSegments, result }) => {
      expect(matchPatternSegment(patternSegment, routeSegments)).toEqual(
        result
      );
    }
  );
  it.todo;
  it.each`
    segments
    ${["info"]}
    ${["info/user"]}
    ${["info/user/details"]}
    ${["info/user/details/personal"]}
  `("consumes no unmatched route segments", ({ segments }) => {
    expect(matchPatternSegment("user", segments)).toEqual([false, segments]);
  });
  it.each`
    segments
    ${["info"]}
    ${["info/user"]}
    ${["info/user/details"]}
    ${["info/user/details/personal"]}
  `("** consumes all route segments: $segments", ({ segments }) => {
    expect(matchPatternSegment("**", segments)).toEqual([true, []]);
  });
});

describe(classifySegment, () => {
  it.each`
    segment       | result
    ${"potato"}   | ${SegmentType.Literal}
    ${":potato"}  | ${SegmentType.Variable}
    ${"*"}        | ${SegmentType.WildcardWord}
    ${"**"}       | ${SegmentType.WildcardRoute}
    ${"abc/def"}  | ${"Invalid segment"}
    ${"abc/:def"} | ${"Invalid segment"}
    ${"abc:"}     | ${"Invalid segment"}
  `("classifies [$segment] as $result", ({ segment, result }) => {
    if (typeof result !== "number") {
      expect(() => classifySegment(segment)).toThrowError(result);
    } else {
      expect(classifySegment(segment)).toBe(result);
    }
  });
});

describe(getRouteVariables, () => {
  it.each`
    pattern                 | route
    ${""}                   | ${""}
    ${"user/:name/hands"}   | ${"user/alice"}
    ${"user/:name/enemies"} | ${"user/alice/friends"}
    ${"user/**/:name"}      | ${"user/a/b/c/alice"}
    ${"user"}               | ${"alice"}
  `(
    "throws when route and pattern do not match: $pattern <- $route",
    ({ pattern, route }) => {
      expect(() =>
        expect(getRouteVariables(pattern, route)).toBeUndefined()
      ).toThrowError("Pattern and route do not match!");
    }
  );

  test.each`
    pattern               | route                              | variables
    ${"user/:name"}       | ${"user/alice"}                    | ${{ name: "alice" }}
    ${"user/:name/"}      | ${"user/alice"}                    | ${{ name: "alice" }}
    ${"user/:name/:age"}  | ${"user/alice/45"}                 | ${{ name: "alice", age: "45" }}
    ${"user/:name/*"}     | ${"user/alice/friends"}            | ${{ name: "alice" }}
    ${"user/:name/*/:id"} | ${"user/alice/friends/123"}        | ${{ name: "alice", id: "123" }}
    ${"user/:name/**"}    | ${"user/alice/friends/and/family"} | ${{ name: "alice" }}
    ${"user/*/*/*/:name"} | ${"user/a/b/c/alice"}              | ${{ name: "alice" }}
    ${":a/:b/:c/:d/"}     | ${"user/age/face/word"}            | ${{ a: "user", b: "age", c: "face", d: "word" }}
  `("$pattern -> $route -> $variables", ({ pattern, route, variables }) => {
    expect(getRouteVariables(pattern, route)).toEqual(variables);
  });
});

describe(flattenRouteMap, () => {
  it("unnests child routes", () => {
    const comp1 = jest.fn() as ElementChild;
    const comp2 = jest.fn() as ElementChild;
    const comp3 = jest.fn() as ElementChild;
    expect(
      flattenRouteMap({
        home: comp1,
      })
    ).toEqual({
      home: comp1,
    });
    expect(
      flattenRouteMap({
        info: {
          view: comp1,
          children: {
            details: comp2,
          },
        },
      })
    ).toEqual({
      info: comp1,
      "info/details": comp2,
    });
    expect(
      flattenRouteMap({
        info: {
          view: comp1,
          children: {
            details: {
              view: comp2,
              children: {
                "even-more-details": comp3,
              },
            },
          },
        },
      })
    ).toEqual({
      info: comp1,
      "info/details": comp2,
      "info/details/even-more-details": comp3,
    });
  });
});
describe(getMatch, () => {
  const compAbout = jest.fn() as ElementChild;
  const compUser = jest.fn() as ElementChild;
  const compUserDetails = jest.fn() as ElementChild;
  const compUserDetailsLocation = jest.fn() as ElementChild;
  const routeMap: RouteMap = flattenRouteMap({
    about: compAbout,
    "user/:name": {
      view: compUser,
      children: {
        details: {
          view: compUserDetails,
          children: {
            location: compUserDetailsLocation,
          },
        },
      },
    },
  });
  console.log(routeMap);

  it.each`
    route                            | cfg                        | variables
    ${"invalid"}                     | ${null}                    | ${{}}
    ${"user"}                        | ${null}                    | ${{}}
    ${"user/"}                       | ${null}                    | ${{}}
    ${"about/user"}                  | ${null}                    | ${{}}
    ${"about"}                       | ${compAbout}               | ${{}}
    ${"about/"}                      | ${compAbout}               | ${{}}
    ${"user/alice"}                  | ${compUser}                | ${{ name: "alice" }}
    ${"user/alice/details"}          | ${compUserDetails}         | ${{ name: "alice" }}
    ${"user/alice/details/location"} | ${compUserDetailsLocation} | ${{ name: "alice" }}
  `(
    "finds the correct result for $route -> $cfg",
    ({ route, cfg, variables }) => {
      const match = getMatch(route, routeMap);
      if (match) {
        expect(match[0]).toBe(cfg);
        expect(match[1]).toEqual(variables);
      } else {
        expect(match).toBe(cfg);
      }
    }
  );
});
