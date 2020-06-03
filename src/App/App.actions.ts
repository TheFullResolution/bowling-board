import { FrameState } from "./GameStates/Frame.state";
import { GameState } from "./GameStates/Game.state";
import { PlayerState } from "./GameStates/Players.state";
import { ScoreState } from "./GameStates/Score.state";
import { SessionState } from "./GameStates/Session.state";

export const ActionType = {
  finishFrame: "finishFrame",
  finishGame: "finishGame",
  lastFrame: "lastFrame",
  nextFrame: "nextFrame",
  resetFrame: "resetFrame",
  setFrame: "setFrame",
  setGameState: "setGameState",
  setPlayers: "setPlayers",
  setScoreState: "setScoreState",
  startGame: "startGame",
  updateFrame: "updateFrame",
  updatePlayer: "updatePlayer",
  setSessionState: "setSessionState",
} as const;

export interface StartGameAction {
  type: typeof ActionType.startGame;
  payload: { id: string; value: string }[];
}

export interface SetPlayersAction {
  type: typeof ActionType.setPlayers;
  payload: PlayerState[];
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

export interface ResetFrameAction {
  type: typeof ActionType.resetFrame;
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

export interface SetScoreState {
  type: typeof ActionType.setScoreState;
  payload: ScoreState[][];
}

export interface FinishGame {
  type: typeof ActionType.finishGame;
}

export interface SetSessionState {
  type: typeof ActionType.setSessionState;
  payload: SessionState[][];
}

export type AppActions =
  | FinishFrameAction
  | FinishGame
  | LastFrameAction
  | NextFrameAction
  | ResetFrameAction
  | SetFrameAction
  | SetGameState
  | SetPlayersAction
  | SetScoreState
  | StartGameAction
  | UpdateFrameAction
  | UpdatePlayersAction
  | SetSessionState;
