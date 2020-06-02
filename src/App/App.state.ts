import { merge, Subject } from "rxjs";
import {
  distinctUntilChanged,
  map,
  publishReplay,
  refCount,
  scan,
} from "rxjs/operators";
import { ActionType, AppActions } from "./App.actions";
import { FrameState } from "./GameStates/Frame.state";
import { GameState } from "./GameStates/Game.state";

export enum AppPosition {
  starGame,
  gameBoard,
}

export interface PlayerState {
  id: string;
  value: string;
  automatic: boolean;
}

interface SessionScore {
  id: string;
  points: string;
}

export interface State {
  appPosition: AppPosition;
  showInstructions: boolean;
  sessionScores: SessionScore[][];
  players: PlayerState[];
}

export const defaultState: State = {
  appPosition: AppPosition.starGame,
  showInstructions: true,
  sessionScores: [],
  players: [],
};

export const appStateActions$ = new Subject<AppActions>();

const frameActions = FrameState.registerActions(appStateActions$);
const gameActions = GameState.registerActions(appStateActions$);

const appStateDispatcher$ = merge(
  appStateActions$,
  frameActions.updateFrame$,
  frameActions.setInitialFrames$,
  gameActions.finishFrame$,
);

export const AppState = {
  state$: appStateDispatcher$.pipe(
    scan((state: State, action: AppActions) => {
      console.log({ action });
      switch (action.type) {
        case ActionType.setPlayers:
          return {
            ...state,
            appPosition: AppPosition.gameBoard,
            players: action.payload.map((player) => ({
              ...player,
              automatic: true,
            })),
          };

        case ActionType.updatePlayer:
          return {
            ...state,
            players: state.players.map((player) => {
              if (action.payload.id === player.id) {
                return { ...player, ...action.payload };
              }
              return player;
            }),
          };

        case ActionType.setGameState:
          GameState.dispatch(action.payload);
          return state;

        case ActionType.setFrame:
          FrameState.dispatch(action.payload);
          return state;

        default:
          return state;
      }
    }, defaultState),
    publishReplay(1),
    refCount()
  ),
  dispatch: (action: AppActions) => {
    appStateActions$.next(action);
  },
};

export const appPositionSelector = AppState.state$.pipe(
  map((state) => state.appPosition),
  distinctUntilChanged()
);

export const playersSelector = AppState.state$.pipe(
  map((state) => state.players)
);
