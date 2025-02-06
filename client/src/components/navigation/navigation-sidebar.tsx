import { Link, useNavigate } from "react-router-dom";

import { LuHome, LuContact } from "react-icons/lu";
import { RiArticleLine, RiServiceLine } from "react-icons/ri";
import { BsQuestionCircle } from "react-icons/bs";
import { SheetClose } from "../ui/sheet";
import { Button } from "../ui/button";
import useAuth from "@/hooks/useAuth";
import { useLogout } from "@/service/mutation";
import { Separator } from "../ui/separator";

const NavigationSidebar = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const logout = useLogout();
  const handleLogout = () => {
    logout.mutate();
  };
  return (
    <div className="mt-12 ">
      <div className="flex flex-col gap-2">
        <SheetClose asChild onClick={() => navigate("/")}>
          <div className="flex gap-3 py-3 select-none group">
            <LuHome className="w-7 h-7 transition-[color] duration-200 text-neutral-600 group-hover:text-white" />
            <span className="text-lg transition-[color] duration-200 tracking-wide uppercase text-neutral-400 group-hover:text-white">
              HOME
            </span>
          </div>
        </SheetClose>
        <SheetClose asChild onClick={() => navigate("/about-us")}>
          <div className="flex gap-3 py-3 select-none group">
            <RiArticleLine className="w-7 h-7 transition-[color] duration-200 text-neutral-600 group-hover:text-white" />
            <span className="text-lg transition-[color] duration-200 tracking-wide uppercase text-neutral-400 group-hover:text-white">
              About Us
            </span>
          </div>
        </SheetClose>

        <SheetClose asChild onClick={() => navigate("/services")}>
          <div className="flex gap-3 py-3 select-none group">
            <RiServiceLine className="w-7 h-7 transition-[color] duration-200 text-neutral-600 group-hover:text-white" />
            <span className="text-lg transition-[color] duration-200 tracking-wide uppercase text-neutral-400 group-hover:text-white">
              All Services
            </span>
          </div>
        </SheetClose>
        <SheetClose asChild onClick={() => navigate("/faqs")}>
          <div className="flex gap-3 py-3 select-none group">
            <BsQuestionCircle className="w-7 h-7 transition-[color] duration-200 text-neutral-600 group-hover:text-white" />
            <span className="text-lg transition-[color] duration-200 tracking-wide uppercase text-neutral-400 group-hover:text-white">
              FAQ's
            </span>
          </div>
        </SheetClose>

        <SheetClose asChild onClick={() => navigate("/my-account")}>
          <div className="flex gap-3 py-3 select-none group">
            <LuContact className="w-7 h-7 transition-[color] duration-200 text-neutral-600 group-hover:text-white" />
            <span className="text-lg transition-[color] duration-200 tracking-wide uppercase text-neutral-400 group-hover:text-white">
              My Account
            </span>
          </div>
        </SheetClose>
        <SheetClose asChild onClick={() => navigate("/my-appointment")}>
          <div className="flex gap-3 py-3 select-none group">
            <LuContact className="w-7 h-7 transition-[color] duration-200 text-neutral-600 group-hover:text-white" />
            <span className="text-lg transition-[color] duration-200 tracking-wide uppercase text-neutral-400 group-hover:text-white">
              My Appointment
            </span>
          </div>
        </SheetClose>
      </div>

      <div className="flex flex-col gap-4 mt-20">
        {!userId ? (
          <>
            <SheetClose asChild>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Log In</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button asChild size="lg">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </SheetClose>
          </>
        ) : (
          <>
            <SheetClose asChild>
              <Button variant="outline" size="lg" asChild>
                <Link to="/appointment">Book Appointment</Link>
              </Button>
            </SheetClose>
            <Separator className="my-4 opacity-30 " />
            <SheetClose asChild>
              <Button size="lg" onClick={handleLogout}>
                Logout
              </Button>
            </SheetClose>
          </>
        )}
      </div>
    </div>
  );
};

export default NavigationSidebar;
