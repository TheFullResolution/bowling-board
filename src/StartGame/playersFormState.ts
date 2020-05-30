import randomatic from "randomatic";

export const playersInitialState = [
  {
    id: "player1",
    value: "",
  },
];

type Action = {
  type: "addPlayer" | "removePlayer" | "updatePlayer" | "resetState";
  payload?: {
    id: string;
    value?: string;
  };
};

export type PlayersFormState = typeof playersInitialState;

export const playersFormStateReducer = (
  state: PlayersFormState,
  action: Action
): PlayersFormState => {
  switch (action.type) {
    case "addPlayer": {
      const id = randomatic("Aa", 10);
      return [...state, { id, value: "" }];
    }
    case "removePlayer":
      return state.filter((el) => el.id !== action.payload?.id);

    case "updatePlayer":
      return state.reduce<PlayersFormState>((arr, el) => {
        if (el.id === action.payload?.id) {
          el.value = action.payload.value ?? "";
        }

        arr.push(el);
        return arr;
      }, []);

    case "resetState":
      return playersInitialState;
  }
};
