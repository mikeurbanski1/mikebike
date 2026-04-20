import type { HexTile } from '../models/map';

export const getHexKey = (hex: HexTile): string => {
    return `${hex.q},${hex.r},${hex.s}`;
};
