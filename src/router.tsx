import { RamdaPath, compose, filter, intersperse, split } from "rambda";
import RxFM, { Component, DefaultProps, ElementChild } from "rxfm";
import {
  Observable,
  combineLatest,
  defer,
  isObservable,
  of,
  switchMap,
} from "rxjs";
import {
  initializeRouterState,
  navigateTo,
  selectRouterState,
  selectRouterStateKey,
} from "./state";
import { RouteMap } from "./types";
import { isRouteConfig } from "./utils";

type RouterProps = {
  url?: URL;
  routes: RouteMap | Observable<RouteMap>;
  fallback?: (props: { url: URL }) => Component;
} & DefaultProps;

const ensureObservable = <T,>(value: T | Observable<T>): Observable<T> =>
  isObservable(value) ? value : of(value);

const defaultFallback = ({ url: { href } }: { url: URL }) => (
  <pre>404 - [{href}] not found</pre>
);

export const Router = ({
  url = new URL(window.location.href),
  routes,
  fallback = defaultFallback,
}: RouterProps): RxFM.JSX.Element => {
  // initialize router state
  ensureObservable(routes).subscribe((routeMap) =>
    initializeRouterState(url, routeMap)
  );
  // manage browser history
  selectRouterState((x) => x.url.pathname).subscribe((route: string) =>
    history.pushState(null, "", route)
  );
  window.onpopstate = (e: PopStateEvent) => navigateTo(window.location.href);

  // react from now on
  return combineLatest([
    selectRouterStateKey("url"),
    selectRouterStateKey("match"),
  ]).pipe(
    switchMap(([url, match]) =>
      defer(() => {
        if (!match) {
          return fallback({ url });
        }
        const [cfg, vars] = match;
        const view = isRouteConfig(cfg) ? cfg.view : cfg;
        if (typeof view === "function" && view.length > 0) {
          return view(vars);
        } else {
          return <div>{view as ElementChild}</div>;
        }
      })
    )
  );
};
