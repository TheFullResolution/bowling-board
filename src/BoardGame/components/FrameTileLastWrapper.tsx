import React, { useRef } from "react";
import { createScoreFrameSelector } from "../../App/GameStates/Score.state";
import { useSelector } from "../../stateUtils/useSelector";
import { FrameTileForm } from "./FrameTileForm";
import { Typography } from "@material-ui/core";
import {PlayerState} from '../../App/GameStates/Players.state'

interface Props {
  player: PlayerState;
  frame: number;
}

export const FrameTileLastWrapper: React.FC<Props> = ({ frame, player }) => {
  const scoreFrameSelector = useRef(
    createScoreFrameSelector(frame - 1, player.id)
  );

  const [scoreState] = useSelector(scoreFrameSelector.current, {
    id: "",
    score1: 0,
    score2: 0,
    points: 0,
    strike: false,
    spare: false,
    addFramesToPoints: 0,
  });

  return (
    <>
      {!scoreState.spare && !scoreState.strike ? (
        <Typography variant="h6" component="p" gutterBottom align="center">
          No Extra Throws
        </Typography>
      ) : (
        <FrameTileForm
          player={player}
          isLast={true}
          spare={scoreState.spare}
          strike={scoreState.strike}
        />
      )}
    </>
  );
};
