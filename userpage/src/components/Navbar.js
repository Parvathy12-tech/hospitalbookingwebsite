import { NavLink} from "react-router-dom";
import { useState } from "react";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  

  const handleLogout = () => {
  localStorage.removeItem("token");   // important
  localStorage.removeItem("user");

  window.location.href = "/login";    // force refresh (fix back button issue)
};

  const styles = {
    nav: {
      background: "linear-gradient(135deg, #0d6efd, #0b5ed7)",
      padding: "12px 25px",
      position: "relative"
    },
    title: {
      color: "white",
      fontSize: "22px",
      fontWeight: "bold"
    },
    link: {
      marginLeft: "20px",
      color: "white",
      textDecoration: "none",
      fontSize: "16px"
    },
    active: {
      borderBottom: "2px solid white",
      paddingBottom: "2px"
    },
    menuIcon: {
      fontSize: "24px",
      color: "white",
      cursor: "pointer",
      marginLeft: "20px"
    },
    dropdown: {
      position: "absolute",
      top: "60px",
      right: "20px",
      backgroundColor: "#0d6efd",
      borderRadius: "8px",
      width: "150px",
      display: menuOpen ? "block" : "none",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
    },
    logoutItem: {
      padding: "10px",
      color: "white",
      cursor: "pointer",
      textAlign: "center"
    }
  };

  return (
    <div style={styles.nav} className="d-flex justify-content-between align-items-center">
      
      <NavLink to="/dashboard" style={{ ...styles.title, textDecoration: "none" }}>
  🏥 User
</NavLink>

      <div className="d-flex align-items-center">

        <NavLink 
          to="/dashboard" 
          style={({ isActive }) => 
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Home
        </NavLink>

        <NavLink 
          to="/doctorlist" 
          style={({ isActive }) => 
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Doctors
        </NavLink>

        <NavLink 
          to="/myappointments" 
          style={({ isActive }) => 
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Appointments
        </NavLink>

        <NavLink 
          to="/changepassword" 
          style={({ isActive }) => 
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Change Password
        </NavLink>

        {/* ☰ Hamburger */}
        <div 
          style={styles.menuIcon} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {/* Logout Dropdown */}
        <div style={styles.dropdown}>
          <div style={styles.logoutItem} onClick={handleLogout}>
            Logout
          </div>
        </div>

      </div>

    </div>
  );
}

export default Navbar;