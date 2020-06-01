import React, { useEffect } from "react";
import {
  createStyles,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@material-ui/core";
import range from "lodash.range";
import { makeStyles } from "@material-ui/core/styles";
import cls from "classnames";
import { useSelector } from "../../stateUtils/useSelector";
import { createFrameSelector, FrameState } from "../../state/Frame.state";
import { PlayerState } from "../../state/Player.state";

const RANGE_FOR_POINTS = 11;

interface Props {
  player: PlayerState;
  frame: number;
  currentFrame: number;
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
    formWrapper: {
      flex: "auto",
    },
    formcontrol: {
      width: "100%",
      "&:not(:first-child)": {
        marginTop: theme.spacing(1),
      },
    },
  })
);

export const FrameTile: React.FC<Props> = ({ player, frame, currentFrame }) => {
  const isCurrent = frame === currentFrame;

  const [frameState] = useSelector(createFrameSelector(player.id), {
    id: "",
    score1: null,
    score2: null,
  });

  const createHandleChange = (type: "score1" | "score2") => (
    event: React.ChangeEvent<any>
  ) => {
    const val =
      type === "score1"
        ? { score1: event.target.value }
        : { score2: event.target.value };
    FrameState.update({ id: player.id, ...val });
  };

  useEffect(() => {
    FrameState.update({ id: player.id, score1: null, score2: null });
  }, [player.id, player.automatic]);

  const classes = useStyles();

  const score2options = RANGE_FOR_POINTS - (frameState.score1 ?? 0);

  return (
    <Paper
      elevation={player.automatic ? 1 : 5}
      className={cls(classes.container, { [classes.currentFrame]: isCurrent })}
    >
      {!player.automatic && isCurrent ? (
        <div className={classes.formWrapper}>
          <FormControl
            variant="outlined"
            className={classes.formcontrol}
            size={"small"}
          >
            <InputLabel id="select-label-1">First Round</InputLabel>
            <Select
              labelId="select-label-1"
              id="select-1"
              value={frameState.score1 ?? ""}
              onChange={createHandleChange("score1")}
              label="First Round"
            >
              {range(RANGE_FOR_POINTS).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            className={classes.formcontrol}
            size={"small"}
          >
            <InputLabel id="select-label-2">Second Round</InputLabel>
            <Select
              labelId="select-label-2"
              id="select-2"
              value={frameState.score1 === 10 ? 0 : frameState.score2 ?? ""}
              onChange={createHandleChange("score2")}
              label="Second Round"
            >
              {range(score2options).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ) : null}
    </Paper>
  );
};
