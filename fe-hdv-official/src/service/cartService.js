import axios from "axios";
import {AppConfig} from "../configs/AppConfig";
import {UserService} from "./userService";

const cache = {};

export const CartService = {
    getCart: async () => {
        if (cache['cart']) {
            return cache['cart']
        }
        const resp = await axios.get(`${AppConfig.HOST}/cart/get`,
            { params: {customerId: UserService.getUserId}});

        cache['cart'] = resp.data;
        return resp.data
    },
    getCartProducts: async () => {
        if (cache['cartProducts']) {
            return cache['cartProducts']
        }
        const cart = await CartService.getCart();
        const products = cart['products']
        cache['cartProducts'] = products;
        return products
    }
}