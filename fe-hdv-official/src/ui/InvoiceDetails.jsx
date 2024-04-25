import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { InvoiceService } from "../service/invoiceService";
import axios from "axios";
import { AppConfig } from "../configs/AppConfig";

export const InvoiceDetails = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    // const fetchInvoiceDetails = async () => {
    //         // Gọi API hoặc thực hiện công việc để lấy thông tin hóa đơn dựa trên invoiceId
    //         // Ví dụ:

    //     await axios.get(`http://localhost:8003/invoice/get-invoice?invoiceId=` + invoiceId)
    //         .then
    //     setInvoice(data);
    // };

    // fetchInvoiceDetails();

    fetch("http://localhost:8003/invoice/get-invoice?invoiceId=" + invoiceId)
      .then((response) => response.json())
      .then((data) => {
        setInvoice(data);
        console.log(data);
      });
  }, [invoiceId]);

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Invoice Details</h2>
      <div>
        <h4>Customer:</h4>
        <ul>
          <li>Name: {invoice.customer.name}</li>
          <li>Phone: {invoice.customer.phone}</li>
        </ul>
        <h4>Payment Details:</h4>
        <ul>
          <li>Payment Method: {invoice.payment.paymentMethod}</li>
        </ul>
        <h4>Shipment Details:</h4>
        <ul>
          <li>Shipment Name: {invoice.shipment.shipmentName}</li>
          <li>Shipment Cost: {invoice.shipment.shipmentCost} VND</li>
        </ul>
        <h4>Time: {new Date(invoice.time).toLocaleString()}</h4>

        <h4>Products:</h4>
        <ul>
          {invoice.products.map((product) => {
            const quantity =
              invoice.invoiceProducts.find(
                (item) => item.id.productId === product.productId
              )?.amount || 0;
            return (
              <li key={product.productId}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    <p>
                      <strong>Name:</strong> {product.name}
                    </p>
                    <p>
                      <strong>Price:</strong> {product.price} VND
                    </p>
                    <p>
                      <strong>Quantity:</strong> {quantity}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <h4>Total Amount: {invoice.totalAmount}</h4>
        <h4>Total Price: {invoice.totalPrice} VND</h4>
      </div>
    </div>
  );
};
