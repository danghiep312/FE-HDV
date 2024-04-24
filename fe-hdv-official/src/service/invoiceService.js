import axios from "axios";
import {AppConfig} from "../configs/AppConfig";

const BASE_URL = AppConfig.INVOICE_SERVICE_URL;
const cache = {};

export const InvoiceService = {
    createInvoice: async (customer, payment, shipment, products, totalPrice, address) => {
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
        try {
            const response = await axios.post(`${BASE_URL}/checkout/checkout`, invoiceDto)
            return response.data
        } catch (e) {
            console.error('Error creating invoice: ', e)
            throw e
        }
    }
}