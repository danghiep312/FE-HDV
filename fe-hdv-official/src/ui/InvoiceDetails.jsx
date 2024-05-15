import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppConfig } from "../configs/AppConfig";

export const InvoiceDetails = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    fetch(AppConfig.HOST + "/invoice/get-invoice?invoiceId=" + invoiceId)
      .then((response) => response.json())
      .then((data) => {
        setInvoice(data);
      });
  }, [invoiceId]);

  if (!invoice) {
    return <div>Loading...</div>;
  }

  const formatMoney = (money) => {
    return money.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'});
  }

  return (
    <div className="container mt-4">
      <h2>Invoice Details</h2>
      <div className="row">
        <div className="col-md-6">
          <div>
            <h4>Customer:</h4>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>Name:</strong> {invoice.customer.name}
              </li>
              <li className="list-group-item">
                <strong>Phone:</strong> {invoice.customer.phone}
              </li>
            </ul>
            <h4 className="mt-4">Payment Details:</h4>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>Payment Method:</strong> {invoice.payment.paymentMethod}
              </li>
            </ul>
            <h4 className="mt-4">Shipment Details:</h4>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>Shipment Name:</strong> {invoice.shipment.shipmentName}
              </li>
              <li className="list-group-item">
                <strong>Shipment Cost:</strong> {formatMoney(invoice.shipment.shipmentCost)}
              </li>
            </ul>
            <h4 className="mt-4">Time: {new Date(invoice.time).toLocaleString()}</h4>
          </div>
        </div>
        <div className="col-md-6">
          <h4 className="mt-4">Products:</h4>
          <ul className="list-group">
            {invoice.products.map((product) => {
              const quantity =
                invoice.invoiceProducts.find(
                  (item) => item.id.productId === product.productId
                )?.amount || 0;
              return (
                <li key={product.productId} className="list-group-item">
                  <div className="d-flex align-items-center">
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
                        <strong>Price:</strong> {formatMoney(product.price)}
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
          <div className="mt-4">
            <h4>Total Amount: {invoice.totalAmount}</h4>
            <h4>Total Price: {formatMoney(invoice.totalPrice)} </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
