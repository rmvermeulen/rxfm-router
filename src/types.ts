import { Dictionary } from "rambda";
import { ElementChild, FC } from "rxfm";
import { BehaviorSubject, Observable, Subject } from "rxjs";

export type BehaviorSubjectType<T> = T extends BehaviorSubject<infer X>
  ? X
  : never;
export type SubjectType<T> = T extends Subject<infer X> ? X : never;
export type ObservableType<T> = T extends Observable<infer X> ? X : never;

export type RouteConfig<TProps extends {} = any, CProps extends {} = TProps> = {
  view: FC<TProps> | ElementChild;
  children?: RouteMap<CProps>;
};

export type RouteMap<P extends {} = any> = {
  [href: string]: ElementChild | FC<P> | RouteConfig<P>;
};
export type RouteMapValue = RouteMap[keyof RouteMap];

export type RouterState = {
  navigating: boolean;
  url: URL;
  routes: RouteMap;
  match: null | [RouteMapValue, Dictionary<string>];
};
