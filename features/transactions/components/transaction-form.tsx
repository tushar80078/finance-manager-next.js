/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertTransactionSchema } from "@/db/schema";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form"
import Select from "@/components/select";
import DatePicker from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import AmountInput from "@/components/amout-input";
import { convertAmountToMiliunits } from "@/lib/utils";

const formSchema = z.object({
    date: z.coerce.date(),
    account_Id: z.string(),
    category_Id: z.string().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional()
})

const apiSchema = insertTransactionSchema.omit({
    id: true
});

type FormValues = z.input<typeof formSchema>;

type APIValues = z.input<typeof apiSchema>

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: APIValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    accountOptions: { label: string; value: string }[];
    categoryOptions: { label: string; value: string }[];
    onCreateAccount: (name: string) => void;
    onCreateCategory: (name: string) => void;
}

export const TransactionForm = ({ onSubmit, defaultValues, disabled, id, onDelete,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory

}: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount);
        const ammountInMiliUnits = convertAmountToMiliunits(amount);

        onSubmit({ ...values, amount: ammountInMiliUnits });
    }

    const handleDelete = () => {
        onDelete?.();
    }

    return <Form {...form} >
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
            <FormField
                name="date"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                disabled={disabled}

                            />
                        </FormControl>
                    </FormItem>
                )}
            />


            <FormField
                name="account_Id"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Account
                        </FormLabel>
                        <FormControl>
                            <Select
                                placeholder="Select an account"
                                options={accountOptions}
                                onCreate={onCreateAccount}
                                value={field.value}
                                onChange={field.onChange}
                                disabled={disabled}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <FormField
                name="category_Id"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Category
                        </FormLabel>
                        <FormControl>
                            <Select
                                placeholder="Select a category"
                                options={categoryOptions}
                                onCreate={onCreateCategory}
                                value={field.value}
                                onChange={field.onChange}
                                disabled={disabled}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <FormField
                name="payee"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Payee
                        </FormLabel>
                        <FormControl>
                            <Input
                                disabled={disabled}
                                placeholder="Add a payee"
                                {...field}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                name="amount"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Amount
                        </FormLabel>
                        <FormControl>
                            <AmountInput
                                {...field}
                                disabled={disabled}
                                placeholder="0.00"
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <FormField
                name="notes"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Notes
                        </FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                value={field.value ?? ""}

                                disabled={disabled}
                                placeholder="Optional notes.."
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <Button className="w-full" disabled={disabled

            }>
                {id ? "Save changes" : "Create Transaction"}
            </Button>
            {
                !!id &&
                <Button className="w-full flex" variant={"outline"} type="button" disabled={disabled} onClick={handleDelete} >
                    <Trash className="size-4 mr-2" />
                    Delete Transaction
                </Button>
            }

        </form>
    </Form >
}