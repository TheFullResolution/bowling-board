import { Subject } from "rxjs";
import { publishReplay, refCount, scan } from "rxjs/operators";
import { Action, AppPosition, Player, State } from "./App.types";

export const defaultState = {
  appPosition: AppPosition.gameBoard,
  players: [
    { id: "players1", value: "Stefand", automatic: true },
    { id: "players2", value: "Stefands", automatic: false },
  ],
  showInstructions: true,
};

const stateActions = new Subject<Action>();

export const appState = stateActions.pipe(
  scan((state: State, action: Action): State => {
    switch (action.type) {
      case "update-player":
        const updatedPlayers = state.players.reduce<Player[]>((arr, player) => {
          if (player.id === action.payload.id) {
            player = {
              ...player,
              ...action.payload,
            };
          }
          arr.push(player);
          return arr;
        }, []);

        return { ...state, players: updatedPlayers };

      case "set-players":
        return {
          ...state,
          players: action.payload,
          appPosition: AppPosition.gameBoard,
        };
      case "default-state":
        return action.payload;
      default:
        return state;
    }
  }, defaultState),
  publishReplay(1),
  refCount()
);

export const appStateDispatch = (action: Action) => {
  stateActions.next(action);
};
