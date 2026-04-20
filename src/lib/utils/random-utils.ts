import Rand from 'rand-seed';

export const initRandom = (seed?: string): Rand => {
    const seedToUse = seed || new Rand().next().toString();
    console.log(`Random seed: ${seedToUse}`);
    return new Rand(seedToUse);
};
