import { BehaviorSubject, combineLatest, from, Subject } from "rxjs";
import {
  filter,
  flatMap,
  groupBy,
  map,
  reduce,
  share,
  skip,
  skipWhile,
  withLatestFrom,
} from "rxjs/operators";
import { FrameState, frameStateSelector } from "../Frame.state";
import { processNewFrame } from "./processNewFrame";
import { recalculateScores } from "./recalculateScores";
import { gameStateSelector } from "../Game.state";
import { recalculateLatsScores } from "./recalculateLastScores";
import { getExtraFrame } from "./getExtraFrame";

export interface ScoreState extends FrameState {
  score1: number;
  score2: number;
  points: number;
  addFramesToPoints: number;
  strike: boolean;
  spare: boolean;
}

const scoreStateSubject = new BehaviorSubject<ScoreState[][]>([]);

const scoreDispatcher = new Subject<FrameState[]>();

export const ScoreState = {
  init: () => {
    gameStateSelector
      .pipe(
        skip(1),
        filter((frameState) => frameState.frame <= frameState.maxFrames),
        withLatestFrom(frameStateSelector),
        flatMap(([gameState, frameState]) => processNewFrame(frameState)),
        withLatestFrom(scoreStateSubject),
        flatMap(([frameState, scoreState]) => {
          scoreState.push(frameState);

          return recalculateScores(scoreState);
        })
      )
      .subscribe((scores) => {
        scoreStateSubject.next(scores);
      });

    gameStateSelector
      .pipe(
        skip(1),
        filter((frameState) => frameState.frame > frameState.maxFrames),
        withLatestFrom(frameStateSelector),
        flatMap(([gameState, frameState]) => {
          console.log(frameState);

          const scoreState = scoreStateSubject.getValue();

          return combineLatest(
            getExtraFrame(frameState, scoreState[scoreState.length - 1]),
            from([scoreState])
          );
        }),
        flatMap(([lastFrame, scoreState]) => {
          scoreState.push(lastFrame);

          return recalculateLatsScores(scoreState);
        })
      )
      .subscribe((scores) => {
        scoreStateSubject.next(scores);
      });
  },
  update: (frame: FrameState[]) => {
    scoreDispatcher.next(frame);
  },
};

export const scoreStateSelector = scoreStateSubject
  .asObservable()
  .pipe(share());

export const scoreStateTotals = scoreStateSubject.pipe(
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
      )
    )
  )
);

export const createScoreFrameSelector = (frame: number, id: string) => {
  return scoreStateSubject.pipe(
    map((scoreState) => scoreState[frame - 1]),
    skipWhile((scores) => !scores),
    flatMap((scores) => scores),
    filter((el) => el.id === id)
  );
};

export const createScoreTotalSelector = (id: string) =>
  scoreStateSubject.pipe(
    flatMap((scores) =>
      from(scores).pipe(
        flatMap((scores) => scores),
        filter((score) => score.id === id),
        reduce((acc, score) => acc + score.points, 0)
      )
    )
  );
