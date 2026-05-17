import Navbar from "../components/Navbar";
import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function DoctorProfile() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(1);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://127.0.0.1:8000/doctor_profile/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      })
      .then((res) => setDoctor(res.data));

    axios
      .get(`http://127.0.0.1:8000/doctor_feedback/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      })
      .then((res) => setFeedbacks(res.data));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .post(
        `http://127.0.0.1:8000/doctor_feedback/${id}/`,
        { message, rating },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then(() => {
        setMessage("");
        setRating(1);

        return axios.get(
          `http://127.0.0.1:8000/doctor_feedback/${id}/`,
          { headers: { Authorization: `Token ${token}` } }
        );
      })
      .then((res) => setFeedbacks(res.data));
  };

  if (!doctor) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  return (
    <>
      <Navbar />

      {/* 🌈 HEADER */}
      <div
        style={{
          background: "linear-gradient(to right, #0d6efd, #00c6ff)",
          color: "white",
          padding: "40px 0",
          textAlign: "center"
        }}
      >
        <h2>{doctor.name}</h2>
        <p>{doctor.field}</p>
      </div>

      <div className="container mt-5">

        {/* 🧑‍⚕️ DOCTOR INFO */}
        <div className="row g-4 align-items-center">
          <div className="col-md-4 text-center">
            <img
              src={`http://127.0.0.1:8000${doctor.image}`}
              alt="doctor"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "5px solid #0d6efd",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
              }}
            />
          </div>

          <div className="col-md-8">
            <div className="card p-4 shadow-lg border-0">
              <h4>{doctor.name}</h4>
              <p className="text-muted">{doctor.field}</p>

              <p><strong>Experience:</strong> {doctor.experience}</p>
              <p><strong>Qualification:</strong> {doctor.qualification}</p>

              <NavLink
                to={`/bookappointment/${id}`}
                className="btn btn-primary mt-3"
              >
                Book Appointment
              </NavLink>
            </div>
          </div>
        </div>

        {/* ✍️ FEEDBACK FORM */}
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <div className="card shadow-lg p-4 border-0">
              <h5 className="text-center mb-3">Leave a Review</h5>

              <form onSubmit={handleSubmit}>
                <textarea
                  className="form-control mb-3"
                  placeholder="Share your experience..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />

                {/* ⭐ STAR SELECT */}
                <div className="mb-3 text-center">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span
                      key={num}
                      style={{
                        fontSize: "25px",
                        cursor: "pointer",
                        color: num <= rating ? "gold" : "gray"
                      }}
                      onClick={() => setRating(num)}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <button className="btn btn-success w-100">
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 💬 REVIEWS */}
        <div className="row justify-content-center mt-5">
          <div className="col-md-8">
            <h4 className="mb-4">Patient Reviews</h4>

            {feedbacks.length === 0 ? (
              <p className="text-muted">No reviews yet</p>
            ) : (
              feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="card mb-3 shadow-sm border-0 p-3"
                  style={{
                    borderLeft: "5px solid #0d6efd"
                  }}
                >
                  <div className="d-flex justify-content-between">
                    <strong>{fb.user_name}</strong>
                    <small className="text-muted">
                      {new Date(fb.created_at).toLocaleDateString()}
                    </small>
                  </div>

                  <div style={{ color: "gold" }}>
                    {"★".repeat(fb.rating)}
                  </div>

                  <p className="mt-2 mb-0">{fb.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </>
  );
}

export default DoctorProfile;