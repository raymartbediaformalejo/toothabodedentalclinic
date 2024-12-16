import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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
import { DraggableItem } from "@/components/DraggableItem";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AddNewService = () => {
  const { userId } = useAuth();
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
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
      return item?.id === array2[i]?.id;
    });
  };

  const form = useForm<TCreateService>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      title: "",
      description: "",
      visible: true,
      createdBy: "",
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  useEffect(() => {
    if (!isServicesLoading) {
      setServicesToSort(allServices.map(({ id, title }) => ({ id, title })));
    }
  }, [allServices, isServicesLoading]);

  useEffect(() => {
    form.setValue("createdBy", userId);
  }, [userId]);

  useEffect(() => {
    const isOrderSame = areArrayOrderIsTheSame(
      allServices.map(({ id, title }) => ({ id, title })),
      servicesToSort
    );

    setIsSaveDisabled(isOrderSame);
  }, [servicesToSort, allServices]);

  useEffect(() => {
    form.setValue("createdBy", userId!);
  }, [form, userId]);

  const handleSaveSortedService = async (data: TSaveSortedService[]) => {
    saveSortedService.mutate(data);
    toast.success("Successfully sorted the services");
  };

  const handleCancelSortService = () => {
    setServicesToSort(allServices.map(({ id, title }) => ({ id, title })));
  };

  const handleCreateService: SubmitHandler<TCreateService> = async (data) => {
    await createService.mutate(data);
  };
  return (
    <div>
      <header className=" text-black/80">
        <h1 className="text-neutral-800 leading-[43.2px] font-bold text-[36px]">
          Add New Service
        </h1>
      </header>
      <div className="flex gap-4 mt-4">
        <Card className="w-[30%]">
          <CardHeader>
            <p>Services Title</p>
          </CardHeader>
          <div
            className={`flex flex-col justify-between ${
              servicesToSort.length > 0 && "h-[calc(100%-71px)]"
            }`}
          >
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
                      <DraggableItem
                        className="border border-neutral-200 flex items-center gap-2 rounded-[6px] bg-neutral-100 p-3"
                        key={id}
                        id={id}
                        content={title}
                      />
                    ))}
                </SortableContext>
              </DndContext>
            </CardContent>
            {servicesToSort.length > 0 ? (
              <CardFooter className="justify-center">
                <div className="flex justify-center gap-3">
                  <Button
                    type="button"
                    size="lg"
                    className="rounded-md"
                    variant={isSaveDisabled ? "db_disabled" : "db_outline"}
                    disabled={isSaveDisabled}
                    onClick={handleCancelSortService}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    className="rounded-md"
                    variant={isSaveDisabled ? "db_disabled" : "db_default"}
                    disabled={isSaveDisabled}
                    onClick={() => handleSaveSortedService(servicesToSort)}
                  >
                    Save
                  </Button>
                </div>
              </CardFooter>
            ) : (
              <p className="flex justify-center w-full italic text-neutral-500">
                No service title to show
              </p>
            )}
          </div>
        </Card>
        <Card className="w-[70%]">
          <CardHeader>Add Service</CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateService)}
                className="flex flex-col justify-between h-full"
              >
                <div className="flex flex-col gap-4">
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
                    name="description"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col ">
                          <Label htmlFor="description">Description</Label>
                          <FormControl>
                            <Textarea
                              id="description"
                              placeholder="Description"
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
                        <Label htmlFor="visible">Visibility</Label>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Visible" />
                            </SelectTrigger>
                          </FormControl>
                          <FormMessage />
                          <SelectContent>
                            <SelectItem id="visible" key="visible" value="true">
                              Visible
                            </SelectItem>
                            <SelectItem id="hidden" key="hidden" value="false">
                              Hidden
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex content-end justify-center gap-3 mt-10 ">
                  <Button asChild variant="db_outline" size="lg">
                    <Link to="/admin/services">Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-md"
                    variant={
                      form.formState.isSubmitting ? "db_disabled" : "db_default"
                    }
                  >
                    Submit
                  </Button>
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
