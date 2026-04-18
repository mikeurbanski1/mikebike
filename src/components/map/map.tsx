import { useMemo } from 'react';
import { HexGrid, Layout } from 'react-hexgrid';
import ScrollContainer from 'react-indiana-drag-scroll';

import type { Route } from '../../lib/map/route';
import { hexHeight, hexWidth } from '../../lib/utils/consts';
import { generateRouteHexes } from '../../lib/utils/path-utils';
import { MapTile } from './map-tile';

export interface MapProps {
    route: Route;
}

export function Map({ route }: MapProps) {
    const { hexes, boundingBox } = useMemo(() => generateRouteHexes(route), [route]);

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
                <Layout size={{ x: hexWidth / 2, y: hexWidth / 2 }} flat={true} spacing={1} origin={{ x: 0, y: 0 }}>
                    {hexes.map((hexTile) => {
                        return <MapTile key={`${hexTile.q},${hexTile.r},${hexTile.s}`} hexTile={hexTile} />;
                    })}
                </Layout>
            </HexGrid>
        </ScrollContainer>
    );
}
