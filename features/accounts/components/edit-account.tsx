/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useOpenAccount } from "../hooks/use-open-account";
import { useGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";
import { useEditAccount } from "../api/use-edit-account";
import { useDeleteAccount } from "../api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";

const formSchema = insertAccountSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>;


const EditAccountSheet = () => {
    const { isOpen, onClose, id } = useOpenAccount();

    const [ConfirmDialog, confirm] = useConfirm('Are you sure?', "You are about to delete this account.");


    const accountQuery = useGetAccount(id);
    const editMuation = useEditAccount(id);
    const deleteMuation = useDeleteAccount(id);


    const isPending = editMuation.isPending || deleteMuation.isPending;


    const isLoading = accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        editMuation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMuation.mutate(undefined, {
                onSuccess: () => (
                    onClose()
                )
            });
        }
    }

    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name,

    } : {
        name: ''
    }
    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Account
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing account.
                        </SheetDescription>
                    </SheetHeader>
                    {
                        isLoading ? <div className="absolute flex items-center inset-0 justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div> : <AccountForm onSubmit={onSubmit} id={id} disabled={isPending} defaultValues={defaultValues} onDelete={onDelete} />
                    }
                </SheetContent>
            </Sheet>
        </>
    )
}

export default EditAccountSheet