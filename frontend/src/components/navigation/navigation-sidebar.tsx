import { Link } from "react-router-dom";

import { LuHome, LuUsers, LuContact } from "react-icons/lu";
import { RiArticleLine, RiServiceLine } from "react-icons/ri";
import { BsQuestionCircle } from "react-icons/bs";
import { SheetClose } from "../ui/sheet";
import { Button } from "../ui/button";
import useAuth from "@/hooks/useAuth";
import { useLogout } from "@/service/mutation";

const NavigationSidebar = () => {
  const { userId } = useAuth();
  const logout = useLogout();
  const handleLogout = () => {
    logout.mutate();
  };
  return (
    <div className="mt-12 ">
      <div className="flex flex-col gap-2">
        <SheetClose asChild>
          <div className="flex gap-3 py-3 select-none group">
            <LuHome className="w-7 h-7 transition-[color] duration-200 text-neutral-600 group-hover:text-white" />
            <Link to="/">
              <span className="text-lg transition-[color] duration-200 tracking-wide uppercase text-neutral-400 group-hover:text-white">
                HOME
              </span>
            </Link>
          </div>
        </SheetClose>
        <SheetClose asChild>
          <div className="flex gap-3 py-3 select-none group">
            <RiArticleLine className="w-7 h-7 transition-[color] duration-200 text-neutral-600 group-hover:text-white" />
            <Link to="/">
              <span className="text-lg transition-[color] duration-200 tracking-wide uppercase text-neutral-400 group-hover:text-white">
                About Us
              </span>
            </Link>
          </div>
        </SheetClose>
        <SheetClose asChild>
          <div className="flex gap-3 py-3 select-none group">
            <LuUsers className="w-7 h-7 transition-[color] duration-200 text-neutral-600 group-hover:text-white" />
            <Link to="/">
              <span className="text-lg transition-[color] duration-200 tracking-wide uppercase text-neutral-400 group-hover:text-white">
                All Dentists
              </span>
            </Link>
          </div>
        </SheetClose>
        <SheetClose asChild>
          <div className="flex gap-3 py-3 select-none group">
            <RiServiceLine className="w-7 h-7 transition-[color] duration-200 text-neutral-600 group-hover:text-white" />
            <Link to="/">
              <span className="text-lg transition-[color] duration-200 tracking-wide uppercase text-neutral-400 group-hover:text-white">
                Services
              </span>
            </Link>
          </div>
        </SheetClose>
        <SheetClose asChild>
          <div className="flex gap-3 py-3 select-none group">
            <BsQuestionCircle className="w-7 h-7 transition-[color] duration-200 text-neutral-600 group-hover:text-white" />
            <Link to="/">
              <span className="text-lg transition-[color] duration-200 tracking-wide uppercase text-neutral-400 group-hover:text-white">
                Faq's
              </span>
            </Link>
          </div>
        </SheetClose>
        <SheetClose asChild>
          <div className="flex gap-3 py-3 select-none group">
            <LuContact className="w-7 h-7 transition-[color] duration-200 text-neutral-600 group-hover:text-white" />
            <Link to="/">
              <span className="text-lg transition-[color] duration-200 tracking-wide uppercase text-neutral-400 group-hover:text-white">
                Contact Us
              </span>
            </Link>
          </div>
        </SheetClose>
      </div>

      <div className="flex flex-col gap-4 mt-20">
        {!userId ? (
          <>
            <SheetClose asChild>
              <Button asChild variant="outline" size="lg">
                <Link to="/log-in">Log In</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button asChild size="lg">
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </SheetClose>
          </>
        ) : (
          <SheetClose asChild>
            <Button size="lg" onClick={handleLogout}>
              Logout
            </Button>
          </SheetClose>
        )}
      </div>
    </div>
  );
};

export default NavigationSidebar;
