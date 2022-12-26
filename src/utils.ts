import { Dictionary, compose, toPairs } from "rambda";
import { RouteConfig, RouteMap, RouteMapValue } from "./types";

const createMatcherRegExp = (route: string) => {
  const re = /todo/i;
  return re;
};

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

export const getMatchableRoutes = (routes: RouteMap): string[] => {
  throw new Error("Not implemented!");
};

export const getMatches = (route: string, routeMap: RouteMap) => {
  const routes = compose(getMatchableRoutes, flattenRouteMap)(routeMap);
  console.log(routes);
  const matchers = routes.map(createMatcherRegExp);
  const matchedRoutes = matchers.map((m) => m.exec(route)).filter(Boolean);

  return matchedRoutes;
};
export const isRouteConfig = (value: RouteMapValue): value is RouteConfig =>
  typeof value === "object";
