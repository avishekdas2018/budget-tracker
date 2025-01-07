"use server"

import prisma from "@/lib/prisma"
import { CreateCategorySchema, CreateCategorySchemaType } from "@/schema/create-category-schema"
import { DeleteCategorySchema, DeleteCategorySchemaType } from "@/schema/delete-category-schema"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"


export const CreateCategory = async (form: CreateCategorySchemaType) => {
  const parsedData = CreateCategorySchema.safeParse(form)

  if (!parsedData.success) {
    throw new Error("Invalid data")
  }

  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const { name, icon, type } = parsedData.data

  return await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    }
  })
}


export const DeleteCategory = async (form: DeleteCategorySchemaType) => {
  const parsedData = DeleteCategorySchema.safeParse(form)

  if (!parsedData.success) {
    throw new Error("Invalid data")
  }

  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }


  return await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: parsedData.data.name,
        type: parsedData.data.type,
      }
    }
  })


}