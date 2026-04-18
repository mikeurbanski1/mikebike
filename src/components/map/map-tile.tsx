// react function component to render a hex (to avoid re rendering all on any hex click)

import { useState } from 'react';
import { Hexagon, Text } from 'react-hexgrid';

import type { HexTile } from '../../lib/models/hex';
import type { SegmentHexTile } from '../../lib/models/map.ts';

export type HexProps = {
    hexTile: SegmentHexTile;
};

export function MapTile({ hexTile }: HexProps) {
    const [selected, setSelected] = useState<boolean>(false);
    const baseColor = `hsl(${(hexTile.segmentNumber * 360) / 15}, 70%, 50%)`;
    const centerLineColor = `hsl(${(hexTile.segmentNumber * 360) / 15}, 70%, 70%)`;

    const { q, r, s, isCenter } = hexTile;

    return (
        <Hexagon
            q={q}
            r={r}
            s={s}
            style={{
                fill: isCenter ? centerLineColor : baseColor,
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
