import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "./_columns";
import { db } from "../_lib/prisma";
import AddTransactionButton from "../_components/add-transaction-button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import canUserAddTransaction from "../_data/can-user-add-transaction";

const Transactions = async () => {
  // acessar as transacoes do meu banco
  const { userId } = auth();
  if (!userId) {
    redirect("/login");
  }

  const transactions = await db.transaction.findMany({
    where: {
      userId: userId,
    },
  });

  const userAddTransaction = await canUserAddTransaction();

  return (
    <div className="space-y-6 overflow-hidden p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Transações</h1>
        <AddTransactionButton userCanAddTransaction={userAddTransaction} />
      </div>

      <ScrollArea>
        <DataTable
          columns={transactionColumns}
          data={JSON.parse(JSON.stringify(transactions))}
        />
      </ScrollArea>
    </div>
  );
};

export default Transactions;
