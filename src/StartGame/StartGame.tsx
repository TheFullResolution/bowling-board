import React, { useReducer, useState } from "react";
import { Button } from "@material-ui/core";
import { PlayerForm } from "./components/PlayerForm";
import { Dialog } from "./components/Dialog";
import randomatic from "randomatic";

const formId = "players-form";

const initialState = [
  {
    id: "player1",
    value: ""
  }
];

type Action = {
  type: "addPlayer" | "removePlayer" | "updatePlayer" | "resetState";
  payload?: {
    id: string;
    value?: string;
  };
};

const reducer = (
  state: typeof initialState,
  action: Action
): typeof initialState => {
  switch (action.type) {
    case "addPlayer": {
      const id = randomatic("Aa", 10);
      return [...state, { id, value: "" }];
    }
    case "removePlayer":
      return state.filter(el => el.id !== action.payload?.id);

    case "updatePlayer":
      return state.reduce<typeof initialState>((arr, el) => {
        if (el.id === action.payload?.id) {
          el.value = action.payload.value ?? "";
        }

        arr.push(el);
        return arr;
      }, []);

    case "resetState":
      return initialState;
  }
};

export const StartGame: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [players, dispatchPlayersAction] = useReducer(reducer, initialState);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatchPlayersAction({ type: "resetState" });
  };

  const addPlayer = () => {
    dispatchPlayersAction({ type: "addPlayer" });
  };

  const createRemovePlayer = (id: string) => () => {
    dispatchPlayersAction({ type: "removePlayer", payload: { id } });
  };

  const createOnChange = (id: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatchPlayersAction({
      type: "updatePlayer",
      payload: { id, value: event.target.value }
    });
  };

  const handleSubmit = (event: React.SyntheticEvent<any>) => {
    console.log(event);
    event.preventDefault();
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        size="large"
      >
        Start Game
      </Button>
      <Dialog handleClose={handleClose} open={open} formId={formId}>
        <PlayerForm
          addPlayer={addPlayer}
          createRemovePlayer={createRemovePlayer}
          createOnChange={createOnChange}
          players={players}
          handleSubmit={handleSubmit}
          formId={formId}
        />
      </Dialog>
    </>
  );
};
