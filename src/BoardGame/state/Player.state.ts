import { BehaviorSubject, from, Subject } from "rxjs";
import { AppState } from "../../App/App.state";
import { distinctUntilChanged, filter, flatMap, map } from "rxjs/operators";

export interface PlayerState {
  id: string;
  automatic: boolean;
}

const playerStateSubject = new BehaviorSubject<PlayerState[]>([]);

const playerDispatcher = new Subject<PlayerState>();

export const PlayerState = {
  state: playerStateSubject,
  init: () => {
    AppState.pipe(
      map((state) => state.players),
      distinctUntilChanged(),
      map((players) =>
        players.map((el) => ({
          id: el.id,
          automatic: true,
        }))
      )
    ).subscribe((players) => {
      playerStateSubject.next(players);
    });

    playerDispatcher
      .pipe(
        map((el) => {
          return playerStateSubject.getValue().map((player) => {
            if (el.id === player.id) {
              return el;
            }
            return player;
          });
        })
      )
      .subscribe((players) => {
        playerStateSubject.next(players);
      });
  },

  updateValue: (val: PlayerState) => {
    playerDispatcher.next(val);
  },
};

export const createPlayerSelector = (id: string) =>
  playerStateSubject.pipe(
    flatMap((el) => from(el)),
    filter((el) => el.id === id),
    distinctUntilChanged()
  );
