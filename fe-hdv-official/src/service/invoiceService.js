import axios from "axios";

const InvoiceService = {
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