import React, { useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { StartGame } from "../StartGame/StartGame";
import { BoardGame } from "../BoardGame/BoardGame";
import { theme } from "../theme";
import { useAppState } from "../stateUtils/useAppState";
import { AppPosition, appPositionSelector, AppState } from "../state/App.state";
import { FrameState, GameState, PlayerState, SessionState } from "../state";

export const App: React.FC = () => {
  useEffect(() => {
    SessionState.init();
    GameState.init();
    PlayerState.init();
    FrameState.init();
    AppState.init();
  }, []);

  const [appPosition] = useAppState({
    selector: appPositionSelector,
    defaultStateKey: "appPosition",
  });

  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline></CssBaseline>
        {appPosition === AppPosition.starGame ? <StartGame /> : <BoardGame />}
      </>
    </ThemeProvider>
  );
};
