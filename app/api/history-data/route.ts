import { getHistoryData } from "@/lib/helpers";
import { getHistoryDataSchema } from "@/schema/history-data-schema";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in"); 
  }

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");


  const queryParams = getHistoryDataSchema.safeParse({
    timeframe,
    month,
    year,
  })

  if (!queryParams.success) {
    return Response.json({
      error: queryParams.error.message,
    }, {
      status: 400,
    });
  }

  const data = await getHistoryData(user.id, queryParams.data.timeframe, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  })

  return Response.json(data);
}