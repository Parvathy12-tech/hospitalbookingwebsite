import Navbar from "../components/Navbar";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleUpdate = () => {
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/update_password/",
        {
          current_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        setSuccess(res.data.message || "Password updated successfully");

        // logout
        localStorage.removeItem("token");

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // redirect after 2 sec
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Failed to update password"
        );
      });
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <div
          className="card shadow-lg border-0"
          style={{
            maxWidth: "420px",
            margin: "80px auto",
            padding: "30px",
            borderRadius: "20px",
          }}
        >
          <h3 className="text-center mb-4 fw-bold">
            🔐 Change Password
          </h3>

          {/* ERROR */}
          {error && (
            <div className="alert alert-danger py-2">{error}</div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="alert alert-success py-2">{success}</div>
          )}

          {/* OLD PASSWORD */}
          <div className="mb-3 position-relative">
            <input
              type={showOld ? "text" : "password"}
              className="form-control"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <span
              onClick={() => setShowOld(!showOld)}
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                cursor: "pointer"
              }}
            >
              {showOld ? "🙈" : "👁️"}
            </span>
          </div>

          {/* NEW PASSWORD */}
          <div className="mb-3 position-relative">
            <input
              type={showNew ? "text" : "password"}
              className="form-control"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              onClick={() => setShowNew(!showNew)}
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                cursor: "pointer"
              }}
            >
              {showNew ? "🙈" : "👁️"}
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-3 position-relative">
            <input
              type={showConfirm ? "text" : "password"}
              className="form-control"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: "absolute",
                right: "10px",
                top: "8px",
                cursor: "pointer"
              }}
            >
              {showConfirm ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            className="btn btn-primary w-100 fw-bold"
            style={{
              borderRadius: "10px",
              padding: "10px",
            }}
            onClick={handleUpdate}
          >
            Update Password
          </button>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;