import type { JSX } from 'react';

import { SegmentHexTile } from '../../lib/map/map';

type HexInfoPanelProps = {
    hex?: SegmentHexTile;
};
export function HexInfoPanel({ hex }: HexInfoPanelProps): JSX.Element {
    if (!hex) {
        return <div></div>;
    }
    return (
        <div>
            <h3>Selected tile:</h3>
            <p>
                q: {hex.q}, r: {hex.r}, s: {hex.s}
            </p>
            <p>Segment number: {hex.segmentNumber}</p>
            <p>
                Riders on tile:{' '}
                {hex.riders ? hex.riders.map((r) => `${r.bibNumber} (facing ${r.facing})`).join(', ') : 'None'}
            </p>
        </div>
    );
}
