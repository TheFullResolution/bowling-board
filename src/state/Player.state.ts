import { BehaviorSubject, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { sessionPlayerSelector } from "./Session.state";

export interface PlayerState {
  id: string;
  value: string;
  automatic: boolean;
}

interface SetPlayers {
  id: string;
  value: string;
}

const playerStateSubject = new BehaviorSubject<PlayerState[]>([]);

const playerDispatcher = new Subject<Partial<PlayerState>>();

export const PlayerState = {
  init: () => {
    sessionPlayerSelector.subscribe((players) => {
      playerStateSubject.next(
        players.map((player) => ({ ...player, automatic: false }))
      );
    });

    playerDispatcher
      .pipe(
        map((el) => {
          return playerStateSubject.getValue().map((player) => {
            if (el.id === player.id) {
              return { ...player, ...el };
            }
            return player;
          });
        })
      )
      .subscribe((players) => {
        playerStateSubject.next(players);
      });
  },

  update: (val: Partial<PlayerState>) => {
    playerDispatcher.next(val);
  },
};

export const playersSelector = playerStateSubject.asObservable();
