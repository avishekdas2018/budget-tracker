"use client";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/create-transaction-schema";
import { ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "../_actions/transactions";
import { toast } from "sonner";
import { dateToUTCDate } from "@/lib/helpers";



interface CreateTransactionDialogProps {
  trigger: ReactNode;
  type: TransactionType;
}



const CreateTransactionDialog = (
  {
    trigger,
    type
  }: CreateTransactionDialogProps
) => {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    }
  })

  const [open, setOpen] = useState(false)
  const handleCategoryChange = useCallback((value: string) => {
    form.setValue("category", value)
  }, [form])

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success("Transaction created successfully 🥳", {
        id: "create-transaction"
      })

      form.reset({
        type,
        date: new Date(),
        category: undefined,
        amount: 0,
        description: ""
      })

      // After a successful mutation, invalidate the "overview" query which refetch data in home page
      queryClient.invalidateQueries({
        queryKey: ["overview"]
      })

      setOpen((prev) => !prev)
    }
  })

  const onSubmit = useCallback((data: CreateTransactionSchemaType) => {
    toast.loading("Creating transaction...", {
      id: "create-transaction"
    })
    mutate({
      ...data,
      date: dateToUTCDate(data.date)
    })
  }, [mutate])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Create new <span className={cn(
              "m-1",
              type === "income" ? "text-emerald-500" : "text-rose-500"
            )}>
              {type}
            </span>
            transaction 💰
          </DialogTitle>
          <DialogDescription>
            Categories are used to group transactions together.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Transaction Description (Optional)</FormDescription>
              </FormItem>
            )} />
            <FormField control={form.control} name="amount" render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input defaultValue={0} type="number" {...field} />
                </FormControl>
                <FormDescription>Transaction Amount (Required)</FormDescription>
              </FormItem>
            )} />
            <div className="flex items-center justify-between gap-2">
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategoryPicker type={type} {...field} onChange={handleCategoryChange} />
                  </FormControl>
                  <FormDescription>Select a category</FormDescription>
                </FormItem>
              )} />
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Transaction Date </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                            <Button variant={"outline"} size={"default"} className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}>
                              {field.value ? format(field.value, "PPP") : (
                                <span className="">Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={field.value} onSelect={(value) => {
                          if (!value) {
                            return
                          }
                          field.onChange(value)
                        } } initialFocus />
                      </PopoverContent>
                    </Popover>
                  <FormDescription>Date of this transaction</FormDescription>
                  <FormMessage/>
                </FormItem>
              )} />
            </div>
          </form>
        </Form>
          <DialogFooter>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant={'secondary'} type='button' onClick={() => form.reset()}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                {!isPending && "Create"}
                {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              </Button>

            </div>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTransactionDialog


