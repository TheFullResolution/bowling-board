import { Observable } from "rxjs";
import { useEffect, useState } from "react";
import { defaultState, State } from "../state/App.state";

interface UseAppStateParams<T extends any> {
  selector: Observable<T>;
  defaultStateKey: keyof State;
}

export const useAppState = <T extends any>({
  selector,
  defaultStateKey,
}: UseAppStateParams<T>): [T] => {
  const [value, setState] = useState<T>(defaultState[defaultStateKey] as T);

  useEffect(() => {
    const sub = selector.subscribe((s) => setState(s));
    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value];
};
