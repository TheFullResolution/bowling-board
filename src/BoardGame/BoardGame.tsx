import React from "react";
import range from "lodash.range";
import cls from "classnames";
import { AppState } from "../App/App.state";
import {
  Box,
  Container,
  createStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PlayerTile } from "./components/PlayerTile";
import { useSharedState } from "../stateUtils";

interface Props {}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: "grid",
      gridTemplateColumns: "200px auto 200px",
      gridColumnGap: theme.spacing(2),
    },
    column: {
      display: "grid",
      gridTemplateColumns: "auto",
      gridTemplateRows: "30px 50px",
      gridRowGap: theme.spacing(2),
      gridAutoRows: "100px",
    },
    frames: {
      overflowX: "auto",
      paddingBottom: theme.spacing(5),
    },
    framesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(10, 100px)",
      gridColumnGap: theme.spacing(2),
    },
  })
);

export const BoardGame: React.FC<Props> = () => {
  const [{ players }] = useSharedState(AppState);

  const classes = useStyles();
  return (
    <Container maxWidth="xl">
      <Box my={6}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Bowling Board
        </Typography>
      </Box>
      <div className={classes.container}>
        <div className={classes.column}>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            Players
          </Typography>
          <div />
          {players.map((player) => (
            <PlayerTile key={player.id} player={player}></PlayerTile>
          ))}
        </div>
        <div className={cls(classes.column, classes.frames)}>
          <div />
          <div />
          {players.map((player) => (
            <div className={classes.framesGrid} key={player.id}>
              {range(10).map((frame) => (
                <Paper key={player.id + frame}>Frame</Paper>
              ))}
            </div>
          ))}
        </div>
        <div>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            Score
          </Typography>
        </div>
      </div>
    </Container>
  );
};
