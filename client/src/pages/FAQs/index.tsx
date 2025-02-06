import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import H1 from "@/components/ui/H1";

const FAQs = () => {
  return (
    <>
      <header className="py-8 text-center text-primary-950 bg-primary-50">
        <H1 className="">
          Frequently <span className="text-primary-700">Ask Questions</span>
        </H1>
      </header>

      <div className="px-4 my-8   flex justify-center">
        <div className="px-4 my-8  flex gap-10 flex-col w-full max-w-[500px]">
          <div>
            <h2 className=" font-bold text-xl text-primary-800">
              {" "}
              Clinic Location & Operating Hours
            </h2>
            <div className="mt-2">
              <Accordion
                type="single"
                collapsible
                className="w-full flex flex-col gap-4"
              >
                <AccordionItem
                  className="border border-primary-800/30 px-4 rounded-md"
                  value="item-1-1"
                >
                  <AccordionTrigger className=" font-medium text-neutral-700">
                    Where is Tooth Abode Dental Clinic located?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-neutral-600">
                    <div>
                      <p>
                        We are located at{" "}
                        <span className="font-medium text-primary-700">
                          Second Floor, 1806-G Juan Luna St., Plaza Casasola
                          Building, Tondo, Manila.
                        </span>
                      </p>
                      <p>
                        Landmark: In front of Pritil Market, above Goldilocks.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  className="border border-primary-800/30 px-4 rounded-md"
                  value="item-1-2"
                >
                  <AccordionTrigger className=" font-medium text-neutral-700">
                    What are your operating hours?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-neutral-600">
                    Monday - Sunday: 9:00 AM - 5:00 PM
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* <div>
            <h2 className=" font-bold text-xl text-primary-800">
              Appointments & Booking
            </h2>
            <div className="mt-2">
              <Accordion
                type="single"
                collapsible
                className="w-full flex flex-col gap-4"
              >
                <AccordionItem
                  className="border border-primary-800/30 px-4 rounded-md"
                  value="item-2-1"
                >
                  <AccordionTrigger className=" font-medium text-neutral-700">
                    Do I need an appointment, or do you accept walk-ins?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-neutral-600">
                    <div>
                      <p>
                        STRICTLY BY APPOINTMENT to ensure quality service.
                        Please schedule in advance.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  className="border border-primary-800/30 px-4 rounded-md"
                  value="item-2-2"
                >
                  <AccordionTrigger className=" font-medium text-neutral-700">
                    How can I book an appointment?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-neutral-600">
                    Monday - Sunday: 9:00 AM - 5:00 PM
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  className="border border-primary-800/30 px-4 rounded-md"
                  value="item-2-3"
                >
                  <AccordionTrigger className=" font-medium text-neutral-700">
                    Can I reschedule or cancel my appointment?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-neutral-600">
                    Yes, but please inform us at least 24 hours in advance for
                    any changes.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div> */}

          <div>
            <h2 className=" font-bold text-xl text-primary-800">
              Dental Services
            </h2>
            <div className="mt-2">
              <Accordion
                type="single"
                collapsible
                className="w-full flex flex-col gap-4"
              >
                <AccordionItem
                  className="border border-primary-800/30 px-4 rounded-md"
                  value="item-3-1"
                >
                  <AccordionTrigger className=" font-medium text-neutral-700">
                    What dental services do you offer?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-neutral-600">
                    <div>
                      <ol>
                        <li>Oral Prophylaxis (Cleaning)</li>
                        <li>Restoration Dentistry (Fillings)</li>
                        <li>Cosmetic Dentistry (Veneers)</li>
                        <li>Extraction (Bunot)</li>
                        <li>
                          Surgery (Gum Reduction, Wisdom Tooth Removal, etc)
                        </li>
                        <li>
                          Prosthodontics (Pustiso, Jacket Crowns and Bridges)
                        </li>
                        <li>Root Canal Treatment</li>
                        <li>Orthodontic Treatment (Braces)</li>
                        <li>Retainers</li>
                        <li>Pediatric Dentistry</li>
                        <li>Teeth Whitening</li>
                        <li>Clear Aligners (Orthero)</li>
                        <li>Periapical X-rays</li>
                      </ol>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <div>
            <h2 className=" font-bold text-xl text-primary-800">
              Health Cards & HMOs
            </h2>
            <div className="mt-2">
              <Accordion
                type="single"
                collapsible
                className="w-full flex flex-col gap-4"
              >
                <AccordionItem
                  className="border border-primary-800/30 px-4 rounded-md"
                  value="item-4-1"
                >
                  <AccordionTrigger className=" font-medium text-neutral-700">
                    Do you accept health cards or HMOs?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-neutral-600">
                    <div>
                      <p>
                        Yes! We accept health cards under Health Partners Dental
                        Access and by Company.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  className="border border-primary-800/30 px-4 rounded-md"
                  value="item-4-2"
                >
                  <AccordionTrigger className=" font-medium text-neutral-700">
                    How do I verify if my health card is accepted?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-neutral-600">
                    <div>
                      <p>
                        Send a photo of your card via Facebook Messenger or
                        Viber (0915 991 9558) for verification.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  className="border border-primary-800/30 px-4 rounded-md"
                  value="item-4-3"
                >
                  <AccordionTrigger className=" font-medium text-neutral-700">
                    Are you accredited by AsianCare?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-neutral-600">
                    <div>
                      <p>
                        Yes! We are now accredited by AsianCare for dental
                        services.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  className="border border-primary-800/30 px-4 rounded-md"
                  value="item-4-4"
                >
                  <AccordionTrigger className=" font-medium text-neutral-700">
                    What should I bring for my appointment?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-neutral-600">
                    <div>
                      <ol>
                        <li>Valid ID</li>
                        <li>Health card (if applicable)</li>
                        <li> Previous dental records (if available)</li>
                      </ol>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQs;
