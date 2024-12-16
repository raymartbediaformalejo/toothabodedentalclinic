import { BsCheckCircleFill } from "react-icons/bs";
import { MdArrowOutward } from "react-icons/md";

import aboutUsImg1 from "@/assets/image 7.png";
import aboutUsImg2 from "@/assets/image 8.png";
import { Button } from "@/components/ui/button";

const AboutUsSection = () => {
  return (
    <div className="px-4 py-20 ">
      <div className="relative">
        <img className="w-full rounded-[50px]" src={aboutUsImg1} alt="" />
        <img
          className="outline outline-white outline-8 w-[70%] bottom-0 translate-y-[50%] right-0 absolute rounded-[50px]"
          src={aboutUsImg2}
          alt=""
        />
      </div>
      <div className="mt-36">
        <h3 className="mb-1 text-primary-700 font-medium text-sm leading-[21px] tracking-[2.8px] uppercase ">
          About Us
        </h3>
        <h2 className="heading-1 text-primary-950">
          <span className="text-primary-700">Your Journey</span> to a Healthier
          Smile Begins Here
        </h2>

        <p className="mt-4">
          Our mission is to provide affordable, high-quality dental care for
          patients of all ages. We strive to make dental treatments accessible
          to everyone.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-7">
        <div className="flex gap-3">
          <BsCheckCircleFill className="w-6 h-6 text-primary-700" />
          <p className=" font-semibold leading-[25.6px]">Experienced Team</p>
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
          <p className=" font-semibold leading-[25.6px]">Affordable Services</p>
        </div>
      </div>

      <Button size="lg" className="mt-12">
        Read More About Us{" "}
        <MdArrowOutward className="w-6 h-6 p-1 bg-white rounded-full text-primary-700" />
      </Button>
    </div>
  );
};

export default AboutUsSection;
