import { BehaviorSubject, Subject } from "rxjs";
import { map, skip } from "rxjs/operators";

interface SetPlayers {
  id: string;
  value: string;
}

interface SessionState {
  players: SetPlayers[];
}

const sessionStateSubject = new BehaviorSubject<SessionState>({ players: [] });

const sessionDispatcher = new Subject<Partial<SessionState>>();

export const SessionState = {
  init: () => {
    sessionDispatcher.subscribe((newState) => {
      sessionStateSubject.next({
        ...sessionStateSubject.getValue(),
        ...newState,
      });
    });
  },
};

export const updateSessionState = (newState: Partial<SessionState>) => {
  sessionDispatcher.next(newState);
};

export const sessionPlayerSelector = sessionStateSubject.pipe(
  map((state) => state.players),
  skip(1)
);
