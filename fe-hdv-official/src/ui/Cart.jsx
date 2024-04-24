import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap-utilities.min.css'
import {useEffect, useState} from "react";
import {Mappers} from "../service/mapper";
import {CheckoutService} from "../service/checkoutService";
import {VnAdmin} from "../service/vnAdmin";
import {InvoiceService} from "../service/invoiceService";
import {UserService} from "../service/userService";
import {router} from "../App";
import {CartService} from "../service/cartService";

const Cart = () => {
    const [selectedShipment, setSelectedShipment] = useState({'shipmentCost' : 0})
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [products, setProduct] = useState([])

    useEffect(() => {
        const j = async () => {
            const products = await CartService.getCartProducts();
            setProduct(products.map(Mappers.mapItemDtoToItem));
        };
        j();
    }, [])

    const handleMakeOrderClick = () => {
        const j = async () => {
           const resp = await InvoiceService.createInvoice(
               await UserService.getUser(),
               selectedPayment,
               selectedShipment,
               products['product'],
               100,
           )
            console.log(resp);
            router.navigate("/success")
        }
        j()
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-7">
                    <LeftPane
                        onSelectPayment={setSelectedPayment} onSelectShipment={setSelectedShipment}
                        currentShipment={selectedShipment}
                        currentPayment={selectedPayment}
                    />
                </div>
                <div className="col-lg-5">
                    <RightPane
                        shipmentPrice={selectedShipment['shipmentCost']}
                        onMakeOrderClick={handleMakeOrderClick}
                        products={products}
                    />
                </div>
            </div>
        </div>
    );
}

const LeftPane = ({onSelectShipment, onSelectPayment, currentPayment, currentShipment}) => {
    const [shipments, setShipments] = useState([])
    const [payments, setPayments] = useState([])
    const [cities, setCities] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    useEffect(() => {
        const j1 = async () => {
            const resp = await CheckoutService.getPayments();
            setPayments(resp.map(Mappers.mapPaymentDtoToPayment));
        }
        const j = async () => {
            const resp = await CheckoutService.getShipment();
            setShipments(resp.map(Mappers.mapShipmentDtoToShipment));
        }
        j();
        j1();
    }, [])

    useEffect(() => {
        if (payments.length) {
            onSelectPayment(payments[0]._body)
        }
        if (shipments.length) {
            onSelectShipment(shipments[0]._body)
        }
    }, [payments, shipments]);

    useEffect(() => {
        const j = async () => {
            const cities = await VnAdmin.getCities();
            setCities(cities);
        }
        j()
    }, [])

    const handleCityChange = (cityId) => {
        if (cityId === '0') return
        const j = async () => {
            const provinces = await VnAdmin.getDistricts(cityId);
            setDistricts(provinces)
            setWards([])
        }
        j();
    }

    const handleDistrictChange = (districtId) => {
        if (districtId === '0') return
        const j = async () => {
            const districts = await VnAdmin.getWards(districtId);
            setWards(districts)
        }
        j();
    }

    return (
        <div className="ms-5 mt-3">
            <div id="address-choose">
                <h3>Thông tin giao hàng:</h3>
                <input type="text" className="form-control w-100" placeholder="Địa chỉ"/>
                <input type="text" className="form-control w-100 mt-2" placeholder="Email"/>
                <div className="row" style={{marginTop: '1vh'}}>
                    <div className="col-lg-4">
                        <select className="form-select" onChange={(e) => handleCityChange(e.target.value)}>
                            <option value="0">Chọn tỉnh thành</option>
                            {
                                cities.map((city, _) => (
                                    <option value={city.id}>{city.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="col-lg-4">
                        <select className="form-select" onChange={(e) => handleDistrictChange(e.target.value)}>
                            <option value="0">Chọn quận huyện</option>
                            {
                                districts.map((district, _) => (
                                    <option value={district.id}>{district.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="col-lg-4">
                        <select className="form-select">
                            <option value="0">Chọn phường xã</option>
                            {
                                wards.map((ward, _) => (
                                    <option value={ward.id}>{ward.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div id="shipment" className="mt-3">
                <h3>Shipment Method:</h3>
                {
                    shipments.map((shipment, _) => (
                        <div className="row d-flex align-items-lg-center"
                             style={ {background: shipment._body === currentShipment ? '#f5f5f5' : 'white'} }
                        onClick={() => onSelectShipment(shipment._body)}>
                            <div className="col-lg-1">
                                <input type="radio" name="shipment"
                                       checked={shipment._body === currentShipment}/>
                            </div>
                            <img src="https://hstatic.net/0/0/global/design/seller/image/payment/other.svg?v=6"
                                 alt="smaidw"
                                 style={{height: "100%", width: "auto"}} className="col-lg-3"/>
                            <div className="col-lg-6">{shipment.title}</div>
                            <div className="col-lg-2">{shipment.cost} đ</div>
                        </div>
                    ))
                }
            </div>
            <div id="payment" className="mt-3">
                <h3>Payment Method:</h3>
                {
                    payments.map((payment, _) => (
                        <div className="row d-flex align-items-lg-center"
                             style={ {background: payment._body === currentPayment ? '#f5f5f5' : 'white'} }
                        onClick={() => onSelectPayment(payment._body)}>
                            <div className="col-lg-1">
                                <input type="radio" name="payment"
                                       checked={payment._body === currentPayment}/>
                            </div>

                            <img src="https://hstatic.net/0/0/global/design/seller/image/payment/other.svg?v=6"
                                 alt="smaidw"
                                 style={{height: "100%", width: "auto"}} className="col-lg-3"/>
                            <div className="col-lg-8">{payment.title}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

const RightPane = ({products, shipmentPrice, onMakeOrderClick}) => {
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        setTotalPrice(products.reduce((acc, item) => acc + item.price, 0));
    }, [products]);

    return (
        <div className="row-gap-4 d-flex flex-column" style={{background: '#f8f8f8', height: '100vh', padding: '2vh 10vh 0vh 8vh'}}>
            <div>
                {
                    products.map((item, _) =>
                        <div className="mt-3">
                            <ProductItem item={item}/>
                        </div>
                    )
                }
            </div>
            <div style={{width: '100%', background: 'black', height: '1px'}}></div>
            <div>
                <div className="row">
                    <div className="col-lg-8">Tạm tính</div>
                    <div className="col-lg-4">{totalPrice} đ</div>
                </div>
                <div className="row">
                    <div className="col-lg-8">Phí vận chuyển</div>
                    <div className="col-lg-4">{shipmentPrice} đ</div>
                </div>
            </div>
            <div style={{width: '100%', background: 'black', height: '1px'}}></div>
            <div>
                <div className="row">
                    <div className="col-lg-8">Tổng cộng</div>
                    <div className="col-lg-4"><span>VND</span>{totalPrice + shipmentPrice} đ</div>
                </div>
            </div>
            <div style={{width: '100%', background: 'black', height: '1px'}}></div>
            <div className="btn btn-primary mx-auto" style={{display: 'block'}} onClick={onMakeOrderClick}>Đặt hàng</div>
        </div>
    )
}

const ProductItem = ({item}) => {
    return (
        <div className="row" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="col-lg-2">
                <img alt="bruh" src={item.image} style={{width: '100%', height: 'auto'}}/>
            </div>
            <div className="col-lg-7" style={{display: "flex", flexDirection: "column"}}>
                <div>{item.title}</div>
                <div style={{color: 'gray', fontSize: '0.9rem'}}>{item.description}</div>
            </div>
            <div className="col-lg-3">
                <div>{item.price} đ</div>
                <div>x{item.amount}</div>
            </div>
        </div>
    )
}

export default Cart;