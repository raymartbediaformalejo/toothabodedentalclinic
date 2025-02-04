import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditPenaltyFee } from "@/service/mutation";
import { useGetPenalty } from "@/service/queries";
import { updatePenaltyFeeSchema } from "@/types/schema";
import { TPenalty, TUpdatePenaltyFee } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const PenaltyFee = () => {
  const { data: penaltyData } = useGetPenalty();
  const updatePenaltyFee = useEditPenaltyFee();
  const penalty: TPenalty = penaltyData || {
    penaltyFee: 0,
    gcashQrCodeUrl: "",
  };
  const form = useForm<TUpdatePenaltyFee>({
    resolver: zodResolver(updatePenaltyFeeSchema),
  });

  const handleEditPenaltyFee: SubmitHandler<TUpdatePenaltyFee> = async (
    data
  ) => {
    try {
      await updatePenaltyFee.mutate(data);
    } catch (error) {
      console.error("Failed to update penalty fee:", error);
    }
  };

  console.log("SUBMITTING: ", form.formState.isSubmitting);

  useEffect(() => {
    if (penalty.penaltyFee) {
      form.setValue("penaltyFee", penalty.penaltyFee);
    }
  }, [form, penalty?.penaltyFee]);
  return (
    <div>
      <div className="flex items-center justify-between mb-6 ">
        <header className=" text-black/80">
          <h1 className="text-neutral-700 leading-[43.2px] font-bold text-[34px]">
            Penalty Fee
          </h1>
        </header>
      </div>
      <Card>
        <CardHeader>Penalty Fee: </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditPenaltyFee)}>
              <FormField
                control={form.control}
                name="penaltyFee"
                render={({ field, fieldState }) => {
                  return (
                    <FormItem>
                      <Label>Penalty Fee</Label>
                      <FormControl className="w-[200px]">
                        <Input
                          {...field}
                          id="penaltyFee"
                          type="number"
                          placeholder="Enter penalty fee"
                          dirty={fieldState?.isDirty}
                          invalid={fieldState?.invalid}
                          onChange={(e) => {
                            const value = e.target.value;

                            field.onChange(
                              value === "" ? "" : parseFloat(value)
                            );
                          }}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div>
                <Button
                  onClick={() => {
                    form.setValue("penaltyFee", penalty.penaltyFee);
                  }}
                  type="button"
                  variant="db_outline"
                  size="lg"
                >
                  Cancel
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
  );
};

export default PenaltyFee;
