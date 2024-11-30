import Homepage from "@/pages/Home";
import SignUp from "@/pages/SignUp/index";
import LogIn from "@/pages/LogIn/index";
import DashboardAdmin from "@/pages/DashboardAdmin";
import Dentists from "@/pages/DashboardAdmin/Dentist";
import Services from "@/pages/DashboardAdmin/Service";
import AddNewService from "@/pages/DashboardAdmin/Service/AddNewService";
import EditService from "@/pages/DashboardAdmin/Service/EditService";

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
  {
    path: "/dashboardadmin/dentist",
    component: Dentists,
    isAuthenticated: true,
  },
  {
    path: "/dashboardadmin/service",
    component: Services,
    isAuthenticated: true,
  },
  {
    path: "/dashboardadmin/service/new",
    component: AddNewService,
    isAuthenticated: true,
  },
  {
    path: "/dashboardadmin/service/:serviceId",
    component: EditService,
    isAuthenticated: true,
  },
];

export default routes;
