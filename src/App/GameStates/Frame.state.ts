import { BehaviorSubject, from, Subject } from "rxjs";
import {
  distinctUntilChanged,
  filter,
  flatMap,
  map,
  reduce,
} from "rxjs/operators";
import {
  ActionType,
  AppActions,
  SetPlayersAction,
  UpdateFrameAction,
} from "../App.actions";

export interface FrameState {
  id: string;
  score1: number | null;
  score2: number | null;
}

const frameStateDispatcher$ = new BehaviorSubject<FrameState[]>([]);

const getInitialFrameState = (players: { id: string; value: string }[]) =>
  from(players).pipe(
    map(({ id }) => ({ id, score1: null, score2: null })),
    reduce((arr, el) => {
      arr.push(el);
      return arr;
    }, [] as FrameState[])
  );

export const FrameState = {
  state$: frameStateDispatcher$,

  dispatch: (newState: FrameState[]) => {
    frameStateDispatcher$.next(newState);
  },
  registerActions: (actions$: Subject<AppActions>) => ({

    setInitialFrames$: actions$.pipe(
      filter((action): action is SetPlayersAction => {
        return (action as SetPlayersAction).type === ActionType.setPlayers;
      }),
      flatMap((action) => getInitialFrameState(action.payload)),
      map((payload) => ({
        type: ActionType.setFrame,
        payload,
      }))
    ),

    updateFrame$: actions$.pipe(
      filter((action): action is UpdateFrameAction => {
        return (action as UpdateFrameAction).type === ActionType.updateFrame;
      }),
      map((action) => {
        const state = FrameState.state$.getValue();
        return state.map((el) => {
          if (el.id === action.payload.id) {
            return {
              ...el,
              score1:
                action.payload.score1 ??
                (action.payload.score1 === null ? null : el.score1),
              score2: action.payload.score2 ?? null,
            };
          }
          return el;
        });
      }),
      map((payload) => ({
        type: ActionType.setFrame,
        payload,
      }))
    ),
  }),
};

export const frameStateSelector = FrameState.state$.asObservable();

export const createFrameSelector = (id: string) =>
  frameStateSelector.pipe(
    flatMap((el) => from(el)),
    filter((el) => el.id === id),
    distinctUntilChanged()
  );
