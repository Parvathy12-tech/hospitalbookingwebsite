import { createBrowserRouter } from "react-router-dom";

import Register from "./Register";
import Login from "./Login";
import Doctorlist from "./Doctorlist";
import MyAppointments from "./MyAppointments";
import BookAppointment from "./BookAppointment";
import ChangePassword from "./Changepassword";
import Dashboard from "./Dashboard";
import Confirmation from "./Confirmation";
import DoctorProfile from "./DoctorProfile";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  { path: "/", element: <Register /> },
  { path: "/login", element: <Login /> },

  // 🔐 Protected Routes Wrapper
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/doctorlist", element: <Doctorlist /> },
      { path: "/bookappointment/:id", element: <BookAppointment /> },
      { path: "/myappointments", element: <MyAppointments /> },
      { path: "/changepassword", element: <ChangePassword /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/confirmation", element: <Confirmation /> },
      { path: "/doctor_profile/:id", element: <DoctorProfile /> },
    ],
  },
]);

export default router;