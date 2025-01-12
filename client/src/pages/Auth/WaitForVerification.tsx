import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import H1 from "@/components/ui/H1";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const WaitForVerification = () => {
  return (
    <div>
      <header className="px-4 py-8 text-center text-primary-950 bg-primary-50">
        <H1>
          Payment Verificaiton{" "}
          <span className="text-primary-700">in Progress</span>
        </H1>
        <p className="text-primary-950 mt-1 text-[14px]">
          Your payment receipt has been submitted and is currently being
          verified.
        </p>
      </header>

      <div className="flex flex-col justify-center mx-4 my-8">
        <Progress className="self-center max-w-[80%]" />
        <p className="mt-3 font-semibold text-center text-primary-800">
          Verification in Progress...
        </p>

        <div>
          <p className="mt-6 text-sm text-center text-primary-700">
            <Icons.clock className="inline-block mr-1" /> This process may take
            up to <strong>24-48 hours</strong>.
          </p>
        </div>

        <div className="max-w-md mt-6 text-center">
          <h2 className="text-lg font-bold text-primary-900">
            What happens next?
          </h2>
          <p className="mt-2 text-sm text-primary-950">
            Our team will review your payment receipt for accuracy. Once
            verified, you will regain full access to your account.
          </p>
          <p className="mt-2 text-sm text-primary-950">
            If you have any questions, feel free to{" "}
            <a href="/contact-support" className="underline text-primary-800">
              contact our support team
            </a>
            .
          </p>
        </div>
      </div>

      <div className="px-4 py-6 text-center bg-primary-50">
        <p className="text-sm text-primary-900">
          Thank you for your patience! <span className="text-lg">😊</span>
        </p>
        <div className="flex justify-center mt-4 space-x-4">
          <Button
            variant="default"
            className="px-4 py-2 text-white rounded-lg bg-primary-700"
            asChild
          >
            <Link to="/">Back to Home</Link>
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 rounded-lg bg-primary-100 text-primary-800"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WaitForVerification;
