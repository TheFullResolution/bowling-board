import { BehaviorSubject, from, Subject } from "rxjs";
import {
  filter,
  flatMap,
  map,
  reduce,
  skipWhile,
  withLatestFrom,
} from "rxjs/operators";
import { FrameState } from "../Frame.state";
import { processNewFrame } from "./processNewFrame";
import { recalculateScores } from "./recalculateScores";

export interface ScoreState extends FrameState {
  score1: number;
  score2: number;
  points: number;
  addFramesToPoints: number;
  strike: boolean;
}

const scoreStateSubject = new BehaviorSubject<ScoreState[][]>([]);

const scoreDispatcher = new Subject<FrameState[]>();

export const ScoreState = {
  init: () => {
    scoreDispatcher
      .pipe(
        flatMap((frameState) => processNewFrame(frameState)),
        withLatestFrom(scoreStateSubject),
        flatMap(([frameState, scoreState]) => {
          scoreState.push(frameState);

          return recalculateScores(scoreState);
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
