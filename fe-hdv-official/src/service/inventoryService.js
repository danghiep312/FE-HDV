import axios from "axios";

const BASE_URL = "http://localhost:8088/api/v1/inventory"

const InventoryService = {
    getProducts: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/all`)
            return response.data
        } catch (e) {
            console.error('Error fetching users: ', e)
            throw e
        }
    },

    searchProduct: async (keyword) => {
        try {
            const response = await axios.get(`${BASE_URL}/search`, { params: { 'keyword': keyword} })
            return response.data
        } catch (e) {
            console.error('Error searching users: ', e)
            throw e
        }
    },

    order: async (invoice) => {
        try {
            const response = await axios.post(`${BASE_URL}/confirm-transaction`, invoice)
            return response.data
        } catch (e) {
            console.error('Error ordering products: ', e)
            throw e
        }
    }
}