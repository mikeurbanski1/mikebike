import type { HexTile, SegmentHexTile } from '../map/map';

export interface BoundingBox {
    qMin: number;
    qMax: number;
    rsMin: number;
    rsMax: number;
}

export interface RouteHexes {
    hexes: SegmentHexTile[];
    keyToHexMap: Map<string, SegmentHexTile>;
    // the rectangular view that emcompasses all the hexes, used for setting the svg viewbox
    boundingBox: BoundingBox;
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

export const Direction = {
    NE: 'NE',
    SE: 'SE',
    SW: 'SW',
    NW: 'NW',
    S: 'S',
    N: 'N',
} as const;

export type Direction = (typeof Direction)[keyof typeof Direction];

export const Axis = {
    Q: 'Q',
    R: 'R',
    S: 'S',
} as const;
export type Axis = (typeof Axis)[keyof typeof Axis];

// export const RiderHexPosition = {
//     CENTER: 'CENTER',
//     LEFT: 'LEFT',
//     RIGHT: 'RIGHT',
// } as const;
// export type RiderHexPosition = (typeof RiderHexPosition)[keyof typeof RiderHexPosition];

export interface GridSize {
    width: number;
    height: number;
}

export interface ViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
