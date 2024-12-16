import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import routes from "./routes/index";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { NavigationSidebarDashboard } from "./components/navigation/navigation-sidebar-dashboard";
import ProtectedRoutes from "./pages/Auth/ProtectedRoutes";
import UnprotectedRoutes from "./pages/Auth/UnprotectedRoutes";
import NavigationTopDashboard from "./components/navigation/navigation-top-dashboard";
import useAuth from "./hooks/useAuth";
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

function App() {
  // const { role } = useAuth();
  // console.log("role: ", role);
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
          </Route>

          {/* PROTECTED ROUTES */}
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
            </Route>
          </Route>
          <Route path="*" element={<p>Page Not Found</p>} />
        </Route>
      </Routes>
    </>

    // <div>
    //   <Toaster richColors position="top-right" />
    //   <Router>
    //     <Routes>
    //       {routes.map((route, index) => {
    //         return role === "Superadmin" ? (
    //           <Route
    //             key={index}
    //             path={route.path}
    //             element={
    //               <ProtectedRoutes>
    //                 <SidebarProvider>
    //                   <NavigationSidebarDashboard />
    //                   <SidebarInset className="flex w-full border bg-neutral-50">
    //                     <NavigationTopDashboard />
    //                     <div className="flex justify-center w-full ">
    //                       <div className="w-full mx-6  mt-12 max-w-[1400px]">
    //                         <route.component />
    //                       </div>
    //                     </div>
    //                   </SidebarInset>
    //                 </SidebarProvider>
    //               </ProtectedRoutes>
    //             }
    //           />
    //         ) : (
    //           <Route
    //             key={index}
    //             path={route.path}
    //             element={
    //               <UnprotectedRoutes>
    //                 {!route.isAdminPage ? <Header /> : ""}
    //                 <route.component />
    //                 {!route.isAdminPage ? <Footer /> : ""}
    //               </UnprotectedRoutes>
    //             }
    //           />
    //         );
    //       })}
    //     </Routes>
    //   </Router>
    // </div>
  );
}

export default App;
