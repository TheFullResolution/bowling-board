import React, { useReducer, useState } from "react";
import { Box, Button, Container, Typography } from "@material-ui/core";
import { PlayerForm } from "./components/PlayerForm";
import { Dialog } from "./components/Dialog";
import banner from "../App/banner.jpg";
import { makeStyles } from "@material-ui/core/styles";
import {
  playersFormStateReducer,
  playersInitialState,
} from "./playersFormState";
import { AppPosition, AppStateSubject } from "../App/App.state";
import { setSharedState } from "../stateUtils";

const formId = "players-form";

const useStyles = makeStyles({
  banner: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
});

export const StartGame: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showformValid, setShowFormValid] = useState(false);
  const [players, dispatchPlayersAction] = useReducer(
    playersFormStateReducer,
    playersInitialState
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShowFormValid(false);
    dispatchPlayersAction({ type: "resetState" });
  };

  const addPlayer = () => {
    dispatchPlayersAction({ type: "addPlayer" });
    showformValid && setShowFormValid(false);
  };

  const createRemovePlayer = (id: string) => () => {
    dispatchPlayersAction({ type: "removePlayer", payload: { id } });
    showformValid && setShowFormValid(false);
  };

  const createOnChange = (id: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatchPlayersAction({
      type: "updatePlayer",
      payload: { id, value: event.target.value },
    });
    showformValid && setShowFormValid(false);
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const checkIfValid = players.every((player) => !!player.value);
    if (!checkIfValid) {
      setShowFormValid(true);
    } else {
      setSharedState(AppStateSubject, {
        appPosition: AppPosition.gameBoard,
        players,
      });
    }
  };
  const classes = useStyles();
  return (
    <>
      <Box height="300px">
        <img src={banner} alt="banner" className={classes.banner} />
      </Box>
      <Container maxWidth="lg">
        <Box my={6}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Bowling Board
          </Typography>
        </Box>
        <Box my={4} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            size="large"
          >
            Start Game
          </Button>
          <Dialog
            handleClose={handleClose}
            open={open}
            formId={formId}
            showformValid={showformValid}
          >
            <PlayerForm
              addPlayer={addPlayer}
              showformValid={showformValid}
              createRemovePlayer={createRemovePlayer}
              createOnChange={createOnChange}
              players={players}
              handleSubmit={handleSubmit}
              formId={formId}
            />
          </Dialog>
        </Box>
      </Container>
    </>
  );
};
