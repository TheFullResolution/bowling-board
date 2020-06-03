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
import { AppState} from "../../App/App.state";
import { ActionType } from "../../App/App.actions";
import {PlayerState} from '../../App/GameStates/Players.state'

interface Props {
  player: PlayerState;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1),
      display: "flex",
      alignItems: "center",

      "& >div": {
        flex: "auto",
      },
    },
  })
);

export const PlayerTile: React.FC<Props> = ({ player }) => {
  const classes = useStyles();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    AppState.dispatch({
      type: ActionType.updatePlayer,
      payload: { id: player.id, automatic: event.target.checked },
    });
  };

  return (
    <Paper className={classes.container} elevation={player.automatic ? 1 : 5}>
      <div>
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
      </div>
    </Paper>
  );
};
