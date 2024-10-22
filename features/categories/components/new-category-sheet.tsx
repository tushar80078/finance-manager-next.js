/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNewCategory } from "../hooks/use-new-category";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CategoryForm } from "./category-form";
import { insertCategoriesSchema } from "@/db/schema";
import { z } from "zod";
import { useCreatCategory } from "../api/use-create-category";

const formSchema = insertCategoriesSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>;

const NewCategorySheet = () => {
    const { isOpen, onClose } = useNewCategory();
    const mutation = useCreatCategory();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
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
                        New Category
                    </SheetTitle>
                    <SheetDescription>
                        Create a new category to organize your transaction.
                    </SheetDescription>
                </SheetHeader>

                <CategoryForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{ name: "" }} />
            </SheetContent>
        </Sheet>
    )
}

export default NewCategorySheet