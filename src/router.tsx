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
import { RouteDetails, RouteMap } from "./types";

const isRouteDetails = (
  value: ElementChild | RouteDetails
): value is RouteDetails => typeof value === "object";

type RouterProps = {
  url: URL;
  routes: RouteMap | Observable<RouteMap>;
} & DefaultProps;

const ensureObservable = <T,>(value: T | Observable<T>): Observable<T> =>
  isObservable(value) ? value : of(value);

const getRamdaPath: (path: string) => RamdaPath = compose(
  intersperse("children"),
  filter<string>(Boolean),
  split("/")
);

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
        console.log(
          url,
          intersperse("children", filter(Boolean, url.pathname.split("/"))),
          routes
        );

        const getMatch = path<ElementChild | RouteDetails>(
          getRamdaPath(url.pathname)
        );
        let match = getMatch(routes);

        if (isRouteDetails(match)) {
          console.log("route details!", match);
          match = match.view;
        }
        console.log({ match });
        return match ? (
          <div>{match}</div>
        ) : (
          <pre>404 - [{url.href}] not found</pre>
        );
      })
    )
  );
};
