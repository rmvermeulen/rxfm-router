import RxFM, { DefaultProps } from "rxfm";
import { Observable } from "rxjs";
import { RouteMap } from "./types";
type RouterProps = {
    url?: URL;
    routes: RouteMap | Observable<RouteMap>;
} & DefaultProps;
export declare const Router: ({ url, routes, }: RouterProps) => RxFM.JSX.Element;
export {};
