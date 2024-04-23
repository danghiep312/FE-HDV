const mapItemDtoToItem = (itemDto, _) => {
    return {
        productId: itemDto['productId'],
        image: itemDto['imageUrl'],
        title: itemDto['name'],
        description: itemDto['description'],
        price: itemDto['price']
    }
}

const mapPaymentDtoToPayment = (paymentDto, _) => {
    return {
        _body: paymentDto,
        title: paymentDto['paymentMethod'],
    }
}

const mapShipmentDtoToShipment = (shipmentDto, _) => {
    return {
        _body: shipmentDto,
        title: shipmentDto['shipmentName'],
        cost: shipmentDto['shipmentCost']
    }
}

export const Mappers = {
    mapItemDtoToItem: (itemDto, _) => mapItemDtoToItem(itemDto, _),
    mapPaymentDtoToPayment: (paymentDto, _) => mapPaymentDtoToPayment(paymentDto, _),
    mapShipmentDtoToShipment: (shipmentDto, _) => mapShipmentDtoToShipment(shipmentDto, _)
}