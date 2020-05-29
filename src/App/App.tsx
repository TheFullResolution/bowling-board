import React from "react";
import { Box, Container, CssBaseline, Typography } from "@material-ui/core";
import { StartGame } from "../StartGame/StartGame";

export const App: React.FC = () => {
  return (
    <>
      <CssBaseline></CssBaseline>
      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Bowling Board
          </Typography>
        </Box>
        <Box my={10} textAlign="center">
          <StartGame />
        </Box>
      </Container>
    </>
  );
};
