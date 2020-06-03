import { BehaviorSubject, Subject } from "rxjs";
import {
  ActionType,
  AppActions,
  StartGameAction,
  UpdatePlayersAction,
} from "../App.actions";
import { filter, map, shareReplay, withLatestFrom } from "rxjs/operators";

export interface PlayerState {
  id: string;
  value: string;
  automatic: boolean;
}

export const playersStateDispatcher$ = new BehaviorSubject<PlayerState[]>([{id: 'player1', value: 'Stefan', automatic: false}]);

export const PlayersState = {
  state$: playersStateDispatcher$,
  dispatch: (newState: PlayerState[]) => {
    PlayersState.state$.next(newState);
  },
  registerActions: (actions$: Subject<AppActions>) => ({
    startGame$: actions$.pipe(
      filter((action): action is StartGameAction => {
        return (action as StartGameAction).type === ActionType.startGame;
      }),
      map((action) =>
        action.payload.map((player) => ({
          ...player,
          automatic: true,
        }))
      ),
      map((payload) => ({ type: ActionType.setPlayers, payload }))
    ),
    updatePlayers$: actions$.pipe(
      filter((action): action is UpdatePlayersAction => {
        return (action as UpdatePlayersAction).type === ActionType.updatePlayer;
      }),
      withLatestFrom(PlayersState.state$),
      map(([action, state]) =>
        state.map((player) => {
          if (action.payload.id === player.id) {
            return { ...player, ...action.payload };
          }
          return player;
        })
      ),
      map((payload) => ({ type: ActionType.setPlayers, payload }))
    ),
  }),
};

export const playersSelector = PlayersState.state$
  .asObservable()
  .pipe(shareReplay(1));
