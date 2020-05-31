import { Observable } from "rxjs";
import { useEffect, useState } from "react";
import { defaultState } from "./App.state";

export const useAppState = <T extends any>(
  selector: Observable<T>,
  defaultStateKey: keyof typeof defaultState
): [T] => {
  const [value, setState] = useState<T>(defaultState[defaultStateKey] as T);

  useEffect(() => {
    const sub = selector.subscribe((s) => setState(s));
    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value];
};
