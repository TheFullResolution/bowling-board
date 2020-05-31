import { BehaviorSubject } from "rxjs";
import { useEffect, useState } from "react";
import { skip } from "rxjs/operators";

export const useSharedState = <T extends {}>(
  subject: BehaviorSubject<T>
): [T, (state: T) => void] => {
  const [value, setState] = useState(subject.getValue());

  useEffect(() => {
    const sub = subject.pipe(skip(1)).subscribe((s) => setState(s));
    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const newSetState = (state: T) => {
    subject.next(state);
  };

  return [value, newSetState];
};
