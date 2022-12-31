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

const createUrl = (route: string): { url: URL; isAbsolute: boolean } => {
  try {
    const url = new URL(route);
    return { url, isAbsolute: true };
  } catch {
    return {
      url: new URL(route, routerState.value.url.origin),
      isAbsolute: false,
    };
  }
};

export const navigateTo = (route: string) => {
  const { url, isAbsolute } = createUrl(route);
  if (isAbsolute && url.origin !== routerState.value.url.origin) {
    window.location.href = url.href;
    return;
  }

  const match = getMatch(url.pathname, routerState.value.routes);
  updateRouterState({ navigating: true });
  // todo: pre-navigate stuff
  updateRouterState({ url, match, navigating: false });
  // todo: post-navigate stuff
  updateRouterState({ navigating: false });
};
