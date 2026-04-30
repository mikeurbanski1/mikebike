import type { HexTile, SegmentHexTile } from '../map/map';
import type { Route } from '../map/route';
import type { RiderStamina } from '../models/abilities';
import type { CommandOutcome, CommandOutcomeDebug, Effort } from '../models/commands';
import type { RouteHexes } from '../models/map';
import { ShelterAmount } from '../models/race';
import { effortToDistance, effortToStaminaEffect } from '../utils/consts';
import { generateRouteHexes, getDirectionByOffset, getNeighbor, getSegmentEnd } from '../utils/map-utils';

import '../utils/race-utils';

import { getNewStamina } from '../utils/race-utils';
import type { Race } from './race';
import type { RaceRider } from './rider';

export class RaceManager {
    race: Race;
    route: Route;
    routeHexes: RouteHexes;
    allRiders: RaceRider[];
    hexToRiderMap: Map<string, RaceRider> = new Map();
    riderToHexMap: Map<number, SegmentHexTile> = new Map();
    nextTurn = 1;

    constructor(race: Race, route: Route) {
        this.race = race;
        this.route = route;
        this.routeHexes = generateRouteHexes(route);

        this.allRiders = this.race.teams.flatMap((team) => team.raceRiders);
        this.allRiders.forEach((rider) => {
            this.moveRider(rider, this.routeHexes.keyToHexMap.get(rider.location.key)!);
        });
        this.allRiders.forEach(this.calcRiderShelter.bind(this));
    }

    getAllRiders() {
        return this.allRiders;
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

    calcRiderShelter(rider: RaceRider): void {
        const riderHex = rider.location;
        const travelDirection = rider.facing;

        const forwardHex = getNeighbor(riderHex, travelDirection);
        const rightHex = getNeighbor(riderHex, getDirectionByOffset(travelDirection, 1));
        const leftHex = getNeighbor(riderHex, getDirectionByOffset(travelDirection, -1));

        const forward2Hex = getNeighbor(forwardHex, travelDirection);
        const right2Hex = getNeighbor(rightHex, travelDirection);
        const left2Hex = getNeighbor(leftHex, travelDirection);

        const adjacentHexes = [forwardHex, rightHex, leftHex];
        const adjacent2Hexes = [forward2Hex, right2Hex, left2Hex];

        const adjacentRiderCount = adjacentHexes.reduce((count, hex) => count + (this.getRiderAtHex(hex) ? 1 : 0), 0);
        const adjacent2RiderCount = adjacent2Hexes.reduce((count, hex) => count + (this.getRiderAtHex(hex) ? 1 : 0), 0);

        let shelter: ShelterAmount;

        if (adjacentRiderCount === 3 && adjacent2RiderCount >= 2) {
            shelter = ShelterAmount.HIGH;
        } else if (adjacentRiderCount >= 2 || adjacent2RiderCount >= 3) {
            shelter = ShelterAmount.MEDIUM;
        } else if (this.getRiderAtHex(forwardHex)) {
            shelter = ShelterAmount.LOW;
        } else if (adjacent2RiderCount >= 2 || adjacentRiderCount >= 1) {
            shelter = ShelterAmount.PARTIAL;
        } else {
            shelter = ShelterAmount.EXPOSED;
        }

        rider.curShelter = shelter;
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

        riders.forEach(this.simRider.bind(this));
        this.allRiders.forEach(this.calcRiderShelter.bind(this));
        this.allRiders.forEach((rider) => this.setRiderEffort(rider, rider.nextCommand!.effort));
        this.nextTurn++;
    }

    setRiderEffort(rider: RaceRider, effort: Effort) {
        rider.nextCommand = { effort, outcome: this.getOutcomeForEffort(rider, effort) };
    }

    getOutcomeForEffort(rider: RaceRider, effort: Effort): CommandOutcome {
        let distance = effortToDistance[effort]; // TODO: convert effort to actual distance based on rider and terrain stats

        const staminaUpdate: RiderStamina = Object.assign({}, effortToStaminaEffect[effort]);

        const debug: CommandOutcomeDebug = {
            baseDistance: distance,
            baseStaminaUpdate: staminaUpdate.curStamina,
            baseHighEffortUpdate: staminaUpdate.highEffortStamina,
            baseMaxStaminaUpdate: staminaUpdate.maxStamina,
            shelterStaminaEffect: 0,
            shelterHighEffortEffect: 0,
            maxStaminaPenaltyFromLowStamina: 0,
            highEffortPenaltyFromLowStamina: 0,
            distancePenaltyFromLowStamina: 0,
            staminaPenaltyFromLowHighEffort: 0,
            maxStaminaPenaltyFromLowHighEffort: 0,
            distancePenaltyFromLowHighEffort: 0,
        };

        this.calcRiderShelter(rider);
        if (rider.curShelter === ShelterAmount.HIGH) {
            staminaUpdate.curStamina += 2;
            staminaUpdate.highEffortStamina += 1;
            debug.shelterStaminaEffect = 2;
            debug.shelterHighEffortEffect = 1;
        } else if (rider.curShelter === ShelterAmount.MEDIUM) {
            staminaUpdate.curStamina += 1;
            debug.shelterStaminaEffect = 1;
        } else if (rider.curShelter === ShelterAmount.PARTIAL) {
            staminaUpdate.curStamina -= 1;
            debug.shelterStaminaEffect = -1;
        } else if (rider.curShelter === ShelterAmount.EXPOSED) {
            staminaUpdate.curStamina -= 2;
            debug.shelterStaminaEffect = -2;
        }

        if (staminaUpdate.curStamina < 0 && rider.stamina.curStamina === 0) {
            // if you are out of stamina and still using it, the cost is very high
            distance -= 2;
            staminaUpdate.highEffortStamina -= 1;
            staminaUpdate.maxStamina -= 0.5;

            debug.distancePenaltyFromLowStamina = -2;
            debug.highEffortPenaltyFromLowStamina = -1;
            debug.maxStaminaPenaltyFromLowStamina = -0.5;
        } else if (staminaUpdate.curStamina < 0 && rider.stamina.curStamina + staminaUpdate.curStamina <= 0) {
            // if your move would put you into 0 stamina, the cost is high, but not as high
            distance--;
            staminaUpdate.highEffortStamina -= 1;

            debug.distancePenaltyFromLowStamina = -1;
            debug.highEffortPenaltyFromLowStamina = -1;

            // but worse if it would bring you negative
            if (rider.stamina.curStamina + staminaUpdate.curStamina < 0) {
                staminaUpdate.maxStamina -= 0.25;

                debug.maxStaminaPenaltyFromLowStamina = -0.25;
            }
        }

        if (staminaUpdate.highEffortStamina < 0 && rider.stamina.highEffortStamina === 0) {
            // if you are out of high effort stamina and still using it, the cost is high
            distance -= 1;
            staminaUpdate.curStamina -= 2;
            staminaUpdate.maxStamina -= 0.5;

            debug.distancePenaltyFromLowHighEffort = -1;
            debug.staminaPenaltyFromLowHighEffort = -2;
            debug.maxStaminaPenaltyFromLowHighEffort = -0.5;
        } else if (
            staminaUpdate.highEffortStamina < 0 &&
            rider.stamina.highEffortStamina + staminaUpdate.highEffortStamina <= 0
        ) {
            // if your move would put you into 0 high effort stamina, the cost is high, but not as high
            distance -= 1;
            staminaUpdate.curStamina -= 1;

            debug.distancePenaltyFromLowHighEffort = -1;
            debug.staminaPenaltyFromLowHighEffort = -1;

            // but worse if it would bring you negative
            if (rider.stamina.highEffortStamina + staminaUpdate.highEffortStamina < 0) {
                staminaUpdate.maxStamina -= 0.25;

                debug.maxStaminaPenaltyFromLowHighEffort = -0.25;
            }
        }

        const newStamina = getNewStamina(rider, staminaUpdate);

        return { newStamina, distance, debug };
    }

    simRider(rider: RaceRider) {
        const command = rider.nextCommand!;
        const currentHex = this.getHexForRider(rider)!;
        const { newStamina, distance } = this.getOutcomeForEffort(rider, command.effort);

        const newHexTile = getSegmentEnd(currentHex, rider.facing, distance);

        const newHex = this.routeHexes.keyToHexMap.get(newHexTile.key);
        if (!newHex) {
            throw new Error(
                `Rider ${rider.bibNumber} attempted to move out of bounds to q:${newHexTile.q}, r:${newHexTile.r}, s:${newHexTile.s}`
            );
        }
        this.moveRider(rider, newHex);
        rider.stamina = newStamina;
    }
}
