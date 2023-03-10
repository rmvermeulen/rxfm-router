import RxFM, { DefaultProps } from "rxfm";
import { Observable, map } from "rxjs";
import { navigateTo } from "./state";

export const Link = ({
  href,
  children,
}: { href: Observable<string> } & DefaultProps) => (
  <a
    href={href}
    onClick={href.pipe(
      map((url) => (e: MouseEvent) => {
        e.preventDefault();
        navigateTo(url);
      })
    )}
  >
    {children}
  </a>
);
