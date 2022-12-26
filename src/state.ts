import { BehaviorSubject, Observable, distinctUntilChanged, map } from "rxjs";
import { RouteMap, RouterState } from "./types";

import { flattenRouteMap, getMatch } from "./utils";

// default store
const routerState = new BehaviorSubject<RouterState>({
  url: new URL("http://app"),
  routes: {},
  match: null,
  navigating: false,
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

export const selectRouterState = <R>(selector: (state: RouterState) => R) =>
  routerState.pipe(map(selector), distinctUntilChanged());
export const selectRouterStateKey = <
  K extends keyof RouterState,
  KV extends RouterState[K]
>(
  selector: K
): Observable<KV> =>
  routerState.pipe<KV, KV>(
    map((s) => s[selector] as KV),
    distinctUntilChanged()
  );

export const navigateTo = (route: string) => {
  const url = new URL(route, routerState.value.url.origin);
  const match = getMatch(url.pathname, routerState.value.routes);
  updateRouterState({ navigating: true });
  if (match) {
    updateRouterState({ url, match, navigating: false });
  } else {
    // todo: redirect to configured fallback
    console.error(`unmatched route '${route}'`);
  }
  updateRouterState({ navigating: false });
};
