import { BehaviorSubject, Subject } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { sessionPlayerSelector } from "./Session.state";

export enum AppPosition {
  starGame,
  gameBoard,
}

export interface State {
  appPosition: AppPosition;
  showInstructions: boolean;
}

export const defaultState: State = {
  appPosition: AppPosition.starGame,
  showInstructions: true,
};

const appStateSubject = new BehaviorSubject<State>(defaultState);
const appStateDispatcher = new Subject<Partial<State>>();

export const AppState = {
  init: () => {
    appStateDispatcher.subscribe((newState) => {
      appStateSubject.next({ ...appStateSubject.getValue(), ...newState });
    });

    sessionPlayerSelector.subscribe(() => {
      appStateDispatcher.next({ appPosition: AppPosition.gameBoard });
    });
  },
  update: (newState: Partial<State>) => {
    appStateDispatcher.next(newState);
  }

};

export const appPositionSelector = appStateSubject.pipe(
  map((state) => state.appPosition),
  distinctUntilChanged()
);
