import { Button } from "@/app/_components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Transaction, TransactionType } from "@prisma/client";

import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/app/_utils/currency";
import { TRANSACTION_PAYMENT_METHOD_ICONS } from "@/app/_constants/transactions";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { Separator } from "@/app/_components/ui/separator";
import InformativeNotResult from "@/app/_components/informative-not-result";

interface LastTransactionsProps {
  lastTransactions: Transaction[];
}

const LastTransactions = ({ lastTransactions }: LastTransactionsProps) => {
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

    return "-";
  };

  return (
    <ScrollArea className="rounded-md border">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-bold">Últimas Transações</CardTitle>
        <Button variant="outline" className="rounded-full font-bold" asChild>
          <Link href="/transactions">Ver mais</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator orientation="horizontal" />

        {lastTransactions.map((transaction) => (
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
                  {new Date(transaction.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <p className={`text-sm font-bold ${getAmountColor(transaction)}`}>
              {getAmountPrefix(transaction)}
              {formatCurrency(Number(transaction.amount))}
            </p>
          </div>
        ))}

        {!lastTransactions.length && (
          <InformativeNotResult
            message="Realize sua primeira transação do mês"
            emoji="&#128178;"
          />
        )}
      </CardContent>
    </ScrollArea>
  );
};

export default LastTransactions;
