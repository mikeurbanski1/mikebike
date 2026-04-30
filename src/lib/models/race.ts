export const ShelterAmount = {
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low',
    PARTIAL: 'Partial',
    EXPOSED: 'Exposed',
};
export type ShelterAmount = (typeof ShelterAmount)[keyof typeof ShelterAmount];
