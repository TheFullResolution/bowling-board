import { distinctUntilChanged, map } from "rxjs/operators";
import { AppState } from "./App.state";

export const appPositionSelector = AppState.pipe(
  map((state) => state.appPosition),
  distinctUntilChanged()
);

export const playersSelector = AppState.pipe(
  map((state) => state.players),
  distinctUntilChanged()
);

export const gameSelector = AppState.pipe(
  map((state) => state.game),
  distinctUntilChanged()
);
