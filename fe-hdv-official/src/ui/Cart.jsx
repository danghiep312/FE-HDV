import { useEffect, useRef, useState } from "react";
import { Mappers } from "../service/mapper";
import { CheckoutService } from "../service/checkoutService";
import { VnAdmin } from "../service/vnAdmin";
import { UserService } from "../service/userService";
import { router } from "../App";
import { CartService } from "../service/cartService";
import {
  Button,
  ListGroup,
  ListGroupItem,
  Modal,
  ProgressBar,
  Spinner,
  Toast,
} from "react-bootstrap";
import { ToastStyle } from "../configs/Style";
import { wait } from "@testing-library/user-event/dist/utils";

const Cart = () => {
  const [selectedShipment, setSelectedShipment] = useState({ shipmentCost: 0 });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [products, setProduct] = useState([]);
  const address = useRef("");
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState("");
  const [toastBody, setToastBody] = useState("");
  const [toastIsSuccess, setToastIsSuccess] = useState(false);
  const [showCheckoutStatusDialog, setShowCheckoutStatusDialog] =
    useState(false);
  const [backendStatus, setBackendStatus] = useState(-1);
  const [progress, setProgress] = useState(0);


  useEffect(() => {
    const fetchProducts = async () => {
      const products = await CartService.getCartProducts();
      setProduct(products.map(Mappers.mapItemDtoToItem));
    };
    fetchProducts();
  }, []);

  const getTotalProductPrice = () => {
    var result = 0;
    products.forEach((product) => {
      result += product.price * product.amount;
    });
    return result;
  }

  const getTotalPrice = () => {
    return getTotalProductPrice() + selectedShipment["shipmentCost"];
  }
  

  const handleMakeOrderClick = () => {
    const displayMakeOrderProgress = async () => {
      setBackendStatus(-1);
      let count = -1;
      try {
        setShowCheckoutStatusDialog(true);
        await CheckoutService.streamCheckoutStatus((newStatus) => {
          console.log("on new status:" + newStatus);
          count++;
          setBackendStatus(count);
          setProgress(((count + 1) * 100) / statuses.length);
        });
      } catch (e) {
        toast("Something went wrong", e, false);
      }
    };
    const checkout = async () => {
      console.log("asdf " + getTotalPrice())
      try {
        
        let invoice;
        const checkoutPromise = CheckoutService.checkout(
          await UserService.getUser(),
          selectedPayment,
          selectedShipment,
          products,
          getTotalPrice(),
          address.current
        ).then((resp) => (invoice = resp));
        await Promise.all([checkoutPromise, displayMakeOrderProgress()]);
        toast("Success", `Invoice created`, true);
        console.log("Success" + invoice)
        await wait(1500);
        // router.navigate(`/order/${invoice["invoiceId"]}`);
      } catch (e) {
        const failCode = e.response.status;
        console.log("Failed  " + failCode)
        if (failCode === 470) {
          const upToDateProducts = e.response.data;
          toast(`Lỗi: Mặt hàng hiện không đủ số lượng`, "Chuẩn bị cập nhật...");
          await wait(1500);
          updateCartProductAmount(upToDateProducts);
          toast(`Lỗi: Mặt hàng hiện không đủ số lượng`, "Cập nhật xong!");
        }
        else if (failCode === 471) {
          toast(`Xác thực phương thức thanh toán thất bại`);
        }
        else if (failCode === 472) {
          toast(`Xác thực phương thức vận chuyển thất bại`);
        }
        else {
          toast("Lỗi: tạo hóa đơn không thành công");
        }
        setShowCheckoutStatusDialog(false);
      }
    };
    checkout();
  };

  const updateCartProductAmount = (newProducts) => {
    newProducts.forEach((newProduct) => {
      const product = products.find(
        (product) => product.productId === newProduct.productId
      );
      if (product) {
        product.amount = newProduct.amount;
      }
    });
    setProduct([...products]);
  };

  function toast(title, body, isSuccess = false) {
    // Set the title and body of the toast message
    setToastTitle(title);
    setToastBody(body);
    setToastIsSuccess(isSuccess);

    // Show the toast
    setShowToast(true);
  }

  const handleClose = () => {
    setShowCheckoutStatusDialog(false);
  };

  const statuses = [
    "Đang bắt đầu",
    "Lấy thông tin khách hàng",
    "Kiểm tra hàng còn tồn",
    "Kiểm tra phương thức thanh toán",
    "Kiểm tra phương thức vận chuyển",
    "Đã tạo hóa đơn xong!",
    "Gửi email thông báo",
  ];

  return (
    <div className="container-fluid">
      <div style={ToastStyle}>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={5000}
          autohide
          bg={toastIsSuccess ? "success" : "danger"}
        >
          <Toast.Header>
            <strong className="me-auto">{toastTitle}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastBody}</Toast.Body>
        </Toast>
      </div>
      <div className="row">
        <div className="col-lg-7">
          <LeftPane
            onSelectPayment={setSelectedPayment}
            onSelectShipment={setSelectedShipment}
            currentShipment={selectedShipment}
            currentPayment={selectedPayment}
            onAddressChange={(addr) => (address.current = addr)}
          />
        </div>
        <div className="col-lg-5">
          <RightPane
            shipmentPrice={selectedShipment["shipmentCost"]}
            onMakeOrderClick={handleMakeOrderClick}
            products={products}
          />
        </div>
      </div>
      <Modal show={showCheckoutStatusDialog} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Task Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {statuses.map((status, index) => (
              <ListGroupItem key={index}>
                {backendStatus < index ? (
                  <Spinner
                    animation="border"
                    role="status"
                    style={{ width: "20px", height: "20px", color: "grey" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  <i
                    className="bi bi-check2"
                    style={{
                      paddingRight: "4px",
                      fontSize: "16px",
                      color: "green",
                    }}
                  ></i>
                )}
                <span style={{ marginLeft: "10px" }}>{status}</span>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>

        <ProgressBar
          striped
          variant="success"
          now={progress}
          key={1}
          label={`${progress.toFixed(0)}%`}
        />
      </Modal>
    </div>
  );
};

const LeftPane = ({
  onSelectShipment,
  onSelectPayment,
  currentPayment,
  currentShipment,
  onAddressChange,
}) => {
  const [shipments, setShipments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [finalAddress, setFinalAddress] = useState([]);

  const [user, setUser] = useState({});

  const formatMoney = (money) => {
    return money.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'});
  }

  useEffect(() => {
    const j1 = async () => {
      const resp = await CheckoutService.getPayments();
      setPayments(resp.map(Mappers.mapPaymentDtoToPayment));
    };
    const j = async () => {
      const resp = await CheckoutService.getShipment();
      setShipments(resp.map(Mappers.mapShipmentDtoToShipment));
    };
    j();
    j1();

    UserService.getUser().then((user) => setUser(user));
  }, []);

  useEffect(() => {
    if (payments.length) {
      onSelectPayment(payments[0]._body);
    }
    if (shipments.length) {
      onSelectShipment(shipments[0]._body);
    }
  }, [payments, shipments]);

  useEffect(() => {
    const j = async () => {
      const cities = await VnAdmin.getCities();
      setCities(cities);
    };
    j();
  }, []);

  useEffect(() => {
    const value = `${finalAddress[2]}, ${finalAddress[1]}, ${finalAddress[0]}`;
    onAddressChange(value);
  }, [finalAddress]);

  const handleCityChange = (cityId) => {
    if (cityId === "0") return;
    const j = async () => {
      const districts = await VnAdmin.getDistricts(cityId);
      finalAddress[0] = cities.filter((city) => city.id === cityId)[0].name;
      setFinalAddress([...finalAddress]);
      setDistricts(districts);
      setWards([]);
    };
    j();
  };

  const handleDistrictChange = (districtId) => {
    if (districtId === "0") return;
    const j = async () => {
      const wards = await VnAdmin.getWards(districtId);
      finalAddress[1] = districts.filter(
        (district) => district.id === districtId
      )[0].name;
      setFinalAddress([...finalAddress]);
      setWards(wards);
    };
    j();
  };

  const handleWardChange = (wardId) => {
    if (wardId === "0") return;
    const j = async () => {
      finalAddress[2] = wards.filter((ward) => ward.id === wardId)[0].name;
      setFinalAddress([...finalAddress]);
    };
    j();
  };

  return (
    <div className="ms-5 mt-3">
      <div class="user-info" style={{marginBottom: '20px'}}>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">User Details</h5>
            <div class="row">
              <div class="col-md-6">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <strong>Customer ID:</strong> {user.customerId} <span id="customerId"></span>
                  </li>
                  <li class="list-group-item">
                    <strong>Phone:</strong> {user.phone} <span id="phone"></span>
                  </li>
                </ul>
              </div>
              <div class="col-md-6">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <strong>Name:</strong> {user.name} <span id="name"></span>
                  </li>

                  <li class="list-group-item">
                    <strong>Email:</strong> {user.email}  <span id="email"></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="address-choose">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Thông tin giao hàng</h5>

            <div className="row" style={{ marginTop: "1vh" }}>
              <div className="col-lg-4">
                <select
                  className="form-select"
                  onChange={(e) => handleCityChange(e.target.value)}
                >
                  <option value="0">Chọn tỉnh thành</option>
                  {cities.map((city, _) => (
                    <option value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg-4">
                <select
                  className="form-select"
                  onChange={(e) => handleDistrictChange(e.target.value)}
                >
                  <option value="0">Chọn quận huyện</option>
                  {districts.map((district, _) => (
                    <option value={district.id}>{district.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg-4">
                <select
                  className="form-select"
                  onChange={(e) => handleWardChange(e.target.value)}
                >
                  <option value="0">Chọn phường xã</option>
                  {wards.map((ward, _) => (
                    <option value={ward.id}>{ward.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg-12">
                <input
                  type="text"
                  className="form-control w-100 mt-2"
                  placeholder="Địa chỉ"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="shipment" className="mt-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Shipment Method:</h5>
            {shipments.map((shipment, _) => (
              <div
                className="row d-flex align-items-lg-center"
                style={{
                  background:
                    shipment._body === currentShipment ? "#f5f5f5" : "white",
                }}
                onClick={() => onSelectShipment(shipment._body)}
              >
                <div className="col-lg-1">
                  <input
                    type="radio"
                    name="shipment"
                    checked={shipment._body === currentShipment}
                    readOnly
                  />
                </div>
                <img
                  src="https://hstatic.net/0/0/global/design/seller/image/payment/other.svg?v=6"
                  alt="smaidw"
                  style={{ height: "100%", width: "auto" }}
                  className="col-lg-3"
                />
                <div className="col-lg-6">{shipment.title}</div>
                <div className="col-lg-2">{formatMoney(shipment.cost)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div id="payment" className="mt-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Payment Method:</h5>
            {payments.map((payment, _) => (
              <div
                className="row d-flex align-items-lg-center"
                style={{
                  background:
                    payment._body === currentPayment ? "#f5f5f5" : "white",
                }}
                onClick={() => onSelectPayment(payment._body)}
              >
                <div className="col-lg-1">
                  <input
                    type="radio"
                    name="payment"
                    checked={payment._body === currentPayment}
                    readOnly
                  />
                </div>

                <img
                  src="https://hstatic.net/0/0/global/design/seller/image/payment/other.svg?v=6"
                  alt="smaidw"
                  style={{ height: "100%", width: "auto" }}
                  className="col-lg-3"
                />
                <div className="col-lg-8">{payment.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RightPane = ({ products, shipmentPrice, onMakeOrderClick }) => {
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setTotalPrice(products.reduce((acc, item) => acc + item.price, 0));
  }, [products]);

  const formatMoney = (money) => {
    return money.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'});
  }

  return (
    <div
      className="row-gap-4 d-flex flex-column"
      style={{
        background: "#f8f8f8",
        height: "100vh",
        padding: "2vh 10vh 0vh 8vh",
      }}
    >
      <div>
        {products.map((item, _) => (
          <div className="mt-3">
            <ProductItem item={item} />
          </div>
        ))}
      </div>
      <div style={{ width: "100%", background: "black", height: "1px" }}></div>
      <div>
        <div className="row">
          <div className="col-lg-8">Tạm tính</div>
          <div className="col-lg-4">{formatMoney(totalPrice)}</div>
        </div>
        <div className="row">
          <div className="col-lg-8">Phí vận chuyển</div>
          <div className="col-lg-4">{formatMoney(shipmentPrice)}</div>
        </div>
      </div>
      <div style={{ width: "100%", background: "black", height: "1px" }}></div>
      <div>
        <div className="row">
          <div className="col-lg-8">Tổng cộng</div>
          <div className="col-lg-4">
            {formatMoney(totalPrice + shipmentPrice)}
          </div>
        </div>
      </div>
      <div style={{ width: "100%", background: "black", height: "1px" }}></div>
      <div
        className="btn btn-primary mx-auto"
        style={{ display: "block" }}
        onClick={onMakeOrderClick}
      >
        Đặt hàng
      </div>
    </div>
  );
};

const ProductItem = ({ item }) => {
  const formatMoney = (money) => {
    return money.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'});
  }
  
  return (
    <div className="row" style={{ display: "flex", alignItems: "center" }}>
      <div className="col-lg-2">
        <img
          alt="bruh"
          src={item.image}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <div
        className="col-lg-7"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div>{item.title}</div>
        <div style={{ color: "gray", fontSize: "0.9rem" }}>
          {item.description}
        </div>
      </div>
      <div className="col-lg-3">
        <div>{formatMoney(item.price)}</div>
        <div>x{item.amount}</div>
      </div>
    </div>
  );
};

export default Cart;
