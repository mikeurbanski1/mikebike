import React from 'react';

import './App.css';

import { LiveRace } from './components/race/live-race.tsx';
import { RaceManager } from './lib/game/race-manager.ts';
import { generateRace } from './lib/gen/race-gen.ts';
import { simpleStraightRoute } from './lib/gen/route-gen.ts';
import { Route } from './lib/map/route';

let seed: string | undefined = undefined;
// seed = '0.33578115234574535';

const renderTypes = ['random', 'small', 'turnTest', 'randomLarge', 'simpleStraight'] as const;
type RenderType = (typeof renderTypes)[number];
let renderType: RenderType;
const renderTypeToFn: Record<RenderType, () => Route> = {
    random: randomRoute,
    small: small,
    turnTest: turnTestRoute,
    randomLarge: largeRandomRoute,
    simpleStraight: simpleStraightRoute,
};

renderType = 'random';
// renderType = 'small';
// renderType = 'randomLarge';
// renderType = 'turnTest';
renderType = 'simpleStraight';

let route = renderTypeToFn[renderType]();
let race = generateRace();
const raceManager = new RaceManager(race, route);

const RaceContext = React.createContext(new RaceManager(race, route));
export const useRaceManager = () => React.useContext(RaceContext);

function App() {
    return (
        <div className="App">
            <RaceContext value={raceManager}>
                <LiveRace />
            </RaceContext>
        </div>
    );
}

export default App;
function randomRoute(): Route {
    throw new Error('Function not implemented.');
}

function small(): Route {
    throw new Error('Function not implemented.');
}

function turnTestRoute(): Route {
    throw new Error('Function not implemented.');
}

function largeRandomRoute(): Route {
    throw new Error('Function not implemented.');
}
