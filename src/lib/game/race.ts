import type { RaceTeam } from './team';

export class Race {
    teams: RaceTeam[];

    constructor() {
        this.teams = [];
    }

    addTeam(team: RaceTeam): void {
        this.teams.push(team);
    }
}
