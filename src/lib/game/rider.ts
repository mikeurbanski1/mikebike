import type { Direction, HexTile, RiderHexPosition } from '../models/map';
import type { Team } from './team';

export class Rider {
    riderNumber: number;
    team: Team;
    bibNumber: number;
    location: HexTile;
    hexPosition: RiderHexPosition;
    facing: Direction;

    constructor(riderNumber: number, team: Team, location: HexTile, hexPosition: RiderHexPosition, facing: Direction) {
        this.riderNumber = riderNumber;
        this.team = team;
        this.bibNumber = parseInt(`${team.teamNumber}${riderNumber}`);
        this.location = location;
        this.hexPosition = hexPosition;
        this.facing = facing;
    }
}
