import type { Rider } from './rider';

export class Team {
    name: string;
    teamNumber: number;
    riders: Rider[];

    constructor(name: string, teamNumber: number) {
        this.name = name;
        this.teamNumber = teamNumber;
        this.riders = [];
    }

    addRider(rider: Rider): void {
        this.riders.push(rider);
    }
}
