"use server"

import prisma from "@/lib/prisma"
import { UpdateUserCurrencySchema } from "@/schema/user-settings-schema"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export const UpdateUserCurrency = async (currency: string) => {
  const parseData = UpdateUserCurrencySchema.safeParse({
    currency
  })


  if (!parseData.success) {
    throw new Error(parseData.error.message)
  }

  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const userSettings = await prisma.userSettings.update({
    where: {
      userId: user.id,
    },
    data: {
      currency,
    },
  })

  return userSettings
}