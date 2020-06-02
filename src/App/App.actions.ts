import { PlayerState } from "./App.state";
import { FrameState } from "./GameStates/Frame.state";
import { GameState } from "./GameStates/Game.state";

export const ActionType = {
  setPlayers: "setPlayers",
  updatePlayer: "updatePlayer",
  setFrame: "setFrame",
  updateFrame: "updateFrame",
  finishFrame: "finishFrame",
  nextFrame: "nextFrame",
  lastFrame: "lastFrame",
  setGameState: "setGameState",
} as const;

export interface SetPlayersAction {
  type: typeof ActionType.setPlayers;
  payload: {
    id: string;
    value: string;
  }[];
}

export interface UpdatePlayersAction {
  type: typeof ActionType.updatePlayer;
  payload: Partial<PlayerState> & { id: string };
}

export interface SetFrameAction {
  type: typeof ActionType.setFrame;
  payload: FrameState[];
}

export interface UpdateFrameAction {
  type: typeof ActionType.updateFrame;
  payload: Partial<FrameState> & {
    id: string;
  };
}

export interface FinishFrameAction {
  type: typeof ActionType.finishFrame;
}

export interface NextFrameAction {
  type: typeof ActionType.nextFrame;
}

export interface LastFrameAction {
  type: typeof ActionType.lastFrame;
}

export interface SetGameState {
  type: typeof ActionType.setGameState;
  payload: GameState;
}

export type AppActions =
  |FinishFrameAction
  | SetPlayersAction
  | UpdatePlayersAction
  | SetFrameAction
  | UpdateFrameAction
  | NextFrameAction
  | LastFrameAction
  | SetGameState;
