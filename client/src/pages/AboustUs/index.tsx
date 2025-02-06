import H1 from "@/components/ui/H1";
import { BsCheckCircleFill } from "react-icons/bs";

const AboutUs = () => {
  return (
    <>
      <header className="py-8 text-center text-primary-950 bg-primary-50">
        <H1>
          About <span className="text-primary-700">Us</span>
        </H1>
        <p className="text-primary-950 -mt-1 text-[14px]">
          Welcome to Tooth Abode Dental Clinic
        </p>
      </header>
      <div className="flex justify-center py-12 px-4 ">
        <div className="gap-14  w-full flex flex-col max-w-[1048px]">
          <div
            className=" flex md:gap-6 flex-col md:flex-row
        "
          >
            <div className="md:w-[40%] md:self-start md:mt-8 relative flex justify-center items-center ">
              <div className="w-full">
                <img
                  className="aspect-square w-full rounded-[50px]"
                  src="https://res.cloudinary.com/deklgilr5/image/upload/v1738812200/beujjiogeujsx9oooxtk.jpg"
                  alt=""
                />
              </div>
            </div>

            <div className="md:w-[60%] mt-6">
              <div>
                <h2 className="heading-1 text-primary-950">
                  <span className="text-primary-700">Your Journey</span> to a
                  Healthier Smile Begins Here
                </h2>

                <p className="mt-2 leading-[27.8px] text-sm">
                  Tooth Abode Dental Clinic is committed to providing
                  high-quality, affordable, and accessible dental care to our
                  community. Established in{" "}
                  <span className="font-bold text-primary-800">2020</span> by{" "}
                  <span className="font-bold text-primary-800">
                    Dr. Mariah Melissa Anne A. Castro
                  </span>
                  , our clinic has become a trusted name in{" "}
                  <span className="font-bold text-primary-800">
                    Pritil, Tondo, Manila
                  </span>{" "}
                  , serving patients of all ages with exceptional dental
                  services.
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
            </div>
          </div>

          {/*  MISSION */}
          <div
            className=" flex-col-reverse flex md:gap-6  md:flex-row
        "
          >
            <div className="md:w-[60%] mt-6">
              <div>
                <h2 className="heading-1 text-primary-950">
                  <span className="text-primary-700">Our</span> Mission
                </h2>

                <p className="mt-1 leading-[27.8px] text-sm">
                  Our mission is to ensure that every patient receives the best
                  possible dental care in a comfortable and welcoming
                  environment. We believe in making dental health easy,
                  accessible, and hassle-free through our{" "}
                  <span className="font-bold text-primary-800">
                    modern online appointment
                  </span>{" "}
                  , allowing patients to book their visits conveniently.
                </p>
              </div>
            </div>

            <div className="md:w-[40%] md:self-start relative md:mt-8 flex justify-center items-center ">
              <div className="w-full">
                <img
                  className="aspect-square w-full rounded-[50px]"
                  src="https://res.cloudinary.com/deklgilr5/image/upload/v1738812299/zzlmc39dozb4lbpldy5i.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>

          {/* VISSION */}
          <div
            className=" flex md:gap-6 flex-col md:flex-row
        "
          >
            <div className="md:w-[40%] md:self-start md:mt-8 relative flex justify-center items-center ">
              <div className="w-full">
                <img
                  className="aspect-square w-full rounded-[50px]"
                  src="https://res.cloudinary.com/deklgilr5/image/upload/v1738863726/lyx0xnovbiitgzi7du8l.jpg"
                  alt=""
                />
              </div>
            </div>

            <div className="md:w-[60%] mt-4">
              <div>
                <h2 className="heading-1 text-primary-950">
                  <span className="text-primary-700">Our</span> Vision
                </h2>

                <p className="mt-1 leading-[27.8px] text-sm">
                  To be a leading provider of{" "}
                  <span className="font-bold text-primary-800">
                    affordable and high-quality
                  </span>
                  dental services while embracing{" "}
                  <span className="font-bold text-primary-800">
                    innovative technology
                  </span>{" "}
                  to enhance patient experience and improve operational
                  efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
