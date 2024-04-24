import axios from "axios";
import {AppConfig} from "../configs/AppConfig";

const cache = {};

export const CheckoutService = {
    getPayments: async () => {
        if (AppConfig.DISABLE_SERVICES) return []
        if (cache['payments']) {
            return cache['payments']
        }
        const resp = await CheckoutService.forceGetPayments();
        cache['payments'] = resp;
        return resp
    },
    forceGetPayments: async () => {
        try {
            const resp = await axios.get(`${AppConfig.PAYMENT_SERVICE_URL}/payment/all`)
            return resp.data
        } catch (e) {
            console.error('Error fetching payments: ', e)
            throw e
        }
    },
    getShipment: async () => {
        if (AppConfig.DISABLE_SERVICES) return []
        if (cache['shipment']) {
            return cache['shipment']
        }
        const resp = await CheckoutService.forceGetShipment();
        cache['shipment'] = resp;
        return resp
    },
    forceGetShipment: async () => {
        try {
            const resp = await axios.get(`${AppConfig.SHIPMENT_SERVICE_URL}/shipment/all`)
            return resp.data
        } catch (e) {
            console.error('Error fetching shipment: ', e)
            throw e
        }
    },
}