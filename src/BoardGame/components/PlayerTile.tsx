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
import { createPlayerSelector, PlayerState } from "../state/Player.state";
import { Player } from "../../App/App.types";
import { useSelector } from "../../stateUtils/useSelector";

interface Props {
  player: Player;
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

  const [playerState] = useSelector(createPlayerSelector(player.id), {
    id: "",
    automatic: false,
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    PlayerState.updateValue({
      id: playerState.id,
      automatic: event.target.checked,
    });
  };

  return (
    <Paper
      className={classes.container}
      elevation={playerState.automatic ? 1 : 5}
    >
      <div>
        <Typography variant="h6" component="p" gutterBottom align="center">
          {player.value}
        </Typography>
        <Box textAlign="center">
          <FormControlLabel
            control={
              <Switch
                checked={playerState.automatic}
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
