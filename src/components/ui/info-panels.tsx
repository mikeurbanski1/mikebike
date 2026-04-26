import React, { type JSX } from 'react';

import type { RaceRider } from '../../lib/game/rider';
import { SegmentHexTile } from '../../lib/map/map';
import { Effort, type Command } from '../../lib/models/commands';

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
    setSelectedCommand: (command: Command) => void;
};
export function RiderCommandPanel({ rider, setSelectedCommand }: RiderCommandPanelProps): JSX.Element {
    const [selectedEffort, setSelectedEffort] = React.useState<Effort | undefined>(rider.nextCommand?.effort);

    const handleEffortClick = (effort: Effort) => {
        setSelectedEffort(effort);
        setSelectedCommand({ riderId: rider.id, effort });
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

    return (
        <div className="command-panel">
            <h3>Rider info:</h3>
            <p>
                Rider: #{rider.bibNumber} {rider.name} ({rider.team.name}) - facing {rider.facing}
            </p>
            <div className="effort-buttons">{effortButtons}</div>
        </div>
    );
}
