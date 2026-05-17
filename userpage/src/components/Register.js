import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
/*import Navbar from "./Navbar"; */

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function registerUser() {
    setErrorMessage("");

    if (
      !name ||
      !email ||
      !dob ||
      !gender ||
      !address ||
      !phone ||
      !password ||
      !passwordConf
    ) {
      setErrorMessage("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setErrorMessage("Invalid email");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    if (password !== passwordConf) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const user = {
      name: name,
      email: email,
      dob: dob,
      gender: gender,
      address: address,
      phone: phone,
      password: password,
    };

    setLoading(true);

    axios
      .post("http://127.0.0.1:8000/signup/", user)
      .then(() => {
        setLoading(false);
        alert("Registration Successful ✅");
        navigate("/login");
      })
      .catch(() => {
        setLoading(false);
        setErrorMessage("Registration failed");
      });
  }

  return (
    <>
    
      

      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Hospital Booking System</p>

          {errorMessage && (
            <p style={{ color: "red", textAlign: "center" }}>
              {errorMessage}
            </p>
          )}

          <div style={styles.inputGroup}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label>Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label>Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label>Address</label>
            <textarea
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={passwordConf}
              onChange={(e) => setPasswordConf(e.target.value)}
            />
          </div>

          <button
            style={styles.button}
            onClick={registerUser}
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>

          <p style={styles.footer}>
            Already have an account?{" "}
            <span
              style={styles.link}
              onClick={() => navigate("/login")}
            >
              Login
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
    width: "420px",
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
  row: {
    display: "flex",
    gap: "10px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
    flex: 1,
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

export default Register;