import {BehaviorSubject} from 'rxjs'
import {AppPosition, Player, State} from './App.types'

export const defaultState: State = {
  appPosition: AppPosition.gameBoard,
  players: [
    { id: "players1", value: "Stefand" },
    { id: "players2", value: "Stefands" },
  ],
  game: {
    frame: 1,
    maxFrames: 10,
  },
  showInstructions: true,
};

export const AppState = new BehaviorSubject<State>(defaultState);

export const setPlayers = (players: Player[]) => {
  const state = AppState.getValue();

  AppState.next({
    ...state,
    players,
  });
};
