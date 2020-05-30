import React from "react";
import { CssBaseline } from "@material-ui/core";
import { StartGame } from "../StartGame/StartGame";
import { AppPosition, AppStateSubject } from "./App.state";
import { useSharedState } from "../stateUtils";

export const App: React.FC = () => {
  const [{ appPosition, players }] = useSharedState(AppStateSubject);

  return (
    <>
      <CssBaseline></CssBaseline>

      {appPosition === AppPosition.starGame ? (
        <StartGame />
      ) : (
        <ul>
          {players.map((pl) => (
            <li key={pl.id}>{pl.value}</li>
          ))}
        </ul>
      )}
    </>
  );
};
