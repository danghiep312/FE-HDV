import axios from "axios";
import {AppConfig} from "../configs/AppConfig";

const cache = {};

export const InvoiceService = {
    findInvoice: async (invoiceId) => {
        if (cache[`invoice-${invoiceId}`]) {
            return cache[invoiceId]
        }
        try {
            const response = await axios.get(`${AppConfig.HOST}/invoice/get-invoice`, {params: {invoiceId: invoiceId}});
            cache[`invoice-${invoiceId}`] = response.data
            return response.data
        } catch (e) {
            console.error('Error finding invoice: ', e)
            throw e
        }
    }
}