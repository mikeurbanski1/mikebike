import type { HexTile } from '../models/hex';

export const getHexKey = (hex: HexTile): string => {
    return `${hex.q},${hex.r},${hex.s}`;
};
