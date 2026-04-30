import type { RaceRider } from '../game/rider';
import type { RiderStamina } from '../models/abilities';
import { maxRiderHighEffortStamina, maxRiderStamina } from './consts';

export const getNewStamina = (
    rider: RaceRider,
    { curStamina, maxStamina, highEffortStamina }: Partial<RiderStamina>
): RiderStamina => {
    const maxStaminaMod = maxStamina ?? 0;
    const highEffortStaminaMod = highEffortStamina ?? 0;
    const curStaminaMod = curStamina ?? 0;
    const newMaxStamina = Math.min(rider.stamina.maxStamina + maxStaminaMod, maxRiderStamina);
    const newHighEffortStamina = Math.max(
        0,
        Math.min(rider.stamina.highEffortStamina + highEffortStaminaMod, maxRiderHighEffortStamina)
    );
    const newCurStamina = Math.max(0, Math.min(rider.stamina.curStamina + curStaminaMod, newMaxStamina));
    return {
        maxStamina: newMaxStamina,
        highEffortStamina: newHighEffortStamina,
        curStamina: newCurStamina,
    };
};
