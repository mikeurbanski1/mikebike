import type { HexTile } from '../map/map';
import type { RiderAbilities, RiderStamina } from '../models/abilities';
import type { Command } from '../models/commands';
import type { Direction } from '../models/map';
import type { ShelterAmount } from '../models/race';
import { maxRiderHighEffortStamina, maxRiderStamina } from '../utils/consts';
import type { RaceTeam, Team } from './team';

let nextRiderId = 1;

export class Rider {
    id: number;
    name: string;
    team: Team;
    abilities: RiderAbilities;

    constructor(name: string, team: Team, abilities: RiderAbilities) {
        this.id = nextRiderId++;
        this.name = name;
        this.team = team;
        this.abilities = abilities;
    }
}

const startingStamina: RiderStamina = {
    curStamina: maxRiderStamina,
    maxStamina: maxRiderStamina,
    highEffortStamina: maxRiderHighEffortStamina,
};

export class RaceRider extends Rider {
    riderNumber: number;
    bibNumber: number;
    location: HexTile;
    facing: Direction;
    team: RaceTeam;
    stamina: RiderStamina = Object.assign({}, startingStamina);
    nextCommand?: Command;
    curShelter?: ShelterAmount;

    constructor({ name, abilities }: Rider, team: RaceTeam, riderNumber: number, location: HexTile, facing: Direction) {
        super(name, team, abilities);
        this.team = team;
        this.riderNumber = riderNumber;
        this.bibNumber = parseInt(`${team.teamNumber}${riderNumber}`);
        this.location = location;
        this.facing = facing;
    }
}
