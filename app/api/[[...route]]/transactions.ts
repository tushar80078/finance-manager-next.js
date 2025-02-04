
import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { transactions,  insertTransactionSchema, categories, accounts } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { z } from "zod";
import {zValidator} from "@hono/zod-validator"
import {createId} from "@paralleldrive/cuid2"
import {parse, subDays} from "date-fns"

const app = new Hono()
    .get(
     '/',
     zValidator("query",z.object({
            from:z.string().optional(),
            to:z.string().optional(),
            accountId:z.string().optional()
        })),
    clerkMiddleware(),
    async (c)=>{
        const auth = getAuth(c);
        const {accountId, from, to} = c.req.valid("query");

        if(!auth?.userId)
        {
            return c.json({error:"Unauthorised"},401)
        }

        const defualtTo = new Date();
        const defualtFrom = subDays(defualtTo, 30);

        const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defualtFrom;
        const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defualtTo;

        const data = await db
        .select({
            id:transactions.id,
            date : transactions.date,
            category:categories.name,
            category_Id:transactions.category_Id,
            payee : transactions.payee,
            amount : transactions.amount,
            notes : transactions.notes,
            account :accounts.name,
            accountId:transactions.account_Id
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.account_Id, accounts.id))
        .leftJoin(categories,eq(transactions.category_Id, categories.id))
        .where(
            and(
                accountId ? eq(transactions.account_Id, accountId) : undefined,
                eq(accounts.userId, auth.userId),
                gte(transactions.date, startDate),
                lte(transactions.date, endDate),
            )
        ).orderBy(desc(transactions.date))

    return c.json({data})
})
.get(
    "/:id",
    zValidator("param",z.object({
        id:z.string().optional()
    })),
    clerkMiddleware(),
    async (c)=>{
        const auth = await getAuth(c);
        const {id} = c.req.valid("param");

        if(!id){
            return c.json({error:"Missing id"}, 400)
        }

        if(!auth?.userId){
            return c.json({error:"Unauthorized"}, 401)
        }

        const [data] = await db
        .select({
            id:transactions.id,
            date : transactions.date,
            category_Id:transactions.category_Id,
            payee : transactions.payee,
            amount : transactions.amount,
            notes : transactions.notes,
            accountId:transactions.account_Id
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.account_Id, accounts.id))
        .where(
            and(
                eq(transactions.id, id),
                eq(accounts.userId, auth.userId)
            ),
        );

        if(!data){
            return c.json({error:"Not found"}, 404)
        }

        return c.json({data});
    }
)
.post(
    "/",
    clerkMiddleware(),
    zValidator("json",insertTransactionSchema.omit({
        id:true
    })),
    async(c)=>{
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if(!auth?.userId){
        return c.json({error:"Unauthorised"}, 401);
    }

    const [data] = await db
    .insert(transactions)
    .values({
        id:createId(),
        ...values,
    })
    .returning()

    return c.json({data});
})
.post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json",z.object({
        ids:z.array(z.string())
    })),
    async(c)=>{
        const auth = getAuth(c);
        const values = c.req.valid("json");

        if(!auth?.userId){
            return c.json({error:"Unauthorised"},401)
        }

        const transactionsToDelete = db.$with("transactions_to_delete").as(
            db.select({id:transactions.id}).from(transactions)
            .innerJoin(accounts, eq(transactions.account_Id, accounts.id))
            .where(
                and(
                    inArray(transactions.id, values.ids),
                    eq(accounts.userId, auth.userId)
                )
            )
        );

        const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
            inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
        )
        .returning({
            id:transactions.id,
        })
       

        return c.json({data})
    }
    
)
.patch(
    "/:id",
     clerkMiddleware(), 
     zValidator(
        "param",
         z.object({
        id:z.string().optional()
        })),
        zValidator(
            "json",
            insertTransactionSchema.omit({
                id:true
            })
        ),
        async(c)=>{
            const auth = getAuth(c);
            const {id} = c.req.valid("param")
            const values = c.req.valid("json");

            if(!id){
                return c.json({error:"Missing Id"},400)
            }
            
            if(!auth?.userId){
                return c.json({error:"Unauthorised"},401)
            }

            const transactionsToUpdate = db.$with("transactions_to_update").as(
                db.select({id:transactions.id}).from(transactions)
                .innerJoin(accounts, eq(transactions.account_Id, accounts.id))
                .where(
                    and(
                        eq(transactions.id, id),
                        eq(accounts.userId, auth.userId)
                    )
                )
            );
           
            const [data] = await db
            .with(transactionsToUpdate)
            .update(transactions)
            .set(values)
            .where(
                inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)
            )
            .returning()
           

            if(!data){
                return c.json({error:"Not found"}, 404)
            }

            return c.json({data});
        }
)
.delete(
    "/:id",
     clerkMiddleware(), 
     zValidator(
        "param",
         z.object({
        id:z.string().optional()
        })),
        async(c)=>{
            const auth = getAuth(c);
            const {id} = c.req.valid("param")

            if(!id){
                return c.json({error:"Missing Id"},400)
            }
            
            if(!auth?.userId){
                return c.json({error:"Unauthorised"},401)
            }

            const transactionsToDelete = db.$with("transactions_to_delete").as(
                db.select({id:transactions.id}).from(transactions)
                .innerJoin(accounts, eq(transactions.account_Id, accounts.id))
                .where(
                    and(
                        eq(transactions.id, id),
                        eq(accounts.userId, auth.userId)
                    )
                )
            );
           
            const [data] = await db
            .with(transactionsToDelete)
            .delete(transactions)
            .where(
                inArray(
                    transactions.id,
                    sql`(select id from ${transactionsToDelete})`
                )
            )
            .returning({
                id:transactions.id
            })

            if(!data){
                return c.json({error:"Not found"}, 404)
            }

            return c.json({data});
        }
)
.post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
        "json",
        z.array(
            insertTransactionSchema.omit({
                id:true
            }),
        ),
    ),
    async (c)=>{
        const auth = getAuth(c);
        const values = c.req.valid("json");

        if(!auth?.userId){
            return c.json({error:"Unauthorized"}, 401)
        }

        const data = await db
        .insert(transactions)
        .values(
            values.map((value)=>({
                id:createId(),
                ...value
            }))
        ).returning();

        return c.json({data});
    }
)



export default app;