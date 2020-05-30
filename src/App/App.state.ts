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
  appPosition: AppPosition.gameBoard,
  players: [{id: "players1", value: "Stefand"}, {id: "players2", value: "Stefands"}],
  showInstructions: true,
});
