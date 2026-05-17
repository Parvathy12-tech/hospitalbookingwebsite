import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctorName, setDoctorName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://127.0.0.1:8000/doctors_list/", {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      .then((response) => {
        const selectedDoctor = response.data.find(
          (doctor) => doctor.id === parseInt(id)
        );

        if (selectedDoctor) {
          setDoctorName(selectedDoctor.name);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleBooking = () => {
    const token = localStorage.getItem("token");

    // Basic validation
    if (!appointmentDate || !timeSlot) {
      alert("Please select date and time");
      return;
    }

    // Prevent past date booking
    const today = new Date().toISOString().split("T")[0];

    if (appointmentDate < today) {
      alert("Past date appointment booking is not allowed");
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/book_appointment/",
        {
          doctors_id: parseInt(id),
          appointment_date: appointmentDate,
          time_slot: timeSlot
        },
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      )
      .then(() => {
        alert("Appointment booked successfully");

        navigate("/confirmation", {
          state: {
            success: true,
            doctor: doctorName,
            date: appointmentDate,
            time: timeSlot
          }
        });
      })
      .catch((error) => {
        console.log(error.response?.data);
        alert(error.response?.data?.message || "Booking failed");
      });
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <div
          className="card shadow p-4 mt-5"
          style={{ maxWidth: "500px", margin: "auto" }}
        >
          <h3 className="text-center">Book Appointment</h3>

          <p><b>Doctor Name:</b> {doctorName}</p>

          <label>Date</label>
          <input
            type="date"
            className="form-control mb-3"
            min={new Date().toISOString().split("T")[0]}
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />

          <label>Time</label>
          <input
            type="time"
            className="form-control mb-3"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
          />

          <button
            className="btn btn-success w-100"
            onClick={handleBooking}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </>
  );
}

export default BookAppointment;