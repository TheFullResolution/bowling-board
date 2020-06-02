import { BehaviorSubject, Subject } from "rxjs";
import { map, skip, skipWhile } from "rxjs/operators";
import { gameStateSelector } from "./Game.state";

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

    gameStateSelector
      .pipe(
        map((gameState) => gameState.frame > gameState.maxFrames),
        skipWhile((el) => !el)
      )
      .subscribe((nextGame) => {
        const state = sessionStateSubject.getValue();
        sessionStateSubject.next({ ...state, game: state.game + 1 });
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
