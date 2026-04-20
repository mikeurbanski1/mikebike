import { Race } from '../game/race';
import { Rider } from '../game/rider';
import { Team } from '../game/team';
import { Direction, RiderHexPosition } from '../models/map';
import { getDirectionByOffset } from '../utils/map-utils';

export const generateRace = (): Race => {
    const race = new Race();
    const team1 = new Team('Team 1', 1);
    const team2 = new Team('Team 2', 2);

    let q = 0;
    let r = 2;
    let s = -2;

    race.addTeam(team1);
    race.addTeam(team2);

    for (let i = 0; i < 6; i++) {
        team1.addRider(
            new Rider(i + 1, team1, { q: 0, r: i, s: -i }, RiderHexPosition.LEFT, getDirectionByOffset(Direction.N, i))
        );
        team2.addRider(
            new Rider(i + 1, team2, { q: 0, r: i, s: -i }, RiderHexPosition.RIGHT, getDirectionByOffset(Direction.N, i))
        );
    }

    return race;
};
