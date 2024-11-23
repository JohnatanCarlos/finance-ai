"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { upsertTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface UpsertTransactionParams {
  id?: string;
  name: string;
  amount: number;
  type: TransactionType;
  fixed: boolean;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const upsertTransaction = async (params: UpsertTransactionParams) => {
  upsertTransactionSchema.parse(params);
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthirize");
  }

  console.log({ ...params });
  debugger;

  await db.transaction.upsert({
    update: { ...params, userId },
    create: { ...params, userId },
    where: {
      id: params?.id ?? "",
    },
  });

  // Se a transação for fixa, criar as transações futuras
  if (params.fixed && !params.id) {
    const currentDate = new Date(params.date);
    const currentMonth = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const transactions = [];

    // Criar transações para os meses seguintes até dezembro
    for (let month = currentMonth + 1; month <= 11; month++) {
      const newDate = new Date(year, month, currentDate.getDate());

      transactions.push({
        ...params,
        date: newDate,
        id: undefined, // Garantir que será criada uma nova transação
      });
    }

    // Inserir todas as transações de uma vez
    await db.transaction.createMany({
      data: transactions.map((t) => ({
        ...t,
        userId,
      })),
    });
  }

  revalidatePath("/transactions");
};
