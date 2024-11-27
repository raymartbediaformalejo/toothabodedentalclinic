import Homepage from "@/pages/Home";
import SignUp from "@/pages/SignUp/index";
import LogIn from "@/pages/LogIn/index";
import DashboardAdmin from "@/pages/DashboardAdmin";
import Dentists from "@/pages/DashboardAdmin/Dentist";

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
    path: "/dashboardadmin/dentists",
    component: Dentists,
    isAuthenticated: true,
  },
];

export default routes;
