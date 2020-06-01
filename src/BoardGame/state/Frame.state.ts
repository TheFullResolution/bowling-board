import { BehaviorSubject, from, Subject } from "rxjs";
import { distinctUntilChanged, filter, flatMap, map } from "rxjs/operators";
import { AppState } from "../../App/App.state";

interface FrameState {
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
  state: frameStateSubject,
  init: () => {
    AppState.pipe(
      map((state) => ({
        frame: state.game.frame,
        players: state.players,
      })),
      distinctUntilChanged((prev, curr) => prev.frame === curr.frame),
      map((state) =>
        state.players.map((el) => ({
          id: el.id,
          score1: null,
          score2: null,
        }))
      )
    ).subscribe((frames) => {
      frameStateSubject.next(frames);
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
  updateValue: (frame: UpdateFrame) => {
    frameStateDispatcher.next(frame);
  },
};

export const createFrameSelector = (id: string) =>
  frameStateSubject.pipe(
    flatMap((el) => from(el)),
    filter((el) => el.id === id),
    distinctUntilChanged()
  );
