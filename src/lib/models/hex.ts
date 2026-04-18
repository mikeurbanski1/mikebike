export interface HexTile {
    q: number;
    r: number;
    s: number;
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
