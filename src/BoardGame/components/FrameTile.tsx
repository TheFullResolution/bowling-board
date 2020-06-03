import React from "react";
import { createStyles, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import cls from "classnames";
import { FrameTileForm } from "./FrameTileForm";
import { FrameTileResults } from "./FrameTileResults";
import { FrameTileLastWrapper } from "./FrameTileLastWrapper";
import {PlayerState} from '../../App/GameStates/Players.state'

interface Props {
  player: PlayerState;
  frame: number;
  currentFrame: number;
  isLast: boolean;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1),
      display: "flex",
      alignItems: "center",
    },
    currentFrame: {
      border: `3px solid ${theme.palette.secondary.light}`,
    },
    points: {
      fontWeight: theme.typography.fontWeightBold,
    },
    pointsRow: {
      backgroundColor: theme.palette.primary.light,
    },
  })
);

export const FrameTile: React.FC<Props> = ({
  player,
  frame,
  currentFrame,
  isLast,
}) => {
  const classes = useStyles();

  const isCurrent = frame === currentFrame;
  const isPast = frame < currentFrame;

  return (
    <Paper
      elevation={player.automatic ? 1 : 5}
      className={cls(classes.container, { [classes.currentFrame]: isCurrent })}
    >
      {!player.automatic && isCurrent && isLast ? (
        <FrameTileLastWrapper player={player} frame={frame} />
      ) : !player.automatic && isCurrent ? (
        <FrameTileForm player={player} />
      ) : (
        isPast && (
          <FrameTileResults frame={frame} player={player} isLast={isLast} />
        )
      )}
    </Paper>
  );
};
