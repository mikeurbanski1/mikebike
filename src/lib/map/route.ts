import type { Direction } from '../models/hex';
import type { NavigationInstruction, PadDirection, PathSegment, Turn, TurnDirection } from '../models/map.ts';
import { getNewDirection, getSegmentEnd, getSegmentPadding, normalizeSegment } from '../utils/path-utils';

export class Route implements Iterable<NavigationInstruction> {
    segments: PathSegment[];
    turns: Turn[];
    currentDirection: Direction;

    constructor(
        firstSegmentLength: number,
        firstSegmentWidth: number,
        firstSegmentDirection: Direction,
        firstSegmentOffsetPadding?: PadDirection
    ) {
        const start = { q: 0, r: 0, s: 0 };
        const undirectedSegment = normalizeSegment(
            {
                length: firstSegmentLength,
                width: firstSegmentWidth,
                index: 0,
                offsetPadding: firstSegmentOffsetPadding,
            },
            undefined
        );
        const end = getSegmentEnd(start, firstSegmentDirection, firstSegmentLength);
        const firstSegment: PathSegment = {
            ...undirectedSegment,
            start: start,
            end: end,
            direction: firstSegmentDirection,
        };
        this.segments = [firstSegment];
        this.turns = [];
        this.currentDirection = firstSegment.direction;
    }

    public addSegment({
        length,
        width,
        turn,
        offsetPadding,
    }: {
        length: number;
        width: number;
        turn?: TurnDirection;
        offsetPadding?: PadDirection;
    }): Route {
        const newSegmentIndex = this.segments.length;

        const lastSegment = this.segments[this.segments.length - 1];
        const undirectedSegment = normalizeSegment(
            { length, width, index: newSegmentIndex, offsetPadding },
            lastSegment
        );

        if (turn) {
            this.turns.push({
                beforeSegmentIndex: newSegmentIndex,
                turnDirection: turn,
            });
            this.currentDirection = getNewDirection(this.currentDirection, turn);
        }

        const lastSegmentEnd = this.segments[this.segments.length - 1].end;
        const segment: PathSegment = {
            direction: this.currentDirection,
            length,
            width,
            start: lastSegmentEnd,
            end: getSegmentEnd(lastSegmentEnd, this.currentDirection, length),
            index: newSegmentIndex,
            padLeft: undirectedSegment.padLeft,
            padRight: undirectedSegment.padRight,
        };
        this.segments.push(segment);
        return this;
    }

    [Symbol.iterator](): Iterator<NavigationInstruction> {
        let segmentIndex = 0;
        let turnIndex = 0;

        return {
            next: (): IteratorResult<NavigationInstruction> => {
                if (segmentIndex >= this.segments.length) {
                    return { done: true, value: undefined };
                }

                const segment = this.segments[segmentIndex];
                const turn = this.turns[turnIndex];

                let turnDirection: TurnDirection | undefined = undefined;

                if (turn && turn.beforeSegmentIndex === segmentIndex) {
                    turnIndex++;
                    turnDirection = turn.turnDirection;
                }

                segmentIndex++;

                return { done: false, value: { segment, turn: turnDirection } };
            },
        };
    }
}
