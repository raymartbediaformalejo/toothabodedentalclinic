import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Homepage from "./pages/Home";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Layout from "./components/Layout";
import RequireAuth from "./pages/Auth/RequireAuth";
import { ROLES } from "./lib/variables";
import DashboardLayout from "./components/DashboardLayout";
import DashboardAdmin from "./pages/DashboardAdmin";
import Dentists from "./pages/DashboardAdmin/Dentist";
import AddNewDentist from "./pages/DashboardAdmin/Dentist/AddNewDentist";
import EditDentist from "./pages/DashboardAdmin/Dentist/EditDentist";
import Services from "./pages/DashboardAdmin/Service";
import AddNewService from "./pages/DashboardAdmin/Service/AddNewService";
import EditService from "./pages/DashboardAdmin/Service/EditService";
import Appointment from "./pages/Appointment";
import Calendar from "./pages/DashboardAdmin/Calendar";
import EmailVerification from "./pages/Auth/EmailVerification";
import NoShowRestricted from "./pages/Auth/NoShowRestricted";
import MyAccount from "./pages/MyAccount";
import MyAppoinment from "./pages/MyAppointment";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/">
          {/* PUBLIC ROUTES */}
          <Route element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="login" element={<LogIn />} />
            <Route path="verify-email" element={<EmailVerification />} />
            <Route path="no-show-restricted" element={<NoShowRestricted />} />
          </Route>

          {/* PROTECTED ROUTES */}
          <Route
            element={
              <RequireAuth
                allowedRoles={[ROLES.Patient, ROLES.Dentist, ROLES.Admin]}
              />
            }
          >
            <Route element={<Layout />}>
              <Route path="appointment" element={<Appointment />} />
              <Route path="my-account" element={<MyAccount />} />
              <Route path="my-appointment" element={<MyAppoinment />} />
            </Route>
          </Route>

          <Route
            element={
              <RequireAuth allowedRoles={[ROLES.Admin, ROLES.Dentist]} />
            }
          >
            <Route path="admin" element={<DashboardLayout />}>
              <Route index element={<DashboardAdmin />} />
              <Route path="dentists">
                <Route index element={<Dentists />} />
                <Route path="add_new_dentist" element={<AddNewDentist />} />
                <Route path=":id" element={<EditDentist />} />
              </Route>
              <Route path="services">
                <Route index element={<Services />} />
                <Route path="add_new_service" element={<AddNewService />} />
                <Route path=":id" element={<EditService />} />
              </Route>
              <Route path="calendar" element={<Calendar />} />
            </Route>
          </Route>
          <Route path="*" element={<p>Page Not Found</p>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
