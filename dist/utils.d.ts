import { RouteConfig, RouteMap, RouteMapValue } from "./types";
export declare const flattenRouteMap: (routeMap: RouteMap) => RouteMap;
export declare const getMatchableRoutes: (routes: RouteMap) => string[];
export declare const getMatches: (route: string, routeMap: RouteMap) => (RegExpExecArray | null)[];
export declare const isRouteConfig: (value: RouteMapValue) => value is RouteConfig<any, any>;
