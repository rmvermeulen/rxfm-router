import RxFM, { DefaultProps } from "rxfm";
import { Observable, map } from "rxjs";
import { routerState } from "./store";

export const Link = ({
  href,
  children,
}: { href: Observable<string> } & DefaultProps) => {
  return (
    <a
      href={href}
      onClick={href.pipe(
        map((url) => (e) => {
          e.preventDefault();
          routerState.next({
            type: "set url",
            payload: url,
          });
        })
      )}
    >
      {children}
    </a>
  );
};
