"use client"

import { DateRangePicker } from "@/components/ui/date-range-picker"
import { MAX_DATE_RANGE_DAYS } from "@/lib/constant"
import { differenceInDays, startOfMonth } from "date-fns"
import { useState } from "react"
import { toast } from "sonner"
import TransactionTable from "./_components/TransactionTable"
import { useAuth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const TransactionPage = () => {
  const { userId } = useAuth()

  if (!userId) {
    redirect("/sign-in")
  }
  
  const [dateRange, setDateRange] = useState<{from: Date; to: Date}>({
    from: startOfMonth(new Date()),
    to: new Date
  })
  return (
    <>
    <div className="border-b bg-card">
      <div className="flex flex-wrap items-center justify-between gap-6 py-8 px-6">
        <div>
          <p className="text-3xl font-bold">Transaction history</p>
        </div>
      <DateRangePicker 
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range
              if (!from || !to) {
                return
              }
              console.log("Date range selected:", { from, to });
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(`The selected date range is too big. You can only view up to ${MAX_DATE_RANGE_DAYS} days at a time!`)
                return
              }
              setDateRange({ from, to })
            }}
          />
      </div>
    </div>
    <div className="flex flex-col gap-4 p-4">
      <TransactionTable from={dateRange.from} to={dateRange.to}/>
    </div>
    </>
  )
}

export default TransactionPage