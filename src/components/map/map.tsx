import React, { useCallback, useEffect, useMemo } from 'react';
import { HexGrid, Layout } from 'react-hexgrid';
import ScrollContainer from 'react-indiana-drag-scroll';

import type { Race } from '../../lib/game/race';
import type { SegmentHexTile } from '../../lib/map/map';
import type { Route } from '../../lib/map/route';
import { RiderHexPosition, type HexTile } from '../../lib/models/map';
import { gridHexSize, hexHeight, hexWidth } from '../../lib/utils/consts';
import { getHexKey } from '../../lib/utils/hex-utils';
import { generateRouteHexes } from '../../lib/utils/map-utils';
import { HexInfoPanel } from '../ui/info-panels';
import { MapTile } from './map-tile';
import { RiderIcon } from './rider';

export interface MapProps {
    route: Route;
    race: Race;
}

export function MapPanel({ route, race }: MapProps) {
    const { hexes, boundingBox, keyToHexMap } = useMemo(() => generateRouteHexes(route), [route]);
    const riders = useMemo(() => {
        console.log('Adding riders initially');
        const riders = race.teams.flatMap((team) => team.riders);
        riders.forEach((rider) => {
            const hexKey = getHexKey(rider.location);
            const hexTile = keyToHexMap.get(hexKey);
            if (!hexTile) {
                console.warn(`Rider ${rider.bibNumber} is located at ${hexKey}, which is not on the route`);
                return;
            }
            rider.location = hexTile;
            hexTile.addRider(rider);
        });
        return riders;
    }, [race, keyToHexMap]);

    const [selectedHex, setSelectedHex] = React.useState<SegmentHexTile | undefined>(undefined);
    const setSelectedHexFn = useCallback(
        (hex?: HexTile) => {
            console.log('Setting selected hex to', hex);
            setSelectedHex(hex ? keyToHexMap.get(getHexKey(hex)) : undefined);
        },
        [route]
    );

    const qDiff = boundingBox.qMax - boundingBox.qMin;
    const rsDiff = boundingBox.rsMax - boundingBox.rsMin;

    // console.log('boundingBox', boundingBox);
    // console.log('qDiff', qDiff);
    // console.log('rsDiff', rsDiff);

    const gridSize = {
        width: qDiff * hexWidth * 0.75 + hexWidth / 2,
        height: rsDiff * hexHeight * 0.5 + hexHeight / 2,
    };

    const viewBox = {
        x: boundingBox.qMin * hexWidth * 0.75 - hexWidth / 2,
        y: boundingBox.rsMin * hexHeight * 0.5 - hexHeight / 4,
        width: gridSize.width + hexWidth / 2, // add some padding to the right and left of the grid to account for the fact that the hexes are centered on their coordinates
        height: gridSize.height,
    };

    // const gridSize = {
    //     width: 1000,
    //     height: 1000, // add an extra hex height to account for the fact that the hexes are centered on their coordinates, so we need to add some padding to the top and bottom of the grid
    // };

    // const viewBox = {
    //     x: -500,
    //     y: -500,
    //     width: 1000,
    //     height: 1000,
    // };

    // console.log('gridSize', gridSize);
    // console.log('viewBox', viewBox);

    return (
        <div className="map-panel">
            <ScrollContainer className="map-container">
                <HexGrid
                    className="map-grid"
                    width={gridSize.width}
                    height={gridSize.height}
                    viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                >
                    <Layout size={{ x: gridHexSize, y: gridHexSize }} flat={true} spacing={1} origin={{ x: 0, y: 0 }}>
                        {hexes.map((hexTile) => {
                            return (
                                <MapTile
                                    key={getHexKey(hexTile)}
                                    hexTile={hexTile}
                                    setSelectedHex={setSelectedHexFn}
                                    selected={
                                        selectedHex?.q === hexTile.q &&
                                        selectedHex?.r === hexTile.r &&
                                        selectedHex?.s === hexTile.s
                                    }
                                />
                            );
                        })}
                    </Layout>
                </HexGrid>
            </ScrollContainer>
            <HexInfoPanel hex={selectedHex} />
        </div>
    );
}
