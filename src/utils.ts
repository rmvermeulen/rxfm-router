import { Dictionary, compose, toPairs } from "rambda";
import { RouteConfig, RouteMap, RouteMapValue } from "./types";
import { getRouteVariables } from "./route-matching";

const flattenRouteConfig = (routeConfig: RouteConfig): Dictionary<any> => {
  const result: Dictionary<any> = {
    "": routeConfig.view,
  };
  if (routeConfig.children) {
    const flatMap = flattenRouteMap(routeConfig.children);
    for (const [innerKey, innerValue] of toPairs(flatMap)) {
      result[innerKey] = innerValue;
    }
  }
  return result;
};

export const flattenRouteMap = (routeMap: RouteMap): RouteMap => {
  const result: Dictionary<any> = {};
  for (const [key, value] of toPairs(routeMap)) {
    if (isRouteConfig(value)) {
      const flatConfig = flattenRouteConfig(value);
      for (const [innerKey, innerValue] of toPairs(flatConfig)) {
        const fullKey = [key, innerKey].filter(Boolean).join("/");
        result[fullKey] = innerValue;
      }
    } else {
      result[key] = value;
    }
  }
  return result;
};

export const getMatch = (
  route: string,
  routeMap: RouteMap
): [RouteMapValue, Dictionary<string>] | null => {
  for (const [pattern, cfg] of toPairs(routeMap)) {
    try {
      return [cfg, getRouteVariables(pattern, route)];
    } catch {
      // failed to match
      continue;
    }
  }
  return null;
};
export const isRouteConfig = (value: RouteMapValue): value is RouteConfig =>
  typeof value === "object";
