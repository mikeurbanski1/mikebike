import { useMemo } from 'react';
import { HexGrid, Layout } from 'react-hexgrid';
import ScrollContainer from 'react-indiana-drag-scroll';

import type { Race } from '../../lib/game/race';
import type { Route } from '../../lib/map/route';
import { RiderHexPosition } from '../../lib/models/map';
import { gridHexSize, hexHeight, hexWidth } from '../../lib/utils/consts';
import { generateRouteHexes } from '../../lib/utils/map-utils';
import { MapTile } from './map-tile';
import { RiderIcon } from './rider';

export interface MapProps {
    route: Route;
    race: Race;
}

export function Map({ route, race }: MapProps) {
    const { hexes, boundingBox } = useMemo(() => generateRouteHexes(route), [route]);
    const riders = useMemo(() => race.teams.flatMap((team) => team.riders), [race]);

    const qDiff = boundingBox.qMax - boundingBox.qMin;
    const rsDiff = boundingBox.rsMax - boundingBox.rsMin;

    console.log('boundingBox', boundingBox);
    console.log('qDiff', qDiff);
    console.log('rsDiff', rsDiff);

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

    console.log('gridSize', gridSize);
    console.log('viewBox', viewBox);

    return (
        <ScrollContainer className="map-container">
            <HexGrid
                className="map-grid"
                width={gridSize.width}
                height={gridSize.height}
                viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            >
                <Layout size={{ x: gridHexSize, y: gridHexSize }} flat={true} spacing={1} origin={{ x: 0, y: 0 }}>
                    {hexes.map((hexTile) => {
                        return <MapTile key={`${hexTile.q},${hexTile.r},${hexTile.s}`} hexTile={hexTile} />;
                    })}
                </Layout>
                {riders.map((rider) => (
                    <RiderIcon key={rider.bibNumber} rider={rider} />
                ))}
            </HexGrid>
        </ScrollContainer>
    );
}
