import './App.css';

import { LiveRace } from './components/race/live-race.tsx';
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

function App() {
    return (
        <div className="App">
            <LiveRace route={route} race={race} />
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
