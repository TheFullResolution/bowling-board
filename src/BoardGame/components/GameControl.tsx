import React from "react";
import { Box, Button, Typography } from "@material-ui/core";
import { GameState } from "../../state";

interface Props {
  currentFrame: number;
}

export const GameControl: React.FC<Props> = ({ currentFrame }) => {
  const onClick = () => {
    GameState.update({ frame: currentFrame + 1 });
  };
  return (
    <>
      <Typography variant="h5" component="p" gutterBottom align="center">
        Current Frame: {currentFrame}
      </Typography>
      <Box textAlign="center">
        <Button variant="contained" color="secondary" onClick={onClick}>
          Run this frame
        </Button>
      </Box>
    </>
  );
};
