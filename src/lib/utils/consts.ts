import type { RiderStamina } from '../models/abilities';
import { Effort } from '../models/commands';
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

export const maxRiderStamina = 20;
export const maxRiderHighEffortStamina = 8;

export const effortToDistance: Record<Effort, number> = {
    [Effort.RECOVER]: 3,
    [Effort.EASY]: 4,
    [Effort.STEADY]: 5,
    [Effort.HARD]: 6,
    [Effort.ATTACK]: 7,
};

export const effortToStaminaEffect: Record<Effort, RiderStamina> = {
    [Effort.RECOVER]: { curStamina: 2, maxStamina: 0, highEffortStamina: 2 },
    [Effort.EASY]: { curStamina: 1, maxStamina: 0, highEffortStamina: 1 },
    [Effort.STEADY]: { curStamina: -1, maxStamina: -0.25, highEffortStamina: 1 },
    [Effort.HARD]: { curStamina: -3, maxStamina: -0.5, highEffortStamina: -2 },
    [Effort.ATTACK]: { curStamina: -5, maxStamina: -0.5, highEffortStamina: -4 },
};
