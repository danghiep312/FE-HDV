import 'bootstrap/dist/css/bootstrap.min.css'
import {useState} from "react";

const Cart = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-8">
                    <LeftPane/>
                </div>
                <div className="col-lg-4">
                    <RightPane/>
                </div>
            </div>
        </div>
    );
}

const LeftPane = () => {
    return (
        <div>
            <div id="address-choose">
                <h3>Địa chỉ giao hàng:</h3>
                <input type="text" placeholder="Địa chỉ" style={{width: "100%"}}/>
                <div className="row" style={{marginTop: '1vh'}}>
                    <div className="col-lg-4">
                        <select className="form-select">
                            <option value="0">Chọn tỉnh thành</option>
                            <option value="1">A</option>
                            <option value="2">B</option>
                            <option value="3">C</option>
                        </select>
                    </div>
                    <div className="col-lg-4">
                        <select className="form-select">
                            <option value="0">Chọn quận huyện</option>
                            <option value="1">A</option>
                            <option value="2">B</option>
                            <option value="3">C</option>
                        </select>
                    </div>
                    <div className="col-lg-4">
                        <select className="form-select">
                            <option value="0">Chọn phường xã</option>
                            <option value="1">A</option>
                            <option value="2">B</option>
                            <option value="3">C</option>
                        </select>
                    </div>
                </div>
            </div>
            <div id="shipment">
                <h3>Shipment Method:</h3>
                <div className="row">
                    <input type="radio" className="col-lg-1" value="express" name="shipment"/>
                    <img src="https://hstatic.net/0/0/global/design/seller/image/payment/other.svg?v=6" alt="smaidw"
                         style={{height: "100%", width: "auto"}} className="col-lg-3"/>
                    <p className="col-lg-6">Giao hàng tận nơi</p>
                    <p className="col-lg-2">10000đ</p>
                </div>
            </div>
            <div id="payment" style={{height: "2vh"}}>
                <h3>Payment Method:</h3>
                <div className="row">
                    <input type="radio" className="col-lg-1" value="bank" name="payment"/>
                    <img src="https://hstatic.net/0/0/global/design/seller/image/payment/other.svg?v=6" alt="smaidw"
                         style={{height: "100%", width: "auto"}} className="col-lg-3"/>
                    <p className="col-lg-8">Transfer through bank account</p>
                </div>
                <div className="row">
                    <input type="radio" className="col-lg-1" value="cod" name="payment"/>
                    <img src="https://hstatic.net/0/0/global/design/seller/image/payment/cod.svg?v=6/image/payment/other.svg?v=6" alt="smaidw"
                         style={{height: "100%", width: "auto"}} className="col-lg-3"/>
                    <p className="col-lg-8">Cash On Delivery</p>
                </div>
            </div>
        </div>
    )
}

const RightPane = () => {
    const fakeImg = "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1nqjtY.img?w=768&h=402&m=6&x=120&y=120&s=280&d=280"
    const item = {
        image: fakeImg,
        title: "Đồ nội địa Nhật",
        description: "Mô tả sản phẩm",
        price: "100000đ"
    }
    const [products, setProduct] = useState(Array.from({length: 5}, () => item))
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
                    <div className="col-lg-4">100000đ</div>
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
            <a className="btn btn-primary">Đặt hàng</a>
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
                <div>{item.price}</div>
            </div>
        </div>
    )
}

export default Cart;