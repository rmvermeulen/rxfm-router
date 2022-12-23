import { RamdaPath, intersperse, path } from "rambda";
import RxFM, { ElementChild } from "rxfm";
import { combineLatest, defer, switchMap } from "rxjs";
import { routerState } from "./state";
import { RouteDetails } from ".";

export const Router = () => {
  const url = routerState.selectState("url");
  return (
    <div>
      <input
        value={url}
        onChange={(e) =>
          routerState.dispatch({ type: "set url", payload: e.target.value })
        }
      />
      {
        combineLatest([url, routerState.selectState("routes")]).pipe(
          switchMap(([url, routes]) =>
            defer(() => {
              const getMatch = path<ElementChild | RouteDetails>(
                intersperse("children", url.split("/")) as RamdaPath
              );
              let match = getMatch(routes);
              // return typeof match == 'function')?
              if (typeof match === "object") {
                match = (match as RouteDetails).component;
              }
              return <div>{match || <pre>404 - [{url}] not found</pre>}</div>;
            })
          )
        ) as ElementChild
      }
    </div>
  );
};
