import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // 🔥 FETCH FROM DB
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/my_appointments/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        console.log("Appointments:", res.data);
        setAppointments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response?.data);
        setLoading(false);
      });
  }, []);

  // 🔥 TODAY DATE
  const today = new Date().toISOString().split("T")[0];

  // 🔥 SPLIT DATA (safe date compare)
  const upcoming = appointments.filter(
    (a) => new Date(a.appointment_date) >= new Date(today)
  );

  const past = appointments.filter(
    (a) => new Date(a.appointment_date) < new Date(today)
  );

  // 🔥 CANCEL (safe check added)
  const cancelAppointment = (id) => {
    if (!id) {
      alert("Cannot cancel: appointment id missing from backend");
      return;
    }

    axios
      .post(
        `http://127.0.0.1:8000/cancel_appointment/${id}/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then(() => {
        alert("Cancelled successfully");

        setAppointments((prev) =>
          prev.filter((item) => item.id !== id)
        );
      })
      .catch((err) => {
        console.log("Cancel error:", err.response?.data);
      });
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h3 className="text-center mb-4">My Appointments</h3>

        {loading && <p className="text-center">Loading...</p>}

        {/* 🟢 UPCOMING */}
        {!loading && (
          <>
            <h5 className="mb-3">Upcoming Appointments</h5>

            {upcoming.length === 0 && (
              <p>No upcoming appointments</p>
            )}

            {upcoming.map((item, index) => (
              <div key={index} className="card shadow mb-3 p-3">
                <h5>{item.doctor_name}</h5>
                <p>Date: {item.appointment_date}</p>
                <p>Time: {item.time_slot}</p>

                {/* 🔥 Safe cancel button */}
                {item.id ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => cancelAppointment(item.id)}
                  >
                    Cancel
                  </button>
                ) : (
                  <span className="text-danger">
                    Cannot cancel (missing id)
                  </span>
                )}
              </div>
            ))}
          </>
        )}

        {/* 🔵 PAST */}
        {!loading && (
          <>
            <h5 className="mt-4 mb-3">Past Appointments</h5>

            {past.length === 0 && <p>No past appointments</p>}

            {past.map((item, index) => (
              <div key={index} className="card shadow mb-3 p-3">
                <h5>{item.doctor_name}</h5>
                <p>Date: {item.appointment_date}</p>
                <p>Time: {item.time_slot}</p>

                <span className="badge bg-secondary">
                  Completed
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default MyAppointments;