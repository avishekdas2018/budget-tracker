import { z } from "zod";

export const getHistoryDataSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11),
  year: z.coerce.number().min(2000).max(5000),
})