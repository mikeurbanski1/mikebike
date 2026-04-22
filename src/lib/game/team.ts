import type { RaceRider, Rider } from './rider';

export class Team {
    name: string;
    riders: Rider[];

    constructor(name: string) {
        this.name = name;
        this.riders = [];
    }

    addRider(rider: Rider): void {
        this.riders.push(rider);
    }
}

export class RaceTeam extends Team {
    teamNumber: number;
    raceRiders: RaceRider[];

    constructor(name: string, teamNumber: number) {
        super(name);
        this.teamNumber = teamNumber;
        this.raceRiders = [];
    }

    addRaceRider(rider: RaceRider): void {
        this.raceRiders.push(rider);
    }
}
