import { appState } from "./App.state";
import { distinctUntilChanged, filter, flatMap, map } from "rxjs/operators";
import { from } from "rxjs";

export const appPositionSelector = appState.pipe(
  map((state) => state.appPosition),
  distinctUntilChanged()
);

export const playersSelector = appState.pipe(
  map((state) => state.players),
  distinctUntilChanged()
);

export const createplayerSelector = (id: string) =>
  playersSelector.pipe(
    flatMap((players) => from(players)),
    filter((player) => player.id === id),
    distinctUntilChanged()
  );
