import axios from "axios";

const BASE_URL = "http://localhost:8088/api/v1/discovery";
const cache = {};
const DISABLE_FLAG = true;
export const InventoryService = {
    getProducts: async () => {
        if (DISABLE_FLAG) return []
        if (cache['products']) {
            return cache['products']
        }
        const resp = await InventoryService.forceGetProducts();
        cache['products'] = resp;
        return resp
    },

    forceGetProducts: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/all`)
            return response.data
        } catch (e) {
            console.error('Error fetching users: ', e)
            throw e
        }
    }
}