import {findById, findLevel1ById, level1s} from "dvhcvn";

export const VnAdmin = {
    getCities: async () => {
        return level1s;
    },
    getDistricts: async (level1Id) => {
        return findLevel1ById(level1Id).children;
    },
    getWards: async (level2Id) => {
        return findById(level2Id).children;
    }
}