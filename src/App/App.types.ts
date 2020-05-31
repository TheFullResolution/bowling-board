export enum AppPosition {
  starGame,
  gameBoard,
}

export interface Player {
  id: string;
  value: string;
  automatic: boolean;
}

export interface State {
  appPosition: AppPosition;
  players: Player[];
  showInstructions: boolean;
}

interface UpdatePlayer extends Partial<Player> {
  id: string;
}

interface UpdatePlayerAction {
  type: "update-player";
  payload: UpdatePlayer;
}

interface SetPlayersAction {
  type: "set-players";
  payload: Player[];
}

interface DefaultStateAction {
  type: "default-state"
  payload: State
}

export type Action = UpdatePlayerAction | SetPlayersAction | DefaultStateAction;
