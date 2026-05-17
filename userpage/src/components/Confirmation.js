import React from "react";
import { NavLink, useLocation, Navigate } from "react-router-dom";

function Confirmation() {
  const location = useLocation();
  const data = location.state;

  // protect page
  if (!data || !data.success) {
    return <Navigate to="/Dashboard" replace />;
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f4f6f9"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        width: "350px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ color: "green" }}>Booking Confirmed 🎉</h2>

        <p><b>Doctor:</b> {data.doctor}</p>
        <p><b>Date:</b> {data.date}</p>
        <p><b>Time:</b> {data.time}</p>

        <NavLink to="/Dashboard" className="btn btn-success w-100 mt-3">
          Go to Home
        </NavLink>

        <NavLink to="/MyAppointments" className="btn btn-warning w-100 mt-3">
          My Appointments
        </NavLink>
      </div>
    </div>
  );
}

export default Confirmation;