import React, { useEffect, useState } from "react";
import "../App.css";

const Orders = ({ userId, onBack,onViewOrder  }) => {
  const API = "http://localhost:8080";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API}/orders/user/${userId}`);

      if (!response.ok) {
        throw new Error("Unable to fetch orders");
      }

      const data = await response.json();

  console.log("ORDERS DATA:", data);


      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Orders fetch error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders-page">

      <div className="orders-header">

        <button
          type="button"
          className="back-orders-button"
          onClick={onBack}
        >
          ← Back to Home
        </button>

        <h1>My Orders</h1>

      </div>

      <div className="orders-container">

        {loading ? (

          <div className="orders-message">
            Loading orders...
          </div>

        ) : orders.length === 0 ? (

          <div className="orders-message">
            <h2>No Orders Yet</h2>
            <p>Your placed orders will appear here.</p>
          </div>

        ) : (

          orders.map((order) => (

            <div className="order-card" key={order.id}>

              <div className="order-card-header">

                <div>
                  <h2>Order #{order.id}</h2>

                  <p>
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleString()
                      : "Date not available"}
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

  <button
  type="button"
  className="view-order-button"
  onClick={() => {
    onViewOrder(order);
  }}
>
  View Details
</button>

</div>

</div>
))
        )}
      </div>

    </div>
  );
};

export default Orders;