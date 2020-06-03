import { from } from "rxjs";
import { flatMap, map, reduce } from "rxjs/operators";
import { ScoreState } from "../Score.state";

const getExtraPoints = (
  scoreState: ScoreState[][],
  index: number,
  id: string
) => {
  return scoreState[index]?.find((el) => el.id === id)?.points ?? 0;
};

export function recalculateScores(scoreState: ScoreState[][]) {
  return from(scoreState).pipe(
    flatMap((scores, scoreArrayIndex) => {
      return from(scores).pipe(
        map((score) => {
          if (score.addFramesToPoints === 0) {
            return score;
          }

          let frameIndex = scoreArrayIndex + 1;

          if (score.addFramesToPoints === 1 && score.strike) {
            frameIndex = scoreArrayIndex + 2;
          }

          if (scoreState.length > frameIndex) {
            const extraPoints = getExtraPoints(
              scoreState,
              frameIndex,
              score.id
            );

            const points = score.points + extraPoints;
            const addFramesToPoints = score.addFramesToPoints - 1;

            return { ...score, points, addFramesToPoints };
          }
          return score;
        }),
        reduce((acc, value) => {
          acc.push(value);
          return acc;
        }, [] as ScoreState[])
      );
    }),
    reduce((acc, value) => {
      acc.push(value);
      return acc;
    }, [] as ScoreState[][])
  );
}
