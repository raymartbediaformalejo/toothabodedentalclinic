import { useGetServicesById } from "@/service/queries";
import { TService, TServiceIds } from "@/types/types";

type TServiceProps = {
  serviceIds: string[];
};

const Services = ({ serviceIds }: TServiceProps) => {
  const servicesCast: TServiceIds = { ids: serviceIds };
  const { data: servicesData, isLoading } = useGetServicesById(servicesCast);
  const services: TService[] | undefined = servicesData?.data;
  const content =
    !isLoading &&
    services &&
    services.map((service) => service.title).join(", ");
  return (
    <div className="flex items-center h-full gap-2 ml-4">
      {!isLoading ? (
        <span className="pt-2 font-semibold">{content}</span>
      ) : null}
    </div>
  );
};

export default Services;
