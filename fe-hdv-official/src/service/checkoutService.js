import axios from "axios";

const BASE_URL = "http://localhost:8090/api/v1";
const cache = {};
export const CheckoutService = {
    getPayments: async () => {
        if (cache['payments']) {
            return cache['payments']
        }
        const resp = await CheckoutService.forceGetPayments();
        cache['payments'] = resp;
        return resp
    },
    forceGetPayments: async () => {
        try {
            const resp = await axios.get(`${BASE_URL}/payment/all`)
            return resp.data
        } catch (e) {
            console.error('Error fetching payments: ', e)
            throw e
        }
    },
    getShipment: async () => {
        if (cache['shipment']) {
            return cache['shipment']
        }
        const resp = await CheckoutService.forceGetShipment();
        cache['shipment'] = resp;
        return resp
    },
    forceGetShipment: async () => {
        try {
            const resp = await axios.get(`${BASE_URL}/shipment/all`)
            return resp.data
        } catch (e) {
            console.error('Error fetching shipment: ', e)
            throw e
        }
    },
}