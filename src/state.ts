import { BehaviorSubject, Observable, distinctUntilChanged, map } from "rxjs";
import { NavigationState, RouteMap, RouterState } from "./types";

import { flattenRouteMap, getMatches } from "./utils";

// default store
const routerState = new BehaviorSubject<RouterState>({
  url: new URL("http://app"),
  routes: {},
  navigation: "idle" as NavigationState,
});

export const initializeRouterState = (url: URL, routes: RouteMap) =>
  updateRouterState({ url, routes: flattenRouteMap(routes) });

export const updateRouterRouteMap = (routes: RouteMap) =>
  updateRouterState({ routes: flattenRouteMap(routes) });

export const mapRouterState = (fn: (state: RouterState) => RouterState) =>
  routerState.next(fn(routerState.value));

export const updateRouterState = (update: Partial<RouterState>) => {
  const next = {
    ...routerState.value,
    ...update,
  };
  routerState.next(next);
};

const propFn =
  <T>(prop: keyof T) =>
  (value: T) =>
    value[prop];

export const selectRouterState = <R>(selector: (state: RouterState) => R) =>
  routerState.pipe(map(selector), distinctUntilChanged());
export const selectRouterStateKey = <
  K extends keyof RouterState,
  KV = RouterState[K]
>(
  selector: K
): Observable<KV> =>
  routerState.pipe<KV, KV>(
    map((s) => propFn(selector)(s)),
    distinctUntilChanged()
  );

export const navigateTo = (route: string) => {
  const url = new URL(route, routerState.value.url.origin);
  const matches = getMatches(url.pathname, routerState.value.routes);
  console.log("route matches", matches);
  updateRouterState({ url });
};
