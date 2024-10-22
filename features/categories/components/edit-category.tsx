/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CategoryForm } from "./category-form";
import { insertCategoriesSchema } from "@/db/schema";
import { z } from "zod";
import { useOpenCategory } from "../hooks/use-open-category";
import { useGetCategory } from "../api/use-get-category";
import { Loader2 } from "lucide-react";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";
import { useConfirm } from "@/hooks/use-confirm";

const formSchema = insertCategoriesSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>;


const EditCateorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategory();

    const [ConfirmDialog, confirm] = useConfirm('Are you sure?', "You are about to delete this category.");


    const categoryQuery = useGetCategory(id);
    const editMuation = useEditCategory(id);
    const deleteMuation = useDeleteCategory(id);


    const isPending = editMuation.isPending || deleteMuation.isPending;


    const isLoading = categoryQuery.isLoading;

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

    const defaultValues = categoryQuery.data ? {
        name: categoryQuery.data.name,

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
                            Edit Category
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing category.
                        </SheetDescription>
                    </SheetHeader>
                    {
                        isLoading ? <div className="absolute flex items-center inset-0 justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div> : <CategoryForm onSubmit={onSubmit} id={id} disabled={isPending} defaultValues={defaultValues} onDelete={onDelete} />
                    }
                </SheetContent>
            </Sheet>
        </>
    )
}

export default EditCateorySheet