import randomatic from "randomatic";

export const initialFormState = [
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

export type FormReducer = typeof initialFormState;

export const formReducer = (
  state: FormReducer,
  action: Action
): FormReducer => {
  switch (action.type) {
    case "addPlayer": {
      const id = randomatic("Aa", 10);
      return [...state, { id, value: "" }];
    }
    case "removePlayer":
      return state.filter((el) => el.id !== action.payload?.id);

    case "updatePlayer":
      return state.reduce<FormReducer>((arr, el) => {
        if (el.id === action.payload?.id) {
          el.value = action.payload.value ?? "";
        }

        arr.push(el);
        return arr;
      }, []);

    case "resetState":
      return initialFormState;
  }
};
