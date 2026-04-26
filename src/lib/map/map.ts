// export interface SegmentHexTile extends HexTile {
//     segmentNumber: number;
//     isCenter: boolean;
//     riders?: Rider[];
// }

export class HexTile {
    key: string;
    q: number;
    r: number;
    s: number;

    constructor(q: number, r: number, s: number) {
        if (q + r + s !== 0) {
            throw new Error(`Invalid hex tile with q:${q}, r:${r}, s:${s} - q + r + s must equal 0`);
        }
        this.q = q;
        this.r = r;
        this.s = s;
        this.key = `${q},${r},${s}`;
    }
}

export class SegmentHexTile extends HexTile {
    segmentNumber: number;
    isCenter: boolean;

    constructor({ q, r, s }: HexTile, segmentNumber: number, isCenter: boolean) {
        super(q, r, s);
        this.segmentNumber = segmentNumber;
        this.isCenter = isCenter;
    }

    // addRider(rider: RaceRider): boolean {
    //     // handle react double render
    //     if (this.rider && this.rider.bibNumber !== rider.bibNumber) {
    //         return false;
    //     }
    //     this.rider = rider;
    //     return true;
    // }

    // removeRider() {
    //     this.rider = undefined;
    // }
}
