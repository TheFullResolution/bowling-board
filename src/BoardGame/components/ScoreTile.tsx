import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, createStyles, Paper } from "@material-ui/core";
import { useSelector } from "../../stateUtils/useSelector";
import { createScoreTotal } from "../../state/Score.state";
import cls from "classnames";

interface Props {
  playerId: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    score: {
      backgroundColor: theme.palette.primary.main,
      height: "50px",
      width: "50px",
    },
  })
);

export const ScoreTile: React.FC<Props> = ({ playerId }) => {
  const classes = useStyles();

  const [scoreState] = useSelector(createScoreTotal(playerId), 0);

  return (
    <Paper className={classes.container}>
      <Avatar className={cls({ [classes.score]: scoreState > 0 })}>
        {scoreState}
      </Avatar>
    </Paper>
  );
};
