import React, { useCallback, type JSX } from 'react';

import { useRaceManager } from '../../App';
import type { RaceRider } from '../../lib/game/rider';
import type { HexTile, SegmentHexTile } from '../../lib/map/map';
import { MapPanel } from '../map/map';
import { HexInfoPanel, RiderCommandPanel } from '../ui/info-panels';

type LiveRaceProps = {};
export function LiveRace({}: LiveRaceProps): JSX.Element {
    const raceManager = useRaceManager();
    const riders = raceManager.getAllRiders();

    const { keyToHexMap } = raceManager.routeHexes;

    const [turn, setTurn] = React.useState(raceManager.nextTurn);
    const [selectedHex, setSelectedHex] = React.useState<SegmentHexTile | undefined>(undefined);
    const [selectedRider, setSelectedRider] = React.useState<RaceRider | undefined>(undefined);

    const endTurn = useCallback(() => {
        raceManager.simNextTurn();
        setSelectedHex(selectedRider ? keyToHexMap.get(selectedRider.location.key) : undefined);
        // setSelectedRider(undefined);
        setTurn(raceManager.nextTurn);
    }, [raceManager, selectedRider]);

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

    return (
        <div className="live-race">
            <MapPanel
                hexes={raceManager.routeHexes.hexes}
                boundingBox={raceManager.routeHexes.boundingBox}
                riders={riders}
                selectedHex={selectedHex}
                setSelectedHexFn={setSelectedHexFn}
                turn={turn}
            />
            <button onClick={endTurn}>End turn</button>
            <HexInfoPanel hex={selectedHex} />
            {selectedRider && <RiderCommandPanel rider={selectedRider} />}
        </div>
    );
}
