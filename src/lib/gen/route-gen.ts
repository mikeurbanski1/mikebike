import Rand from 'rand-seed';

import { Route } from '../map/route';
import { Direction, PadDirection, TurnDirection } from '../models/map';
import { initRandom } from '../utils/random-utils';

const randomRoute = (seed?: string): Route => {
    const rand = initRandom(seed);
    const lengthBounds = [5, 12];
    const turnProbability = 0.5;
    const turnDirectionProbability = 0.5;
    const padDirectionProbability = 0.5;
    const widthChangeAmountProbabilities = [0.4, 0.3, 0.3];
    const widthBounds = [2, 9];

    const numSegments = 20;

    let curWidth = 5;
    let route = new Route(
        Math.floor(rand.next() * (lengthBounds[1] - lengthBounds[0] + 1)) + lengthBounds[0],
        curWidth,
        Direction.S,
        rand.next() < padDirectionProbability ? PadDirection.LEFT : PadDirection.RIGHT
    );

    while (route.segments.length < numSegments) {
        try {
            const length = Math.floor(rand.next() * (lengthBounds[1] - lengthBounds[0] + 1)) + lengthBounds[0];

            let turn: TurnDirection | undefined;
            if (rand.next() < turnProbability) {
                turn = rand.next() < turnDirectionProbability ? TurnDirection.LEFT : TurnDirection.RIGHT;
            }

            const widthChangeAmountRandom = rand.next();
            let widthChangeAmount = 0;
            if (widthChangeAmountRandom < widthChangeAmountProbabilities[0]) {
                widthChangeAmount = 0;
            } else if (
                widthChangeAmountRandom <
                widthChangeAmountProbabilities[0] + widthChangeAmountProbabilities[1]
            ) {
                widthChangeAmount = 1;
            } else {
                widthChangeAmount = 2;
            }

            const widthChangeDirection = rand.next() < 0.5 ? -1 : 1;
            curWidth = Math.max(
                widthBounds[0],
                Math.min(widthBounds[1], curWidth + widthChangeDirection * widthChangeAmount)
            );

            route = route.addSegment({
                length,
                width: curWidth,
                turn,
                offsetPadding: rand.next() < padDirectionProbability ? PadDirection.LEFT : PadDirection.RIGHT,
            });
        } catch (err) {
            console.error(err);
        }
    }

    return route;
};

const turnTestRoute = (): Route => {
    let offsetPadding: PadDirection = PadDirection.LEFT;
    let width = 2;
    let widthDelta = 2;
    let length = 4;
    let lengthDelta = 2;
    let minWidth = 2;
    let maxWidth = width + 8;

    let route = new Route(length, width, Direction.SE, offsetPadding);

    while (true) {
        width += widthDelta;
        if (width > maxWidth) {
            width = maxWidth;
            widthDelta *= -1;
        } else if (width < minWidth) {
            break;
        }

        offsetPadding = offsetPadding === PadDirection.LEFT ? PadDirection.RIGHT : PadDirection.LEFT;

        route.addSegment({ length: length, width, turn: TurnDirection.RIGHT, offsetPadding });
        length += lengthDelta;
    }

    return route;
};

const largeRandomRoute = (seed?: string): Route => {
    const rand = initRandom(seed);
    const lengthBounds = [15, 75];
    const turnProbability = 0.4;
    const turnDirectionProbability = 0.5;
    const padDirectionProbability = 0.5;
    const widthChangeAmountProbabilities = [0.5, 0.3, 0.2];
    const widthBounds = [2, 9];

    const numSegments = 40;

    let curWidth = 5;
    let route = new Route(
        Math.floor(rand.next() * (lengthBounds[1] - lengthBounds[0] + 1)) + lengthBounds[0],
        curWidth,
        Direction.S,
        rand.next() < padDirectionProbability ? PadDirection.LEFT : PadDirection.RIGHT
    );

    while (route.segments.length < numSegments) {
        try {
            const length = Math.floor(rand.next() * (lengthBounds[1] - lengthBounds[0] + 1)) + lengthBounds[0];

            let turn: TurnDirection | undefined;
            if (rand.next() < turnProbability) {
                turn = rand.next() < turnDirectionProbability ? TurnDirection.LEFT : TurnDirection.RIGHT;
            }

            const widthChangeAmountRandom = rand.next();
            let widthChangeAmount = 0;
            if (widthChangeAmountRandom < widthChangeAmountProbabilities[0]) {
                widthChangeAmount = 0;
            } else if (
                widthChangeAmountRandom <
                widthChangeAmountProbabilities[0] + widthChangeAmountProbabilities[1]
            ) {
                widthChangeAmount = 1;
            } else {
                widthChangeAmount = 2;
            }

            const widthChangeDirection = rand.next() < 0.5 ? -1 : 1;
            curWidth = Math.max(
                widthBounds[0],
                Math.min(widthBounds[1], curWidth + widthChangeDirection * widthChangeAmount)
            );

            route = route.addSegment({
                length,
                width: curWidth,
                turn,
                offsetPadding: rand.next() < padDirectionProbability ? PadDirection.LEFT : PadDirection.RIGHT,
            });
        } catch (err) {
            console.error(err);
        }
    }

    return route;
};

export const simpleStraightRoute = () => new Route(20, 5, Direction.S);

export const small = () =>
    new Route(8, 7, Direction.NE).addSegment({ length: 10, width: 9, turn: TurnDirection.RIGHT });
