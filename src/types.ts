import { ElementChild } from "rxfm";
import { BehaviorSubject, Observable, Subject } from "rxjs";

export type BehaviorSubjectType<T> = T extends BehaviorSubject<infer X>
  ? X
  : never;
export type SubjectType<T> = T extends Subject<infer X> ? X : never;
export type ObservableType<T> = T extends Observable<infer X> ? X : never;
export type RouteDetails = {
  name: string;
  component: ElementChild;
  children?: RouteMap;
};
export type RouteMap = {
  [href: string]: ElementChild | RouteDetails;
};
export type NavigationState = "idle" | "before" | "after";

export type RouterState = {
  navigation: NavigationState;
  url: URL;
  routes: RouteMap;
};
