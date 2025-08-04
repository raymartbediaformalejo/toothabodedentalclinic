import logo from "@/assets/logo-with-bg.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="px-4 text-white pt-14 bg-primary-950">
      <div className="w-full max-w-[1048px] md:flex md:justify-center">
        <div className="md:flex md:justify-between md:gap-6">
          <div className="w-full max-w-[400px]">
            <div className="flex gap-2">
              <img
                className="h-[50px]"
                src={logo}
                alt="Tooth Abode Dental Clinic logo"
              />
              <div className="flex justify-center flex-col font-bold text-primary-700 leading-[15px]">
                <span>Tooth Abode</span> <span>Dental Clinic</span>
              </div>
            </div>
            <p className="text-sm font-light leading-[24.8px] mt-4">
              Our mission is to provide affordable, high-quality dental care for
              all ages, making treatments accessible to everyone.
            </p>
          </div>

          {/* <div className="flex flex-col gap-14 mt-14"> */}
          <div className="flex mt-8 flex-col gap-5">
            <p className="text-xs leading-[19.8px] font-semibold tracking-[2.4px] uppercase">
              Quick Links
            </p>
            <div className="flex flex-col gap-4 ">
              <Link
                className="text-sm transition-[color,text-decoration-line] no-underline duration-200 ease-in-out hover:text-primary-500 font-light hover:underline "
                to="/"
              >
                Home
              </Link>
              <Link
                className="text-sm transition-[color,text-decoration-line] no-underline duration-200 ease-in-out hover:text-primary-500 font-light hover:underline "
                to="/about-us"
              >
                About Us
              </Link>
              <Link
                className="text-sm transition-[color,text-decoration-line] no-underline duration-200 ease-in-out hover:text-primary-500 font-light hover:underline "
                to="/all-services"
              >
                Services
              </Link>
              <Link
                className="text-sm transition-[color,text-decoration-line] no-underline duration-200 ease-in-out hover:text-primary-500 font-light hover:underline "
                to="/faqs"
              >
                FAQ's
              </Link>
              <Link
                className="text-sm transition-[color,text-decoration-line] no-underline duration-200 ease-in-out hover:text-primary-500 font-light hover:underline "
                to="/appointment"
              >
                Book Appointment
              </Link>
            </div>
          </div>

          <div className="flex mt-8 flex-col gap-5">
            <p className="text-xs leading-[19.8px] font-semibold tracking-[2.4px] uppercase">
              Social Media
            </p>
            <div className="flex flex-col gap-4 ">
              <Link
                className="text-sm transition-[color,text-decoration-line] no-underline duration-200 ease-in-out hover:text-primary-500 font-light hover:underline "
                to="https://www.facebook.com/profile.php?id=100064125608150"
              >
                Facebook
              </Link>
              <Link
                className="text-sm transition-[color,text-decoration-line] no-underline duration-200 ease-in-out hover:text-primary-500 font-light hover:underline "
                to="/"
              >
                Instagram
              </Link>
              <Link
                className="text-sm transition-[color,text-decoration-line] no-underline duration-200 ease-in-out hover:text-primary-500 font-light hover:underline "
                to="/"
              >
                X(Twitter)
              </Link>
            </div>
          </div>
          <div className="flex mt-8 flex-col gap-5">
            <p className="text-xs leading-[19.8px] font-semibold tracking-[2.4px] uppercase">
              Contact Us
            </p>
            <div className="flex flex-col gap-4 ">
              <Link
                className="text-sm transition-[color,text-decoration-line] no-underline duration-200 ease-in-out hover:text-primary-500 font-light hover:underline "
                to="/"
              >
                {`+63 915 991 9558`}
              </Link>
              <Link
                className="text-sm transition-[color,text-decoration-line] no-underline duration-200 ease-in-out hover:text-primary-500 font-light hover:underline "
                to="mailto:tooth.abode@gmail.com"
              >
                tooth.abode@gmail.com
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 border-t tracking-[2.2px] leading-[18.15px] border-primary-30/20 font-semibold">
        <p className="py-6 text-center text-[11px] uppercase">
          © Tooth Abode Dental Clinic
        </p>
      </div>
    </div>
  );
};

export default Footer;
