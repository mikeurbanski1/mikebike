import type { JSX } from 'react';

import { RaceRider } from '../../lib/game/rider';
import { directionAngles, gridHexSize, teamColors } from '../../lib/utils/consts';
import { hexPixelCenter } from '../../lib/utils/map-utils';

const arrowEnds = [gridHexSize / 3, gridHexSize / 6];
const arrowTip = gridHexSize / 2;
const centerOffset = gridHexSize / 3;

const arrowPoints = `-${arrowEnds[0]},-${arrowEnds[1]} 0,${-arrowTip} ${arrowEnds[0]},${-arrowEnds[1]}`;

export type RiderProps = {
    rider: RaceRider;
};
export function RiderIcon({ rider: { location, facing, team } }: RiderProps): JSX.Element {
    const { x, y } = hexPixelCenter(location, { x: gridHexSize, y: gridHexSize });

    return (
        // <g> centered at hex, rotated; arrow offset within <g>
        <g
            transform={`translate(${x}, ${y}) rotate(${directionAngles[facing]})`}
            stroke={teamColors[team.teamNumber - 1]}
            strokeWidth={3}
            fill="none"
        >
            <polyline points={arrowPoints} />
            <line x1={0} y1={arrowTip} x2={0} y2={-arrowTip} />
        </g>
    );
}
