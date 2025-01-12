import logo from "@/assets/toothabodelogo.png";
import MobileToggle from "./mobile-toggle";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-b-primary-700/10 bg-primary-50">
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
      <MobileToggle />
    </header>
  );
};

export default Header;
