import type { JSX } from 'react';

import { Rider } from '../../lib/game/rider';
import { RiderHexPosition } from '../../lib/models/map';
import { directionAngles, gridHexSize, teamColors } from '../../lib/utils/consts';
import { hexPixelCenter } from '../../lib/utils/map-utils';

const arrowEnds = [gridHexSize / 3, gridHexSize / 6];
const arrowTip = gridHexSize / 2;
const centerOffset = gridHexSize / 3;

const arrowPoints = `-${arrowEnds[0]},-${arrowEnds[1]} 0,${-arrowTip} ${arrowEnds[0]},${-arrowEnds[1]}`;

export type RiderProps = {
    rider: Rider;
};
export function RiderIcon({ rider: { location, facing, hexPosition, team } }: RiderProps): JSX.Element {
    const { x, y } = hexPixelCenter(location, { x: gridHexSize, y: gridHexSize });

    let xOffset = 0;
    if (hexPosition !== RiderHexPosition.CENTER) {
        xOffset = hexPosition === RiderHexPosition.LEFT ? -centerOffset : centerOffset;
    }

    return (
        // <g> centered at hex, rotated; arrow offset within <g>
        <g
            transform={`translate(${x}, ${y}) rotate(${directionAngles[facing]})`}
            stroke={teamColors[team.teamNumber - 1]}
            strokeWidth={3}
            fill="none"
            onClick={() => console.log(`Clicked rider at ${JSON.stringify(location)} - ${facing} ${hexPosition}`)}
        >
            <polyline points={arrowPoints} transform={`translate(${xOffset}, 0)`} />
            <line x1={0} y1={arrowTip} x2={0} y2={-arrowTip} transform={`translate(${xOffset}, 0)`} />
        </g>
    );
}
