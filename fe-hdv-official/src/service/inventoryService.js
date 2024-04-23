import axios from "axios";

const BASE_URL = "http://localhost:8088/api/v1/discovery";
const cache = {};
export const InventoryService = {
    getProducts: async () => {
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

    createInvoice: async (customer, payment, shipment, products, totalPrice) => {
        const invoiceProducts = products.map((item, _) => {
            return {
                amount: item.amount,
                id: {
                    invoiceId: undefined,
                    productId: item.productId
                }
            }
        })
        const invoiceDto = {
            invoiceId: undefined,
            customer: customer,
            payment: payment,
            shipment: shipment,
            products: [],
            invoiceProducts: invoiceProducts,
            totalPrice: totalPrice,
            time: new Date().toISOString()
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