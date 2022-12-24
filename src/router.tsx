import { RamdaPath, intersperse, path } from "rambda";
import RxFM, { DefaultProps, ElementChild } from "rxfm";
import {
  Observable,
  combineLatest,
  defer,
  isObservable,
  of,
  switchMap,
} from "rxjs";
import { combineLatestObject } from "rxjs-etc";
import { selectRouterState, updateRouterState } from "./state";
import { RouteDetails, RouteMap } from "./types";

const isRouteDetails = (
  value: ElementChild | RouteDetails
): value is RouteDetails => typeof value === "object";

type RouterProps = {
  route: string | Observable<string>;
  routes: RouteMap | Observable<RouteMap>;
} & DefaultProps;

const makeObservable = <T,>(value: T | Observable<T>): Observable<T> =>
  isObservable(value) ? value : of(value);

export const Router = ({ route, routes }: RouterProps): RxFM.JSX.Element => {
  // initialize router state
  combineLatestObject({
    route: makeObservable(route),
    routes: makeObservable(routes),
  }).subscribe(updateRouterState);
  // manage browser history
  selectRouterState((x) => x.route).subscribe((route: string) =>
    history.pushState(null, "", route.startsWith("/") ? route : `/${route}`)
  );
  window.onpopstate = (e: PopStateEvent) => {
    getRouteF;
  };
  // react from now on
  return combineLatest([
    selectRouterState("route"),
    selectRouterState("routes"),
  ]).pipe(
    switchMap(([route, routes]) =>
      defer(() => {
        const getMatch = path<ElementChild | RouteDetails>(
          intersperse("children", route.split("/")) as RamdaPath
        );
        let match = getMatch(routes);
        // return typeof match == 'function')?
        if (isRouteDetails(match)) {
          match = match.component;
        }
        return match ? (
          <div>{match}</div>
        ) : (
          <pre>404 - [{route}] not found</pre>
        );
      })
    )
  );
};
