import React from "react";
import {
  Box,
  createStyles,
  FormControlLabel,
  Paper,
  Switch,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Player } from "../../App/App.types";
import { appStateDispatch } from "../../App/App.state";

interface Props {
  player: Player;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1),
    },
  })
);

export const PlayerTile: React.FC<Props> = ({ player }) => {
  const classes = useStyles();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    appStateDispatch({
      type: "update-player",
      payload: {
        id: player.id,
        automatic: event.target.checked,
      },
    });
  };

  return (
    <Paper className={classes.container} elevation={player.automatic ? 1 : 5}>
      <Typography variant="h6" component="p" gutterBottom align="center">
        {player.value}
      </Typography>
      <Box textAlign="center">
        <FormControlLabel
          control={
            <Switch
              checked={player.automatic}
              onChange={onChange}
              name="checkedB"
              color="secondary"
            />
          }
          label="Automatic"
          labelPlacement="start"
        />
      </Box>
    </Paper>
  );
};
