import { FiPhoneCall } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";
import { TfiInfoAlt } from "react-icons/tfi";

const ContactHeroSection = () => {
  return (
    <div className="flex flex-col items-center gap-8 text-white py-14 bg-primary-950">
      <div className="flex w-[70%] items-start">
        <div className="w-[20%] h-7">
          <FiPhoneCall className="w-full h-full" />
        </div>
        <div className="flex w-[80%] flex-col gap-[2px]">
          <span className="text-[16px] font-semibold ">
            Need Dental Services?
          </span>
          <p className="text-[16px] leading-[28.8px]">
            Call on: <span>0915 991 9558</span>
          </p>
        </div>
      </div>
      <div className="w-[70%] flex items-start ">
        <div className="w-[20%] h-7">
          <FaRegClock className="w-full h-full" />
        </div>
        <div className="flex w-[80%] flex-col gap-[2px]">
          <span className="text-[16px] font-semibold ">Open Hours</span>
          <p className="text-[16px] leading-[28.8px]">Mon to Sun 9am to 5pm</p>
        </div>
      </div>

      <div className=" flex w-[70%] items-start ">
        <div className="w-[20%] h-7">
          <TfiInfoAlt className="w-full h-full" />
        </div>
        <div className="flex w-[80%] flex-col gap-[2px]">
          <span className="text-[16px] font-semibold ">
            HMO Scheduling Notice
          </span>
          <p className="text-[16px] leading-[28.8px]">
            For patients with accredited HMO, kindly schedule an appointment
            ahead.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactHeroSection;
