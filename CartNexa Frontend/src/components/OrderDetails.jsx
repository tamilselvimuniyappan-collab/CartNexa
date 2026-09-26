import React, { useEffect, useState } from "react";
import "../App.css";

import curdImg from "../assets/curd.jpg";
import milkImg from "../assets/milk.jpg";
import soapImg from "../assets/soap.jpg";
import breadImg from "../assets/bread.jpg";
import chipsImg from "../assets/chips.jpg";
import riceImg from "../assets/rice.jpg";

const OrderDetails = ({ order, onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const productImages = {
    curd: curdImg,
    milk: milkImg,
    soap: soapImg,
    bread: breadImg,
    chips: chipsImg,
    rice: riceImg
  };

  useEffect(() => {
    if (!order) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/orders/${order.id}/items`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch order items");
        }

        return response.json();
      })
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Order details error:", error);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [order]);

  if (!order) {
    return (
      <div className="orders-page">
        <div className="orders-message">
          <h2>Order not found</h2>

          <button
            type="button"
            className="back-orders-button"
            onClick={onBack}
          >
            ← Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">

      <div className="orders-header">

        <button
          type="button"
          className="back-orders-button"
          onClick={onBack}
        >
          ← Back to Orders
        </button>

        <h1>Order Details</h1>

      </div>

      <div className="order-details-container">

        <div className="order-details-card">

          <div className="order-details-header">

            <div>
              <h2>Order #{order.id}</h2>

              <p>
                Date:{" "}
                {order.orderDate
                  ? new Date(order.orderDate).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            <span className="order-status">
              {order.status}
            </span>

          </div>

          <div className="order-summary-info">

            <div>
              <span>Total Amount</span>

              <strong>
                ₹{Number(order.totalAmount || 0).toFixed(2)}
              </strong>
            </div>

          </div>

        </div>

        <div className="order-items-card">

          <h2>Ordered Products</h2>

          {loading ? (

            <div className="orders-message">
              Loading products...
            </div>

          ) : items.length === 0 ? (

            <div className="orders-message">
              <p>No products found for this order.</p>
            </div>

          ) : (

            items.map((item) => {

              const imageKey = item.productName
                ? item.productName.toLowerCase().trim()
                : "";

              const productImage = productImages[imageKey];

              return (
                <div
                  className="order-item"
                  key={item.id}
                >

                  <div className="order-item-image">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={item.productName}
                      />
                    ) : (
                      <span>🛒</span>
                    )}
                  </div>

                  <div className="order-item-info">

                    <h3>
                      {item.productName}
                    </h3>

                    <p>
                      Price: ₹
                      {Number(item.price || 0).toFixed(2)}
                    </p>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                  </div>

                  <strong>
                    ₹
                    {(
                      Number(item.price || 0) *
                      Number(item.quantity || 0)
                    ).toFixed(2)}
                  </strong>

                </div>
              );
            })

          )}

        </div>

      </div>

    </div>
  );
};

export default OrderDetails;