import Navbar from "../components/Navbar";
import { NavLink } from "react-router-dom";

function Dashboard() {
  const cards = [
    {
      title: "Doctors",
      description: "Browse and book appointments with trusted doctors.",
      icon: "👨‍⚕️",
      buttonText: "View Doctors",
      link: "/Doctorlist",
    },
    {
      title: "Appointments",
      description: "Check and manage all your bookings easily.",
      icon: "📅",
      buttonText: "My Appointments",
      link: "/MyAppointments",
    },
    {
      title: "Password",
      description: "Keep your account safe by updating password.",
      icon: "🔒",
      buttonText: "Change Password",
      link: "/Changepassword",
    },
  ];

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e0f2fe, #ffffff, #dbeafe)",
          padding: "40px 0",
        }}
      >
        <div className="container">
          {/* Hero Section */}
          <div
            className="shadow-lg mb-5"
            style={{
              background: "linear-gradient(90deg, #2563eb, #06b6d4)",
              borderRadius: "20px",
              padding: "40px",
              color: "white",
            }}
          >
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Your Health, Our Priority 🏥
                </h1>
                <p style={{ fontSize: "18px", marginBottom: "20px" }}>
                  Book appointments, connect with doctors, and manage your
                  health records easily.
                </p>
                <NavLink
                  to="/Doctorlist"
                  className="btn btn-light px-4 py-2"
                >
                  Book Now
                </NavLink>
              </div>
              <div className="col-md-4 text-center">
                <div style={{ fontSize: "80px" }}>🩺</div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div
                className="card shadow border-0 text-center p-4"
                style={{ borderRadius: "20px" }}
              >
                <h2>25+</h2>
                <p>Expert Doctors</p>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card shadow border-0 text-center p-4"
                style={{ borderRadius: "20px" }}
              >
                <h2>120+</h2>
                <p>Appointments</p>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card shadow border-0 text-center p-4"
                style={{ borderRadius: "20px" }}
              >
                <h2>100%</h2>
                <p>Secure Access</p>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div
            className="shadow-lg mb-5"
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
            }}
          >
            <h2 style={{ fontWeight: "bold" }}>Welcome back 👋</h2>
            <p style={{ color: "gray", marginBottom: 0 }}>
              Manage your healthcare services and appointments easily.
            </p>
          </div>

          {/* Cards Section */}
          <div className="row g-4">
            {cards.map((card, index) => (
              <div className="col-md-4" key={index}>
                <div
                  className="card shadow h-100 border-0"
                  style={{
                    borderRadius: "20px",
                    padding: "30px",
                    transition: "0.3s",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div style={{ fontSize: "50px", marginBottom: "15px" }}>
                    {card.icon}
                  </div>

                  <h4 style={{ fontWeight: "bold" }}>{card.title}</h4>
                  <p style={{ color: "gray" }}>{card.description}</p>

                  <NavLink
                    to={card.link}
                    className="btn btn-primary w-100 mt-3"
                    style={{
                      borderRadius: "12px",
                      padding: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {card.buttonText}
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
{/* Footer */}
{/* Footer */}
<footer
  style={{
    marginTop: "40px",
    background: "#1e293b",
    color: "white",
    borderRadius: "16px 16px 0 0",
    padding: "18px 24px",
  }}
>
  <div className="container">
    <div className="row justify-content-center text-center align-items-center">

      {/* Column 1 */}
      <div className="col-md-3 mb-2 mb-md-0">
        <h6 style={{ marginBottom: "4px", fontWeight: "bold" }}>
          🏥 MediCare
        </h6>
        <small style={{ color: "#cbd5e1" }}>
          Trusted healthcare services
        </small>
      </div>

      {/* Column 2 */}
      <div className="col-md-3 mb-2 mb-md-0">
        <small style={{ color: "#94a3b8" }}>
          📍 Pallitottam, Kerala
        </small>
      </div>

      {/* Column 3 */}
      <div className="col-md-3">
        <small style={{ color: "#cbd5e1" }}>
          © 2026 All rights reserved
        </small>
      </div>

    </div>
  </div>
</footer>
      </div>
    </>
  );
}

export default Dashboard;