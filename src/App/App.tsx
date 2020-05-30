import React from "react";
import banner from "./banner.jpg";
import { Box, Container, CssBaseline, Typography } from "@material-ui/core";
import { StartGame } from "../StartGame/StartGame";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  banner: {
    objectFit: "cover",
    width: "100%",
    height: "100%"
  }
});

export const App: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <CssBaseline></CssBaseline>
      <Box height="300px">
        <img src={banner} alt="banner" className={classes.banner} />
      </Box>
      <Container maxWidth="lg">
        <Box my={6}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Bowling Board
          </Typography>
        </Box>
        <Box my={4} textAlign="center">
          <StartGame />
        </Box>
      </Container>
    </>
  );
};
