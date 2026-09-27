import React, { useEffect, useState } from "react";
import "../App.css";

const Dashboard = ({
  userId,
  onBack,
  onReportsClick
}) => {

  const [products, setProducts] = useState([]);

  const [orders, setOrders] = useState([]);


  // GET ALL PRODUCTS

  useEffect(() => {

    fetch("https://cartnexa-4.onrender.com/products")

      .then((response) => {

        if (!response.ok) {

          throw new Error(
            "Failed to fetch products"
          );
        }

        return response.json();

      })

      .then((data) => {

        setProducts(
          Array.isArray(data)
            ? data
            : []
        );

      })

      .catch((error) => {

        console.error(
          "Products fetch error:",
          error
        );

        setProducts([]);

      });

  }, []);


  // GET ALL ORDERS

  useEffect(() => {

    fetch("https://cartnexa-4.onrender.com/orders")

      .then((response) => {

        if (!response.ok) {

          throw new Error(
            "Failed to fetch orders"
          );
        }

        return response.json();

      })

      .then((data) => {

        console.log(
          "DASHBOARD ORDERS:",
          data
        );

        setOrders(
          Array.isArray(data)
            ? data
            : []
        );

      })

      .catch((error) => {

        console.error(
          "Orders fetch error:",
          error
        );

        setOrders([]);

      });

  }, []);


  // TOTAL SALES

  const totalSales = orders.reduce(

    (total, order) => {

      return (
        total +
        Number(
          order.totalAmount || 0
        )
      );

    },

    0

  );


  // LOW STOCK

  const lowStockProducts =
    products.filter(

      (product) =>
        Number(
          product.quantity || 0
        ) < 10

    );


  // EXPIRING SOON

  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );


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


  // MAXIMUM SALES

  const maxSales =
    orders.length > 0

      ? Math.max(

          ...orders.map(
            (order) =>
              Number(
                order.totalAmount || 0
              )
          )

        )

      : 0;


  // MAXIMUM STOCK

  const maxQuantity =
    products.length > 0

      ? Math.max(

          ...products.map(
            (product) =>
              Number(
                product.quantity || 0
              )
          )

        )

      : 0;


  return (

    <div className="dashboard-page">


      {/* DASHBOARD HEADER */}

      <div className="dashboard-header">


        <button

          type="button"

          className="back-orders-button"

          onClick={onBack}

        >

          ← Back to Home

        </button>


        <h1>
          CartNexa Dashboard
        </h1>


        <p>
          Product and order overview
        </p>


      </div>



      {/* DASHBOARD CARDS */}

      <div className="dashboard-cards">


        <div className="dashboard-card">

          <h3>
            Total Products
          </h3>

          <strong>
            {products.length}
          </strong>

        </div>


        <div className="dashboard-card">

          <h3>
            Total Orders
          </h3>

          <strong>
            {orders.length}
          </strong>

        </div>


        <div className="dashboard-card">

          <h3>
            Total Sales
          </h3>

          <strong>
            ₹{totalSales.toFixed(2)}
          </strong>

        </div>


        <div className="dashboard-card">

          <h3>
            Low Stock
          </h3>

          <strong>
            {lowStockProducts.length}
          </strong>

        </div>


        <div className="dashboard-card">

          <h3>
            Expiring Soon
          </h3>

          <strong>
            {expiringSoonProducts.length}
          </strong>

        </div>


      </div>



      {/* SALES CHART */}

      <div className="dashboard-chart-card">


        <h2>
          Sales Overview
        </h2>


        {orders.length === 0 ? (

          <div className="chart-empty">

            No sales data available

          </div>

        ) : (

          <div className="sales-chart">


            {orders.map((order) => {


              const amount =
                Number(
                  order.totalAmount || 0
                );


              const barHeight =
                maxSales > 0

                  ? (
                      amount /
                      maxSales
                    ) * 100

                  : 0;


              return (

                <div

                  className="sales-bar-container"

                  key={order.id}

                >


                  <div className="sales-value">

                    ₹{amount}

                  </div>


                  <div className="sales-bar-area">


                    <div

                      className="sales-bar"

                      style={{
                        height:
                          `${barHeight}%`
                      }}

                    >

                    </div>


                  </div>


                  <div className="sales-label">

                    Order #{order.id}

                  </div>


                </div>

              );

            })}


          </div>

        )}


      </div>



      {/* STOCK CHART */}

      <div className="dashboard-chart-card">


        <h2>
          Stock Overview
        </h2>


        {products.length === 0 ? (

          <div className="chart-empty">

            No stock data available

          </div>

        ) : (

          <div className="sales-chart">


            {products.map((product) => {


              const quantity =
                Number(
                  product.quantity || 0
                );


              const barHeight =
                maxQuantity > 0

                  ? (
                      quantity /
                      maxQuantity
                    ) * 100

                  : 0;


              return (

                <div

                  className="sales-bar-container"

                  key={product.id}

                >


                  <div className="sales-value">

                    {quantity} items

                  </div>


                  <div className="sales-bar-area">


                    <div

                      className="sales-bar"

                      style={{
                        height:
                          `${barHeight}%`
                      }}

                    >

                    </div>


                  </div>


                  <div className="sales-label">

                    {product.name}

                  </div>


                </div>

              );

            })}


          </div>

        )}


      </div>



      {/* REPORTS BUTTON */}

      <div className="dashboard-reports-button-container">

        <button

          type="button"

          className="dashboard-reports-button"

          onClick={onReportsClick}

        >

          📊 View Reports

        </button>

      </div>


    </div>

  );
};

export default Dashboard;