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
import { gameDefaultState, GameState } from "./GameStates/Game.state";
import { PlayersState } from "./GameStates/Players.state";
import { ScoreState } from "./GameStates/Score.state";
import { SessionState } from "./GameStates/Session.state";

export enum AppPosition {
  starGame,
  gameBoard,
  scoreBoard,
}

export interface State {
  appPosition: AppPosition;
  showInstructions: boolean;
  showFormModal: boolean;
}

export const defaultState: State = {
  appPosition: AppPosition.starGame,
  showInstructions: true,
  showFormModal: false,
};

export const appStateActions$ = new Subject<AppActions>();

const frameActions = FrameState.registerActions(appStateActions$);
const gameActions = GameState.registerActions(appStateActions$);
const playersActions = PlayersState.registerActions(appStateActions$);
const scoreActions = ScoreState.registerActions(appStateActions$);
const sessionsActions = SessionState.registerActions(appStateActions$);

const appStateDispatcher$ = merge(
  appStateActions$,
  frameActions.updateFrame$,
  frameActions.startGame$,
  frameActions.resetFrame$,
  gameActions.finishFrame$,
  playersActions.startGame$,
  playersActions.updatePlayers$,
  scoreActions.finishFrame$,
  scoreActions.lastFrame$,
  sessionsActions.finishGame$
);

export const AppState = {
  state$: appStateDispatcher$.pipe(
    scan((state: State, action: AppActions) => {
      console.log(JSON.stringify(action.type, null, 2), {
        payload: (action as any).payload,
      });
      switch (action.type) {
        case ActionType.startGame:
          return {
            ...state,
            appPosition: AppPosition.gameBoard,
          };

        case ActionType.finishGame:
          return {
            ...state,
            appPosition: AppPosition.scoreBoard,
          };

        case ActionType.toggleFormModal: {
          return { ...state, showFormModal: action.payload };
        }

        case ActionType.playeAnotherGame: {
          ScoreState.dispatch([]);
          GameState.dispatch(gameDefaultState);
          return { ...state, appPosition: AppPosition.gameBoard };
        }

        case ActionType.createNewGame: {
          ScoreState.dispatch([]);
          GameState.dispatch(gameDefaultState);
          SessionState.dispatch([]);
          return {
            ...state,
            appPosition: AppPosition.starGame,
            showFormModal: true,
          };
        }

        case ActionType.setScoreState:
          ScoreState.dispatch(action.payload);
          return state;

        case ActionType.setPlayers:
          PlayersState.dispatch(action.payload);
          return state;

        case ActionType.setGameState:
          GameState.dispatch(action.payload);
          return state;

        case ActionType.setFrame:
          FrameState.dispatch(action.payload);
          return state;
        case ActionType.setSessionState:
          SessionState.dispatch(action.payload);
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

export const appFormModalSelector = AppState.state$.pipe(
  map((state) => state.showFormModal),
  distinctUntilChanged()
);
