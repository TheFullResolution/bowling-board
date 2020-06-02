import { BehaviorSubject, Subject } from "rxjs";
import { ActionType, AppActions, FinishFrameAction } from "../App.actions";
import { filter, map } from "rxjs/operators";

export interface GameState {
  frame: number;
  maxFrames: number;
  finished: number;
}

const gameStateDispatcher$ = new BehaviorSubject<GameState>({
  frame: 1,
  maxFrames: 11,
  finished: 0,
});

export const GameState = {
  state$: gameStateDispatcher$,

  dispatch: (newState: GameState) => {
    gameStateDispatcher$.next(newState);
  },

  registerActions: (actions$: Subject<AppActions>) => ({
    finishFrame$: actions$.pipe(
      filter((action): action is FinishFrameAction => {
        return (action as FinishFrameAction).type === ActionType.finishFrame;
      }),
      map(() => {
        const state = GameState.state$.getValue();

        return { ...state, frame: state.frame + 1 };
      }),
      map((payload) => {
        if (payload.frame + 1 > payload.maxFrames) {
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
export const gameStateSelector = GameState.state$;
