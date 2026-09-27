import { useEffect, useState } from "react";
import "../App.css";

import cartnexaLogo from "../assets/cartnexa.png";
import backgroundImage from "../assets/cartnexabackground.jpg";
import heroImage from "../assets/heroimg.png";

const assetImages = import.meta.glob("../assets/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const normalizeName = (value) => {
  return String(value || "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
};

const getImage = (imageName) => {
  const targetName = normalizeName(imageName);

  const matchingImage = Object.entries(assetImages).find(
    ([path]) => {
      const fileName = path
        .split("/")
        .pop()
        .split(".")[0];

      return normalizeName(fileName) === targetName;
    }
  );

  return matchingImage ? matchingImage[1] : null;
};

const productImages = {
  curd: getImage("curd"),
  milk: getImage("milk"),
  soap: getImage("soap"),
  bread: getImage("bread"),
  chips: getImage("chips"),
  rice: getImage("rice"),

  paneer: getImage("paneer") || getImage("panner"),
  butter: getImage("butter"),
  cheese: getImage("cheese"),
  ghee: getImage("ghee"),
  cake: getImage("cake"),
  biscuits: getImage("biscuits"),
  wheatflour: getImage("wheatflour"),
  sugar: getImage("sugar"),
  salt: getImage("salt"),
  cookingoil: getImage("cookingoil"),
  toordal: getImage("toordal") || getImage("toordhal"),
  moongdal: getImage("moongdal"),
  chanadal: getImage("chanadal") || getImage("channadal"),
  teapowder: getImage("teapowder"),
  coffeepowder: getImage("coffeepowder"),
  shampoo: getImage("shampoo"),
  toothpaste: getImage("toothpaste"),
  toothbrush: getImage("toothbrush"),
  facewash: getImage("facewash"),
  handwash: getImage("handwash"),
};

const getProductImage = (productName) => {

  if (!productName) return null;

  const name = normalizeName(productName);

  const match = Object.keys(productImages).find(
    (key) => normalizeName(key) === name
  );

  return match ? productImages[match] : null;
};


function Home({
  username,
  userId,
  onLogout,
  onViewProduct,
  onCheckout,
  onOrdersClick,
  onDashboardClick,
}) {

  const API = "https://cartnexa-4.onrender.com";

  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState([]);

  const [wishlist, setWishlist] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [activeSection, setActiveSection] =
    useState("home");


  // FETCH PRODUCTS

  useEffect(() => {

    fetchProducts();

  }, []);


  // FETCH CART + WISHLIST

  useEffect(() => {

    if (userId) {

      fetchCart();

      loadWishlist();

    }

  }, [userId]);


  const fetchProducts = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(`${API}/products`);

      if (!response.ok) {

        throw new Error(
          `Products API error: ${response.status}`
        );

      }

      const data =
        await response.json();

      setProducts(
        Array.isArray(data) ? data : []
      );

    } catch (error) {

      console.error(
        "Error fetching products:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  const fetchCart = async () => {

    if (!userId) {

      setCart([]);

      return;

    }

    try {

      const response =
        await fetch(`${API}/cart/${userId}`);

      if (!response.ok) {

        throw new Error(
          `Cart API error: ${response.status}`
        );

      }

      const data =
        await response.json();

      setCart(
        Array.isArray(data) ? data : []
      );

    } catch (error) {

      console.error(
        "Error fetching cart:",
        error
      );

      setCart([]);

    }

  };


  // WISHLIST

  const loadWishlist = () => {

    if (!userId) {

      setWishlist([]);

      return;

    }

    try {

      const savedWishlist =
        localStorage.getItem(
          `wishlist_${userId}`
        );

      if (savedWishlist) {

        const data =
          JSON.parse(savedWishlist);

        setWishlist(
          Array.isArray(data) ? data : []
        );

      } else {

        setWishlist([]);

      }

    } catch (error) {

      console.error(
        "Wishlist loading error:",
        error
      );

      setWishlist([]);

    }

  };


  const saveWishlist = (updatedWishlist) => {

    if (!userId) return;

    localStorage.setItem(
      `wishlist_${userId}`,
      JSON.stringify(updatedWishlist)
    );

    setWishlist(updatedWishlist);

  };


  const toggleWishlist = (product) => {

    if (!userId) {

      alert("Please login first!");

      return;

    }

    const exists =
      wishlist.some(
        (item) =>
          Number(item.id) === Number(product.id)
      );

    if (exists) {

      const updatedWishlist =
        wishlist.filter(
          (item) =>
            Number(item.id) !== Number(product.id)
        );

      saveWishlist(updatedWishlist);

    } else {

      const updatedWishlist =
        [...wishlist, product];

      saveWishlist(updatedWishlist);

    }

  };


  const isWishlisted = (productId) => {

    return wishlist.some(
      (item) =>
        Number(item.id) === Number(productId)
    );

  };


  // ADD TO CART

  const addToCart = async (product) => {

    if (!userId) {

      alert("Please login first!");

      return;

    }

    try {

      const response =
        await fetch(
          `${API}/cart/add/${userId}/${product.id}`,
          {
            method: "POST",
          }
        );

      if (!response.ok) {

        let errorMessage =
          "Unable to add product to cart.";

        try {

          const errorData =
            await response.text();

          if (errorData) {

            errorMessage = errorData;

          }

        } catch (error) {

          console.error(error);

        }

        throw new Error(errorMessage);

      }

      await response.json();

      await fetchCart();

      

    } catch (error) {

      console.error(
        "Add to cart error:",
        error
      );

      alert(error.message);

    }

  };


  // CART PRODUCT

  const getCartProduct = (cartItem) => {

    if (!cartItem) return null;

    if (cartItem.product)
      return cartItem.product;

    if (cartItem.productDetails)
      return cartItem.productDetails;

    return null;

  };


  const getCartProductName = (cartItem) => {

    const product =
      getCartProduct(cartItem);

    if (product?.name)
      return product.name;

    if (cartItem?.productName)
      return cartItem.productName;

    return "Product";

  };


  const getCartProductPrice = (cartItem) => {

    const product =
      getCartProduct(cartItem);

    if (product?.price !== undefined)
      return Number(product.price);

    if (cartItem?.price !== undefined)
      return Number(cartItem.price);

    return 0;

  };


  const getCartProductImage = (cartItem) => {

    const product =
      getCartProduct(cartItem);

    const productName =
      product?.name ||
      cartItem?.productName ||
      "";

    return getProductImage(productName);

  };


  // UPDATE CART QUANTITY

  const updateCartQuantity =
    async (cartItem, newQuantity) => {

      if (!userId) {

        alert("Please login first!");

        return;

      }

      if (newQuantity <= 0) {

        await removeFromCart(cartItem);

        return;

      }

      try {

        const response =
          await fetch(
            `${API}/cart/update/${userId}/${cartItem.id}/${newQuantity}`,
            {
              method: "PUT",
            }
          );

        if (!response.ok) {

          let errorMessage =
            "Unable to update quantity.";

          try {

            const errorData =
              await response.text();

            if (errorData)
              errorMessage = errorData;

          } catch (error) {

            console.error(error);

          }

          throw new Error(errorMessage);

        }

        await response.json();

        await fetchCart();

      } catch (error) {

        console.error(
          "Cart quantity update error:",
          error
        );

        alert(error.message);

      }

    };


  // REMOVE CART

  const removeFromCart = async (cartItem) => {

    if (!userId) {

      alert("Please login first!");

      return;

    }

    try {

      const response =
        await fetch(
          `${API}/cart/remove/${userId}/${cartItem.id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {

        let errorMessage =
          "Unable to remove product.";

        try {

          const errorData =
            await response.text();

          if (errorData)
            errorMessage = errorData;

        } catch (error) {

          console.error(error);

        }

        throw new Error(errorMessage);

      }

      await fetchCart();

    } catch (error) {

      console.error(
        "Remove cart error:",
        error
      );

      alert(error.message);

    }

  };


  // CART COUNT

  const getCartCount = () => {

    return cart.reduce(
      (total, item) =>
        total +
        Number(item.cartQuantity || 0),
      0
    );

  };


  // CART TOTAL

  const getCartTotal = () => {

    return cart.reduce(
      (total, item) => {

        const price =
          getCartProductPrice(item);

        const quantity =
          Number(item.cartQuantity || 0);

        return total +
          price * quantity;

      },
      0
    );

  };


  // CATEGORIES

  const categories = [
    "All",
    ...new Set(
      products
        .map(
          (product) =>
            product.category
        )
        .filter(Boolean)
    ),
  ];


  // FILTER PRODUCTS

  const filteredProducts =
    products.filter((product) => {

      const name =
        product.name?.toLowerCase() || "";

      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        name.includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );

    });


  // SCROLL

  const scrollToSection =
    (sectionId, sectionName) => {

      setActiveSection(sectionName);

      const element =
        document.getElementById(
          sectionId
        );

      if (element) {

        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      }

    };


  // LOGOUT

  const handleLogout = () => {

    localStorage.removeItem("userId");

    localStorage.removeItem("username");

    if (onLogout)
      onLogout();

  };


  // VIEW PRODUCT

  const handleViewProduct = (product) => {

    if (onViewProduct)
      onViewProduct(product);

  };


  // CHECKOUT

  const handleProceedToCheckout = () => {

    if (cart.length === 0) {

      alert("Your cart is empty!");

      return;

    }

    if (onCheckout) {

      onCheckout(cart);

    }

  };


  return (

    <div
      className="home-page"
      style={{
        "--cartnexa-background":
          `url("${backgroundImage}")`,
      }}
    >

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="navbar-brand">

          <img
            src={cartnexaLogo}
            alt="CartNexa Logo"
            className="navbar-logo"
          />

          <h2>CartNexa</h2>

        </div>


        <div className="navbar-links">

          <button
            className={`nav-button ${
              activeSection === "home"
                ? "active"
                : ""
            }`}
            onClick={() =>
              scrollToSection(
                "home",
                "home"
              )
            }
          >
            Home
          </button>


          <button
            className={`nav-button ${
              activeSection === "wishlist"
                ? "active"
                : ""
            }`}
            onClick={() =>
              scrollToSection(
                "wishlist",
                "wishlist"
              )
            }
          >
            💗 Wishlist ({wishlist.length})
          </button>


          <button
            className={`nav-button ${
              activeSection === "cart"
                ? "active"
                : ""
            }`}
            onClick={() =>
              scrollToSection(
                "cart",
                "cart"
              )
            }
          >
            🛒 Cart ({getCartCount()})
          </button>


          {/* MY ORDERS */}

          <button
            type="button"
            className="nav-button"
            onClick={onOrdersClick}
          >
            📦 My Orders
          </button>


          <span className="welcome-text">
            Welcome, {username}
          </span>


          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>


          <button
            type="button"
            className="dashboard-menu-button"
            onClick={onDashboardClick}
          >
            ☰
          </button>

        </div>

      </nav>


      {/* HERO */}

      <section
        id="home"
        className="hero-section"
      >

        <div className="hero-content">

          <div className="hero-small-title">
            SMART SHOPPING • EASY LIVING
          </div>

          <h1>
            Everything You Need,
            <br />
            <span>
              All in One Cart.
            </span>
          </h1>

          <p className="hero-description">
            Discover everyday essentials at
            great prices. Your shopping, made
            simple with CartNexa.
          </p>

          <button
            className="hero-button"
            onClick={() =>
              scrollToSection(
                "products",
                "products"
              )
            }
          >
            Explore Products →
          </button>

        </div>


        <div className="hero-image-wrapper">

          <img
            src={heroImage}
            alt="CartNexa Grocery Shopping"
            className="hero-image"
          />

        </div>

      </section>


      {/* PRODUCTS */}

      <section
        id="products"
        className="products-section"
      >

        <div className="section-heading">

          <p>OUR COLLECTION</p>

          <h2>
            Explore Our Products
          </h2>

          <span>
            Find your everyday essentials
            in one place.
          </span>

        </div>


        <div className="search-filter-area">

          <div className="search-box">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>


          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value
              )
            }
          >

            {categories.map(
              (category) => (

                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>

              )
            )}

          </select>

        </div>


        {loading ? (

          <div className="loading-message">
            Loading products...
          </div>

        ) : filteredProducts.length === 0 ? (

          <div className="empty-message">
            No products found.
          </div>

        ) : (

          <div className="products-grid">

            {filteredProducts.map(
              (product) => {

                const image =
                  getProductImage(
                    product.name
                  );

                const stock =
                  Number(
                    product.quantity || 0
                  );

                return (

                  <div
                    className="product-card"
                    key={product.id}
                  >

                    <button
                      type="button"
                      className={`wishlist-button ${
                        isWishlisted(
                          product.id
                        )
                          ? "liked"
                          : ""
                      }`}
                      onClick={() =>
                        toggleWishlist(
                          product
                        )
                      }
                    >
                      {isWishlisted(
                        product.id
                      )
                        ? "♥"
                        : "♡"}
                    </button>


                    <div className="product-image-wrapper">

                      {image ? (

                        <img
                          src={image}
                          alt={product.name}
                          className="product-image"
                        />

                      ) : (

                        <div className="no-image">
                          🛍️
                        </div>

                      )}

                    </div>


                    <div className="product-info">

                      {product.category && (

                        <span className="product-category">
                          {product.category}
                        </span>

                      )}

                      <h3>
                        {product.name}
                      </h3>

                      <p className="product-price">
                        ₹
                        {Number(
                          product.price || 0
                        ).toFixed(2)}
                      </p>

                      <p className="product-stock">
                        {stock > 0
                          ? `Stock: ${stock}`
                          : "Out of Stock"}
                      </p>


                      <div className="product-actions">

                        <button
                          type="button"
                          className="view-button"
                          onClick={() =>
                            handleViewProduct(
                              product
                            )
                          }
                        >
                          View
                        </button>


                        <button
                          type="button"
                          className="add-cart-button"
                          disabled={
                            stock <= 0
                          }
                          onClick={() =>
                            addToCart(
                              product
                            )
                          }
                        >
                          {stock > 0
                            ? "Add to Cart"
                            : "Out of Stock"}
                        </button>

                      </div>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </section>


      {/* WISHLIST */}

      <section
        id="wishlist"
        className="wishlist-section"
      >

        <div className="section-heading">

          <p>
            YOUR FAVOURITES
          </p>

          <h2>
            My Wishlist
          </h2>

          <span>
            Products you saved for later.
          </span>

        </div>


        {wishlist.length === 0 ? (

          <div className="empty-card">
            Your wishlist is empty.
          </div>

        ) : (

          <div className="small-product-grid">

            {wishlist.map(
              (product) => {

                const image =
                  getProductImage(
                    product.name
                  );

                return (

                  <div
                    className="small-product-card"
                    key={product.id}
                  >

                    {image ? (

                      <img
                        src={image}
                        alt={product.name}
                      />

                    ) : (

                      <div className="no-image">
                        🛍️
                      </div>

                    )}

                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      ₹
                      {Number(
                        product.price || 0
                      ).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        addToCart(
                          product
                        )
                      }
                    >
                      Add to Cart
                    </button>

                  </div>

                );

              }
            )}

          </div>

        )}

      </section>


      {/* CART */}

      <section
        id="cart"
        className="cart-section"
      >

        <div className="section-heading">

          <p>
            YOUR SHOPPING BAG
          </p>

          <h2>
            My Cart
          </h2>

          <span>
            Review your selected products.
          </span>

        </div>


        {cart.length === 0 ? (

          <div className="empty-card">
            Your cart is empty.
          </div>

        ) : (

          <div className="cart-container">

            <div className="cart-items">

              {cart.map(
                (item) => {

                  const product =
                    getCartProduct(item);

                  const productName =
                    getCartProductName(
                      item
                    );

                  const productPrice =
                    getCartProductPrice(
                      item
                    );

                  const image =
                    getCartProductImage(
                      item
                    );

                  const quantity =
                    Number(
                      item.cartQuantity || 0
                    );


                  return (

                    <div
                      className="cart-item"
                      key={item.id}
                    >

                      {image ? (

                        <img
                          src={image}
                          alt={productName}
                        />

                      ) : (

                        <div className="no-image">
                          🛍️
                        </div>

                      )}


                      <div className="cart-item-details">

                        <h3>
                          {productName}
                        </h3>

                        <p>
                          ₹
                          {productPrice.toFixed(
                            2
                          )}
                        </p>


                        <div className="quantity-control">

                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item,
                                quantity - 1
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item,
                                quantity + 1
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                      </div>


                      <div className="cart-item-total">

                        <strong>
                          ₹
                          {(
                            productPrice *
                            quantity
                          ).toFixed(2)}
                        </strong>

                      </div>


                      <button
                        type="button"
                        className="remove-cart-button"
                        onClick={() =>
                          removeFromCart(
                            item
                          )
                        }
                      >
                        Remove
                      </button>

                    </div>

                  );

                }
              )}

            </div>


            <div className="cart-summary">

              <h3>
                Cart Summary
              </h3>


              <div className="summary-row">

                <span>
                  Items
                </span>

                <span>
                  {getCartCount()}
                </span>

              </div>


              <div className="summary-row total-row">

                <span>
                  Total
                </span>

                <span>
                  ₹
                  {getCartTotal().toFixed(
                    2
                  )}
                </span>

              </div>


              <button
                type="button"
                className="checkout-button"
                onClick={
                  handleProceedToCheckout
                }
              >
                Proceed to Checkout
              </button>

            </div>

          </div>

        )}

      </section>


      {/* FOOTER */}

      <footer className="footer">

        <div className="footer-brand">

          <img
            src={cartnexaLogo}
            alt="CartNexa"
          />

          <h2>
            CartNexa
          </h2>

        </div>

        <p>
          Shop Smart • Live Better
        </p>

        <span>
          © 2026 CartNexa.
          All rights reserved.
        </span>

      </footer>

    </div>

  );
}

export default Home;