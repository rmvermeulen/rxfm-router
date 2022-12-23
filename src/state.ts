import { BehaviorSubject } from "rxjs";
import { ObservableValue } from "rxjs-etc";
import { NavigationState } from ".";

// default store
export const routerState = new BehaviorSubject({
  navigation: "idle" as NavigationState,
  fullUrl: "",
  route: "",
});

export type RouterState = ObservableValue<typeof routerState>;

export const mapRouterState = (fn: (state: RouterState) => RouterState) =>
  routerState.next(fn(routerState.value));

export const updateRouterState = (update: Partial<RouterState>) =>
  routerState.next({
    ...update,
    ...routerState.value,
  });
