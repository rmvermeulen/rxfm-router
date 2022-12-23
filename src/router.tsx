import { RamdaPath, intersperse, path } from "rambda";
import RxFM, { DefaultProps, ElementChild } from "rxfm";
import { Observable, combineLatest, defer, switchMap } from "rxjs";
import { selectRouterState, updateRouterState } from "./state";
import { RouteDetails, RouteMap } from "./types";

const isRouteDetails = (
  value: ElementChild | RouteDetails
): value is RouteDetails => typeof value === "object";

type RouterProps = {
  route: string | Observable<string>;
  routes: RouteMap | Observable<RouteMap>;
} & DefaultProps;

export const Router = ({ route, routes }: RouterProps): RxFM.JSX.Element => {
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
