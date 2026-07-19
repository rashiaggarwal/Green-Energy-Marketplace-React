import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/apiClient";

export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] =
    useState("login");

  const [loading, setLoading] =
    useState(false);

  const [loginForm, setLoginForm] =
    useState({
      email: "",
      password: "",
    });

  const [registerForm, setRegisterForm] =
    useState({
      email: "",
      username: "",
      password: "",
      confirm_password: "",
      full_name: "",
      phone_number: "",
      address: "",
      city: "",
      country: "",
      role: "SELLER",
      wallet_address: "",
    });

  
const login = async () => {
  if (loading) return;
    try {
      setLoading(true);

      await apiClient.loginUser({
        email: loginForm.email,
        password: loginForm.password,
      });

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
  if (loading) return;
      try {
        if (
          registerForm.password !==
          registerForm.confirm_password
        ) {
          alert(
            "Passwords do not match"
          );
          return;
        }

        setLoading(true);

        await apiClient.registerUser(
          registerForm
        );

        alert(
          "Registration successful. Please login."
        );

        setMode("login");
      } catch (error) {
        alert(
          error.message ||
            "Registration failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="auth-layout">

    <div className="landing-hero">

  <div className="landing-overlay">
    <div className="hero-content">
      <h1>
        ⚡ Green Energy Marketplace
      </h1>

      <p>
        AI Blockchain-Powered Renewable
        Energy Trading Platform
      </p>
    </div>
  </div>
</div>

<div className="auth-content auth-centered">

  {/* <div className="auth-panel">

        <div className="page-title">

  <h2>
    Welcome to GreenGrid
  </h2>

  <p className="header">
    Login to continue or create a
    new account to start trading
    renewable energy credits.
  </p>

</div>

        <div className="card auth-switch-card">

          <div className="btn-row">

            <button
              className={
                mode === "login"
                  ? "btn active-btn"
                  : "btn outline-btn"
              }
              onClick={() =>
                setMode("login")
              }
            >
              Login
            </button>

            <button
              className={
                mode === "register"
                  ? "btn active-btn"
                  : "btn outline-btn"
              }
              onClick={() =>
                setMode(
                  "register"
                )
              }
            >
              Register
            </button>

            </div>

          </div>

        </div> */}

        {mode === "login" && (
          <div className="auth-grid">
            
              <form
                className="card"
                onSubmit={(e) => {
                  e.preventDefault();
                  login();
                }}
              >

              <h2 className="form-title">
                Sign In
              </h2>

              <div className="form-group">
                <label>
                  Email
                </label>

                <input
                  value={
                    loginForm.email
                  }
                  onChange={(e) =>
                    setLoginForm(
                      {
                        ...loginForm,
                        email:
                          e.target
                            .value,
                      }
                    )
                  }
                  placeholder="user@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label>
                  Password
                </label>

                <input
                  type="password"
                  value={
                    loginForm.password
                  }
                  onChange={(e) =>
                    setLoginForm(
                      {
                        ...loginForm,
                        password:
                          e.target
                            .value,
                      }
                    )
                  }
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn green-btn"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>

              <button
              className={
                mode === "register"
                  ? "btn active-btn"
                  : "btn outline-btn"
              }
              style={{marginLeft: 12}}
              onClick={() =>
                setMode(
                  "register"
                )
              }
            >
              Create Account
            </button>

            </form>

          </div>
        )}

        {mode === "register" && (
          <div className="auth-grid">

            <form
              className="card"
              onSubmit={(e) => {
                e.preventDefault();
                register();
              }}
            >

              <h2 className="form-title">
                Create Account
              </h2>

              <div className="field-grid">

                <input
                  placeholder="Full Name"
                  value={
                    registerForm.full_name
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      {
                        ...registerForm,
                        full_name:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <input
                  placeholder="Username"
                  value={
                    registerForm.username
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      {
                        ...registerForm,
                        username:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <input
                  placeholder="Email"
                  value={
                    registerForm.email
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      {
                        ...registerForm,
                        email:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <input
                  placeholder="Wallet Address"
                  value={
                    registerForm.wallet_address
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      {
                        ...registerForm,
                        wallet_address:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <input
                  placeholder="Phone Number"
                  value={
                    registerForm.phone_number
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      {
                        ...registerForm,
                        phone_number:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <input
                  placeholder="City"
                  value={
                    registerForm.city
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      {
                        ...registerForm,
                        city:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <input
                  placeholder="Country"
                  value={
                    registerForm.country
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      {
                        ...registerForm,
                        country:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  value={
                    registerForm.password
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      {
                        ...registerForm,
                        password:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={
                    registerForm.confirm_password
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      {
                        ...registerForm,
                        confirm_password:
                          e.target
                            .value,
                      }
                    )
                  }
                />

                <select
                  value={
                    registerForm.role
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      {
                        ...registerForm,
                        role:
                          e.target
                            .value,
                      }
                    )
                  }
                >
                  <option value="BUYER">
                    Buyer
                  </option>

                  <option value="SELLER">
                    Seller
                  </option>

                  <option value="ADMIN">
                    Admin
                  </option>
                </select>

                <input
                  placeholder="Address"
                  value={
                    registerForm.address
                  }
                  onChange={(e) =>
                    setRegisterForm(
                      {
                        ...registerForm,
                        address:
                          e.target
                            .value,
                      }
                    )
                  }
                />

              </div>

              <div className="btn-row">

                <button
                  type="submit"
                  className="btn green-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Creating..."
                    : "Create Account"}
                </button>

                <button
                  className={
                    mode === "login"
                      ? "btn active-btn"
                      : "btn outline-btn"
                  }
                  onClick={() =>
                    setMode("login")
                  }
                >
                  Login
                </button>

              </div>

            </form>

          </div>
        )}

      </div>

    </div>
  );
}