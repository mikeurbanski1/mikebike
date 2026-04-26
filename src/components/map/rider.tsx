import type { JSX } from 'react';

import type { HexTile } from '../../lib/map/map';
import type { Direction } from '../../lib/models/map';
import { directionAngles, gridHexSize } from '../../lib/utils/consts';
import { hexPixelCenter } from '../../lib/utils/map-utils';

const arrowEnds = [gridHexSize / 3, gridHexSize / 6];
const arrowTip = gridHexSize / 2;
// const centerOffset = gridHexSize / 3;

const arrowPoints = `-${arrowEnds[0]},-${arrowEnds[1]} 0,${-arrowTip} ${arrowEnds[0]},${-arrowEnds[1]}`;

// export function Riders({
//     riders,
//     setSelectedHexFn,
// }: {
//     riders: RaceRider[];
//     setSelectedHexFn: (hex: HexTile, rider?: RaceRider) => void;
// }) {
//     return riders.map((rider) => <RiderIcon key={rider.id} rider={rider} setSelectedHexFn={setSelectedHexFn} />);
// }
export type RiderProps = {
    location: HexTile;
    facing: Direction;
    color: string;
    setSelectedHexFn: (hex: HexTile) => void;
};
export function RiderIcon({ location, facing, color, setSelectedHexFn }: RiderProps): JSX.Element {
    console.log('in rider icon render', location, facing);
    const { x, y } = hexPixelCenter(location, { x: gridHexSize, y: gridHexSize });

    return (
        // <g> centered at hex, rotated; arrow offset within <g>
        <g
            transform={`translate(${x}, ${y}) rotate(${directionAngles[facing]})`}
            stroke={color}
            strokeWidth={3}
            fill="none"
            onClick={() => setSelectedHexFn(location)}
            cursor="pointer"
        >
            <polyline points={arrowPoints} />
            <line x1={0} y1={arrowTip} x2={0} y2={-arrowTip} />
        </g>
    );
}
