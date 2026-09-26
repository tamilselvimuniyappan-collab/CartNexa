import "../App.css";

function ProductDetails({ product, onBack }) {
  if (!product) {
    return <p>Product details not found.</p>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiryDate = product.expiryDate
    ? new Date(`${product.expiryDate}T00:00:00`)
    : null;

  const daysUntilExpiry = expiryDate
    ? Math.ceil(
        (expiryDate - today) / (1000 * 60 * 60 * 24)
      )
    : null;

  const isLowStock = product.quantity < 10;

  const isExpiringSoon =
    daysUntilExpiry !== null &&
    daysUntilExpiry >= 0 &&
    daysUntilExpiry <= 7;

  const isExpired =
    daysUntilExpiry !== null &&
    daysUntilExpiry < 0;

  return (
    <div className="details-page">

      <nav className="navbar">
        <h2>CartNexa 🛒</h2>

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Products
        </button>
      </nav>

      <div className="details-card">

        <h1>{product.name}</h1>

        <p>
          <strong>Price:</strong> ₹{product.price}
        </p>

        <p>
          <strong>Available Quantity:</strong>{" "}
          {product.quantity}
        </p>

        <p>
          <strong>Expiry Date:</strong>{" "}
          {product.expiryDate || "Not specified"}
        </p>

        {isLowStock && (
          <div className="warning-message">
            ⚠️ Low stock! Only {product.quantity} item(s) available.
          </div>
        )}

        {isExpiringSoon && (
          <div className="warning-message">
            ⚠️ This product expires in{" "}
            {daysUntilExpiry} day(s).
          </div>
        )}

        {isExpired && (
          <div className="expired-message">
            ❌ This product has expired.
          </div>
        )}

        {!isLowStock &&
          !isExpiringSoon &&
          !isExpired && (
            <div className="success-message">
              ✅ Product is available.
            </div>
          )}

      </div>
    </div>
  );
}

export default ProductDetails;