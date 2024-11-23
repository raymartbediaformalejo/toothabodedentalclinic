import Homepage from "@/pages/Home";
import SignUp from "@/pages/SignUp/index";
import LogIn from "@/pages/LogIn/index";

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
];

export default routes;
