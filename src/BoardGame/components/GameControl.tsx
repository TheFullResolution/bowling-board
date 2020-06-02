import React from "react";
import { Box, Button, Typography } from "@material-ui/core";
import { AppState } from "../../App/App.state";
import { ActionType } from "../../App/App.actions";
import { GameState } from "../../App/GameStates/Game.state";

interface Props {
  gameState: GameState;
}

export const GameControl: React.FC<Props> = ({ gameState }) => {
  const nextFrame = () => {
    AppState.dispatch({ type: ActionType.finishFrame });
  };

  const isLast = gameState.frame === gameState.maxFrames;

  const gameIsFinished = gameState.frame > gameState.maxFrames;

  return (
    <>
      {gameIsFinished ? (
        <>
          <Typography variant="h4" component="p" gutterBottom align="center">
            GAME COMPLETED
          </Typography>
          <Box textAlign="center">
            <Button variant="contained" color="primary">
              Go to Score Board
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h5" component="p" gutterBottom align="center">
            Current Frame: {isLast ? "Extra Frame" : gameState.frame}
          </Typography>
          <Box textAlign="center">
            <Button variant="contained" color="secondary" onClick={nextFrame}>
              Complete Frame
            </Button>
          </Box>{" "}
        </>
      )}
    </>
  );
};
