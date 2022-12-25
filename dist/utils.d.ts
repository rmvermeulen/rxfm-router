import { Dictionary } from "rambda";
import { RouteConfig, RouteMap, RouteMapValue } from "./types";
export declare const placeholderRegExp: RegExp;
export declare const getMatchableRoutes: (routes: RouteMap) => string[];
/**
 * A low-level variable matcher that does no type checking or conversions
 * @param pattern a route pattern with optional variables
 * @param route a route as a absolute or relative url
 * @returns a map of variables
 */
export declare const getRouteVariables: (pattern: string, route: string) => Dictionary<string>;
export declare const getMatches: (route: string, routeMap: RouteMap) => (RegExpExecArray | null)[];
export declare const isRouteConfig: (value: RouteMapValue) => value is RouteConfig<any, any>;
