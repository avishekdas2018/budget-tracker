import { getBalanceStats } from "@/lib/helpers";
import { OverviewQuerySchema } from "@/schema/overview-schema";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const { searchParams } = new URL(request.url)
  const from = new Date(searchParams.get('from') || '');
  const to = new Date(searchParams.get('to') || '');

  const queryParams = OverviewQuerySchema.safeParse({from, to})

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, { status: 400 })
  }
  

  const stats = await getBalanceStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  )

  return Response.json(stats)
}