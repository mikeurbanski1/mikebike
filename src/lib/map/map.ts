import type { Rider } from '../game/rider';
import type { HexTile } from '../models/map';

// export interface SegmentHexTile extends HexTile {
//     segmentNumber: number;
//     isCenter: boolean;
//     riders?: Rider[];
// }

export class SegmentHexTile implements HexTile {
    q: number;
    r: number;
    s: number;
    segmentNumber: number;
    isCenter: boolean;
    riders?: Rider[];

    constructor({ q, r, s }: HexTile, segmentNumber: number, isCenter: boolean) {
        this.q = q;
        this.r = r;
        this.s = s;
        this.segmentNumber = segmentNumber;
        this.isCenter = isCenter;
    }

    addRider(rider: Rider) {
        if (!this.riders) {
            this.riders = [rider];
        } else if (this.riders.length < 2) {
            if (!this.riders.find((r) => r.bibNumber === rider.bibNumber)) {
                this.riders.push(rider);
            } else {
                console.warn(`Rider ${rider.bibNumber} is already on hex ${this.q},${this.r},${this.s}`);
            }
        } else {
            console.warn(
                `Hex ${this.q},${this.r},${this.s} already has 2 riders ${this.riders.map((r) => r.bibNumber).join(', ')}, cannot add rider ${rider.bibNumber}`
            );
        }
    }
}
