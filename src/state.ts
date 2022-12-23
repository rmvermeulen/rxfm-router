import { BehaviorSubject, distinctUntilChanged, map } from "rxjs";
import { ObservableValue } from "rxjs-etc";
import { NavigationState, RouteMap } from "./types";

// default store
export const routerState = new BehaviorSubject({
  navigation: "idle" as NavigationState,
  fullUrl: "",
  route: "",
  routes: {} as RouteMap,
});

export type RouterState = ObservableValue<typeof routerState>;

export const mapRouterState = (fn: (state: RouterState) => RouterState) =>
  routerState.next(fn(routerState.value));

export const updateRouterState = (update: Partial<RouterState>) =>
  routerState.next({
    ...update,
    ...routerState.value,
  });

const propFn =
  <T>(prop: keyof T) =>
  (value: T) =>
    value[prop];

export const selectRouterState = (
  selector: ((state: RouterState) => any) | keyof RouterState
) =>
  routerState.pipe(
    map(typeof selector === "string" ? propFn(selector) : selector),
    distinctUntilChanged()
  );
