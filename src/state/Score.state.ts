import { BehaviorSubject, Subject } from "rxjs";
import {
  filter,
  find,
  flatMap,
  map,
  scan,
  skipWhile,
  withLatestFrom,
} from "rxjs/operators";
import { weightedRand } from "../stateUtils/weightedRand";
import { MAX_POINTS, RANGE_FOR_POINTS } from "../config";
import { FrameState } from "./Frame.state";

interface ScoreState extends FrameState {
  score1: number;
  score2: number;
  points: number;
}

const scoreStateSubject = new BehaviorSubject<ScoreState[][]>([]);

const scoreDispatcher = new Subject<FrameState[]>();

export const ScoreState = {
  init: () => {
    scoreDispatcher
      .pipe(
        map((frameState) => {
          return frameState.map((el) => {
            let score1: number;
            let score2: number;

            if (el.score1 !== null && el.score2 !== null) {
              score1 = el.score1;
              score2 = el.score2;
            } else {
              score1 = weightedRand(RANGE_FOR_POINTS);

              const remainingPoints = MAX_POINTS - score1;

              score2 =
                remainingPoints > 0 ? weightedRand(remainingPoints + 1) : 0;
            }

            return { ...el, score1, score2, points: score1 + score2 };
          });
        }),
        withLatestFrom(scoreStateSubject),
        map(([frameState, scoreState]) => {
          scoreState.push(frameState);

          return scoreState;
        })
      )
      .subscribe((scores) => {
        console.log(scores);
        scoreStateSubject.next(scores);
      });
  },
  update: (frame: FrameState[]) => {
    scoreDispatcher.next(frame);
  },
};

export const createScoreFrameSelector = (frame: number, id: string) => {
  const index = frame - 1;

  return scoreStateSubject.pipe(
    skipWhile((state) => !state[index]),
    flatMap((state) => state[index]),
    find((el) => el.id === id)
  );
};

export const createScoreTotal = (id: string) =>
  scoreStateSubject.pipe(
    flatMap((scores) => scores),
    flatMap((scores) => scores),
    filter((score) => score.id === id),
    scan((acc, score) => acc + score.points, 0)
  );
