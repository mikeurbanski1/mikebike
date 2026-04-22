import type { HexTile } from '../map/map';
import type { Command } from '../models/commands';
import type { Direction } from '../models/map';
import type { RaceTeam, Team } from './team';

let nextRiderId = 1;

export class Rider {
    id: number;
    name: string;
    team: Team;

    constructor(name: string, team: Team) {
        this.id = nextRiderId++;
        this.name = name;
        this.team = team;
    }
}

export class RaceRider extends Rider {
    riderNumber: number;
    bibNumber: number;
    location: HexTile;
    facing: Direction;
    team: RaceTeam;
    nextCommand?: Command;

    constructor(name: string, team: RaceTeam, riderNumber: number, location: HexTile, facing: Direction) {
        super(name, team);
        this.team = team;
        this.riderNumber = riderNumber;
        this.bibNumber = parseInt(`${team.teamNumber}${riderNumber}`);
        this.location = location;
        this.facing = facing;
    }
}
