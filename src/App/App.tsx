import React from "react";
import { Box, Container, CssBaseline, Typography } from "@material-ui/core";

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
      </Container>
    </>
  );
};
