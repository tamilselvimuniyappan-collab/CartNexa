import React, { useEffect, useState } from "react";
import "../App.css";

const MyOrders = ({ userId, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/orders/user/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        return response.json();
      })
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => {
        console.error("Orders fetch error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="orders-page">

      <div className="orders-header">

        <button
          type="button"
          className="back-cart-button"
          onClick={onBack}
        >
          ← Back to Home
        </button>

        <h1>My Orders</h1>

        

      </div>


      <div className="orders-container">

        {loading ? (
          <h2>Loading orders...</h2>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <h2>No Orders Yet</h2>
            <p>Your placed orders will appear here.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              className="order-card"
              key={order.id}
            >

              <div className="order-card-header">

                <div>
                  <h2>
                    Order #{order.id}
                  </h2>

                  <p>
                    Date:{" "}
                    {order.orderDate
                      ? new Date(
                          order.orderDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <span className="order-status">
                  {order.status}
                </span>

              </div>


              <div className="order-card-details">

                <div>
                  <span>Total Amount</span>

                  <strong>
                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toFixed(2)}
                  </strong>
                </div>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default MyOrders;