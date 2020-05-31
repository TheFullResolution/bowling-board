import React from "react";
import { CssBaseline } from "@material-ui/core";
import { StartGame } from "../StartGame/StartGame";
import { BoardGame } from "../BoardGame/BoardGame";
import { AppPosition } from "./App.types";
import { useAppState } from "./useAppState";
import { appPositionSelector } from "./App.selectors";

export const App: React.FC = () => {
  const [appPosition] = useAppState(appPositionSelector, "appPosition");

  return (
    <>
      <CssBaseline></CssBaseline>
      {appPosition === AppPosition.starGame ? <StartGame /> : <BoardGame />}
    </>
  );
};
