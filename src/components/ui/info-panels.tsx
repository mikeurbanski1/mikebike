import React, { type JSX } from 'react';

import { useRaceManager } from '../../App';
import type { RaceRider } from '../../lib/game/rider';
import { SegmentHexTile } from '../../lib/map/map';
import { Effort } from '../../lib/models/commands';

type HexInfoPanelProps = {
    hex?: SegmentHexTile;
};
export function HexInfoPanel({ hex }: HexInfoPanelProps): JSX.Element {
    if (!hex) {
        return <div></div>;
    }
    return (
        <div className="info-panel">
            <h3>Selected tile:</h3>
            <p>
                q: {hex.q}, r: {hex.r}, s: {hex.s} (segment #{hex.segmentNumber})
            </p>
        </div>
    );
}

type RiderCommandPanelProps = {
    rider: RaceRider;
};
export function RiderCommandPanel({ rider }: RiderCommandPanelProps): JSX.Element {
    const raceManager = useRaceManager();
    const [selectedEffort, setSelectedEffort] = React.useState<Effort | undefined>(rider.nextCommand?.effort);

    // const [curStamina, setCurStamina] = React.useState(rider.stamina.curStamina);
    // const [maxStamina, setMaxStamina] = React.useState(rider.stamina.maxStamina);
    // const [highEffortStamina, setHighEffortStamina] = React.useState(rider.stamina.highEffortStamina);
    // const

    React.useEffect(() => {
        setSelectedEffort(rider.nextCommand?.effort);
    }, [rider]);

    const handleEffortClick = (effort: Effort) => {
        setSelectedEffort(effort);
        raceManager.setRiderEffort(rider, effort);
        console.log(`Set effort to ${effort}`);
    };

    const selectedClass = 'effort-button effort-button-selected';
    const unselectedClass = 'effort-button';

    const effortButtons = Object.values(Effort).map((effort) => (
        <button
            key={effort}
            className={selectedEffort === effort ? selectedClass : unselectedClass}
            onClick={() => handleEffortClick(effort)}
        >
            {effort}
        </button>
    ));

    const nextCommandOutcome = rider.nextCommand?.outcome;

    return (
        <div className="command-panel">
            <h3>Rider info:</h3>
            <p>
                Rider: #{rider.bibNumber} {rider.name} ({rider.team.name}) - facing {rider.facing}
            </p>
            <p>
                Stamina: {rider.stamina.curStamina}/{rider.stamina.maxStamina} (High Effort:{' '}
                {rider.stamina.highEffortStamina})
            </p>
            <p>Shelter: {rider.curShelter}</p>
            <div className="effort-buttons">
                {effortButtons} abc
                {nextCommandOutcome && (
                    <div className="command-outcome">
                        <h4>Next command outcome:</h4>
                        <p>
                            Distance: {nextCommandOutcome.distance}, new stamina:{' '}
                            {nextCommandOutcome.newStamina.curStamina}/{nextCommandOutcome.newStamina.maxStamina} (High
                            Effort: {nextCommandOutcome.newStamina.highEffortStamina})
                        </p>
                        <p className="debug">{JSON.stringify(nextCommandOutcome.debug)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
