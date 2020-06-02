import { BehaviorSubject, Subject } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";

export interface GameState {
  frame: number;
  maxFrames: number;
}

const gameStateSubject = new BehaviorSubject<GameState>({
  frame: 1,
  maxFrames: 10,
});

const gameDispatcher = new Subject<Partial<GameState>>();

export const GameState = {
  init: () => {
    gameDispatcher.subscribe((newState) => {
      gameStateSubject.next({ ...gameStateSubject.getValue(), ...newState });
    });
  },
  update: (val: Partial<GameState>) => {
    gameDispatcher.next(val);
  },
};

export const gameStateSelector = gameStateSubject.asObservable();

export const gameFrameSelector = gameStateSubject.pipe(
  map((state) => state.frame),
  distinctUntilChanged()
);
