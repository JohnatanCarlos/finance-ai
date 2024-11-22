import AddTransactionButton from "@/app/_components/add-transaction-button";
import ShowExtract from "@/app/_components/show-extract";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { TransactionType } from "@prisma/client";
import { ReactNode } from "react";

interface SummaryCardProp {
  icon: ReactNode;
  title: string;
  amount: number;
  type?: TransactionType;
  size?: "small" | "large";
  userCanAddTransaction?: boolean;
}

const SummaryCard = ({
  icon,
  title,
  amount,
  type,
  size = "small",
  userCanAddTransaction,
}: SummaryCardProp) => {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-4">
        {icon}
        <p
          className={`${size === "small" ? "text-muted-foreground" : "text-white opacity-70"}`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent className="flex justify-between">
        <p
          className={`font-bold ${size === "small" ? "text-2xl" : "text-4xl"}`}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>

        {size === "large" && (
          <AddTransactionButton
            userCanAddTransaction={userCanAddTransaction as boolean}
          />
        )}

        {type && <ShowExtract type={type} />}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
