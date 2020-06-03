import { BehaviorSubject, combineLatest, from, Subject } from "rxjs";
import {
  filter,
  flatMap,
  groupBy,
  map,
  reduce,
  shareReplay,
  skipWhile,
  withLatestFrom,
} from "rxjs/operators";
import { FrameState, frameStateSelector } from "./Frame.state";
import { processNewFrame } from "./helpers/processNewFrame";
import { recalculateScores } from "./helpers/recalculateScores";
import { recalculateLatsScores } from "./helpers/recalculateLastScores";
import { getExtraFrame } from "./helpers/getExtraFrame";
import {
  ActionType,
  AppActions,
  FinishFrameAction,
  LastFrameAction,
} from "../App.actions";

export interface ScoreState extends FrameState {
  score1: number;
  score2: number;
  points: number;
  addFramesToPoints: number;
  strike: boolean;
  spare: boolean;
}

const scoreStateSubject$ = new BehaviorSubject<ScoreState[][]>([]);
export const ScoreState = {
  state$: scoreStateSubject$,
  dispatch: (newState: ScoreState[][]) => {
    ScoreState.state$.next(newState);
  },
  registerActions: (actions$: Subject<AppActions>) => ({
    finishFrame$: actions$.pipe(
      filter((action): action is FinishFrameAction => {
        return (action as FinishFrameAction).type === ActionType.finishFrame;
      }),
      withLatestFrom(frameStateSelector),
      flatMap(([action, frameState]) => processNewFrame(frameState)),
      withLatestFrom(ScoreState.state$),
      flatMap(([frameState, scoreState]) => {
        scoreState.push(frameState);

        return recalculateScores(scoreState);
      }),
      map((payload) => {
        actions$.next({
          type: ActionType.resetFrame,
        });

        return {
          type: ActionType.setScoreState,
          payload,
        };
      })
    ),
    lastFrame$: actions$.pipe(
      filter((action): action is LastFrameAction => {
        return (action as LastFrameAction).type === ActionType.lastFrame;
      }),
      withLatestFrom(frameStateSelector, ScoreState.state$),
      flatMap(([action, frameState, scoreState]) =>
        combineLatest(
          getExtraFrame(frameState, scoreState[scoreState.length - 1]),
          from([scoreState])
        )
      ),
      flatMap(([lastFrame, scoreState]) => {
        scoreState.push(lastFrame);

        return recalculateLatsScores(scoreState);
      }),
      map((payload) => {
        actions$.next({
          type: ActionType.resetFrame,
        });

        return {
          type: ActionType.setScoreState,
          payload,
        };
      })
    ),
  }),
};

export const scoreStateSelector = ScoreState.state$
  .asObservable()
  .pipe(shareReplay(1));

export const scoreStateTotalsSelector = scoreStateSelector.pipe(
  flatMap((scores) =>
    from(scores).pipe(
      flatMap((scores) => scores),
      groupBy((score) => score.id),
      flatMap((group) =>
        group.pipe(
          reduce(
            (acc, score) => {
              acc.id = acc.id || score.id;
              acc.points = acc.points + score.points;
              return acc;
            },
            { id: "", points: 0 } as { id: string; points: number }
          )
        )
      ),
        reduce((acc, value) => {
          acc.push(value);
          return acc;
        }, [] as { id: string; points: number }[])
    )
  )
);

export const createScoreFrameSelector = (frame: number, id: string) => {
  return scoreStateSelector.pipe(
    map((scoreState) => scoreState[frame - 1]),
    skipWhile((scores) => !scores),
    flatMap((scores) => scores),
    filter((el) => el.id === id)
  );
};

export const createScoreTotalSelector = (id: string) =>
  scoreStateSelector.pipe(
    flatMap((scores) =>
      from(scores).pipe(
        flatMap((scores) => scores),
        filter((score) => score.id === id),
        reduce((acc, score) => acc + score.points, 0)
      )
    )
  );
