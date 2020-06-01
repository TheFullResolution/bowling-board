import { Observable } from "rxjs";
import { useEffect, useState } from "react";

export const useSelector = <T extends any>(
  selector: Observable<T>,
  defaultState: T
): [T] => {
  const [value, setState] = useState<T>(defaultState);

  useEffect(() => {
    const sub = selector.subscribe((s) => setState(s));
    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value];
};
