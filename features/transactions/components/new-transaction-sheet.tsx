/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNewTransaction } from "../hooks/use-new-transaction";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { insertTransactionSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateTransaction } from "../api/use-create-transaction";
import { useCreatCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { TransactionForm } from "./transaction-form";
import { Loader2 } from "lucide-react";

const formSchema = insertTransactionSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>;

const NewTransactionSheet = () => {
    const { isOpen, onClose } = useNewTransaction();
    const createMutation = useCreateTransaction();

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

    const isPending = createMutation.isPending || categoryMutation.isPending || accountMutation.isPending;
    const isLoading = categoryQuery.isLoading || accountQuery.isLoading

    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    }
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Add a new transaction
                    </SheetDescription>
                </SheetHeader>
                {
                    isLoading ?
                        <>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                            </div>
                        </>
                        : <TransactionForm
                            onSubmit={onSubmit}
                            disabled={isPending}
                            categoryOptions={cateogryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            onCreateAccount={onCreateaccount}
                        />
                }
            </SheetContent>
        </Sheet>
    )
}

export default NewTransactionSheet