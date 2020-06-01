export enum AppPosition {
  starGame,
  gameBoard,
}

export interface Player {
  id: string;
  value: string;
}

export interface State {
  appPosition: AppPosition;
  players: Player[];
  game: {
    frame: number;
    maxFrames: number;
  };
  showInstructions: boolean;
}
