"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionType } from "@prisma/client";

interface GetExtractProps {
  type: TransactionType;
}

export const GetExtract = async ({ type }: GetExtractProps) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthirize");
  }

  const details = await db.transaction.findMany({
    where: {
      userId,
      type: type,
    },
    orderBy: {
      date: "desc",
    },
  });

  console.log(details);
  return details;
};
