import { BehaviorSubject, combineLatest, from, Subject } from "rxjs";
import { ActionType, AppActions, FinishGame } from "../App.actions";
import {
  filter,
  flatMap,
  groupBy,
  map,
  reduce,
  shareReplay,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { scoreStateTotalsSelector } from "./Score.state";
import { playersSelector } from "./Players.state";

export interface SessionState {
  id: string;
  points: number;
}

const sessionStateSubject$ = new BehaviorSubject<SessionState[][]>([
  [{ id: "player1", points: 20 }],
  [{ id: "player1", points: 120 }],
]);

export const SessionState = {
  state$: sessionStateSubject$,
  dispatch: (newState: SessionState[][]) => {
    SessionState.state$.next(newState);
  },
  registerActions: (actions$: Subject<AppActions>) => ({
    finishGame$: actions$.pipe(
      filter((action): action is FinishGame => {
        return (action as FinishGame).type === ActionType.finishGame;
      }),
      withLatestFrom(scoreStateTotalsSelector, SessionState.state$),
      map(([action, scoreStateTotals, sessionState]) => {
        sessionState.push(scoreStateTotals);

        return sessionState;
      }),
      map((payload) => ({ type: ActionType.setSessionState, payload }))
    ),
  }),
};

export const sessionStateSelector = SessionState.state$
  .asObservable()
  .pipe(shareReplay(1));

export const sessionGamesSelector = sessionStateSelector.pipe(map(sessions => sessions.length))

const sessionTotalsSelector = sessionStateSelector.pipe(
  flatMap((session) =>
    from(session).pipe(
      flatMap((scores) => scores),
      groupBy((score) => score.id),
      flatMap((group) =>
        group.pipe(
          reduce(
            (acc, score) => {
              acc.id = acc.id || score.id;
              acc.totals = acc.totals + score.points;
              return acc;
            },
            { id: "", totals: 0 } as { id: string; totals: number }
          )
        )
      ),
      reduce((acc, value) => {
        acc.push(value);
        return acc;
      }, [] as { id: string; totals: number }[])
    )
  )
);

const wonGamesSelector = sessionStateSelector.pipe(
  flatMap((session) =>
    from(session).pipe(
      map((gameScores) => gameScores.sort((a, b) => b.points - a.points)),
      map((gameScoresSorted) => gameScoresSorted[0]),
      groupBy((score) => score.id),
      flatMap((group) =>
        group.pipe(
          reduce(
            (acc, score) => {
              acc.id = acc.id || score.id;
              acc.won = acc.won + 1;
              return acc;
            },
            { id: "", won: 0 } as { id: string; won: number }
          )
        )
      ),
      reduce((acc, value) => {
        acc.push(value);
        return acc;
      }, [] as { id: string; won: number }[])
    )
  )
);

const allSessionsSelector = sessionStateSelector.pipe(
  flatMap((session) =>
    from(session).pipe(
      flatMap((scores) => scores),
      groupBy((score) => score.id),
      flatMap((group) =>
        group.pipe(
          reduce(
            (acc, score) => {
              acc.id = acc.id || score.id;
              acc.games.push(score.points);
              return acc;
            },
            { games: [] as number[] } as { id: string; games: number[] }
          )
        )
      ),
      reduce((acc, value) => {
        acc.push(value);
        return acc;
      }, [] as { id: string; games: number[] }[])
    )
  )
);

export interface ScoreBoardList {
  id: string;
  value: string;
  won: number;
  totals: number;
  games: number[];
}

export const scoreBoardSelector = combineLatest(
  wonGamesSelector,
  sessionTotalsSelector,
  playersSelector,
  allSessionsSelector
).pipe(
  flatMap((lists) =>
    from(lists).pipe(
      flatMap((list) => list),
      groupBy((el) => el.id),
      flatMap((group) =>
        group.pipe(
          reduce(
            (acc, allValues) => {
              acc.id = acc.id || allValues.id;

              if ("won" in allValues) {
                acc.won = allValues.won;
              }

              if ("totals" in allValues) {
                acc.totals = allValues.totals;
              }

              if ("value" in allValues) {
                acc.value = allValues.value;
              }

              if ("games" in allValues) {
                acc.games = allValues.games;
              }

              return acc;
            },
            { games: [] as number[] } as ScoreBoardList
          )
        )
      ),
      reduce((acc, value) => {
        acc.push(value);
        return acc;
      }, [] as ScoreBoardList[])
    )
  )
);
