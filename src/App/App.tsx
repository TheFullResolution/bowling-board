import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { StartGame } from "../StartGame/StartGame";
import { BoardGame } from "../BoardGame/BoardGame";
import { theme } from "../theme";
import { useAppState } from "../stateUtils/useAppState";
import { AppPosition, appPositionSelector } from "./App.state";
import { ScoreBoard } from "../ScoreBoard/ScoreBoard";

export const App: React.FC = () => {
  const [appPosition] = useAppState({
    selector: appPositionSelector,
    defaultStateKey: "appPosition",
  });

  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline></CssBaseline>
        {/*{appPosition === AppPosition.starGame ? (*/}
        {/*  <StartGame />*/}
        {/*) : appPosition === AppPosition.gameBoard ? (*/}
        {/*  <BoardGame />*/}
        {/*) : (*/}
        {/*  <ScoreBoard />*/}
        {/*)}*/}
          <ScoreBoard />
      </>
    </ThemeProvider>
  );
};
