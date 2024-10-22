"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useState } from "react";
import UploadButton from "./upload-button";
import ImportCard from "./import-card";
import { transactions as transactionsSchema } from "@/db/schema"
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT",

}

const INITIAL_IMPORTS_RESULTS = {
    data: [],
    errors: [],
    meta: {}
}

const TransactionPage = () => {
    const [AccountDialog, confirm] = useSelectAccount();

    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORTS_RESULTS);

    const onUpload = (results: typeof INITIAL_IMPORTS_RESULTS) => {
        setImportResults(results);
        setVariant(VARIANTS.IMPORT)
    }

    const onCancelImport = () => {
        setVariant(VARIANTS.LIST);
        setImportResults(INITIAL_IMPORTS_RESULTS)
    }

    const newTransaction = useNewTransaction();
    const createTransactions = useBulkCreateTransactions();
    const transactionsQuery = useTransactions();
    const deleteTransactionQuery = useBulkDeleteTransactions();
    const transactions = transactionsQuery.data || []

    const isDisabled = transactionsQuery.isLoading || deleteTransactionQuery.isPending

    const onSubmitImport = async (values: typeof transactionsSchema.$inferInsert[]) => {
        const accountId = await confirm();
        if (!accountId) {
            return toast.error('Please select an account to continue')
        }

        const data = values.map((value) => ({
            ...value,
            account_Id: accountId as string
        }))


        createTransactions.mutate(data, {
            onSuccess: () => {
                onCancelImport()
            }
        })
    }
    if (transactionsQuery.isLoading) {
        return <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm ">
                <CardHeader >
                    <Skeleton className="h-8 w-48" />
                    <CardContent>
                        <div className="h-[500px] w-full flex items-center justify-center">
                            <Loader2 className="size-6 text-slate-300 animate-spin" />
                        </div>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    }

    if (variant === VARIANTS.IMPORT) {
        return <>
            <div>
                <AccountDialog />
                <ImportCard data={importResults.data} onCancel={onCancelImport} onSubmit={onSubmitImport} />
            </div>
        </>
    }
    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm ">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Transaction Page
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Button onClick={newTransaction.onOpen} size={"sm"}
                            className="w-full lg:w-auto"
                        >
                            <Plus className="size-4 mr-2" />
                            Add new
                        </Button>
                        <UploadButton
                            onUpload={onUpload}
                        />
                    </div>

                </CardHeader>
                <CardContent>
                    <DataTable
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteTransactionQuery.mutate({ ids })
                        }}
                        disabled={isDisabled}
                        filterKey="payee"
                        columns={columns} data={transactions} />
                </CardContent>
            </Card>
        </div>
    )
}

export default TransactionPage