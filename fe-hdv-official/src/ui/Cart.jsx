import 'bootstrap/dist/css/bootstrap.min.css'
import {useEffect, useState} from "react";
import {InventoryService} from "../service/inventoryService";
import {Mappers} from "../service/mapper";
import {CheckoutService} from "../service/checkoutService";
import {VnAdmin} from "../service/vnAdmin";
import {InvoiceService} from "../service/invoiceService";

const Cart = () => {
    const [selectedShipment, setSelectedShipment] = useState(null)
    const [selectedPayment, setSelectedPayment] = useState(null)

    const handleMakeOrderClick = () => {
        const j = async () => {
           const resp = await InvoiceService.createInvoice(
               undefined,
               selectedPayment,
               selectedShipment,
               undefined,
               undefined,
           )
            // router.navigate("/success")
        }
        j()
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-8">
                    <LeftPane
                        onSelectPayment={setSelectedPayment} onSelectShipment={setSelectedShipment}
                    />
                </div>
                <div className="col-lg-4">
                    <RightPane
                        onMakeOrderClick={handleMakeOrderClick}
                    />
                </div>
            </div>
        </div>
    );
}

const LeftPane = ({onSelectShipment, onSelectPayment}) => {
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
        const j = async () => {
            const cities = await VnAdmin.getCities();
            setCities(cities);
        }
        j()
    }, [])

    const handleCityChange = (cityId) => {
        const j = async () => {
            const provinces = await VnAdmin.getDistricts(cityId);
            setDistricts(provinces)
            setWards([])
        }
        j();
    }

    const handleDistrictChange = (districtId) => {
        const j = async () => {
            const districts = await VnAdmin.getWards(districtId);
            setWards(districts)
        }
        j();
    }

    return (
        <div>
            <div id="address-choose">
                <h3>Địa chỉ giao hàng:</h3>
                <input type="text" placeholder="Địa chỉ" style={{width: "100%"}}/>
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
            <div id="shipment">
                <h3>Shipment Method:</h3>
                {
                    shipments.map((shipment, _) => (
                        <div className="row">
                            <input type="radio" className="col-lg-1" name="shipment"
                                   onChange={(e) => onSelectShipment(shipment._body)}/>
                            <img src="https://hstatic.net/0/0/global/design/seller/image/payment/other.svg?v=6"
                                 alt="smaidw"
                                 style={{height: "100%", width: "auto"}} className="col-lg-3"/>
                            <p className="col-lg-6">{shipment.title}</p>
                            <p className="col-lg-2">{shipment.cost} đ</p>
                        </div>
                    ))
                }
            </div>
            <div id="payment" style={{height: "2vh"}}>
                <h3>Payment Method:</h3>
                {
                    payments.map((payment, _) => (
                        <div className="row">
                            <input type="radio" className="col-lg-1" name="payment"
                                onChange={(e) => onSelectPayment(payment._body)}/>
                            <img src="https://hstatic.net/0/0/global/design/seller/image/payment/other.svg?v=6"
                                 alt="smaidw"
                                 style={{height: "100%", width: "auto"}} className="col-lg-3"/>
                            <p className="col-lg-8">{payment.title}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

const RightPane = ({onMakeOrderClick}) => {
    const [products, setProduct] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        setTotalPrice(products.reduce((acc, item) => acc + item.price, 0));
    }, [products])

    useEffect(() => {
        const j = async () => {
            const products = await InventoryService.getProducts();
            setProduct(products.slice(0, 5).map(Mappers.mapItemDtoToItem));
        };
        j();
    }, []);

    return (
        <div>
            <div>
                {
                    products.map((item, _) =>
                        <ProductItem item={item}/>
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
                    <div className="col-lg-4">---</div>
                </div>
            </div>
            <div style={{width: '100%', background: 'black', height: '1px'}}></div>
            <div>
                <div className="row">
                    <div className="col-lg-8">Tổng cộng</div>
                    <div className="col-lg-4"><span>VND</span>1,374,000đ</div>
                </div>
            </div>
            <div style={{width: '100%', background: 'black', height: '1px'}}></div>
            <div className="btn btn-primary" onClick={onMakeOrderClick}>Đặt hàng</div>
        </div>
    )
}

const ProductItem = ({item}) => {
    return (
        <div className="row">
            <div className="col-lg-3">
                <img alt="bruh" src={item.image} style={{width: '100%', height: 'auto'}}/>
            </div>
            <div className="col-lg-6" style={{display: "flex", flexDirection: "column"}}>
                <div>{item.title}</div>
                <div>{item.description}</div>
            </div>
            <div className="col-lg-3">
                <div>{item.price} đ</div>
            </div>
        </div>
    )
}

export default Cart;