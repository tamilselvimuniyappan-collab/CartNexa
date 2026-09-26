import { useState } from "react";
import "../App.css";
import cartnexaLogo from "../assets/cartnexa.png";

function Login({ onRegisterClick, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const result = await response.json();

      console.log("Login API response:", result);

      if (
        response.ok &&
        typeof result === "object" &&
        result !== null &&
        result.id &&
        result.username
      ) {
        localStorage.setItem("userId", result.id);
        localStorage.setItem(
          "username",
          result.username
        );

        

        onLoginSuccess(result);
      } else {
        const errorMessage =
          typeof result === "string"
            ? result
            : "Invalid Email or Password!";

        alert(errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Login failed. Please check the backend connection and CORS settings."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* LEFT SIDE */}

        <div className="login-left">

          <img
            src={cartnexaLogo}
            alt="CartNexa Logo"
            className="login-logo-image"
          />

          <h1>
            Welcome to <span>CartNexa</span>
          </h1>

          <p>
            Your simple and smart grocery shopping
            partner.
          </p>

          <div className="login-features">
            <div>✓ Easy Product Management</div>
            <div>✓ Simple Shopping Cart</div>
            <div>✓ Fast & Secure Login</div>
          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="login-right">

          <div className="login-form-box">

            <div className="login-small-logo">
              <img
                src={cartnexaLogo}
                alt="CartNexa"
              />
            </div>

            <h2>Login</h2>

            <p className="login-subtitle">
              Login to continue to your CartNexa
              account
            </p>

            <form onSubmit={handleLogin}>

              <div className="input-group">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>


              <div className="input-group">

                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>


              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>

            </form>


            <p className="register-text">
              Don't have an account?{" "}

              <button
                type="button"
                className="register-link"
                onClick={onRegisterClick}
              >
                Register
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;