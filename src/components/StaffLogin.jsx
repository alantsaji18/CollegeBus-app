import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StaffLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");
    setLoading(false);

    const enteredUsername = username.trim();
    const enteredPassword = password;

    /* =====================================================
        1. CHECK EMPTY FIELDS
    ===================================================== */

    if (!enteredUsername && !enteredPassword) {
      setError(
        "Please enter both staff ID/username and password."
      );
      return;
    }

    if (!enteredUsername) {
      setError(
        "Staff ID is required. Please enter your staff username or ID."
      );
      return;
    }

    if (!enteredPassword) {
      setError(
        "Password is required. Please enter your password."
      );
      return;
    }

    /* =====================================================
        2. GET STAFF CREATED BY ADMIN
    ===================================================== */

    let staffMembers = [];

    try {
      const savedStaff =
        localStorage.getItem("staff");

      if (savedStaff) {
        staffMembers = JSON.parse(savedStaff);
      }
    } catch (error) {
      console.error(
        "Unable to read staff records:",
        error
      );

      setError(
        "Login failed: Staff records could not be loaded. Please try again."
      );

      return;
    }

    /* =====================================================
        3. CHECK WHETHER STAFF RECORDS EXIST
    ===================================================== */

    if (!Array.isArray(staffMembers) || staffMembers.length === 0) {
      setError(
        "Login failed: No staff account is available. Please contact the administrator."
      );
      return;
    }

    /* =====================================================
        4. FIND STAFF BY USERNAME / STAFF ID
    ===================================================== */

    const staff = staffMembers.find((item) => {
      const storedUsername =
        item.username ??
        item.userName ??
        item.Username ??
        item.staffId ??
        item.staffID ??
        item.id ??
        "";

      return (
        String(storedUsername).trim().toLowerCase() ===
        enteredUsername.toLowerCase()
      );
    });

    /* =====================================================
        5. USERNAME DOES NOT EXIST
    ===================================================== */

    if (!staff) {
      setError(
        "Login failed: The staff username/ID you entered does not exist in the records. Please check and try again."
      );
      return;
    }

    /* =====================================================
        6. GET STORED PASSWORD
    ===================================================== */

    const storedPassword =
      staff.password ??
      staff.Password ??
      "";

    /* =====================================================
        7. CHECK PASSWORD
    ===================================================== */

    if (
      String(storedPassword) !==
      enteredPassword
    ) {
      setError(
        "Login failed: Incorrect password for this staff account. Please check your password and try again."
      );
      return;
    }

    /* =====================================================
        8. LOGIN SUCCESSFUL
    ===================================================== */

    setLoading(true);

    /* =====================================================
        9. SAVE LOGIN SESSION
    ===================================================== */

    sessionStorage.setItem(
      "staffLoggedIn",
      "true"
    );

    sessionStorage.setItem(
      "staffUsername",
      enteredUsername
    );

    sessionStorage.setItem(
      "loggedInStaff",
      JSON.stringify(staff)
    );

    /* =====================================================
        10. GO TO STAFF DASHBOARD
    ===================================================== */

    setTimeout(() => {
      navigate("/staffdashboard");
    }, 500);
  };

  return (
    <div style={styles.page}>

      {/* Background decoration */}
      <div style={styles.circleOne}></div>
      <div style={styles.circleTwo}></div>

      <div style={styles.loginContainer}>

        {/* =================================================
            LEFT SECTION
        ================================================= */}

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
            Staff transportation portal for
            managing schedules, tracking buses,
            and viewing route assignments.
          </p>

          <div style={styles.securityInfo}>
            <i className="fas fa-chalkboard-teacher"></i>

            <span>
              Authorized Staff Access
            </span>
          </div>

        </div>

        {/* =================================================
            RIGHT SECTION
        ================================================= */}

        <div style={styles.rightSection}>

          <div style={styles.adminIcon}>
            <i className="fas fa-chalkboard-teacher"></i>
          </div>

          <h2 style={styles.loginTitle}>
            Staff Login
          </h2>

          <p style={styles.loginSubtitle}>
            Sign in to access your staff
            transportation portal
          </p>

          <form
            onSubmit={handleLogin}
            style={styles.form}
          >

            {/* USERNAME / STAFF ID */}

            <div style={styles.inputGroup}>

              <label style={styles.label}>
                Staff ID / Username
              </label>

              <div style={styles.inputWrapper}>

                <i
                  className="fas fa-user"
                  style={styles.inputIcon}
                ></i>

                <input
                  type="text"
                  placeholder="Enter staff username or ID"
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

            {/* PASSWORD */}

            <div style={styles.inputGroup}>

              <label style={styles.label}>
                Password
              </label>

              <div style={styles.inputWrapper}>

                <i
                  className="fas fa-lock"
                  style={styles.inputIcon}
                ></i>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
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
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
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

            {/* ERROR MESSAGE */}

            {error && (
              <div style={styles.errorBox}>

                <div style={styles.errorIcon}>
                  <i className="fas fa-exclamation-circle"></i>
                </div>

                <div>

                  <strong style={styles.errorTitle}>
                    Login Failed
                  </strong>

                  <p style={styles.errorText}>
                    {error}
                  </p>

                  <p style={styles.tryAgain}>
                    Please check your credentials
                    and try again.
                  </p>

                </div>

              </div>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              style={{
                ...styles.loginButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
              disabled={loading}
            >

              {loading ? (
                <>
                  <i
                    className="fas fa-spinner fa-spin"
                    style={{
                      marginRight: "8px",
                    }}
                  ></i>

                  Signing In...
                </>
              ) : (
                <>
                  <i
                    className="fas fa-sign-in-alt"
                    style={{
                      marginRight: "8px",
                    }}
                  ></i>

                  Login to Staff Portal
                </>
              )}

            </button>

          </form>

          {/* BACK TO HOME */}

          <button
            onClick={() => navigate("/")}
            style={styles.backButton}
          >

            <i
              className="fas fa-arrow-left"
              style={{
                marginRight: "7px",
              }}
            ></i>

            Back to Home

          </button>

          <div style={styles.footerText}>

            <i
              className="fas fa-lock"
              style={{
                marginRight: "6px",
              }}
            ></i>

            Secure Staff Login

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
    fontFamily:
      "'Inter', 'Segoe UI', Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  circleOne: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    border:
      "80px solid rgba(255,193,7,0.05)",
    top: "-250px",
    right: "-150px",
  },

  circleTwo: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    border:
      "70px solid rgba(255,193,7,0.04)",
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
    boxShadow:
      "0 25px 70px rgba(0,0,0,0.35)",
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
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.25)",
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
    borderLeft:
      "4px solid #dc2626",
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
    transition: "0.2s",
    boxShadow:
      "0 6px 15px rgba(12,35,64,0.2)",
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
    borderTop:
      "1px solid #e5e7eb",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "0.75rem",
  },
};