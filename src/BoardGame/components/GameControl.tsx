import React from "react";
import { Box, Button, Typography } from "@material-ui/core";

interface Props {
  currentFrame: number;
}

export const GameControl: React.FC<Props> = ({ currentFrame }) => {


  return (
    <>
      <Typography variant="h5" component="p" gutterBottom align="center">
        Current Frame: {currentFrame}
      </Typography>
      <Box textAlign="center">
        <Button variant="contained" color="secondary">
          Run this frame
        </Button>
      </Box>
    </>
  );
};
