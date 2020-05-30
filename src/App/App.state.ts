import { BehaviorSubject } from "rxjs";

export enum AppPosition {
  starGame,
  gameBoard,
}

interface State {
  appPosition: AppPosition;
  players: { id: string; value: string }[];
  showInstructions: boolean;
}

export const AppStateSubject = new BehaviorSubject<State>({
  appPosition: AppPosition.starGame,
  players: [],
  showInstructions: true,
});
