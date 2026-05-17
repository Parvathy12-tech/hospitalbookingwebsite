import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://127.0.0.1:8000/doctors_list/", {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // ✅ Get unique specializations
  const specializations = [
    ...new Set(doctors.map((doc) => doc.field))
  ];

  // ✅ Filter logic
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "" || doctor.field === filter;

    return matchesSearch && matchesFilter;
  });

  // ✅ Clear filters
  const clearFilters = () => {
    setSearch("");
    setFilter("");
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h2 className="text-center mb-4">Our Doctors</h2>

        {/* 🔍 SEARCH + FILTER + CLEAR */}
        <div className="row mb-4">
          {/* SEARCH */}
          <div className="col-md-4 mb-2">
            <input
              type="text"
              placeholder="🔍 Search doctor..."
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* FILTER */}
          <div className="col-md-4 mb-2">
            <select
              className="form-control"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Specializations</option>
              {specializations.map((field, index) => (
                <option key={index} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>

          {/* CLEAR BUTTON */}
          <div className="col-md-4 mb-2">
            <button
              className="btn btn-secondary w-100"
              onClick={clearFilters}
              disabled={!search && !filter}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* DOCTOR LIST */}
        <div className="row g-4">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div className="col-md-4 col-sm-6" key={doctor.id}>
                <div className="card shadow p-3 text-center">

                  <img
                    src={`http://127.0.0.1:8000${doctor.image}`}
                    alt={doctor.name}
                    style={{
                      height: "150px",
                      width: "150px",
                      borderRadius: "50%",
                      margin: "auto"
                    }}
                  />

                  <h5 className="mt-3">{doctor.name}</h5>
                  <p>{doctor.field}</p>

                  {/* VIEW PROFILE */}
                  <NavLink
                    to={`/doctor_profile/${doctor.id}`}
                    className="btn btn-primary w-100 mt-2"
                  >
                    View Profile
                  </NavLink>

                  {/* BOOK APPOINTMENT */}
                  <NavLink
                    to={`/bookappointment/${doctor.id}`}
                    state={{ doctorName: doctor.name }}
                    className="btn btn-success w-100 mt-2"
                  >
                    Book Appointment
                  </NavLink>

                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-danger">
              No doctors found 😔
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default DoctorList;