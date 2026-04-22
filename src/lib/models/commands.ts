export const Effort = {
    RECOVER: 'Recover',
    EASY: 'Easy',
    STEADY: 'Steady',
    HARD: 'Hard',
    ATTACK: 'Attack',
    ALL_OUT: 'All Out',
};
export type Effort = (typeof Effort)[keyof typeof Effort];

export interface Command {
    effort: Effort;
    riderId: number;
}
