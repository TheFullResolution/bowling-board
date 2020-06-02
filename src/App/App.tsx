import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { StartGame } from "../StartGame/StartGame";
import { BoardGame } from "../BoardGame/BoardGame";
import { theme } from "../theme";
import { useAppState } from "../stateUtils/useAppState";
import { AppPosition, appPositionSelector } from "./App.state";

export const App: React.FC = () => {
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
