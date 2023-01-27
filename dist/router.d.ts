import RxFM, { Component, DefaultProps } from "rxfm";
import { Observable } from "rxjs";
import { RouteMap } from "./types";
type RouterProps = {
    url?: URL;
    routes: RouteMap | Observable<RouteMap>;
    fallback?: (props: {
        url: URL;
    }) => Component;
} & DefaultProps;
export declare const Router: ({ url, routes, fallback, children, }: RouterProps) => RxFM.JSX.Element;
export {};
