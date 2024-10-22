import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";
import {relations} from "drizzle-orm"
import { z } from "zod";

export const accounts = pgTable("accounts",{
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name:text("name").notNull(),
    userId:text("user_id").notNull(),
})

export const accountsRelations = relations(accounts, ({many})=>({
    transactions : many(transactions),
}))

export const insertAccountSchema = createInsertSchema(accounts);

export const categories = pgTable("categories",{
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name:text("name").notNull(),
    userId:text("user_id").notNull(),
})

export const categoriesRelations = relations(categories, ({many})=>({
    transactions : many(transactions),
}))

export const insertCategoriesSchema = createInsertSchema(categories);

export const transactions = pgTable("transactions",{
    id: text("id").primaryKey(),
    amount : integer("amount").notNull(),
    payee: text("payee").notNull(),
    notes : text("notes"),
    date: timestamp("date",{mode:"date"}).notNull(),
    account_Id : text("account_Id").references(()=>accounts.id, {
        onDelete:"cascade",
    }).notNull(),
    category_Id : text("category_Id").references(()=>categories.id,{
        onDelete:"set null",
    })
})

export const transactionsRelations = relations(transactions, ({one})=>({
    accounts : one(accounts,{
        fields:[transactions.account_Id],
        references:[accounts.id]
    }),
    categories : one(categories,{
        fields:[transactions.category_Id],
        references:[categories.id]
    }),
}))

export const insertTransactionSchema = createInsertSchema(transactions,{
    date:z.coerce.date()
});
