import React, { useEffect, useLayoutEffect } from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { StartGame } from "../StartGame/StartGame";
import { BoardGame } from "../BoardGame/BoardGame";
import { theme } from "../theme";
import { useAppState } from "../stateUtils/useAppState";
import { AppPosition, appPositionSelector, AppState } from "../state/App.state";
import {
  FrameState,
  GameState,
  PlayerState,
  ScoreState,
  SessionState,
} from "../state";

export const App: React.FC = () => {
  useEffect(() => {
    SessionState.init();
    GameState.init();
    PlayerState.init();
    FrameState.init();
    AppState.init();
    ScoreState.init();
  }, []);

  const [appPosition] = useAppState({
    selector: appPositionSelector,
    defaultStateKey: "appPosition",
  });

  //TODO - delete before mergiingsggsgs
  useLayoutEffect(() => {
    setTimeout(() => {
      SessionState.update({
        players: [
          {
            id: "player1",
            value: "Marcus",
          },
          {
            id: "player2",
            value: "Jenny",
          },
        ],
      });
    }, 100);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline></CssBaseline>
        {appPosition === AppPosition.starGame ? <StartGame /> : <BoardGame />}
      </>
    </ThemeProvider>
  );
};
