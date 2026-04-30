import type { RiderStamina } from './abilities';

export const Effort = {
    RECOVER: 'Recover',
    EASY: 'Easy',
    STEADY: 'Steady',
    HARD: 'Hard',
    ATTACK: 'Attack',
    // ALL_OUT: 'All Out',
};
export type Effort = (typeof Effort)[keyof typeof Effort];

export interface Command {
    effort: Effort;
    outcome: CommandOutcome;
}

export interface CommandOutcome {
    newStamina: RiderStamina;
    distance: number;
    debug: CommandOutcomeDebug;
}

export interface CommandOutcomeDebug {
    baseDistance: number;
    baseStaminaUpdate: number;
    baseMaxStaminaUpdate: number;
    baseHighEffortUpdate: number;
    shelterStaminaEffect: number;
    shelterHighEffortEffect: number;
    maxStaminaPenaltyFromLowStamina: number;
    highEffortPenaltyFromLowStamina: number;
    distancePenaltyFromLowStamina: number;
    staminaPenaltyFromLowHighEffort: number;
    maxStaminaPenaltyFromLowHighEffort: number;
    distancePenaltyFromLowHighEffort: number;
}
