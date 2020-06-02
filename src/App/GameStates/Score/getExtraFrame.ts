import {FrameState} from '../Frame.state'
import {ScoreState} from './Score.state'
import {from} from 'rxjs'
import {map, reduce} from 'rxjs/operators'
import {weightedRand} from '../../../stateUtils/weightedRand'
import {RANGE_FOR_POINTS} from '../../../config'


export function getExtraFrame(frameState: FrameState[], lastScoreState: ScoreState[]) {
    return from(lastScoreState).pipe(
        map((score) => {
            if (score.strike || score.spare) {
                const frame = frameState.find((frame) => frame.id === score.id);
                console.log(frame)
                const frameScore1 = frame?.score1 ?? weightedRand(RANGE_FOR_POINTS);
                const frameScore2 = frame?.score2 ?? weightedRand(RANGE_FOR_POINTS);

                return {
                    id: score.id,
                    points: 0,
                    spare: false,
                    strike: false,
                    addFramesToPoints: 0,
                    score1: frameScore1,
                    score2: !score.spare ? frameScore2 : 0,
                };
            }
        }),
        reduce((acc, value) => {
            if(value) acc.push(value);
            return acc;
        }, [] as ScoreState[])
    );
}
