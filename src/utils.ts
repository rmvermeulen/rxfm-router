import { compose } from "rambda";
import { RouteConfig, RouteMap, RouteMapValue } from "./types";

export const placeholderRegExp = /:(\w+)\//i;

const createMatcherRegExp = (route: string) => {
  const re = /todo/i;
  return re;
};

const flattenRouteMap = (routeMap: RouteMap): RouteMap => {
  throw new Error("Not implemented!");
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
