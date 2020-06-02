import React, {useEffect, useRef} from 'react'
import {
  createStyles,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import range from "lodash.range";
import { makeStyles } from "@material-ui/core/styles";
import cls from "classnames";
import { useSelector } from "../../stateUtils/useSelector";
import { createFrameSelector, FrameState } from "../../state/Frame.state";
import { PlayerState } from "../../state";
import { RANGE_FOR_POINTS } from "../../config";
import { createScoreFrameSelector } from "../../state/Score/Score.state";

interface Props {
  player: PlayerState;
  frame: number;
  currentFrame: number;
}

const getScoreDisplay = (score1 = 0, score2 = 0) => {
  let scoreDisplay1 = !score1 ? "_" : score1;
  let scoreDisplay2 = !score2 ? "_" : score2;

  if (score1 === 10) {
    scoreDisplay1 = "X";
    scoreDisplay2 = "";
  } else if (score1 + score2 === 10) {
    scoreDisplay2 = "/";
  }

  return { scoreDisplay1, scoreDisplay2 };
};

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
    points: {
      fontWeight: theme.typography.fontWeightBold,
    },
    pointsRow: {
      backgroundColor: theme.palette.primary.light,
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
  const isPast = frame < currentFrame;

  const scoreFrameSelector = useRef(createScoreFrameSelector(frame, player.id))
  const frameSelector = useRef(createFrameSelector(player.id));

  const [frameState] = useSelector(frameSelector.current, {
    id: "",
    score1: null,
    score2: null,
  });

  const [scoreState] = useSelector(scoreFrameSelector.current, {
    id: "",
    score1: 0,
    score2: 0,
    points: 0,
    strike: false,
    addFramesToPoints: 0
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

  const { scoreDisplay1, scoreDisplay2 } = getScoreDisplay(
    scoreState?.score1,
    scoreState?.score2
  );

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
      ) : (
        isPast && (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Round 1</TableCell>
                  <TableCell>Round 2</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">{scoreDisplay1}</TableCell>
                  <TableCell align="center">{scoreDisplay2}</TableCell>
                </TableRow>
                <TableRow className={classes.pointsRow}>
                  <TableCell
                    align="center"
                    className={classes.points}
                    component={"th"}
                  >
                    Points
                  </TableCell>
                  <TableCell align="center" className={classes.points}>
                    {scoreState?.points}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Paper>
  );
};
