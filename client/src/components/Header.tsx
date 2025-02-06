import { useLocation, Link } from "react-router-dom";
import logo from "@/assets/toothabodelogo.png";
import MobileToggle from "./mobile-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { NavigationPatientAccount } from "./navigation/navigation-patient-account";
import { Button } from "./ui/button";

const Header = () => {
  const { userId } = useAuth();
  const location = useLocation();

  console.log("userId: ", userId);

  // Function to check if the link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className=" flex items-center justify-center px-4 py-3 border-b border-b-primary-700/10 bg-primary-50">
      <div className="flex items-center justify-between w-full max-w-[1163px] ">
        <Link to="/" className="flex items-center gap-1">
          <img
            className="h-[50px]"
            src={logo}
            alt="Tooth Abode Dental Clinic logo"
          />
          <div className="flex flex-col font-bold text-primary-700 leading-[15px]">
            <span>Tooth Abode</span> <span>Dental Clinic</span>
          </div>
        </Link>
        <div className="md:hidden">
          <MobileToggle />
        </div>

        <NavigationMenu className=" hidden md:block">
          <NavigationMenuList>
            {[
              { name: "Home", path: "/" },
              { name: "About Us", path: "/about-us" },
              { name: "All Services", path: "/all-services" },
              { name: "FAQ's", path: "/faqs" },
              { name: "Contact Us", path: "/contact-us" },
            ].map(({ name, path }) => (
              <NavigationMenuItem key={path}>
                <Link to={path}>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive(path) && "bg-primary-700/10 text-primary-950"
                    )}
                  >
                    {name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="hidden md:block">
          {!userId ? (
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="signup">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <NavigationPatientAccount userId={userId} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
