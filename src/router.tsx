import { RamdaPath, intersperse, path } from "rambda";
import RxFM, { ElementChild } from "rxfm";
import { combineLatest, defer, switchMap } from "rxjs";
import { selectRouterState } from "./state";
import { RouteDetails } from "./types";

const isRouteDetails = (
  value: ElementChild | RouteDetails
): value is RouteDetails => typeof value === "object";

export const RouterLabelLite = <p>Router</p>;
export const RouterLabel = () => <p>Router</p>;

export const Router = (): RxFM.JSX.Element => (
  <div id="rxfm-router">
    {combineLatest([
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
    )}
  </div>
);
