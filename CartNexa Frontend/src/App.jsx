import { useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import ProductDetails from "./components/ProductDetails";
import Checkout from "./components/Checkout";
import Payment from "./components/Payment";
import Orders from "./components/Orders";
import OrderDetails from "./components/OrderDetails";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";

import "./App.css";

function App() {
  const [page, setPage] = useState("login");

  const [user, setUser] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [checkoutCart, setCheckoutCart] = useState([]);

  const [paymentOrderData, setPaymentOrderData] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);

  // ==============================
  // LOGIN
  // ==============================

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setPage("home");
  };

  // ==============================
  // REGISTER
  // ==============================

  const handleRegister = () => {
    setPage("login");
  };

  // ==============================
  // PRODUCT DETAILS
  // ==============================

  const handleProductDetails = (product) => {
    setSelectedProduct(product);
    setPage("productDetails");
  };

  // ==============================
  // CHECKOUT
  // ==============================

  const handleCheckout = (cart) => {
    if (!user) {
      alert("Please login first");
      setPage("login");
      return;
    }

    if (!cart || cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setCheckoutCart(cart);
    setPage("checkout");
  };

  // ==============================
  // PROCEED TO PAYMENT
  // ==============================

  const handleProceedToPayment = (orderData) => {
    setPaymentOrderData(orderData);
    setPage("payment");
  };

  // ==============================
  // PAYMENT SUCCESS
  // ==============================

  const handlePaymentSuccess = async (paymentData) => {
    try {
      if (!user) {
        alert("Please login first");
        setPage("login");
        return;
      }

      // ==============================
      // CREATE ORDER
      // ==============================

      const orderResponse = await fetch(
        "https://cartnexa-4.onrender.com/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            totalAmount: Number(paymentData.totalAmount || 0),
            status:
              paymentData.paymentMethod === "cod"
                ? "PLACED"
                : "PAID",
            orderDate: new Date().toISOString(),
          }),
        }
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const savedOrder = await orderResponse.json();

      // ==============================
      // SAVE ORDER ITEMS
      // ==============================

      for (const item of checkoutCart) {
        await fetch(
          "https://cartnexa-4.onrender.com/orders/items",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: savedOrder.id,
              productId: item.product.id,
              quantity: item.cartQuantity,
              price: item.product.price,
            }),
          }
        );
      }

      // ==============================
      // CLEAR CART
      // ==============================

      await fetch(
        `https://cartnexa-4.onrender.com/cart/clear/${user.id}`,
        {
          method: "DELETE",
        }
      );

      // ==============================
      // SUCCESS
      // ==============================

      alert(
        paymentData.paymentMethod === "cod"
          ? "Order placed successfully!"
          : "Payment successful! Order placed successfully!"
      );

      setCheckoutCart([]);
      setPaymentOrderData(null);

      setPage("orders");
    } catch (error) {
      console.error("Order error:", error);

      alert(
        "Something went wrong while placing the order."
      );
    }
  };

  // ==============================
  // ORDER DETAILS
  // ==============================

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setPage("orderDetails");
  };

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    setUser(null);
    setCheckoutCart([]);
    setPaymentOrderData(null);
    setSelectedProduct(null);
    setSelectedOrder(null);

    setPage("login");
  };

  // ==============================
  // LOGIN PAGE
  // ==============================

  if (page === "login") {
    return (
      <Login
        onLoginSuccess={handleLogin}
        onRegister={() => setPage("register")}
      />
    );
  }

  // ==============================
  // REGISTER PAGE
  // ==============================

  if (page === "register") {
    return (
      <Register
        onRegister={handleRegister}
        onLogin={() => setPage("login")}
      />
    );
  }

  // ==============================
  // PRODUCT DETAILS PAGE
  // ==============================

  if (page === "productDetails") {
    return (
      <ProductDetails
        product={selectedProduct}
        userId={user?.id}
        onBack={() => setPage("home")}
        onCheckout={handleCheckout}
      />
    );
  }

  // ==============================
  // CHECKOUT PAGE
  // ==============================

  if (page === "checkout") {
    return (
      <Checkout
        cart={checkoutCart}
        userId={user?.id}
        onBack={() => setPage("home")}
        onProceedToPayment={handleProceedToPayment}
      />
    );
  }

  // ==============================
  // PAYMENT PAGE
  // ==============================

  if (page === "payment") {
    return (
      <Payment
        totalAmount={
          paymentOrderData?.totalAmount || 0
        }
        orderData={paymentOrderData}
        onBack={() => setPage("checkout")}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  // ==============================
  // ORDERS PAGE
  // ==============================

  if (page === "orders") {
    return (
      <Orders
        userId={user?.id}
        onBack={() => setPage("home")}
        onViewDetails={handleOrderDetails}
      />
    );
  }

  // ==============================
  // ORDER DETAILS PAGE
  // ==============================

  if (page === "orderDetails") {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={() => setPage("orders")}
      />
    );
  }

  // ==============================
  // DASHBOARD PAGE
  // ==============================

  if (page === "dashboard") {
    return (
      <Dashboard
        onBack={() => setPage("home")}
        onReportsClick={() => setPage("reports")}
      />
    );
  }

  // ==============================
  // REPORTS PAGE
  // ==============================

  if (page === "reports") {
    return (
      <Reports
        onBack={() => setPage("dashboard")}
      />
    );
  }

  // ==============================
  // HOME PAGE
  // ==============================

  return (
    <Home 
  username={user?.username}
  userId={user?.id} 
  onViewProduct={handleProductDetails}
  onCheckout={handleCheckout} 
  onOrdersClick={() => setPage("orders")} 
  onDashboardClick={() => setPage("dashboard")} 
  onLogout={handleLogout} 
/>
  );
}

export default App;