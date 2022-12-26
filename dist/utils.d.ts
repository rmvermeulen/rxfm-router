import { Dictionary } from "rambda";
import { RouteConfig, RouteMap, RouteMapValue } from "./types";
export declare const flattenRouteMap: (routeMap: RouteMap) => RouteMap;
export declare const getMatch: (route: string, routeMap: RouteMap) => [RouteMapValue, Dictionary<string>] | null;
export declare const isRouteConfig: (value: RouteMapValue) => value is RouteConfig<any, any>;
