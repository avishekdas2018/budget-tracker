import { GetFormatterForCurrency } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview-schema";
import { currentUser } from "@clerk/nextjs/server";
import { endOfDay, startOfDay } from "date-fns";
import { redirect } from "next/navigation";

export async function GET(request: Request) {

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in"); 
  }

  const { searchParams } = new URL(request.url);
  const from = new Date(searchParams.get('from') || '');
  const to = new Date(searchParams.get('to') || '');

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    })
  }

  const transactions = await getTransactionHistory(
    user.id,
    queryParams.data.from,
    queryParams.data.to,
  );

  return Response.json(transactions);
}


export type GetTransactionHistoryResponseType = Awaited<ReturnType<typeof getTransactionHistory>>;

const getTransactionHistory = async (
  userId: string,
  from: Date,
  to: Date,
) => {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    }
  })

  if (!userSettings) {
    throw new Error("User settings not found");
  }

  const formatter = GetFormatterForCurrency(userSettings.currency);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startOfDay(from),
        lte: endOfDay(to),
      },
    },
    orderBy: {
      date: "desc",
    }
  });


  return transactions.map(transactions => ({
    ...transactions,
    formattedAmount: formatter.format(transactions.amount),
  }))
}