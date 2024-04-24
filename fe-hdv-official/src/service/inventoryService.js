import axios from "axios";
import {AppConfig} from "../configs/AppConfig";

const BASE_URL = AppConfig.INVENTORY_SERVICE_URL;
const cache = {};
const InventoryService = {
    getProducts: async () => {
        if (AppConfig.DISABLE_SERVICES) return []
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