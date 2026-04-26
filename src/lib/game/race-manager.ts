import type { HexTile, SegmentHexTile } from '../map/map';
import type { Route } from '../map/route';
import { Effort } from '../models/commands';
import type { RouteHexes } from '../models/map';
import { generateRouteHexes, getSegmentEnd } from '../utils/map-utils';
import type { Race } from './race';
import type { RaceRider } from './rider';

export class RaceManager {
    race: Race;
    route: Route;
    routeHexes: RouteHexes;
    hexToRiderMap: Map<string, RaceRider> = new Map();
    riderToHexMap: Map<number, SegmentHexTile> = new Map();
    nextTurn = 1;

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

    getRiderAtHex(hex: HexTile): RaceRider | undefined {
        return this.hexToRiderMap.get(hex.key);
    }

    getHexForRider(rider: RaceRider): SegmentHexTile | undefined {
        return this.riderToHexMap.get(rider.id);
    }

    moveRider(rider: RaceRider, newHex: SegmentHexTile) {
        const currentHex = this.getHexForRider(rider);
        const newHexRider = this.getRiderAtHex(newHex);

        if (newHexRider && newHexRider.id !== rider.id) {
            throw new Error(
                `Hex at q:${newHex.q}, r:${newHex.r}, s:${newHex.s} is already occupied by rider ${newHexRider.bibNumber}`
            );
        }

        this.hexToRiderMap.set(newHex.key, rider);
        this.riderToHexMap.set(rider.id, newHex);
        if (currentHex) {
            this.hexToRiderMap.delete(currentHex.key);
        }
        rider.location = newHex;
    }

    simNextTurn() {
        const riders = this.getAllRiders();
        if (riders.some((rider) => !rider.nextCommand)) {
            throw new Error('Not all riders have a command for the next turn');
        }

        const effortToDistance = (effort: Effort): number => {
            switch (effort) {
                case Effort.RECOVER:
                    return 1;
                case Effort.EASY:
                    return 2;
                case Effort.STEADY:
                    return 3;
                case Effort.HARD:
                    return 4;
                case Effort.ATTACK:
                    return 5;
                case Effort.ALL_OUT:
                    return 5;
                default:
                    throw new Error(`Unknown effort level: ${effort}`);
            }
        };

        riders.forEach((rider) => {
            const command = rider.nextCommand!;
            const currentHex = this.getHexForRider(rider)!;
            const distance = effortToDistance(command.effort); // TODO: convert effort to actual distance based on rider and terrain stats

            const newHexTile = getSegmentEnd(currentHex, rider.facing, distance);

            const newHex = this.routeHexes.keyToHexMap.get(newHexTile.key);
            if (!newHex) {
                throw new Error(
                    `Rider ${rider.bibNumber} attempted to move out of bounds to q:${newHexTile.q}, r:${newHexTile.r}, s:${newHexTile.s}`
                );
            }
            this.moveRider(rider, newHex);
        });

        this.nextTurn++;
    }
}
