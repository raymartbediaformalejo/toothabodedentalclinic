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
import { TCreateService, TSaveSortedService, TService } from "@/types/types";
import { createServiceSchema } from "@/types/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCreateService, useSaveSortedService } from "@/service/mutation";
import useAuth from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { useGetAllServices } from "@/service/queries";
import { DraggableServiceItem } from "./components/DraggableServiceItem";
import { Label } from "@/components/ui/label";

// type TServiceToOrder = {
//   id: string;
//   title: string;
// };

const AddNewService = () => {
  const { userId } = useAuth();
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const navigate = useNavigate();
  const createService = useCreateService();
  const saveSortedService = useSaveSortedService();
  const { data, isLoading: isServicesLoading } = useGetAllServices();
  const allServices: TService[] = useMemo(() => data?.data || [], [data]);
  const [servicesToSort, setServicesToSort] = useState<TSaveSortedService[]>(
    []
  );
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

  const areArrayOrderIsTheSame = (
    array1: TSaveSortedService[],
    array2: TSaveSortedService[]
  ) => {
    return array1.every((item, i) => {
      // console.log(
      //   `array 1: ${item.id} | array 2: ${array2[i]?.id} = ${
      //     item.id === array2[i]?.id
      //   }`
      // );
      // console.log(`array 1: ${item.id} | array 2: ${array2[i]?.id}`);
      return item?.id === array2[i]?.id;
    });
  };

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
    if (!isServicesLoading) {
      setServicesToSort(allServices.map(({ id, title }) => ({ id, title })));
    }
  }, [allServices, isServicesLoading]);

  useEffect(() => {
    const isOrderSame = areArrayOrderIsTheSame(
      allServices.map(({ id, title }) => ({ id, title })),
      servicesToSort
    );

    setIsSaveDisabled(isOrderSame);
  }, [servicesToSort, allServices]);
  console.log(
    "allServices: ",
    allServices.map(({ id, title }) => ({ id, title }))
  );
  console.log("serviceToSort: ", servicesToSort);
  console.log("isSaveDisabled: ", isSaveDisabled);

  useEffect(() => {
    form.setValue("createdBy", userId!);
  }, [form, userId]);

  const handleSaveSortedService = async (data: TSaveSortedService[]) => {
    saveSortedService.mutate(data);
  };

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
          Add Service
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
                  ))}
              </SortableContext>
            </DndContext>
          </CardContent>
          <CardFooter>
            <div className="flex justify-center gap-3 mb-20 ">
              <Button
                type="submit"
                size="lg"
                className="rounded-md"
                variant={isSaveDisabled ? "disabled" : "default"}
                onClick={() => handleSaveSortedService(servicesToSort)}
              >
                Save
              </Button>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-[70%]">
          <CardHeader>Add Service</CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateService)}
                className="flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field, fieldState }) => {
                          return (
                            <FormItem className="flex flex-col ">
                              <Label isRequired htmlFor="title">
                                Title
                              </Label>
                              <FormControl>
                                <Input
                                  id="title"
                                  type="text"
                                  placeholder="Enter the title"
                                  dirty={fieldState?.isDirty}
                                  invalid={fieldState?.invalid}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="visible"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-[40%]">
                            <Label isRequired htmlFor="visible">
                              Visibility
                            </Label>
                            <Select onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Visible" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                <SelectItem
                                  id="visible"
                                  key="visible"
                                  value="visible"
                                >
                                  Visible
                                </SelectItem>
                                <SelectItem
                                  id="hidden"
                                  key="hidden"
                                  value="hidden"
                                >
                                  Hidden
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field, fieldState }) => {
                        return (
                          <FormItem className="flex flex-col ">
                            <Label isRequired htmlFor="description">
                              Description
                            </Label>
                            <FormControl>
                              <Input
                                id="description"
                                type="text"
                                placeholder="Enter the description"
                                dirty={fieldState?.isDirty}
                                invalid={fieldState?.invalid}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddNewService;
