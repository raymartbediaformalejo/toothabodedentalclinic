import Homepage from "@/pages/Home";
import SignUp from "@/pages/SignUp/index";
import LogIn from "@/pages/LogIn/index";
import DashboardAdmin from "@/pages/DashboardAdmin";
import Dentists from "@/pages/DashboardAdmin/Dentist";
import Services from "@/pages/DashboardAdmin/Service";
import AddNewService from "@/pages/DashboardAdmin/Service/AddNewService";
import EditService from "@/pages/DashboardAdmin/Service/EditService";
import AddNewDentist from "@/pages/DashboardAdmin/Dentist/AddNewDentist";

type TRoute = {
  path: string;
  component: React.ComponentType;
  isAuthenticated: boolean;
  isAdminPage?: boolean;
};

const routes: TRoute[] = [
  {
    path: "/",
    component: Homepage,
    isAuthenticated: false,
  },
  {
    path: "/sign-up",
    component: SignUp,
    isAuthenticated: false,
  },
  {
    path: "/log-in",
    component: LogIn,
    isAuthenticated: false,
  },

  // DASHBOARD ADMIN
  {
    path: "/dashboardadmin",
    component: DashboardAdmin,
    isAuthenticated: true,
  },
  // DASHBOARD SERVICE
  {
    path: "/services",
    component: Services,
    isAuthenticated: true,
  },
  {
    path: "/services/add_new_service",
    component: AddNewService,
    isAuthenticated: true,
  },
  {
    path: "/services/:id",
    component: EditService,
    isAuthenticated: true,
  },

  // DASHBOARD DENTIST
  {
    path: "/dentists",
    component: Dentists,
    isAuthenticated: true,
  },
  {
    path: "/dentists/add_new_dentist",
    component: AddNewDentist,
    isAuthenticated: true,
  },
  {
    path: "/dentists/:id",
    component: EditService,
    isAuthenticated: true,
  },
];

export default routes;
