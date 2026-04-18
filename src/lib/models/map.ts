import { getHexKey } from '../utils/hex-utils';
import { getLeftNeighbor, getNeighbor, getRightNeighbor } from '../utils/path-utils';
import type { Direction, HexTile } from './hex';

export interface BoundingBox {
    qMin: number;
    qMax: number;
    rsMin: number;
    rsMax: number;
}

export interface SegmentHexTile extends HexTile {
    segmentNumber: number;
    isCenter: boolean;
}

export interface RouteHexes {
    hexes: SegmentHexTile[];
    // the rectangular view that emcompasses all the hexes, used for setting the svg viewbox
    boundingBox: {
        qMin: number;
        qMax: number;
        rsMin: number;
        rsMax: number;
    };
}

export const TurnDirection = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
} as const;
export type TurnDirection = (typeof TurnDirection)[keyof typeof TurnDirection];

export const PadDirection = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
} as const;
export type PadDirection = (typeof PadDirection)[keyof typeof PadDirection];

export interface RawSegment {
    offsetPadding?: PadDirection;
    length: number;
    width: number;
    index: number;
}

export interface UndirectedSegment extends RawSegment {
    padLeft: number;
    padRight: number;
}

export interface PathSegment extends UndirectedSegment {
    start: HexTile;
    end: HexTile;
    direction: Direction;
}

export interface Turn {
    beforeSegmentIndex: number;
    turnDirection: TurnDirection;
}

export interface NavigationInstruction {
    segment: PathSegment;
    turn?: TurnDirection;
}
