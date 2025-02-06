import { MdArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative ">
      <div className=" bg-[url('https://res.cloudinary.com/deklgilr5/image/upload/v1738812299/zzlmc39dozb4lbpldy5i.jpg')] bg-no-repeat bg-center bg-cover after:block after:relative after:bg-[linear-gradient(180deg,rgba(66,32,6,0.5)_36%,rgba(66,32,6,0.9)_92.5%,rgba(66,32,6,1)_100%)] after:w-full after:h-full after:top-0 after:left-0 flex-1 lg:flex justify-end items-center h-[746px] w-full after:backdrop-blur-[3px] after:bg-opacity-80" />

      <div className="absolute top-0 left-0 h-[746px] w-full  md:flex md:justify-center md:items-center">
        <div className="w-full max-w-[1163px] flex  flex-col justify-center md:items-center h-full gap-12 mx-4 text-white">
          <div className="flex pr-6 md:pr-0 flex-col md:justify-center md:items-center gap-4 w-full max-w-[733px]">
            <div className="flex flex-col gap-2">
              <p className="title-sm md:text-center">
                Welcome to Tooth Abode Dental Clinic
              </p>
              <h1 className="title md:text-center">
                Experience Best in Dental Care
              </h1>
            </div>
            <p className="my-font-default md:text-center md:w-full md:max-w-[533px]">
              Our clinic offers high-quality dental care at an affordable price,
              prioritizing your smile and satisfaction
            </p>
          </div>
          <div>
            <Button asChild size="lg">
              <Link to="/appointment">
                Make an Appointment
                <MdArrowOutward className="w-6 h-6 p-1 bg-white rounded-full text-primary-700" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
