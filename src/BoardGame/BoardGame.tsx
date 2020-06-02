import React from "react";
import range from "lodash.range";
import cls from "classnames";
import { Box, Container, createStyles, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PlayerTile } from "./components/PlayerTile";
import { FrameTile } from "./components/FrameTile";
import { GameControl } from "./components/GameControl";
import { useSelector } from "../stateUtils/useSelector";
import { playersSelector } from "../state/Player.state";
import { gameStateSelector } from "../state/Game.state";
import { ScoreTile } from "./components/ScoreTile";

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
      gridAutoRows: "140px",
    },
    frames: {
      overflowX: "auto",
      paddingBottom: theme.spacing(5),
    },
    framesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(10, 200px)",
      gridColumnGap: theme.spacing(2),
    },
  })
);

export const BoardGame: React.FC<Props> = () => {
  const classes = useStyles();

  const [players] = useSelector(playersSelector, []);
  const [game] = useSelector(gameStateSelector, {
    frame: 1,
    maxFrames: 10,
  });

  const frames = range(1, game.maxFrames + 1);

  return (
    <Container maxWidth="xl">
      <Box my={6}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Bowling Board
        </Typography>
      </Box>
      <GameControl currentFrame={game.frame} />
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
          <div className={classes.framesGrid}>
            {frames.map((frame) => {
              const isCurrent = frame === game.frame;
              const isPast = frame < game.frame;
              return (
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  align="center"
                  key={frame}
                  id={`frame-${frame}`}
                  color={
                    isCurrent ? "secondary" : isPast ? "textSecondary" : "initial"
                  }
                >
                  Frame {frame}
                </Typography>
              );
            })}
          </div>
          {players.map((player) => (
            <div className={classes.framesGrid} key={player.id}>
              {frames.map((frame) => (
                <FrameTile
                  key={player.id + frame}
                  player={player}
                  frame={frame}
                  currentFrame={game.frame}
                />
              ))}
            </div>
          ))}
        </div>
        <div className={classes.column}>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            Score
          </Typography>
          <div />
          {players.map((player) => (
            <ScoreTile key={player.id} playerId={player.id} />
          ))}
        </div>
      </div>
    </Container>
  );
};
