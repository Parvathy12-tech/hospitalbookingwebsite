function Footer() {
  return (
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

          <div className="col-md-3 mb-2 mb-md-0">
            <h6 style={{ marginBottom: "4px", fontWeight: "bold" }}>
              🏥 MediCare
            </h6>
            <small style={{ color: "#cbd5e1" }}>
              Trusted healthcare services
            </small>
          </div>

          <div className="col-md-3 mb-2 mb-md-0">
            <small style={{ color: "#94a3b8" }}>
              📍 Pallitottam, Kerala
            </small>
          </div>

          <div className="col-md-3">
            <small style={{ color: "#cbd5e1" }}>
              © 2026 All rights reserved
            </small>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;