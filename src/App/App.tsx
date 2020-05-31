import React from "react";
import { CssBaseline } from "@material-ui/core";
import { StartGame } from "../StartGame/StartGame";
import { BoardGame } from "../BoardGame/BoardGame";
import { AppPosition } from "./App.types";
import { useSharedState } from "../stateUtils";
import { AppState } from "./App.state";

export const App: React.FC = () => {
  const [{ appPosition }] = useSharedState(AppState);

  return (
    <>
      <CssBaseline></CssBaseline>

      {appPosition === AppPosition.starGame ? <StartGame /> : <BoardGame />}
    </>
  );
};
