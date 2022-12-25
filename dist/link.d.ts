import RxFM, { DefaultProps } from "rxfm";
import { Observable } from "rxjs";
export declare const Link: ({ href, children, }: {
    href: Observable<string>;
} & DefaultProps<import("rxfm").ElementType>) => RxFM.JSX.Element;
