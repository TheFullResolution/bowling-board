export enum AppPosition {
  starGame,
  gameBoard,
}

export interface StartPlayer {
  id: string;
  value: string;
}

export interface Player extends StartPlayer {
  automatic: boolean;
  currentScore: number;
}

interface PastGame extends StartPlayer {
  totalScore: number;
}

interface PastFrame extends StartPlayer {
  score1: number | null;
  score2: number | null;
}

export interface State {
  appPosition: AppPosition;
  players: Player[];
  game: {
    frame: number;
    maxFrames: number;
    pastFrames: PastFrame[];
  };
  pastGames: PastGame[][];
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
  payload: StartPlayer[];
}

interface DefaultStateAction {
  type: "default-state";
  payload: State;
}

export type Action = UpdatePlayerAction | SetPlayersAction | DefaultStateAction;
