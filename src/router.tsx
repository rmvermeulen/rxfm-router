import { RamdaPath, compose, filter, intersperse, path, split } from "rambda";
import RxFM, { DefaultProps, ElementChild } from "rxfm";
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
} & DefaultProps;

const ensureObservable = <T,>(value: T | Observable<T>): Observable<T> =>
  isObservable(value) ? value : of(value);

const getRamdaPath: (path: string) => RamdaPath = compose(
  intersperse("children"),
  filter<string>(Boolean),
  split("/")
);

const matchRoute = (route: string, routes: RouteMap) =>
  path<RouteMap[keyof RouteMap]>(getRamdaPath(route))(routes);

export const Router = ({
  url = new URL(window.location.href),
  routes,
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
    selectRouterStateKey("routes"),
  ]).pipe(
    switchMap(([url, routes]) =>
      defer(() => {
        let match = matchRoute(url.pathname, routes);

        if (isRouteConfig(match)) {
          console.log("route details!", match);
          match = match.view;
        }
        return match ? (
          <div>{match as ElementChild}</div>
        ) : (
          <pre>404 - [{url.href}] not found</pre>
        );
      })
    )
  );
};
