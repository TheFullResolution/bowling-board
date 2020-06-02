import { FrameState } from "../Frame.state";
import { from } from "rxjs";
import { map, reduce } from "rxjs/operators";
import { weightedRand } from "../../stateUtils/weightedRand";
import { MAX_POINTS, RANGE_FOR_POINTS } from "../../config";
import { ScoreState } from "./Score.state";

export function processNewFrame(frameState: FrameState[]) {
  return from(frameState).pipe(
    map((frame) => {
      let score1: number;
      let score2: number;
      if (frame.score1 !== null) {
        score1 = frame.score1;
        score2 = frame.score2 ?? 0;
      } else {
        score1 = weightedRand(RANGE_FOR_POINTS);

        const remainingPoints = MAX_POINTS - score1;

        score2 = remainingPoints > 0 ? weightedRand(remainingPoints + 1) : 0;
      }

      return {
        ...frame,
        score1,
        score2,
        points: score1 + score2,
        addFramesToPoints: 0,
        strike: false,
        spare: false,
      };
    }),
    map((frame) => {
      if (frame.score1 === 10) {
        return {
          ...frame,
          strike: true,
          addFramesToPoints: 2,
        };
      } else if (frame.points === 10) {
        return {
          ...frame,
          addFramesToPoints: 1,
          spare: true,
        };
      } else return frame;
    }),
    reduce((acc, value) => {
      acc.push(value);
      return acc;
    }, [] as ScoreState[])
  );
}
