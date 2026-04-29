import { HexGrid, Layout } from 'react-hexgrid';
import ScrollContainer from 'react-indiana-drag-scroll';

import type { RaceRider } from '../../lib/game/rider';
import type { HexTile, SegmentHexTile } from '../../lib/map/map';
import type { BoundingBox } from '../../lib/models/map';
import { gridHexSize, teamColors } from '../../lib/utils/consts';
import { getViewDimensions } from '../../lib/utils/map-utils';
import { MapTile } from './map-tile';
import { RiderIcon } from './rider';

export interface MapProps {
    hexes: SegmentHexTile[];
    boundingBox: BoundingBox;
    riders: RaceRider[];
    selectedHex?: SegmentHexTile;
    setSelectedHexFn: (hex: HexTile, rider?: RaceRider) => void;
    turn: number;
}

export function MapPanel({ hexes, boundingBox, riders, selectedHex, setSelectedHexFn }: MapProps) {
    console.log('in map panel render');
    console.log(riders);

    const { gridSize, viewBox } = getViewDimensions(boundingBox);

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
                                    key={hexTile.key}
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
                    {riders.map((rider) => (
                        <RiderIcon
                            key={rider.id + rider.location.key}
                            location={rider.location}
                            facing={rider.facing}
                            color={teamColors[rider.team.teamNumber - 1]}
                            setSelectedHexFn={setSelectedHexFn}
                        />
                    ))}
                </HexGrid>
            </ScrollContainer>
        </div>
    );
}
