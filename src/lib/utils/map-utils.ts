import { Route } from '../map/route.ts';
import {
    Axis,
    Direction,
    PadDirection,
    TurnDirection,
    type BoundingBox,
    type HexTile,
    type PathSegment,
    type RawSegment,
    type RouteHexes,
    type SegmentHexTile,
    type UndirectedSegment,
} from '../models/map.ts';
import { getHexKey } from './hex-utils.ts';

const directions = [Direction.N, Direction.NE, Direction.SE, Direction.S, Direction.SW, Direction.NW];

const axes = [Axis.Q, Axis.R, Axis.S];

export const getDirectionByOffset = (direction: Direction, offset: number): Direction => {
    const currentIndex = directions.indexOf(direction);
    const newIndex = (currentIndex + offset + directions.length) % directions.length;
    return directions[(newIndex + directions.length) % directions.length];
};

export const getOppositeDirection = (direction: Direction): Direction => {
    return getDirectionByOffset(direction, 3);
};

export const getAxisByOffset = (axis: Axis, offset: number): Axis => {
    const currentIndex = axes.indexOf(axis);
    const newIndex = (currentIndex + offset + axes.length) % axes.length;
    return axes[(newIndex + axes.length) % axes.length];
};

export const getNewDirection = (currentDirection: Direction, turn: TurnDirection): Direction => {
    const turnValue = turn === TurnDirection.LEFT ? -1 : 1;
    return getDirectionByOffset(currentDirection, turnValue);
};

export const getRightNeighbor = (baseHex: HexTile, travelDirection: Direction, centerOffset: number): HexTile => {
    const offset = centerOffset % 2 === 1 ? 1 : 2; // if centerOffset is odd, we want to move one step clockwise, otherwise stay in the same direction
    return getNeighbor(baseHex, getDirectionByOffset(travelDirection, offset));
};

export const getLeftNeighbor = (baseHex: HexTile, travelDirection: Direction, centerOffset: number): HexTile => {
    const offset = centerOffset % 2 === 1 ? -1 : -2;
    return getNeighbor(baseHex, getDirectionByOffset(travelDirection, offset));
};

// export const getRightNthNeighbor = (baseHex: HexTile, travelDirection: Direction, n: number): HexTile => {
//     const currentIndex = directions.indexOf(travelDirection);
//     const offset = centerOffset % 2 === 1 ? 1 : 2; // if centerOffset is odd, we want to move one step clockwise, otherwise stay in the same direction
//     return getNeighbor(baseHex, directions[(currentIndex + offset) % directions.length]);
// };

export const getHexByVector = (baseHex: HexTile, vector: HexTile): HexTile => {
    return {
        q: baseHex.q + vector.q,
        r: baseHex.r + vector.r,
        s: baseHex.s + vector.s,
    };
};

export const getVectorBetweenHexes = (fromHex: HexTile, toHex: HexTile): HexTile => {
    return {
        q: toHex.q - fromHex.q,
        r: toHex.r - fromHex.r,
        s: toHex.s - fromHex.s,
    };
};

/**
 * Get a vector from the given hex along the from axis to the plane defined by the to axis on the to hex
 *
 * However, we need to check if we are already PAST the target axis in the travel direction
 */
export const getDistanceToAxis = (
    fromHex: HexTile,
    toHex: HexTile,
    toAxis: Axis,
    travelDirection: Direction
): number => {
    const fromAxisValue = fromHex[toAxis.toLowerCase() as keyof HexTile];
    const toAxisValue = toHex[toAxis.toLowerCase() as keyof HexTile];

    if (
        toAxis === Axis.Q &&
        (travelDirection === Direction.NW || travelDirection === Direction.SW) &&
        fromAxisValue < toAxisValue
    ) {
        return -Math.abs(toAxisValue - fromAxisValue);
    } else if (
        toAxis === Axis.Q &&
        (travelDirection === Direction.NE || travelDirection === Direction.SE) &&
        fromAxisValue > toAxisValue
    ) {
        return -Math.abs(toAxisValue - fromAxisValue);
    } else if (
        toAxis === Axis.R &&
        (travelDirection === Direction.NE || travelDirection === Direction.N) &&
        fromAxisValue < toAxisValue
    ) {
        return -Math.abs(toAxisValue - fromAxisValue);
    } else if (
        toAxis === Axis.R &&
        (travelDirection === Direction.SW || travelDirection === Direction.S) &&
        fromAxisValue > toAxisValue
    ) {
        return -Math.abs(toAxisValue - fromAxisValue);
    } else if (
        toAxis === Axis.S &&
        (travelDirection === Direction.SE || travelDirection === Direction.S) &&
        fromAxisValue < toAxisValue
    ) {
        return -Math.abs(toAxisValue - fromAxisValue);
    } else if (
        toAxis === Axis.S &&
        (travelDirection === Direction.NW || travelDirection === Direction.N) &&
        fromAxisValue > toAxisValue
    ) {
        return -Math.abs(toAxisValue - fromAxisValue);
    }

    return Math.abs(toAxisValue - fromAxisValue);
};

export const getDirectionVector = (direction: Direction, scalar: number = 1): HexTile => {
    switch (direction) {
        case Direction.NE:
            return { q: scalar, r: -scalar, s: 0 };
        case Direction.SE:
            return { q: scalar, r: 0, s: -scalar };
        case Direction.SW:
            return { q: -scalar, r: scalar, s: 0 };
        case Direction.NW:
            return { q: -scalar, r: 0, s: scalar };
        case Direction.N:
            return { q: 0, r: -scalar, s: scalar };
        case Direction.S:
            return { q: 0, r: scalar, s: -scalar };
    }
};

export const directionToAxis = (direction: Direction): Axis => {
    switch (direction) {
        case Direction.N:
        case Direction.S:
            return Axis.Q;
        case Direction.NW:
        case Direction.SE:
            return Axis.R;
        case Direction.NE:
        case Direction.SW:
            return Axis.S;
    }
};

export const directionToAxisMap = directions.reduce(
    (acc, direction) => {
        acc[direction] = directionToAxis(direction);
        return acc;
    },
    {} as Record<Direction, Axis>
);

export const getVectorToNthPadding = (
    baseHex: HexTile,
    travelDirection: Direction,
    n: number,
    side: PadDirection
): HexTile => {
    const oddStepScalar = Math.floor((n + 1) / 2); // will be equal to or 1 more than the even step (first step is always odd)
    const evenStepScalar = Math.floor(n / 2);
    const indexSign = side === PadDirection.RIGHT ? 1 : -1;
    const oddStepVector = getDirectionVector(getDirectionByOffset(travelDirection, indexSign), oddStepScalar);
    const evenStepVector = getDirectionVector(getDirectionByOffset(travelDirection, indexSign * 2), evenStepScalar);
    return getHexByVector(baseHex, getHexByVector(oddStepVector, evenStepVector));
};

export const getNeighbor = (hex: HexTile, direction: Direction): HexTile => {
    return getSegmentEnd(hex, direction, 1);
};

export const getSegmentEnd = (startHex: HexTile, direction: Direction, length: number): HexTile => {
    const vector = getDirectionVector(direction, length);
    return getHexByVector(startHex, vector);
};

const fillRow = (startHex: HexTile, segment: PathSegment): SegmentHexTile[] => {
    const row: SegmentHexTile[] = [{ ...startHex, segmentNumber: segment.index, isCenter: true }];
    let leftHex = startHex;
    let rightHex = startHex;
    const padding = Math.floor(segment.width / 2);
    for (let q = 1; q <= padding; q++) {
        const leftNeighbor = getLeftNeighbor(leftHex, segment.direction, q);
        const rightNeighbor = getRightNeighbor(rightHex, segment.direction, q);

        if (q <= segment.padLeft) {
            row.unshift({ ...leftNeighbor, segmentNumber: segment.index, isCenter: false });
        }

        if (q <= segment.padRight) {
            row.push({ ...rightNeighbor, segmentNumber: segment.index, isCenter: false });
        }

        leftHex = leftNeighbor;
        rightHex = rightNeighbor;
    }
    return row;
};

const generateSegmentHexes = (segment: PathSegment, startHex?: HexTile): SegmentHexTile[] => {
    const hexes: SegmentHexTile[] = [];
    const isFirstSegment = startHex === undefined;
    let currentHex = startHex ?? { q: 0, r: 0, s: 0 };

    // the length represents the number of edges crossed, so we only render the path start on the first segment
    if (isFirstSegment) {
        const firstRow = fillRow(currentHex, segment);
        hexes.push(...firstRow);
    }

    for (let i = 0; i < segment.length; i++) {
        currentHex = getNeighbor(currentHex, segment.direction);
        const newRow = fillRow(currentHex, segment);
        hexes.push(...newRow);
    }
    return hexes;
};

export const generateTurnHexes = (
    turn: TurnDirection,
    previousSegment: PathSegment,
    nextSegment: PathSegment
): { hexesToAdd: SegmentHexTile[]; hexesToRemove: Set<string> } => {
    const turnHexes: SegmentHexTile[] = [];
    const hexesToRemove = new Set<string>();

    const prevOppositePadding = turn === TurnDirection.LEFT ? previousSegment.padRight : previousSegment.padLeft;
    const nextOppositePadding = turn === TurnDirection.LEFT ? nextSegment.padRight : nextSegment.padLeft;

    const prevSamePadding = turn === TurnDirection.LEFT ? previousSegment.padLeft : previousSegment.padRight;
    const nextSamePadding = turn === TurnDirection.LEFT ? nextSegment.padLeft : nextSegment.padRight;

    const getOppositeNeighborFn = turn === TurnDirection.LEFT ? getRightNeighbor : getLeftNeighbor;
    const getSameNeighborFn = turn === TurnDirection.LEFT ? getLeftNeighbor : getRightNeighbor;

    // special case when the inside padding goes from 0 to 1, we need to pad the end of the previous segment
    // with the padding of the new segment (in the new segment's direction)
    let hexToAdd = previousSegment.end;
    if (prevSamePadding === 0 && nextSamePadding > 0) {
        for (let i = 1; i <= nextSamePadding; i++) {
            hexToAdd = getSameNeighborFn(hexToAdd, nextSegment.direction, i);
            turnHexes.push({
                ...hexToAdd,
                segmentNumber: previousSegment.index,
                isCenter: false,
            });
        }
    } else if (prevSamePadding === 1 && nextSamePadding === 3) {
        // another very special case - going from 1 to 3 on the inside only, we need to
        // fill the 3rd level padding of the end of the previous segment in the new travel direction
        let paddingHex = getVectorToNthPadding(
            previousSegment.end,
            nextSegment.direction,
            3,
            turn === TurnDirection.LEFT ? PadDirection.LEFT : PadDirection.RIGHT
        );
        turnHexes.push({
            ...paddingHex,
            segmentNumber: nextSegment.index,
            isCenter: false,
        });
    }

    // analogous - if the OUTSIDE padding goes from 1 to 0, we need to remove the outside padding of the end of the previous segment
    // effectively adopting the padding of the new segment
    // let hex = previousSegment.end;
    // if (prevOppositePadding > 0 && nextOppositePadding === 0) {
    //     for (let i = 1; i <= prevOppositePadding; i++) {
    //         hex = getOppositeNeighborFn(hex, previousSegment.direction, i);
    //         hexesToRemove.push(hex);
    //     }
    //     return { hexesToAdd: turnHexes, hexesToRemove };
    // }

    // We need to fill out the previous segment until it fills up to the end of the new segment's padding, along the axis of the new segment's travel direction
    const nextSegmentPaddingEnd = getVectorToNthPadding(
        nextSegment.start,
        nextSegment.direction,
        nextOppositePadding,
        turn === TurnDirection.LEFT ? PadDirection.RIGHT : PadDirection.LEFT
    );

    const nextSegmentAxis = directionToAxisMap[nextSegment.direction];

    let paddingColumn = previousSegment.end;
    let p = 0;
    do {
        // we need to extend each line of padding in the previous segment until it intersects the axes of the nextSegmentPaddingEnd, in the new segment's travel direction
        const fillDistance = getDistanceToAxis(
            paddingColumn,
            nextSegmentPaddingEnd,
            nextSegmentAxis,
            previousSegment.direction
        );

        if (fillDistance < 0) {
            const oppositeDirection = getOppositeDirection(previousSegment.direction);
            // we have to REMOVE this hex and go backwards until we hit the axis (but do not remove that one)
            let hexToRemove = paddingColumn;
            for (let i = 0; i < -fillDistance; i++) {
                hexesToRemove.add(getHexKey(hexToRemove));
                hexToRemove = getNeighbor(hexToRemove, oppositeDirection);
            }
        }

        let nextHex = getNeighbor(paddingColumn, previousSegment.direction);
        for (let i = 0; i < fillDistance; i++) {
            turnHexes.push({
                ...nextHex,
                segmentNumber: previousSegment.index,
                isCenter: false,
            });
            nextHex = getNeighbor(nextHex, previousSegment.direction);
        }
        p++;
        paddingColumn = getOppositeNeighborFn(paddingColumn, previousSegment.direction, p);
    } while (p <= prevOppositePadding);

    return { hexesToAdd: turnHexes, hexesToRemove };
};

export const generateRouteHexes = (route: Route): RouteHexes => {
    const hexMap = new Map<string, SegmentHexTile>();
    let currentHex: HexTile | undefined = undefined;
    let previousSegment: PathSegment | undefined = undefined;

    let topTile: HexTile | undefined = undefined;
    let bottomTile: HexTile | undefined = undefined;

    const boundingBox: BoundingBox = {
        qMin: Infinity,
        qMax: -Infinity,
        rsMin: Infinity,
        rsMax: -Infinity,
    };
    for (const { segment, turn } of route) {
        if (turn) {
            // add a hex on the turn to make it look smoother
            const turnHexes = generateTurnHexes(turn, previousSegment!, segment);
            for (const turnHex of turnHexes.hexesToAdd) {
                const key = getHexKey(turnHex);
                if (hexMap.has(key)) {
                    continue;
                }
                hexMap.set(key, turnHex);
            }

            for (const h of turnHexes.hexesToRemove) {
                hexMap.delete(h);
            }
        }
        const segmentHexes = generateSegmentHexes(segment, currentHex);

        for (const segmentHex of segmentHexes) {
            const key = getHexKey(segmentHex);
            if (hexMap.has(key)) {
                continue;
            }
            hexMap.set(key, segmentHex);
        }

        currentHex = segment.end;
        previousSegment = segment;
    }

    const hexes = Array.from(hexMap.values());

    hexes.forEach((hex) => {
        boundingBox.qMin = Math.min(boundingBox.qMin, hex.q);
        boundingBox.qMax = Math.max(boundingBox.qMax, hex.q);

        // the top tile is the one where (-r, s) is maximum
        if (topTile === undefined || -hex.r + hex.s > -topTile.r + topTile.s) {
            topTile = hex;
        }

        // the bottom tile is the one where (r, -s) is maximum
        if (bottomTile === undefined || hex.r - hex.s > bottomTile.r - bottomTile.s) {
            bottomTile = hex;
        }
    });

    boundingBox.rsMin = topTile!.r - topTile!.s;
    boundingBox.rsMax = bottomTile!.r - bottomTile!.s;

    return { hexes, boundingBox };
};

export const getSegmentPadding = (segment: RawSegment): { padLeft: number; padRight: number } => {
    let w = Math.floor(segment.width / 2);
    let padLeft = w;
    let padRight = w;
    if (segment.width % 2 === 0) {
        if (segment.offsetPadding === PadDirection.LEFT) {
            padRight -= 1;
        } else {
            padLeft -= 1;
        }
    }

    return {
        padLeft,
        padRight,
    };
};

export const hexPixelCenter = (hex: HexTile, hexSize: { x: number; y: number }) => {
    const x = hexSize.x * ((3 / 2) * hex.q);
    const y = hexSize.y * ((Math.sqrt(3) / 2) * hex.q + Math.sqrt(3) * hex.r);
    return { x, y };
};

export const normalizeSegment = (segment: RawSegment, previousSegment?: PathSegment): UndirectedSegment => {
    if (segment.length <= 0) {
        throw new Error(
            `Segment length must be greater than 0. Segment index: ${segment.index}, segment length: ${segment.length}`
        );
    }
    if (segment.width <= 0) {
        throw new Error(
            `Segment width must be greater than 0. Segment index: ${segment.index}, segment width: ${segment.width}`
        );
    }
    if (previousSegment) {
        if (Math.abs(segment.width - previousSegment.width) > 2) {
            throw new Error(
                `Width of new segment must be within 2 units of the previous segment width. Previous segment width: ${previousSegment.width}, new segment width: ${segment.width}`
            );
        }
    }
    if (segment.offsetPadding === undefined && segment.width % 2 === 0) {
        throw new Error(
            `offsetPadding must be set for segments with even width. Segment index: ${segment.index}, segment width: ${segment.width}`
        );
    }
    if (
        previousSegment?.width === 2 &&
        segment.width === 2 &&
        previousSegment.offsetPadding !== segment.offsetPadding
    ) {
        console.log('Setting offset padding to match previous segment to avoid a gap of 2 with no padding');
        segment.offsetPadding = previousSegment.offsetPadding;
    }

    return {
        ...segment,
        ...getSegmentPadding(segment),
    };
};
