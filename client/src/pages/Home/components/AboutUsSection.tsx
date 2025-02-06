import { BsCheckCircleFill } from "react-icons/bs";
import { MdArrowOutward } from "react-icons/md";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutUsSection = () => {
  return (
    <div className="px-4 py-20 md:flex md:justify-center">
      <div
        className="w-full  flex md:gap-6 flex-col md:flex-row
        max-w-[1048px]"
      >
        <div className="md:w-[40%] md:self-start mt-16 relative flex justify-center items-center ">
          <div className="w-full">
            <img
              className="aspect-square
 w-full rounded-[50px]"
              src="https://res.cloudinary.com/deklgilr5/image/upload/v1738812200/beujjiogeujsx9oooxtk.jpg"
              alt=""
            />
          </div>
        </div>

        <div className="md:w-[60%]">
          <div className="mt-6">
            <h3 className="mb-1 text-primary-700 font-medium text-sm leading-[21px] tracking-[2.8px] uppercase ">
              About Us
            </h3>
            <h2 className="heading-1 text-primary-950">
              <span className="text-primary-700">Your Journey</span> to a
              Healthier Smile Begins Here
            </h2>

            <p className="mt-4">
              Our mission is to provide affordable, high-quality dental care for
              patients of all ages. We strive to make dental treatments
              accessible to everyone.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-7">
            <div className="flex gap-3">
              <BsCheckCircleFill className="w-6 h-6 text-primary-700" />
              <p className=" font-semibold leading-[25.6px]">
                Experienced Team
              </p>
            </div>
            <div className="flex gap-3">
              <BsCheckCircleFill className="w-6 h-6 text-primary-700" />
              <p className=" font-semibold leading-[25.6px]">
                State-Of-The-Art-Technology
              </p>
            </div>
            <div className="flex gap-3">
              <BsCheckCircleFill className="w-6 h-6 text-primary-700" />
              <p className=" font-semibold leading-[25.6px]">
                Comprehensive Services
              </p>
            </div>
            <div className="flex gap-3">
              <BsCheckCircleFill className="w-6 h-6 text-primary-700" />
              <p className=" font-semibold leading-[25.6px]">
                Affordable Services
              </p>
            </div>
          </div>

          <Button asChild size="lg" className="mt-12 self-start">
            <Link to="/about-us">
              Read More About Us{" "}
              <MdArrowOutward className="w-6 h-6 p-1 bg-white rounded-full text-primary-700" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsSection;
