import Homepage from "@/pages/Home";
import SignUp from "@/pages/SignUp/index";
import LogIn from "@/pages/LogIn/index";
import DashboardAdmin from "@/pages/DashboardAdmin";
import Dentists from "@/pages/DashboardAdmin/Dentist";
import Services from "@/pages/DashboardAdmin/Service";
import AddNewService from "@/pages/DashboardAdmin/Service/AddNewService";
import EditService from "@/pages/DashboardAdmin/Service/EditService";
import AddNewDentist from "@/pages/DashboardAdmin/Dentist/AddNewDentist";
import EditDentist from "@/pages/DashboardAdmin/Dentist/EditDentist";

type TRoute = {
  path: string;
  component: React.ComponentType;
  authorizedRole: string[];
};

const routes: TRoute[] = [
  {
    path: "/",
    component: Homepage,
    authorizedRole: ["Patient", "Dentist", "Admin", "Superadmin"],
  },
  {
    path: "/signup",
    component: SignUp,
    authorizedRole: ["Patient", "Dentist", "Admin", "Superadmin"],
  },
  {
    path: "/login",
    component: LogIn,
    authorizedRole: ["Patient", "Dentist", "Admin", "Superadmin"],
  },

  // DASHBOARD ADMIN
  {
    path: "/superadmin",
    component: DashboardAdmin,
    authorizedRole: ["Superadmin"],
  },
  // DASHBOARD SERVICE
  {
    path: "/superadmin/services",
    component: Services,
    authorizedRole: ["Superadmin"],
  },
  {
    path: "/superadmin/services/add_new_service",
    component: AddNewService,
    authorizedRole: ["Superadmin"],
  },
  {
    path: "/superadmin/services/:id",
    component: EditService,
    authorizedRole: ["Superadmin"],
  },

  // DASHBOARD DENTIST
  {
    path: "/superadmin/dentists",
    component: Dentists,
    authorizedRole: ["Superadmin"],
  },
  {
    path: "/superadmin/dentists/add_new_dentist",
    component: AddNewDentist,
    authorizedRole: ["Superadmin"],
  },
  {
    path: "/superadmin/dentists/:id",
    component: EditDentist,
    authorizedRole: ["Superadmin"],
  },
];

export default routes;
