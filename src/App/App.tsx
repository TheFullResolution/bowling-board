import React from "react";
import { CssBaseline } from "@material-ui/core";
import { StartGame } from "../StartGame/StartGame";
import { AppPosition, AppStateSubject } from "./App.state";
import { useSharedState } from "../stateUtils";
import { BoardGame } from "../BoardGame/BoardGame";

export const App: React.FC = () => {
  const [{ appPosition }] = useSharedState(AppStateSubject);

  return (
    <>
      <CssBaseline></CssBaseline>

      {appPosition === AppPosition.starGame ? <StartGame /> : <BoardGame />}
    </>
  );
};
