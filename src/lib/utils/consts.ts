import { Direction } from '../models/map';

export const hexWidth = 80;
export const hexHeight = Math.sqrt(3) * (hexWidth / 2);

export const gridHexSize = hexWidth / 2;

export const directionAngles: Record<Direction, number> = {
    [Direction.N]: 0,
    [Direction.NE]: 60,
    [Direction.SE]: 120,
    [Direction.S]: 180,
    [Direction.SW]: 240,
    [Direction.NW]: 300,
};

const roadLightness = 80;
const roadCenterLightness = 90;
const roadSelectedLightness = 60;

export const roadColor = `hsl(0, 0%, ${roadLightness}%)`;
export const roadCenterColor = `hsl(0, 0%, ${roadCenterLightness}%)`;

export const selectedHexColor = `hsl(0, 0%, ${roadSelectedLightness}%)`;

export const teamColors = [
    'hsl(0, 100%, 50%)',
    'hsl(30, 100%, 50%)',
    'hsl(60, 100%, 50%)',
    'hsl(120, 100%, 50%)',
    'hsl(180, 100%, 50%)',
    'hsl(240, 100%, 50%)',
];
