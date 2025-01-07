import { getCategoriesStats } from "@/lib/helpers";
import { OverviewQuerySchema } from "@/schema/overview-schema";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser() 

  if (!user) {
    redirect("/sign-in")
  }

  const { searchParams } = new URL(request.url)

  const from = searchParams.get("from")
  const to = searchParams.get("to")

  const queryParams = OverviewQuerySchema.safeParse({from, to})

  if (!queryParams.success) {
    throw new Error(queryParams.error.message)
  }

  const stats = await getCategoriesStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  )

  return Response.json(stats)
}