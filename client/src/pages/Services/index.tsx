import { Card, CardContent, CardHeader } from "@/components/ui/card";
import H1 from "@/components/ui/H1";
import { useGetAllServices } from "@/service/queries";
import { TService } from "@/types/types";
import { useMemo } from "react";

const AllServices = () => {
  const { data, isLoading, isError } = useGetAllServices();

  // Sort services by orderNo in ascending order
  const allServices: TService[] = useMemo(() => {
    return (data?.data || []).sort(
      (a: TService, b: TService) =>
        (a.orderNo as number) - (b.orderNo as number)
    );
  }, [data]);

  if (isLoading) return <p>Is Loading...</p>;

  if (isError) return <p>Something went wrong!</p>;

  return (
    <>
      <header className="py-8 text-center text-primary-950 bg-primary-50">
        <H1>
          Our <span className="text-primary-700">Dental Services</span>
        </H1>
      </header>

      <div className="flex justify-center">
        <div className="w-full max-w-[1048px] gap-4 px-4 my-8 grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))]">
          {allServices.map((service) => (
            <Card key={service.id}>
              {" "}
              {/* Added a key for better React performance */}
              <CardHeader className="text-primary-800 text-lg py-2 text-center">
                {service.title}
              </CardHeader>
              <CardContent className="text-sm text-primary-950 leading-[28.8px]">
                <p>{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllServices;
