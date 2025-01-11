import { Badge } from "@/components/ui/badge";
import { useGetServicesById } from "@/service/queries";
import { TService, TServiceIds } from "@/types/types";

type TServiceProps = {
  serviceIds: string[];
};

const Services = ({ serviceIds }: TServiceProps) => {
  const servicesCast: TServiceIds = { ids: serviceIds };
  const { data: servicesData, isLoading } = useGetServicesById(servicesCast);
  const services: TService[] | undefined = servicesData?.data;

  const content = services?.map((service) => service.title);

  if (content && content.length > 2) {
    return (
      <div className="flex items-center h-full gap-2">
        {!isLoading ? (
          <div className="flex flex-col gap-1">
            <Badge className=" text-nowrap w-min">{content[0]}, </Badge>

            <div className="flex">
              <Badge className=" w-min text-nowrap">{content[1]}</Badge>
              <Badge className="w-min">+{content.length - 2}</Badge>
            </div>
          </div>
        ) : null}
      </div>
    );
  } else {
    return (
      <div className="flex items-center h-full gap-2">
        {!isLoading ? (
          <div className="flex flex-col gap-1">
            <Badge className="">{content?.join(", ")}</Badge>
          </div>
        ) : null}
      </div>
    );
  }
};

export default Services;
