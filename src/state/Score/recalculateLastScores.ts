import { ScoreState } from "./Score.state";
import { from } from "rxjs";

export function recalculateLatsScores(scoreState: ScoreState[][]) {
  const extraFrame = scoreState[scoreState.length - 1];

  const lastFrame = scoreState[scoreState.length - 2].map((lastScore) => {
    if (lastScore.addFramesToPoints === 0) {
      return lastScore;
    }

    const extraScores = extraFrame.find((el) => el.id === lastScore.id) ?? {
      score1: 0,
      score2: 0,
    };

    if (lastScore.addFramesToPoints === 2) {
      lastScore.points =
        lastScore.points + extraScores.score1 + extraScores.score2;
    } else if (lastScore.addFramesToPoints === 1) {
      lastScore.points = lastScore.points + extraScores.score1;
    }
    return lastScore;
  });

  const previousFrame = scoreState[scoreState.length - 3].map(
    (previousScore) => {
      if (previousScore.addFramesToPoints === 0) {
        return previousScore;
      }

      const extraScores = extraFrame.find(
        (el) => el.id === previousScore.id
      ) ?? {
        score1: 0,
      };

      const lastScores = lastFrame.find((el) => el.id === previousScore.id) ?? {
        score1: 0,
      };

      if (previousScore.addFramesToPoints === 2) {
        previousScore.points =
          previousScore.points + lastScores.score1 + extraScores.score1;
      } else if (previousScore.addFramesToPoints === 1) {
        previousScore.points = previousScore.points + lastScores.score1;
      }
      return previousScore;
    }
  );

  const newState = [...scoreState];

  newState[newState.length - 2] = lastFrame;
  newState[newState.length - 3] = previousFrame;

  return from([newState]);
}
