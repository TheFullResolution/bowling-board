import { BehaviorSubject, from, Subject } from "rxjs";
import { distinctUntilChanged, filter, flatMap, map } from "rxjs/operators";
import { sessionPlayerSelector } from "./Session.state";
import { gameFrameSelector } from "./Game.state";
import { ScoreState } from "./Score/Score.state";

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

export const FrameState = {
  init: () => {
    sessionPlayerSelector.subscribe((players) => {
      frameStateSubject.next(
        players.map(({ id }) => ({ id, score1: null, score2: null }))
      );
    });

    gameFrameSelector.subscribe((frame) => {
      const frameState = frameStateSubject.getValue();
      ScoreState.update(frameState);
      frameStateSubject.next(
        frameState.map(({ id }) => ({ id, score1: null, score2: null }))
      );
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

export const frameStateSelector = frameStateSubject.asObservable();

export const createFrameSelector = (id: string) =>
  frameStateSubject.pipe(
    flatMap((el) => from(el)),
    filter((el) => el.id === id),
    distinctUntilChanged()
  );
