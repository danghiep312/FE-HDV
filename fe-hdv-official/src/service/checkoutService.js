import axios from "axios";
import {AppConfig} from "../configs/AppConfig";
import {fetchEventSource} from "@microsoft/fetch-event-source";

const cache = {};

export const CheckoutService = {
    checkout: async (customer, payment, shipment, products, totalPrice, address) => {
        const invoiceProducts = products.map((item, _) => {
            return {
                amount: item['amount'],
                id: {
                    invoiceId: undefined,
                    productId: item['productId']
                }
            }
        })
        const invoiceDto = {
            customer: customer,
            invoice: {
                invoiceId: undefined,
                customer: customer,
                payment: payment,
                address: address,
                shipment: shipment,
                invoiceProducts: invoiceProducts,
                products: [],
                totalAmount: products.length,
                totalPrice: totalPrice,
                time: new Date().toISOString()
            }
        }
        const response = await axios.post(`${AppConfig.HOST}/checkout/checkout`, invoiceDto);
        return response.data
    },
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
            const resp = await axios.get(`${AppConfig.HOST}/payment/all`)
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
            const resp = await axios.get(`${AppConfig.HOST}/shipment/all`)
            return resp.data
        } catch (e) {
            console.error('Error fetching shipment: ', e)
            throw e
        }
    },
    streamCheckoutStatus: async (onNewStatus) => {
        console.log('stream checkout status')

        return await fetchEventSource(`http://localhost:8007/checkout-status`, {
            onmessage: (event) => {
                const data = JSON.parse(event.data);
                onNewStatus(data);
            }
        })
    }
}