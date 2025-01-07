import { z } from "zod";

export const DeleteCategorySchema = z.object({
  name: z.string().min(3).max(20),
  type: z.enum(["income", "expense"]),
})

export type DeleteCategorySchemaType = z.infer<typeof DeleteCategorySchema>;