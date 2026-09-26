import React, { useState } from "react";
import "../App.css";

const Checkout = ({ cart, userId, onBack, onProceedToPayment }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Product total
  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.product?.price || 0) *
        Number(item.cartQuantity || 1),
    0
  );

  // Delivery charge
  // Below ₹99 -> 5%
  // ₹99 or above -> FREE
  const deliveryCharge =
    total < 99
      ? cart.reduce(
          (sum, item) =>
            sum +
            Number(item.product?.price || 0) *
              Number(item.cartQuantity || 1) *
              0.05,
          0
        )
      : 0;

  // Final amount
  const grandTotal = total + deliveryCharge;

  const handleProceedToPayment = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your address");
      return;
    }

    if (!userId) {
      alert("Please login first");
      return;
    }

    if (!cart || cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const orderData = {
      userId: userId,
      totalAmount: grandTotal,
      subtotal: total,
      deliveryCharge: deliveryCharge,
      name: name,
      phone: phone,
      address: address,
    };

    onProceedToPayment(orderData);
  };

  return (
    <div className="checkout-page">

      {/* Header */}
      <div className="checkout-header">

        <button
          type="button"
          className="back-cart-button"
          onClick={onBack}
        >
          ← Back to Cart
        </button>

        <h1>Checkout</h1>

        <p>Complete your delivery details and place your order</p>

      </div>

      <div className="checkout-container">

        {/* Delivery Details */}
        <div className="checkout-details">

          <h2>Delivery Details</h2>

          <p className="checkout-subtitle">
            Enter your delivery information
          </p>

          <form onSubmit={handleProceedToPayment}>

            {/* Name */}
            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Phone */}
            <label>Phone Number</label>

            <input
              type="text"
              placeholder="Enter 10-digit phone number"
              value={phone}
              maxLength="10"
              onChange={(e) =>
                setPhone(
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
            />

            {/* Address */}
            <label>Address</label>

            <textarea
              placeholder="Enter your delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="5"
            />

            {/* Payment Button */}
            <button
              type="submit"
              className="place-order-button"
            >
              Proceed to Payment
            </button>

          </form>

        </div>


        {/* Order Summary */}
        <div className="checkout-summary">

          <h2>Order Summary</h2>

          {/* Cart Items */}
          <div className="checkout-items">

            {cart.map((item) => (
              <div
                className="checkout-item"
                key={item.id}
              >

                <div>

                  <h3>
                    {item.product?.name}
                  </h3>

                  <p>
                    ₹{Number(item.product?.price || 0).toFixed(2)}
                    {" × "}
                    {item.cartQuantity}
                  </p>

                </div>

                <strong>
                  ₹
                  {(
                    Number(item.product?.price || 0) *
                    Number(item.cartQuantity || 1)
                  ).toFixed(2)}
                </strong>

              </div>
            ))}

          </div>

          <hr />


          {/* Order Amount */}
          <div className="checkout-total">

            <span>Order Amount</span>

            <strong>
              ₹{total.toFixed(2)}
            </strong>

          </div>


          {/* Delivery Charge */}
          <div className="checkout-delivery">

            <span>Delivery</span>

            <strong
              className={
                deliveryCharge === 0
                  ? "free-delivery"
                  : "delivery-charge"
              }
            >
              {deliveryCharge === 0
                ? "FREE"
                : `₹${deliveryCharge.toFixed(2)}`}
            </strong>

          </div>


          <hr />


          {/* Grand Total */}
          <div className="checkout-total final-total">

            <span>Total</span>

            <strong>
              ₹{grandTotal.toFixed(2)}
            </strong>

          </div>


          {/* Delivery Message */}
          {total < 99 ? (

            <p className="free-delivery-message">
              Add ₹{(99 - total).toFixed(2)} more to get FREE delivery.
            </p>

          ) : (

            <p className="free-delivery-message">
              🎉 You got FREE delivery!
            </p>

          )}

        </div>

      </div>

    </div>
  );
};

export default Checkout;