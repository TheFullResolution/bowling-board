import { BehaviorSubject, Subject } from "rxjs";
import { map, skip } from "rxjs/operators";

export interface SetPlayers {
  id: string;
  value: string;
}

interface SessionScore {
  id: string;
  points: string;
}

interface SessionState {
  game: number;
  players: SetPlayers[];
  sessionScores: SessionScore[];
}

const sessionStateSubject = new BehaviorSubject<SessionState>({
  game: 1,
  players: [],
  sessionScores: [],
});

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
  update: (newState: Partial<SessionState>) => {
    sessionDispatcher.next(newState);
  },
};

export const sessionPlayerSelector = sessionStateSubject.pipe(
  map((state) => state.players),
  skip(1)
);
