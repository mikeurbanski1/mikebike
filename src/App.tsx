import { HexGrid, Layout } from 'react-hexgrid';

import './App.css';

import Rand from 'rand-seed';

import { Map } from './components/map/map';
import { Route } from './lib/map/route';
import { Direction } from './lib/models/hex';
import { PadDirection, TurnDirection } from './lib/models/map.ts';

let seed = new Rand().next().toString();
// seed = '0.33578115234574535';

console.log(`Random seed: ${seed}`);
const rand = new Rand(seed);

let renderType: string;

renderType = 'random';
// renderType = 'small';
// renderType = 'randomLarge';
// renderType = 'turnTest';
renderType = 'simpleStraight';

let genRoute: Route;

const randomRoute = () => {
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

const turnTestRoute = () => {
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

const largeRandomRoute = () => {
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

export const simpleStraightRoute = new Route(20, 5, Direction.S);

// const route = new Route(3, 3, Direction.S).addSegment(5, 3, TurnDirection.LEFT).addSegment(9, 3, TurnDirection.LEFT);
// .addSegment(5, 3, TurnDirection.LEFT)
// .addSegment(10, 3, TurnDirection.LEFT)
// .addSegment(10, 3, TurnDirection.LEFT)
//     .addSegment(13, 3, TurnDirection.LEFT);

// let w = 6;

if (renderType === 'random') {
    genRoute = randomRoute();
} else if (renderType === 'small') {
    genRoute = new Route(8, 7, Direction.NE).addSegment({ length: 10, width: 9, turn: TurnDirection.RIGHT });
} else if (renderType === 'turnTest') {
    genRoute = turnTestRoute();
} else if (renderType === 'randomLarge') {
    genRoute = largeRandomRoute();
} else if (renderType === 'simpleStraight') {
    genRoute = simpleStraightRoute;
} else {
    throw new Error(`Invalid render type: ${renderType}`);
}
// const route = new Route(3, w, Direction.S)
//     .addSegment(5, 5, TurnDirection.LEFT)
//     .addSegment(9, 5, TurnDirection.LEFT)
//     .addSegment(5, 5, TurnDirection.LEFT)
//     .addSegment(10, 5, TurnDirection.LEFT)
//     .addSegment(10, 5, TurnDirection.LEFT)
//     .addSegment(13, 5, TurnDirection.LEFT);

// const route = new Route(5, width, Direction.S, offsetPadding)
//     .addSegment({ length: 4, width, turn: TurnDirection.LEFT, offsetPadding })
//     .addSegment({ length: 5, width, turn: TurnDirection.LEFT, offsetPadding })
//     .addSegment({ length: 7, width, turn: TurnDirection.LEFT, offsetPadding })
//     .addSegment({ length: 10, width, turn: TurnDirection.LEFT, offsetPadding })
//     .addSegment({ length: 10, width, turn: TurnDirection.LEFT, offsetPadding })
//     .addSegment({ length: 13, width, turn: TurnDirection.RIGHT, offsetPadding });

// const route = new Route(3, 3, Direction.S).addSegment(5, 4, false).addSegment(5, 6, false).addSegment(5, 7);

// const route = generateRoute1();

function App() {
    return (
        <div className="App">
            <Map route={genRoute} />
        </div>
    );
}

export default App;
