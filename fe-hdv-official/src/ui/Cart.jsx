import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap-utilities.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import {useEffect, useRef, useState} from "react";
import {Mappers} from "../service/mapper";
import {CheckoutService} from "../service/checkoutService";
import {VnAdmin} from "../service/vnAdmin";
import {UserService} from "../service/userService";
import {router} from "../App";
import {CartService} from "../service/cartService";
import {Toast} from "react-bootstrap";
import {ToastStyle} from "../configs/Style";
import {wait} from "@testing-library/user-event/dist/utils";

const Cart = () => {
    const [selectedShipment, setSelectedShipment] = useState({'shipmentCost': 0})
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [products, setProduct] = useState([])
    const address = useRef('')
    const [showToast, setShowToast] = useState(false);
    const [toastTitle, setToastTitle] = useState("");
    const [toastBody, setToastBody] = useState("");
    const [toastIsSuccess, setToastIsSuccess] = useState(false);

    useEffect(() => {
        const j = async () => {
            const products = await CartService.getCartProducts();
            setProduct(products.map(Mappers.mapItemDtoToItem));
        };
        j();
    }, [])

    const handleMakeOrderClick = () => {
        const j = async () => {
            try {
                const invoice = await CheckoutService.checkout(
                    await UserService.getUser(),
                    selectedPayment,
                    selectedShipment,
                    products,
                    100,
                    address.current
                )
                toast('Success', `Invoice created`, true)
                await wait(1500)
                router.navigate(`/success?invoiceId=${invoice['invoiceId']}`)
            } catch (e) {
                const upToDateProducts = e.response.data;
                toast(`Lỗi: Mặt hàng hiện không đủ số lượng`, 'Chuẩn bị cập nhật...')
                await wait(1500)
                updateCartProductAmount(upToDateProducts)
                toast(`Lỗi: Mặt hàng hiện không đủ số lượng`, 'Cập nhật xong!')
            }
        }
        j()
    }

    const updateCartProductAmount = (newProducts) => {
        newProducts.forEach((newProduct) => {
            const product = products.find((product) => product.productId === newProduct.productId);
            if (product) {
                product.amount = newProduct.amount;
            }
        })
        setProduct([...products])
    }

    function toast(title, body, isSuccess=false)  {
        // Set the title and body of the toast message
        setToastTitle(title);
        setToastBody(body);
        setToastIsSuccess(isSuccess)

        // Show the toast
        setShowToast(true);
    }

    return (
        <div className="container-fluid">
            <div style={ToastStyle}>
                <Toast onClose={() => setShowToast(false)} show={showToast}
                       delay={5000} autohide
                       bg={toastIsSuccess ? 'success' : 'danger'}
                >
                    <Toast.Header>
                        <strong className="me-auto">{toastTitle}</strong>
                    </Toast.Header>
                    <Toast.Body className='text-white'>{toastBody}</Toast.Body>
                </Toast>
            </div>
            <div className="row">
                <div className="col-lg-7">
                    <LeftPane
                        onSelectPayment={setSelectedPayment} onSelectShipment={setSelectedShipment}
                        currentShipment={selectedShipment}
                        currentPayment={selectedPayment}
                        onAddressChange={(addr) => address.current = addr}
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

const LeftPane = ({onSelectShipment, onSelectPayment, currentPayment, currentShipment, onAddressChange}) => {
    const [shipments, setShipments] = useState([])
    const [payments, setPayments] = useState([])
    const [cities, setCities] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [finalAddress, setFinalAddress] = useState([])

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

    useEffect(() => {
        const value = `${finalAddress[2]}, ${finalAddress[1]}, ${finalAddress[0]}`;
        onAddressChange(value)
    }, [finalAddress])

    const handleCityChange = (cityId) => {
        if (cityId === '0') return
        const j = async () => {
            const districts = await VnAdmin.getDistricts(cityId);
            finalAddress[0] = cities.filter(city => city.id === cityId)[0].name
            setFinalAddress([...finalAddress])
            setDistricts(districts)
            setWards([])
        }
        j();
    }

    const handleDistrictChange = (districtId) => {
        if (districtId === '0') return
        const j = async () => {
            const wards = await VnAdmin.getWards(districtId);
            finalAddress[1] = districts.filter(district => district.id === districtId)[0].name
            setFinalAddress([...finalAddress])
            setWards(wards)
        }
        j();
    }

    const handleWardChange = (wardId) => {
        if (wardId === '0') return
        const j = async () => {
            finalAddress[2] = wards.filter(ward => ward.id === wardId)[0].name
            setFinalAddress([...finalAddress])
        }
        j();
    }

    return (
        <div className="ms-5 mt-3">
            <div id="address-choose">
                <h3>Thông tin giao hàng:</h3>
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
                        <select className="form-select" onChange={(e) => handleWardChange(e.target.value)}>
                            <option value="0">Chọn phường xã</option>
                            {
                                wards.map((ward, _) => (
                                    <option value={ward.id}>{ward.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <input type="text" className="form-control w-100 mt-2" placeholder="Địa chỉ"/>
            </div>
            <div id="shipment" className="mt-3">
                <h3>Shipment Method:</h3>
                {
                    shipments.map((shipment, _) => (
                        <div className="row d-flex align-items-lg-center"
                             style={{background: shipment._body === currentShipment ? '#f5f5f5' : 'white'}}
                             onClick={() => onSelectShipment(shipment._body)}>
                            <div className="col-lg-1">
                                <input type="radio" name="shipment"
                                       checked={shipment._body === currentShipment} readOnly/>
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
                             style={{background: payment._body === currentPayment ? '#f5f5f5' : 'white'}}
                             onClick={() => onSelectPayment(payment._body)}>
                            <div className="col-lg-1">
                                <input type="radio" name="payment"
                                       checked={payment._body === currentPayment} readOnly/>
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
        <div className="row-gap-4 d-flex flex-column"
             style={{background: '#f8f8f8', height: '100vh', padding: '2vh 10vh 0vh 8vh'}}>
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
            <div className="btn btn-primary mx-auto" style={{display: 'block'}} onClick={onMakeOrderClick}>Đặt hàng
            </div>
        </div>
    )
}

const ProductItem = ({item}) => {
    return (
        <div className="row" style={{display: 'flex', alignItems: 'center'}}>
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