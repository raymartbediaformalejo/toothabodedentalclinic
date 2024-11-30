import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { TCreateService, TService } from "@/types/types";
import { createServiceSchema } from "@/types/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateService } from "@/service/mutation";
import useAuth from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useGetAllServices } from "@/service/queries";
import { DraggableServiceItem } from "./components/DraggableServiceItem";

const AddNewService = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const createService = useCreateService();
  const { data, isLoading: isServicesLoading } = useGetAllServices();
  const allServices: TService[] = useMemo(() => data?.data || [], [data]);
  const [servicesToSort, setServicesToSort] = useState<
    { id: UniqueIdentifier; title: string }[]
  >([]);
  const getServicePosition = (id: UniqueIdentifier) =>
    servicesToSort.findIndex((service) => service.id === id);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setServicesToSort((service) => {
      const originalPos = getServicePosition(active.id);
      const newPos = getServicePosition(over.id);

      return arrayMove(service, originalPos, newPos);
    });
  };
  useEffect(() => {
    if (!isServicesLoading)
      setServicesToSort(allServices.map(({ id, title }) => ({ id, title })));
  }, [allServices]);
  console.log("servicesToSort: ", servicesToSort);
  const form = useForm<TCreateService>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      title: "",
      description: "",
      orderNo: undefined,
      visible: true,
      createdBy: "",
    },
  });
  useEffect(() => {
    form.setValue("createdBy", userId!);
  }, [form, userId]);

  const handleCreateService: SubmitHandler<TCreateService> = async (data) => {
    createService.mutate(data);
    toast.success(`"${data.title}" service has been added!`);
    navigate("/dashboardadmin/service");
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <div>
      <header className=" text-black/80">
        <h1 className="text-neutral-800 leading-[43.2px] font-bold text-[36px]">
          Services
        </h1>
      </header>
      <div className="flex gap-4 mt-4">
        <Card className="w-[30%]">
          <CardHeader>
            <p>Services</p>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={servicesToSort}
                strategy={verticalListSortingStrategy}
              >
                {!isServicesLoading &&
                  servicesToSort.map(({ id, title }) => (
                    <DraggableServiceItem
                      className="border border-neutral-200 flex items-center gap-2 rounded-[6px] bg-neutral-100 p-3"
                      key={id}
                      serviceId={id}
                      title={title}
                    />
                    // <div
                    //   key={id}
                    //   className="border border-neutral-200 flex items-center gap-2 rounded-[6px] bg-neutral-100 p-3"
                    // >
                    //   <RiDraggable className="text-[28px]" />
                    //   <p className="overflow-hidden text-nowrap text-ellipsis">
                    //     {title}
                    //   </p>
                    // </div>
                  ))}
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
        <Card className="p-3 w-[70%]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateService)}
              className="flex flex-col justify-between h-full mt-12"
            >
              <div>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="title"
                            type="text"
                            placeholder="Enter service name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            id="description"
                            placeholder="Description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-center gap-3 mb-20 ">
                  <Button asChild variant="outline" size="lg">
                    <Link to="/dashboardadmin/service">Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-md"
                    variant={
                      form.formState.isSubmitting ? "disabled" : "default"
                    }
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddNewService;
