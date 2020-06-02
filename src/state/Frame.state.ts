import { BehaviorSubject, from, Subject } from "rxjs";
import {
  distinctUntilChanged,
  filter,
  flatMap,
  map,
  reduce,
  share,
  withLatestFrom,
} from "rxjs/operators";
import { sessionPlayerSelector, SetPlayers } from "./Session.state";
import { scoreStateSelector } from "./Score/Score.state";

export interface FrameState {
  id: string;
  score1: number | null;
  score2: number | null;
}

interface UpdateFrame extends Partial<FrameState> {
  id: string;
}

const frameStateSubject = new BehaviorSubject<FrameState[]>([]);

const frameStateDispatcher = new Subject<UpdateFrame>();

const getInitialFrameState = (players: SetPlayers[]) =>
  from(players).pipe(
    map(({ id }) => ({ id, score1: null, score2: null })),
    reduce((arr, el) => {
      arr.push(el);
      return arr;
    }, [] as FrameState[])
  );

export const FrameState = {
  init: () => {
    sessionPlayerSelector
      .pipe(flatMap((players) => getInitialFrameState(players)))
      .subscribe((players) => {
        frameStateSubject.next(players);
      });

    scoreStateSelector
      .pipe(
        withLatestFrom(sessionPlayerSelector),
        flatMap(([scoreState, players]) => getInitialFrameState(players))
      )
      .subscribe((players) => {
        frameStateSubject.next(players);
      });

    frameStateDispatcher
      .pipe(
        map((update) => {
          const state = frameStateSubject.getValue();

          return state.map((el) => {
            if (el.id === update.id) {
              return {
                ...el,
                score1:
                  update.score1 ?? (update.score1 === null ? null : el.score1),
                score2: update.score2 ?? null,
              };
            }
            return el;
          });
        })
      )
      .subscribe((newState) => frameStateSubject.next(newState));
  },
  update: (frame: UpdateFrame) => {
    frameStateDispatcher.next(frame);
  },
};

export const frameStateSelector = frameStateSubject
  .asObservable()
  .pipe(share());

export const createFrameSelector = (id: string) =>
  frameStateSubject.pipe(
    flatMap((el) => from(el)),
    filter((el) => el.id === id),
    distinctUntilChanged()
  );
