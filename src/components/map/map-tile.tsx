import { Hexagon, Text } from 'react-hexgrid';

import type { RaceRider } from '../../lib/game/rider.ts';
import type { SegmentHexTile } from '../../lib/map/map.ts';
import { roadCenterColor, roadColor, selectedHexColor } from '../../lib/utils/consts.ts';

export type HexProps = {
    hexTile: SegmentHexTile;
    setSelectedHex: (hex: SegmentHexTile, rider?: RaceRider) => void;
    selected?: boolean;
};

export function MapTile({ hexTile, setSelectedHex, selected }: HexProps) {
    const { q, r, s, isCenter } = hexTile;

    return (
        <Hexagon
            q={q}
            r={r}
            s={s}
            style={{
                fill: selected ? selectedHexColor : isCenter ? roadCenterColor : roadColor,
                stroke: '#333',
                cursor: 'pointer',
            }}
            onClick={() => {
                console.log(`Clicked ${q}, ${r}, ${s}`);
                setSelectedHex(hexTile);
            }}
        >
            <Text fontSize={10}>{`${q},${r},${s}`}</Text>
        </Hexagon>
    );
}
