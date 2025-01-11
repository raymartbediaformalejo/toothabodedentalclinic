import { Badge } from "@/components/ui/badge";
import { useGetServicesById } from "@/service/queries";
import { TService, TServiceIds } from "@/types/types";

type TServiceProps = {
  serviceIds: string[];
};
const ReviewAndBookService = ({ serviceIds }: TServiceProps) => {
  const servicesCast: TServiceIds = { ids: serviceIds };
  const { data: servicesData, isLoading } = useGetServicesById(servicesCast);
  const services: TService[] | undefined = servicesData?.data;
  console.log("ReviewAndBookService services: ", serviceIds);

  return (
    <div className="flex items-center h-full gap-2">
      {!isLoading ? (
        <div className="flex flex-col gap-1">
          {services &&
            services.map((service) => (
              <Badge className="w-min text-nowrap">{service.title}</Badge>
            ))}
        </div>
      ) : null}
    </div>
  );
};

export default ReviewAndBookService;
