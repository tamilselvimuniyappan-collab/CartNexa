import React, { useEffect, useState } from "react";
import "../App.css";

const Reports = ({ onBack }) => {

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET PRODUCTS
  useEffect(() => {

    fetch("https://cartnexa-4.onrender.com/products")
      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {

        setProducts(
          Array.isArray(data) ? data : []
        );
      })
      .catch((error) => {

        console.error(
          "Products report error:",
          error
        );

        setProducts([]);
      });

  }, []);


  // GET ORDERS
  useEffect(() => {

    fetch("https://cartnexa-4.onrender.com/orders")
      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        return response.json();
      })
      .then((data) => {

        setOrders(
          Array.isArray(data) ? data : []
        );

        setLoading(false);
      })
      .catch((error) => {

        console.error(
          "Orders report error:",
          error
        );

        setOrders([]);
        setLoading(false);
      });

  }, []);


  // TOTAL SALES
  const totalSales = orders.reduce(
    (total, order) => {

      return (
        total +
        Number(order.totalAmount || 0)
      );

    },
    0
  );


  // AVERAGE ORDER VALUE
  const averageOrderValue =
    orders.length > 0
      ? totalSales / orders.length
      : 0;


  // TOTAL STOCK
  const totalStock = products.reduce(
    (total, product) => {

      return (
        total +
        Number(product.quantity || 0)
      );

    },
    0
  );


  // LOW STOCK
  const lowStockProducts =
    products.filter(
      (product) =>
        Number(product.quantity || 0) < 10
    );


  // EXPIRED PRODUCTS
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const expiredProducts =
    products.filter((product) => {

      if (!product.expiryDate) {
        return false;
      }

      const expiryDate =
        new Date(
          `${product.expiryDate}T00:00:00`
        );

      return expiryDate < today;
    });


  // EXPIRING SOON
  const expiringSoonProducts =
    products.filter((product) => {

      if (!product.expiryDate) {
        return false;
      }

      const expiryDate =
        new Date(
          `${product.expiryDate}T00:00:00`
        );

      const daysUntilExpiry =
        Math.ceil(
          (expiryDate - today) /
          (1000 * 60 * 60 * 24)
        );

      return (
        daysUntilExpiry >= 0 &&
        daysUntilExpiry <= 7
      );
    });


  if (loading) {

    return (
      <div className="reports-page">

        <div className="reports-message">
          Loading reports...
        </div>

      </div>
    );
  }


  return (

    <div className="reports-page">


      {/* HEADER */}

      <div className="reports-header">

        <button
          type="button"
          className="back-orders-button"
          onClick={onBack}
        >
          ← Back to Home
        </button>

        <h1>
          CartNexa Reports
        </h1>

        <p>
          Sales, product, stock and expiry reports
        </p>

      </div>


      {/* SUMMARY CARDS */}

      <div className="reports-summary">

        <div className="report-card">

          <h3>
            Total Sales
          </h3>

          <strong>
            ₹{totalSales.toFixed(2)}
          </strong>

        </div>


        <div className="report-card">

          <h3>
            Total Orders
          </h3>

          <strong>
            {orders.length}
          </strong>

        </div>


        <div className="report-card">

          <h3>
            Average Order
          </h3>

          <strong>
            ₹{averageOrderValue.toFixed(2)}
          </strong>

        </div>


        <div className="report-card">

          <h3>
            Total Products
          </h3>

          <strong>
            {products.length}
          </strong>

        </div>


        <div className="report-card">

          <h3>
            Total Stock
          </h3>

          <strong>
            {totalStock}
          </strong>

        </div>


        <div className="report-card">

          <h3>
            Low Stock
          </h3>

          <strong>
            {lowStockProducts.length}
          </strong>

        </div>

      </div>


      {/* PRODUCT REPORT */}

      <div className="report-section">

        <h2>
          Product Report
        </h2>

        <div className="report-table-wrapper">

          <table className="report-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
              </tr>

            </thead>


            <tbody>

              {products.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="empty-table"
                  >
                    No products available
                  </td>
                </tr>

              ) : (

                products.map((product) => (

                  <tr key={product.id}>

                    <td>
                      {product.id}
                    </td>

                    <td>
                      {product.name}
                    </td>

                    <td>
                      ₹
                      {Number(
                        product.price || 0
                      ).toFixed(2)}
                    </td>

                    <td>
                      {product.quantity}
                    </td>

                    <td>
                      {product.expiryDate ||
                        "Not specified"}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* LOW STOCK REPORT */}

      <div className="report-section">

        <h2>
          ⚠️ Low Stock Products
        </h2>

        {lowStockProducts.length === 0 ? (

          <div className="report-success">
            ✅ No low-stock products
          </div>

        ) : (

          <div className="alert-list">

            {lowStockProducts.map(
              (product) => (

                <div
                  className="alert-item"
                  key={product.id}
                >

                  <span>
                    {product.name}
                  </span>

                  <strong>
                    {product.quantity} items
                  </strong>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* EXPIRY REPORT */}

      <div className="report-section">

        <h2>
          📅 Expiry Report
        </h2>


        <div className="expiry-summary">

          <div className="expiry-box">
            <span>
              Expiring Soon
            </span>

            <strong>
              {expiringSoonProducts.length}
            </strong>
          </div>


          <div className="expiry-box">
            <span>
              Expired
            </span>

            <strong>
              {expiredProducts.length}
            </strong>
          </div>

        </div>


        {expiringSoonProducts.length > 0 && (

          <div className="alert-list">

            <h3>
              Products Expiring Soon
            </h3>

            {expiringSoonProducts.map(
              (product) => (

                <div
                  className="alert-item"
                  key={product.id}
                >

                  <span>
                    {product.name}
                  </span>

                  <strong>
                    {product.expiryDate}
                  </strong>

                </div>

              )
            )}

          </div>

        )}


        {expiredProducts.length > 0 && (

          <div className="alert-list">

            <h3>
              Expired Products
            </h3>

            {expiredProducts.map(
              (product) => (

                <div
                  className="alert-item expired-item"
                  key={product.id}
                >

                  <span>
                    {product.name}
                  </span>

                  <strong>
                    {product.expiryDate}
                  </strong>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* ORDER REPORT */}

      <div className="report-section">

        <h2>
          Order Report
        </h2>

        <div className="report-table-wrapper">

          <table className="report-table">

            <thead>

              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>

            </thead>


            <tbody>

              {orders.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="empty-table"
                  >
                    No orders available
                  </td>

                </tr>

              ) : (

                orders.map((order) => (

                  <tr key={order.id}>

                    <td>
                      #{order.id}
                    </td>

                    <td>
                      {order.orderDate
                        ? new Date(
                            order.orderDate
                          ).toLocaleString()
                        : "N/A"}
                    </td>

                    <td>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toFixed(2)}
                    </td>

                    <td>
                      <span className="report-status">
                        {order.status}
                      </span>
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


    </div>
  );
};

export default Reports;