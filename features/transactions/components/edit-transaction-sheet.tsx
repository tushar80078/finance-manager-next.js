/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TransactionForm } from "./transaction-form";
import { insertTransactionSchema } from "@/db/schema";
import { z } from "zod";
import { useOpenTransaction } from "../hooks/use-open-transactions";
import { useGetTransaction } from "../api/use-get-tranaction";
import { Loader2 } from "lucide-react";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreatCategory } from "@/features/categories/api/use-create-category";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

const formSchema = insertTransactionSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>;


const EditTransactionSheet = () => {
    const { isOpen, onClose, id } = useOpenTransaction();

    const [ConfirmDialog, confirm] = useConfirm('Are you sure?', "You are about to delete this transaction.");


    const transactionQuery = useGetTransaction(id);
    const editMuation = useEditTransaction(id);
    const deleteMuation = useDeleteTransaction(id);

    const categoryQuery = useGetCategories();
    const categoryMutation = useCreatCategory();
    const onCreateCategory = (name: string) => {
        categoryMutation.mutate({
            name
        })
    }
    const cateogryOptions = (categoryQuery?.data ?? []).map((category) => {
        return {
            label: category.name,
            value: category.id,
        }
    });

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateaccount = (name: string) => {
        accountMutation.mutate({
            name
        })
    }
    const accountOptions = (accountQuery?.data ?? []).map((account) => {
        return {
            label: account.name,
            value: account.id,
        }
    });



    const isPending = editMuation.isPending || deleteMuation.isPending || transactionQuery.isLoading || categoryMutation.isPending || accountMutation.isPending;


    const isLoading = transactionQuery.isLoading || transactionQuery.isLoading || categoryQuery.isLoading;

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

    const defaultValues = transactionQuery.data ? {
        account_Id: transactionQuery.data.accountId,
        category_Id: transactionQuery.data.category_Id ?? undefined,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes

    } : {
        account_Id: '',
        category_Id: '',
        amount: '',
        payee: '',
        notes: '',
        date: new Date(),
    }
    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Transaction
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing transaction.
                        </SheetDescription>
                    </SheetHeader>
                    {
                        isLoading ? <div className="absolute flex items-center inset-0 justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div> : <TransactionForm
                            id={id}
                            defaultValues={defaultValues}
                            onSubmit={onSubmit}
                            onDelete={onDelete}
                            disabled={isPending}
                            categoryOptions={cateogryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            onCreateAccount={onCreateaccount} />
                    }
                </SheetContent>
            </Sheet>
        </>
    )
}

export default EditTransactionSheet