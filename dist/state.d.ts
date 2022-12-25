import { Observable } from "rxjs";
import { RouteMap, RouterState } from "./types";
export declare const initializeRouterState: (url: URL, routes: RouteMap) => void;
export declare const updateRouterRouteMap: (routes: RouteMap) => void;
export declare const mapRouterState: (fn: (state: RouterState) => RouterState) => void;
export declare const updateRouterState: (update: Partial<RouterState>) => void;
export declare const selectRouterState: <R>(selector: (state: RouterState) => R) => Observable<R>;
export declare const selectRouterStateKey: <K extends keyof RouterState, KV = RouterState[K]>(selector: K) => Observable<KV>;
export declare const navigateTo: (route: string) => void;
