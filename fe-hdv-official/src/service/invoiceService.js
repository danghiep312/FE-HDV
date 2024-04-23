import axios from "axios";
import {AppConfig} from "../configs/AppConfig";

const BASE_URL = AppConfig.INVOICE_SERVICE_URL;
const cache = {};

export const InvoiceService = {
    createInvoice: async (customer, payment, shipment, products, totalPrice) => {
        const invoiceProducts = products.map((item, _) => {
            return {
                amount: 1,
                id: {
                    invoiceId: undefined,
                    productId: item.productId
                }
            }
        })
        const invoiceDto = {
            customer: customer,
            invoice: {
                invoiceId: undefined,
                customer: customer,
                payment: payment,
                shipment: shipment,
                invoiceProducts: invoiceProducts,
                products: [],
                totalAmount: products.length,
                totalPrice: totalPrice,
                time: new Date().toISOString()
            }
        }
        try {
            const response = await axios.post(`${BASE_URL}/create`, invoiceDto)
            return response.data
        } catch (e) {
            console.error('Error creating invoice: ', e)
            throw e
        }
    }
}