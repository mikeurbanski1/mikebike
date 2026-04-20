import { useState } from 'react';
import { Hexagon, Text } from 'react-hexgrid';

import type { SegmentHexTile } from '../../lib/models/map.ts';
import { roadCenterColor, roadColor, selectedHexColor } from '../../lib/utils/consts.ts';

export type HexProps = {
    hexTile: SegmentHexTile;
};

export function MapTile({ hexTile }: HexProps) {
    const [selected, setSelected] = useState<boolean>(false);

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
                setSelected((prev) => !prev);
            }}
        >
            <Text fontSize={10}>{`${q},${r},${s}`}</Text>
        </Hexagon>
    );
}
