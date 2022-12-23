import { DefaultProps } from "rxfm";
import { Observable, map } from "rxjs";
import { updateRouterState } from "./state";

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
          updateRouterState({ route: url });
        })
      )}
    >
      {children}
    </a>
  );
};
