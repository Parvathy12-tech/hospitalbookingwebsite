import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function loginUser() {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("All fields are required");
      return;
    }

    const user = {
      email: email,
      password: password,
    };

    setLoading(true);

    axios
      .post("http://127.0.0.1:8000/login/", user)
      .then((response) => {
        setLoading(false);

        // Save token
        localStorage.setItem("token", response.data.token);

        alert("Login Successful ✅");

        navigate("/dashboard");
      })
      .catch(() => {
        setLoading(false);
        setErrorMessage("Invalid email or password");
      });
  }

  return (
    <>
      

      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Login</h2>
          <p style={styles.subtitle}>Hospital Booking System</p>

          {errorMessage && (
            <p style={{ color: "red", textAlign: "center" }}>
              {errorMessage}
            </p>
          )}

          <div style={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            style={styles.button}
            onClick={loginUser}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={styles.footer}>
            Don’t have an account?{" "}
            <span
              style={styles.link}
              onClick={() => navigate("/")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(to right, #e3f2fd, #f4f6f9)",
    padding: "20px",
  },
  card: {
    width: "400px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "5px",
    textAlign: "center",
    color: "#2c3e50",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#7f8c8d",
    fontSize: "14px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
  footer: {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "#3498db",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;