import RxFM, { DefaultProps } from "rxfm";
import { Observable, map, of } from "rxjs";
import { updateRouterState } from "./state";

export const Link = ({
  href,
  children,
}: { href: Observable<string> } & DefaultProps) => {
  console.log("rendering Link", { href });
  return (
    <a
      href={href}
      onClick={href.pipe(
        map((url) => (e: MouseEvent) => {
          console.log("rxfm-router:link [clicked]", url);
          e.preventDefault();
          updateRouterState({ route: url });
        })
      )}
    >
      {children}
    </a>
  );
};
