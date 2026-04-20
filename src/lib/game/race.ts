import type { Team } from './team';

export class Race {
    teams: Team[];

    constructor() {
        this.teams = [];
    }

    addTeam(team: Team): void {
        this.teams.push(team);
    }
}
