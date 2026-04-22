import React, { useCallback, useMemo, type JSX } from 'react';

import type { Race } from '../../lib/game/race';
import { RaceManager } from '../../lib/game/race-manager';
import type { RaceRider } from '../../lib/game/rider';
import type { HexTile, SegmentHexTile } from '../../lib/map/map';
import type { Route } from '../../lib/map/route';
import type { Command } from '../../lib/models/commands';
import { MapPanel } from '../map/map';
import { HexInfoPanel, RiderCommandPanel } from '../ui/info-panels';

type LiveRaceProps = {
    race: Race;
    route: Route;
};
export function LiveRace({ race, route }: LiveRaceProps): JSX.Element {
    const raceManager = useMemo(() => {
        return new RaceManager(race, route);
    }, [race, route]);

    const { keyToHexMap } = raceManager.routeHexes;

    const riderIdMap = useMemo(() => {
        const riders = raceManager.getAllRiders();
        return riders.reduce((map, rider) => {
            map.set(rider.id, rider);
            return map;
        }, new Map<number, RaceRider>());
    }, [raceManager]);

    const endTurn = useCallback(() => {
        console.log('Ending turn with riders:', riderIdMap);
        riderIdMap.forEach((rider) => {
            if (rider.nextCommand) {
                console.log(`Rider ${rider.bibNumber} has command:`, rider.nextCommand);
            } else {
                console.log(`Rider ${rider.bibNumber} has no command`);
            }
        });
    }, [riderIdMap]);

    const [selectedHex, setSelectedHex] = React.useState<SegmentHexTile | undefined>(undefined);
    const setSelectedHexFn = useCallback(
        (hex?: HexTile) => {
            console.log('Setting selected hex to', hex);
            setSelectedHex(hex ? keyToHexMap.get(hex.key) : undefined);
        },
        [route]
    );

    const setSelectedCommandFn = useCallback(
        (command: Command) => {
            riderIdMap.get(command.riderId)!.nextCommand = command;
        },
        [riderIdMap]
    );

    return (
        <div className="live-race">
            <MapPanel raceManager={raceManager} selectedHex={selectedHex} setSelectedHexFn={setSelectedHexFn} />
            <button onClick={endTurn}>End turn</button>
            <HexInfoPanel hex={selectedHex} />
            {selectedHex?.rider && (
                <RiderCommandPanel rider={selectedHex.rider} setSelectedCommand={setSelectedCommandFn} />
            )}
        </div>
    );
}
