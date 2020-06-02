import React, { useRef } from "react";
import {
  createStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { createScoreFrameSelector } from "../../state/Score/Score.state";
import { useSelector } from "../../stateUtils/useSelector";
import { PlayerState } from "../../state";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  frame: number;
  player: PlayerState;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    points: {
      fontWeight: theme.typography.fontWeightBold,
    },
    pointsRow: {
      backgroundColor: theme.palette.primary.light,
    },
  })
);

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

export const FrameTileResults: React.FC<Props> = ({ player, frame }) => {
  const classes = useStyles();

  const scoreFrameSelector = useRef(createScoreFrameSelector(frame, player.id));

  const [scoreState] = useSelector(scoreFrameSelector.current, {
    id: "",
    score1: 0,
    score2: 0,
    points: 0,
    strike: false,
    spare: false,
    addFramesToPoints: 0,
  });

  const { scoreDisplay1, scoreDisplay2 } = getScoreDisplay(
    scoreState?.score1,
    scoreState?.score2
  );

  return (
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
  );
};
