import type { SegmentHexTile } from '../map/map';
import type { Route } from '../map/route';
import type { RouteHexes } from '../models/map';
import { generateRouteHexes } from '../utils/map-utils';
import type { Race } from './race';
import type { RaceRider } from './rider';

export class RaceManager {
    race: Race;
    route: Route;
    routeHexes: RouteHexes;
    hexToRiderMap: Map<string, RaceRider> = new Map();
    riderToHexMap: Map<number, SegmentHexTile> = new Map();

    constructor(race: Race, route: Route) {
        this.race = race;
        this.route = route;
        this.routeHexes = generateRouteHexes(route);

        this.getAllRiders().forEach((rider) => {
            this.moveRider(rider, this.routeHexes.keyToHexMap.get(rider.location.key)!);
        });
    }

    getAllRiders() {
        return this.race.teams.flatMap((team) => team.raceRiders);
    }

    getAllTeams() {
        return this.race.teams;
    }

    getRiderAtHex(hex: SegmentHexTile): RaceRider | undefined {
        return this.hexToRiderMap.get(hex.key);
    }

    getHexForRider(rider: RaceRider): SegmentHexTile | undefined {
        return this.riderToHexMap.get(rider.id);
    }

    moveRider(rider: RaceRider, newHex: SegmentHexTile) {
        if (newHex.rider && newHex.rider.bibNumber !== rider.bibNumber) {
            throw new Error(
                `Hex at q:${newHex.q}, r:${newHex.r}, s:${newHex.s} is already occupied by rider ${newHex.rider.bibNumber}`
            );
        }
        const oldHex = this.getHexForRider(rider);
        const added = newHex.addRider(rider);
        if (added) {
            if (oldHex) {
                this.hexToRiderMap.delete(oldHex.key);
                oldHex.removeRider();
            }
            this.hexToRiderMap.set(newHex.key, rider);
            this.riderToHexMap.set(rider.id, newHex);
        }
    }
}
