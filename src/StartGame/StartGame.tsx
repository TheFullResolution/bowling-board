import React, { useReducer, useState } from "react";
import { Box, Button, Container, Typography } from "@material-ui/core";
import { PlayerForm } from "./components/PlayerForm";
import { Dialog } from "./components/Dialog";
import banner from "./banner.jpg";
import { makeStyles } from "@material-ui/core/styles";
import { formReducer, initialFormState } from "./formReducer";
import { appFormModalSelector, AppState } from "../App/App.state";
import { ActionType } from "../App/App.actions";
import { useAppState } from "../stateUtils/useAppState";

const formId = "players-form";

const useStyles = makeStyles({
  banner: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
});

export const StartGame: React.FC = () => {
  const [open] = useAppState({
    selector: appFormModalSelector,
    defaultStateKey: "showFormModal",
  });
  const [showformValid, setShowFormValid] = useState(false);
  const [form, dispatchFormAction] = useReducer(formReducer, initialFormState);

  const handleClickOpen = () => {
    AppState.dispatch({ type: ActionType.toggleFormModal, payload: true });
  };

  const handleClose = () => {
    AppState.dispatch({ type: ActionType.toggleFormModal, payload: false });
    setShowFormValid(false);
    dispatchFormAction({ type: "resetState" });
  };

  const addPlayer = () => {
    dispatchFormAction({ type: "addPlayer" });
    showformValid && setShowFormValid(false);
  };

  const createRemovePlayer = (id: string) => () => {
    dispatchFormAction({ type: "removePlayer", payload: { id } });
    showformValid && setShowFormValid(false);
  };

  const createOnChange = (id: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatchFormAction({
      type: "updatePlayer",
      payload: { id, value: event.target.value },
    });
    showformValid && setShowFormValid(false);
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const checkIfValid = form.every((player) => !!player.value);
    if (!checkIfValid) {
      setShowFormValid(true);
    } else {
      AppState.dispatch({ type: ActionType.startGame, payload: form });
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
              players={form}
              handleSubmit={handleSubmit}
              formId={formId}
            />
          </Dialog>
        </Box>
      </Container>
    </>
  );
};
