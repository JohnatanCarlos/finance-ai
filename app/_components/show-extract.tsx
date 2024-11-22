"use client";

import { useState } from "react";
import { GetExtract } from "../_data/get-extract";
import { formatCurrency } from "../_utils/currency";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Transaction, TransactionType } from "@prisma/client";
import {
  TRANSACTION_PAYMENT_METHOD_ICONS,
  TRANSACTION_TYPE_OPTIONS,
} from "../_constants/transactions";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface ShowExtractProps {
  type: TransactionType;
}

const getAmountColor = (transaction: Transaction) => {
  if (transaction.type === TransactionType.EXPENSE) {
    return "text-danger";
  }

  if (transaction.type === TransactionType.DEPOSIT) {
    return "text-primary";
  }

  return "text-white";
};

const getAmountPrefix = (transaction: Transaction) => {
  if (transaction.type === TransactionType.DEPOSIT) {
    return "+";
  }

  if (transaction.type === TransactionType.EXPENSE) {
    return "-";
  }

  return "";
};

const ShowExtract = ({ type }: ShowExtractProps) => {
  const [allTransaction, setAllTransaction] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const showMoreDetails = async () => {
    try {
      setLoading(true);
      const trasanctions = await GetExtract({ type });
      setAllTransaction(trasanctions);
      console.log(allTransaction);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" onClick={showMoreDetails}>
          Extrato
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[80vh] max-w-lg overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {
              TRANSACTION_TYPE_OPTIONS.find((option) => option.value === type)
                ?.label
            }
          </DialogTitle>
          <DialogDescription>
            confira as últimas informações abaixo
          </DialogDescription>
        </DialogHeader>
        <Separator orientation="horizontal" />
        <ScrollArea className="h-[calc(80vh-100px)] gap-4">
          <div className="flex flex-col gap-4 pr-3">
            {loading &&
              [...Array(10)].map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-11 w-11" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              ))}

            {!loading &&
              allTransaction.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white bg-opacity-[3%] p-3 text-white">
                      <Image
                        src={`/${TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod]}`}
                        height={20}
                        width={20}
                        alt="PIX"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-bold ${getAmountColor(transaction)}`}
                  >
                    {getAmountPrefix(transaction)}
                    {formatCurrency(Number(transaction.amount))}
                  </p>
                </div>
              ))}

            {!loading && !allTransaction.length && (
              <p className="text-center text-white">
                Não encontramos nenhum resultado!
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ShowExtract;
