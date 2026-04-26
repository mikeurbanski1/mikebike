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
        raceManager.simNextTurn();
        setSelectedHex(undefined);
        setSelectedRider(undefined);
    }, [raceManager]);

    const [selectedHex, setSelectedHex] = React.useState<SegmentHexTile | undefined>(undefined);
    const [selectedRider, setSelectedRider] = React.useState<RaceRider | undefined>(undefined);
    const setSelectedHexFn = useCallback(
        (hex: HexTile, rider?: RaceRider) => {
            const riderToUse = rider ?? (hex ? raceManager.getRiderAtHex(hex) : undefined);
            console.log('Clicked hex', hex, 'with rider', riderToUse);
            if (selectedHex && selectedHex.key === hex.key) {
                setSelectedHex(undefined);
                setSelectedRider(undefined);
            } else {
                setSelectedHex(keyToHexMap.get(hex.key));
                setSelectedRider(riderToUse);
            }
        },
        [keyToHexMap, selectedHex, raceManager]
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
            {selectedRider && <RiderCommandPanel rider={selectedRider} setSelectedCommand={setSelectedCommandFn} />}
        </div>
    );
}
