import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const admins = {
    admin1: "admin1@123",
    admin2: "admin2@123",
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    const enteredUsername = username.trim();
    const enteredPassword = password;

    // Empty fields
    if (!enteredUsername && !enteredPassword) {
      setError("Login failed: Please enter both username and password.");
      return;
    }

    if (!enteredUsername) {
      setError("Login failed: Username is required.");
      return;
    }

    if (!enteredPassword) {
      setError("Login failed: Password is required.");
      return;
    }

    // Check username
    if (!Object.prototype.hasOwnProperty.call(admins, enteredUsername)) {
      setError(
        "Login failed: The username you entered does not exist. Please check your username and try again."
      );
      return;
    }

    // Check password
    if (admins[enteredUsername] !== enteredPassword) {
      setError(
        "Login failed: Incorrect password for this username. Please check your password and try again."
      );
      return;
    }

    // Successful login
    setLoading(true);

    // Store login session
    sessionStorage.setItem("adminLoggedIn", "true");
    sessionStorage.setItem("adminUsername", enteredUsername);

    setTimeout(() => {
      navigate("/admin");
    }, 500);
  };

  return (
    <div style={styles.page}>
      {/* Background decoration */}
      <div style={styles.circleOne}></div>
      <div style={styles.circleTwo}></div>

      <div style={styles.loginContainer}>
        {/* Left Section */}
        <div style={styles.leftSection}>
          <div style={styles.busIcon}>
            <i className="fas fa-bus"></i>
          </div>

          <h1 style={styles.systemTitle}>
            FISAT BUS
            <br />
            MANAGEMENT SYSTEM
          </h1>

          <div style={styles.divider}></div>

          <p style={styles.leftText}>
            Secure administration portal for managing buses, students,
            staff, routes, schedules and transportation services.
          </p>

          <div style={styles.securityInfo}>
            <i className="fas fa-shield-alt"></i>
            <span>Authorized Administrator Access</span>
          </div>
        </div>

        {/* Right Section */}
        <div style={styles.rightSection}>
          <div style={styles.adminIcon}>
            <i className="fas fa-user-shield"></i>
          </div>

          <h2 style={styles.loginTitle}>Admin Login</h2>

          <p style={styles.loginSubtitle}>
            Sign in to access the administration dashboard
          </p>

          <form onSubmit={handleLogin} style={styles.form}>
            {/* Username */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>

              <div style={styles.inputWrapper}>
                <i
                  className="fas fa-user"
                  style={styles.inputIcon}
                ></i>

                <input
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  style={styles.input}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>

              <div style={styles.inputWrapper}>
                <i
                  className="fas fa-lock"
                  style={styles.inputIcon}
                ></i>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  style={styles.input}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <i
                    className={
                      showPassword
                        ? "fas fa-eye-slash"
                        : "fas fa-eye"
                    }
                  ></i>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={styles.errorBox}>
                <div style={styles.errorIcon}>
                  <i className="fas fa-exclamation-circle"></i>
                </div>

                <div>
                  <strong style={styles.errorTitle}>
                    Login Failed
                  </strong>

                  <p style={styles.errorText}>{error}</p>

                  <p style={styles.tryAgain}>
                    Please check your credentials and try again.
                  </p>
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              style={{
                ...styles.loginButton,
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i
                    className="fas fa-spinner fa-spin"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Signing In...
                </>
              ) : (
                <>
                  <i
                    className="fas fa-sign-in-alt"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Login to Admin Portal
                </>
              )}
            </button>
          </form>

          {/* Back Home */}
          <button
            onClick={() => navigate("/")}
            style={styles.backButton}
          >
            <i
              className="fas fa-arrow-left"
              style={{ marginRight: "7px" }}
            ></i>
            Back to Home
          </button>

          <div style={styles.footerText}>
            <i
              className="fas fa-lock"
              style={{ marginRight: "6px" }}
            ></i>
            Secure Administrator Login
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background:
      "linear-gradient(135deg, #071a2f 0%, #0c2340 45%, #123b67 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px 20px",
    boxSizing: "border-box",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  circleOne: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    border: "80px solid rgba(255,193,7,0.05)",
    top: "-250px",
    right: "-150px",
  },

  circleTwo: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    border: "70px solid rgba(255,193,7,0.04)",
    bottom: "-230px",
    left: "-170px",
  },

  loginContainer: {
    width: "100%",
    maxWidth: "1000px",
    minHeight: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
    position: "relative",
    zIndex: 2,
  },

  leftSection: {
    background:
      "linear-gradient(145deg, #0c2340 0%, #123b67 65%, #19547e 100%)",
    color: "#ffffff",
    padding: "60px 50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  busIcon: {
    width: "78px",
    height: "78px",
    borderRadius: "50%",
    backgroundColor: "#ffc107",
    color: "#0c2340",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2.2rem",
    marginBottom: "30px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },

  systemTitle: {
    fontSize: "2.35rem",
    lineHeight: 1.2,
    margin: 0,
    fontWeight: 900,
    letterSpacing: "1px",
  },

  divider: {
    width: "70px",
    height: "4px",
    backgroundColor: "#ffc107",
    margin: "25px 0",
    borderRadius: "5px",
  },

  leftText: {
    color: "#d9e5f1",
    fontSize: "1rem",
    lineHeight: 1.8,
    maxWidth: "420px",
    margin: "0 0 30px 0",
  },

  securityInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#ffc107",
    fontSize: "0.9rem",
    fontWeight: 700,
  },

  rightSection: {
    padding: "50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },

  adminIcon: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    backgroundColor: "#eef3f8",
    color: "#0c2340",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.7rem",
    marginBottom: "18px",
  },

  loginTitle: {
    fontSize: "2rem",
    color: "#0c2340",
    margin: "0 0 5px 0",
    fontWeight: 800,
  },

  loginSubtitle: {
    color: "#697586",
    margin: "0 0 30px 0",
    fontSize: "0.92rem",
  },

  form: {
    width: "100%",
  },

  inputGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    color: "#25364a",
    fontSize: "0.9rem",
    fontWeight: 700,
    marginBottom: "8px",
  },

  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  inputIcon: {
    position: "absolute",
    left: "15px",
    color: "#7b8794",
    fontSize: "0.95rem",
    zIndex: 1,
  },

  input: {
    width: "100%",
    height: "50px",
    boxSizing: "border-box",
    border: "1px solid #d8dee7",
    borderRadius: "8px",
    padding: "0 45px",
    fontSize: "0.95rem",
    outline: "none",
    color: "#1f2937",
    backgroundColor: "#f9fafb",
  },

  eyeButton: {
    position: "absolute",
    right: "12px",
    border: "none",
    background: "transparent",
    color: "#6b7280",
    cursor: "pointer",
    fontSize: "0.95rem",
    padding: "8px",
  },

  errorBox: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    backgroundColor: "#fff1f2",
    border: "1px solid #fecdd3",
    borderLeft: "4px solid #dc2626",
    borderRadius: "8px",
    padding: "13px",
    marginBottom: "20px",
  },

  errorIcon: {
    color: "#dc2626",
    fontSize: "1.2rem",
    marginTop: "2px",
  },

  errorTitle: {
    display: "block",
    color: "#b91c1c",
    fontSize: "0.9rem",
    marginBottom: "3px",
  },

  errorText: {
    color: "#991b1b",
    fontSize: "0.82rem",
    lineHeight: 1.5,
    margin: 0,
  },

  tryAgain: {
    color: "#7f1d1d",
    fontSize: "0.78rem",
    margin: "5px 0 0 0",
  },

  loginButton: {
    width: "100%",
    height: "52px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#0c2340",
    color: "#ffffff",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: "0 6px 15px rgba(12,35,64,0.2)",
  },

  backButton: {
    marginTop: "18px",
    border: "none",
    background: "transparent",
    color: "#0c2340",
    fontSize: "0.88rem",
    fontWeight: 600,
    cursor: "pointer",
    alignSelf: "center",
  },

  footerText: {
    marginTop: "25px",
    paddingTop: "18px",
    borderTop: "1px solid #e5e7eb",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "0.75rem",
  },
};