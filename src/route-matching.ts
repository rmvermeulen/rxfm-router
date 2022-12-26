import { Dictionary, F, trim } from "rambda";

export enum SegmentType {
  Literal,
  Variable,
  WildcardWord,
  WildcardRoute,
}

export const classifySegment = (segment: string): SegmentType => {
  if (/^[-\w]+$/.test(segment)) {
    return SegmentType.Literal;
  } else if (/^:[-\w]+$/.test(segment)) {
    return SegmentType.Variable;
  } else if (segment === "*") {
    return SegmentType.WildcardWord;
  } else if (segment === "**") {
    return SegmentType.WildcardRoute;
  }
  throw new Error(`Invalid segment: '${segment}'`);
};

/**
 *
 * @param patternSegment The segment of a pattern
 * @param routeSegments The remaining segments of the route
 * @returns a tuple of [success, remaining segments] where success is true in case of a match
 * and remaining segments are the remaining unmatched segments.
 */
export const matchPatternSegment = (
  patternSegment: string,
  routeSegments: string[]
): [boolean, string[], Dictionary<string>?] => {
  if (routeSegments.length === 0) {
    return [false, []];
  }
  const type = classifySegment(patternSegment);
  const [next, ...remaining] = routeSegments;
  switch (type) {
    case SegmentType.Literal:
      if (next === patternSegment) {
        return [true, remaining];
      }
      break;
    case SegmentType.Variable:
      return [true, remaining, { [patternSegment.slice(1)]: next }];
    case SegmentType.WildcardWord:
      return [true, remaining];
    case SegmentType.WildcardRoute:
      return [true, []];
  }
  return [false, routeSegments];
};

/**
 * A low-level variable matcher that does no type checking or conversions.
 * It will throw an error if the route does not match the pattern.
 * @param pattern a route pattern with optional variables
 * @param route a route as a absolute or relative url
 * @returns a map of variables
 */
export const getRouteVariables = (
  pattern: string,
  route: string
): Dictionary<string> => {
  const fail = () => {
    throw new Error("Pattern and route do not match!");
  };

  const segments = pattern.split("/").map(trim).filter(Boolean);
  let remaining = route.split("/").map(trim).filter(Boolean);
  if (segments.length === 0 || remaining.length === 0) fail();

  const routeVariables: Dictionary<string> = {};

  while (segments.length && remaining.length) {
    const patternSegment = segments.shift()!;
    const [didMatch, unmatched, vars] = matchPatternSegment(
      patternSegment,
      remaining
    );
    if (!didMatch) fail();
    remaining = unmatched;
    if (vars) {
      Object.assign(routeVariables, vars);
    }
  }
  if (
    // leftover pattern segments
    segments.length ||
    // leftover route segments
    remaining.length
  ) {
    fail();
  }
  return routeVariables;
};
