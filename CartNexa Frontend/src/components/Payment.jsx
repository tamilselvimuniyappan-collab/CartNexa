import React, { useState } from "react";
import "../App.css";

const Payment = ({
  totalAmount,
  orderData,
  onBack,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiMethod, setUpiMethod] = useState("gpay");

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [selectedBank, setSelectedBank] = useState("");

  const [loading, setLoading] = useState(false);

  // ==============================
  // AMOUNT DETAILS
  // ==============================

  const subtotal = Number(
    orderData?.subtotal || 0
  );

  const deliveryCharge = Number(
    orderData?.deliveryCharge || 0
  );

  const finalAmount = Number(
    totalAmount || subtotal + deliveryCharge
  );

  // ==============================
  // PAYMENT
  // ==============================

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    // Card validation
    if (paymentMethod === "card") {
      if (!cardNumber || !expiryDate || !cvv) {
        alert("Please enter all card details");
        return;
      }

      if (
        cardNumber.replace(/\s/g, "").length !== 16
      ) {
        alert(
          "Please enter a valid 16-digit card number"
        );
        return;
      }

      if (cvv.length !== 3) {
        alert(
          "Please enter a valid 3-digit CVV"
        );
        return;
      }

      if (expiryDate.length !== 5) {
        alert(
          "Please enter a valid expiry date"
        );
        return;
      }
    }

    // Net Banking validation
    if (
      paymentMethod === "netbanking" &&
      !selectedBank
    ) {
      alert("Please select your bank");
      return;
    }

    setLoading(true);

    try {
      // Demo payment processing
      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      // Send payment details to App.jsx
      if (onPaymentSuccess) {
        onPaymentSuccess({
          ...orderData,

          subtotal: subtotal,

          deliveryCharge: deliveryCharge,

          totalAmount: finalAmount,

          paymentMethod: paymentMethod,

          upiMethod:
            paymentMethod === "upi"
              ? upiMethod
              : null,

          paymentStatus:
            paymentMethod === "cod"
              ? "PENDING"
              : "PAID",
        });
      }
    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      alert(
        "Payment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">

      {/* ==============================
          HEADER
      ============================== */}

      <div className="payment-header">

        <button
          type="button"
          className="back-payment-button"
          onClick={onBack}
        >
          ← Back to Checkout
        </button>

        <h1>Payment</h1>

      </div>

      <div className="payment-container">

        {/* ==============================
            PAYMENT METHODS
        ============================== */}

        <div className="payment-card">

          <h2>Select Payment Method</h2>

          {/* ==============================
              UPI
          ============================== */}

          <div
            className={`payment-method ${
              paymentMethod === "upi"
                ? "active"
                : ""
            }`}
          >

            <label>

              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={
                  paymentMethod === "upi"
                }
                onChange={() =>
                  setPaymentMethod("upi")
                }
              />

              <span>🟢 UPI</span>

            </label>

            {paymentMethod === "upi" && (
              <div className="upi-options">

                <label className="upi-option">

                  <input
                    type="radio"
                    name="upiMethod"
                    value="gpay"
                    checked={
                      upiMethod === "gpay"
                    }
                    onChange={() =>
                      setUpiMethod("gpay")
                    }
                  />

                  <span>
                    Google Pay
                  </span>

                </label>

                <label className="upi-option">

                  <input
                    type="radio"
                    name="upiMethod"
                    value="phonepe"
                    checked={
                      upiMethod === "phonepe"
                    }
                    onChange={() =>
                      setUpiMethod("phonepe")
                    }
                  />

                  <span>
                    PhonePe
                  </span>

                </label>

                <label className="upi-option">

                  <input
                    type="radio"
                    name="upiMethod"
                    value="paytm"
                    checked={
                      upiMethod === "paytm"
                    }
                    onChange={() =>
                      setUpiMethod("paytm")
                    }
                  />

                  <span>
                    Paytm
                  </span>

                </label>

              </div>
            )}

          </div>

          {/* ==============================
              CARD
          ============================== */}

          <div
            className={`payment-method ${
              paymentMethod === "card"
                ? "active"
                : ""
            }`}
          >

            <label>

              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={
                  paymentMethod === "card"
                }
                onChange={() =>
                  setPaymentMethod("card")
                }
              />

              <span>
                💳 Credit / Debit Card
              </span>

            </label>

            {paymentMethod === "card" && (
              <div className="card-payment-form">

                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  maxLength="19"
                  onChange={(e) => {
                    const value =
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 16);

                    const formatted =
                      value
                        .replace(
                          /(.{4})/g,
                          "$1 "
                        )
                        .trim();

                    setCardNumber(
                      formatted
                    );
                  }}
                />

                <div className="card-row">

                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={expiryDate}
                    onChange={(e) => {
                      let value =
                        e.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(0, 4);

                      if (
                        value.length > 2
                      ) {
                        value =
                          value.slice(0, 2) +
                          "/" +
                          value.slice(2, 4);
                      }

                      setExpiryDate(
                        value
                      );
                    }}
                  />

                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength="3"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(
                        e.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(0, 3)
                      )
                    }
                  />

                </div>

              </div>
            )}

          </div>

          {/* ==============================
              NET BANKING
          ============================== */}

          <div
            className={`payment-method ${
              paymentMethod === "netbanking"
                ? "active"
                : ""
            }`}
          >

            <label>

              <input
                type="radio"
                name="paymentMethod"
                value="netbanking"
                checked={
                  paymentMethod ===
                  "netbanking"
                }
                onChange={() =>
                  setPaymentMethod(
                    "netbanking"
                  )
                }
              />

              <span>
                🏦 Net Banking
              </span>

            </label>

            {paymentMethod ===
              "netbanking" && (
              <select
                value={selectedBank}
                onChange={(e) =>
                  setSelectedBank(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select Bank
                </option>

                <option value="SBI">
                  State Bank of India
                </option>

                <option value="HDFC">
                  HDFC Bank
                </option>

                <option value="ICICI">
                  ICICI Bank
                </option>

                <option value="AXIS">
                  Axis Bank
                </option>

                <option value="KOTAK">
                  Kotak Mahindra Bank
                </option>

                <option value="OTHER">
                  Other Bank
                </option>

              </select>
            )}

          </div>

          {/* ==============================
              COD
          ============================== */}

          <div
            className={`payment-method ${
              paymentMethod === "cod"
                ? "active"
                : ""
            }`}
          >

            <label>

              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={
                  paymentMethod === "cod"
                }
                onChange={() =>
                  setPaymentMethod("cod")
                }
              />

              <span>
                💵 Cash on Delivery
              </span>

            </label>

            {paymentMethod === "cod" && (
              <p className="cod-message">
                Pay when your order is
                delivered.
              </p>
            )}

          </div>

        </div>

        {/* ==============================
            ORDER SUMMARY
        ============================== */}

        <div className="payment-summary">

          <h2>Order Summary</h2>

          {/* Order Amount */}

          <div className="payment-summary-row">

            <span>
              Order Amount
            </span>

            <strong>
              ₹{subtotal.toFixed(2)}
            </strong>

          </div>

          {/* Delivery */}

          <div className="payment-summary-row">

            <span>
              Delivery
            </span>

            <strong>
              {deliveryCharge === 0
                ? "FREE"
                : `₹${deliveryCharge.toFixed(
                    2
                  )}`}
            </strong>

          </div>

          <hr />

          {/* Total */}

          <div className="payment-total">

            <span>
              Total
            </span>

            <strong>
              ₹{finalAmount.toFixed(2)}
            </strong>

          </div>

          {/* Payment Button */}

          <button
            type="button"
            className="pay-now-button"
            onClick={handlePayment}
            disabled={loading}
          >

            {loading
              ? "Processing..."
              : paymentMethod === "cod"
              ? "Place Order"
              : `Pay ₹${finalAmount.toFixed(
                  2
                )}`}

          </button>

        </div>

      </div>

    </div>
  );
};

export default Payment;