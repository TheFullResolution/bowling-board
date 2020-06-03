import { BehaviorSubject, Subject } from "rxjs";
import {
  ActionType,
  AppActions,
  FinishFrameAction,
  FinishGame,
} from "../App.actions";
import { filter, map, shareReplay, withLatestFrom } from "rxjs/operators";

export interface GameState {
  frame: number;
  maxFrames: number;
  gameFinished: boolean;
}

export const gameDefaultState = {
  frame: 1,
  maxFrames: 11,
  gameFinished: false,
};

const gameStateDispatcher$ = new BehaviorSubject<GameState>(gameDefaultState);

export const GameState = {
  state$: gameStateDispatcher$.pipe(
    map((state) => {
      if (state.frame > state.maxFrames) {
        state.gameFinished = true;
      }
      return state;
    })
  ),

  dispatch: (newState: GameState) => {
    gameStateDispatcher$.next(newState);
  },

  registerActions: (actions$: Subject<AppActions>) => ({
    finishGame$: actions$.pipe(
      filter((action): action is FinishGame => {
        return (action as FinishGame).type === ActionType.finishGame;
      }),
      map(() => ({
        type: ActionType.setGameState,
        payload: gameDefaultState,
      }))
    ),
    finishFrame$: actions$.pipe(
      filter((action): action is FinishFrameAction => {
        return (action as FinishFrameAction).type === ActionType.finishFrame;
      }),
      withLatestFrom(GameState.state$),
      map(([asction, state]) => {
        return { ...state, frame: state.frame + 1 };
      }),
      map((payload) => {
        if (payload.frame > payload.maxFrames) {
          actions$.next({
            type: ActionType.lastFrame,
          });
        } else {
          actions$.next({
            type: ActionType.nextFrame,
          });
        }
        return {
          type: ActionType.setGameState,
          payload,
        };
      })
    ),
  }),
};
export const gameStateSelector = GameState.state$.pipe(shareReplay(1));
