import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertAccountSchema } from "@/db/schema";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form"

const formSchema = insertAccountSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
}

export const AccountForm = ({ onSubmit, defaultValues, disabled, id, onDelete }: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
    }

    const handleDelete = () => {
        onDelete?.();
    }

    return <Form {...form} >
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">

            <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Name
                        </FormLabel>
                        <FormControl>
                            <Input disabled={disabled} placeholder="e.g. Cash, Bank, Credit card"
                                {...field}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <Button className="w-full" disabled={disabled

            }>
                {id ? "Save changes" : "Create account"}
            </Button>
            {
                !!id &&
                <Button className="w-full flex" variant={"outline"} type="button" disabled={disabled} onClick={handleDelete} >
                    <Trash className="size-4 mr-2" />
                    Delete account
                </Button>
            }

        </form>
    </Form >
}