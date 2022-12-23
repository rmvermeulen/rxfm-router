import { BehaviorSubject } from "rxjs";
import { combineLatestObject } from "rxjs-etc";

export type NavigationState = "idle" | "before" | "after";

export type RouterState = {
  navigation: NavigationState;
  url: string;
  route: string;
};

export const navigation = new BehaviorSubject<NavigationState>("idle");
export const url = new BehaviorSubject<string>("");
export const route = new BehaviorSubject<string>("");

export const store = combineLatestObject({ navigation, url, route });
