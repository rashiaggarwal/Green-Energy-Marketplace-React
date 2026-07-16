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

  const register =
    async () => {
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

      <div className="auth-header">
        <h1>
          Green Energy Marketplace
        </h1>

        <p>
          Peer-to-Peer Renewable Energy Trading
        </p>
      </div>

      <div className="auth-content">

        <div className="page-title">
          <h2>
            Login / Registration
          </h2>

          <p>
            Login with your account or
            register a new user.
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

        {mode === "login" && (
          <div className="auth-grid">

            <div className="card">

              <h2>
                🔐 Login
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
                />
              </div>

              <button
                className="btn green-btn"
                onClick={login}
                disabled={
                  loading
                }
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>

            </div>

            <div className="card status-card">
              <h3>
                Login Status
              </h3>

              <p>
                Enter valid email and
                password.
              </p>
            </div>

          </div>
        )}

        {mode === "register" && (
          <div className="auth-grid">

            <div className="card">

              <h2>
                👤 Registration
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
                  className="btn green-btn"
                  onClick={
                    register
                  }
                  disabled={
                    loading
                  }
                >
                  {loading
                    ? "Registering..."
                    : "Register User"}
                </button>

              </div>

            </div>

            <div className="card status-card">

              <h2>
                Registration Status
              </h2>

              <p>
                Role:{" "}
                {
                  registerForm.role
                }
              </p>

              <p>
                Ready for
                registration
              </p>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}