import { Race } from '../game/race';
import { RaceRider, Rider } from '../game/rider';
import { RaceTeam, Team } from '../game/team';
import { HexTile } from '../map/map';
import { Direction } from '../models/map';

export const generateRace = (): Race => {
    const race = new Race();

    const team1 = new Team('Team 1');
    const r1 = new Rider('Team1R1', team1, { ability: 8 });
    team1.addRider(r1);

    const raceTeam1 = new RaceTeam(team1.name, 1);
    raceTeam1.addRaceRider(new RaceRider(r1, raceTeam1, 1, new HexTile(0, 0, 0), Direction.S));
    // const team2 = new Team('Team 2', 2);

    // let q = 0;
    // let r = 2;
    // let s = -2;

    race.addTeam(raceTeam1);
    // team1.addRider(new Rider('Team2R1', 2, team2, { q: 0, r: 0, s: 0 }, Direction.S));
    // race.addTeam(team2);

    // for (let i = 0; i < 6; i++) {
    //     team1.addRider(
    //         new Rider(i + 1, team1, { q: 0, r: i, s: -i }, RiderHexPosition.LEFT, getDirectionByOffset(Direction.N, i))
    //     );
    //     team2.addRider(
    //         new Rider(i + 1, team2, { q: 0, r: i, s: -i }, RiderHexPosition.RIGHT, getDirectionByOffset(Direction.N, i))
    //     );
    // }

    return race;
};
