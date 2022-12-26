import { Dictionary } from "rambda";
export declare enum SegmentType {
    Literal = 0,
    Variable = 1,
    WildcardWord = 2,
    WildcardRoute = 3
}
export declare const classifySegment: (segment: string) => SegmentType;
/**
 *
 * @param patternSegment The segment of a pattern
 * @param routeSegments The remaining segments of the route
 * @returns a tuple of [success, remaining segments] where success is true in case of a match
 * and remaining segments are the remaining unmatched segments.
 */
export declare const matchPatternSegment: (patternSegment: string, routeSegments: string[]) => [boolean, string[], Dictionary<string>?];
/**
 * A low-level variable matcher that does no type checking or conversions.
 * It will throw an error if the route does not match the pattern.
 * @param pattern a route pattern with optional variables
 * @param route a route as a absolute or relative url
 * @returns a map of variables
 */
export declare const getRouteVariables: (pattern: string, route: string) => Dictionary<string>;
