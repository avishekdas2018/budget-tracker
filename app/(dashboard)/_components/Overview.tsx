"use client"
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { MAX_DATE_RANGE_DAYS } from '@/lib/constant'
import { UserSettings } from '@prisma/client'
import { differenceInDays, startOfMonth } from 'date-fns'
import React, { useState } from 'react'
import { toast } from 'sonner'
import StatsCards from './StatsCards'
import CategoryStats from './CategoryStats'

interface OverviewProps {
  userSettings: UserSettings
}
const Overview = ({ userSettings }: OverviewProps) => {
  const [dateRange, setDateRange] = useState<{from: Date; to: Date}>({
    from: startOfMonth(new Date()),
    to: new Date()
  })



  return (
    <>
      <div className='flex flex-wrap items-center justify-between gap-2 py-6 px-10'>
        <h2 className='text-3xl font-bold'>Overview</h2>
        <div className='flex items-center gap-3'>
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
      <div className='px-6 lg:px-12 flex flex-col w-full gap-2'>
        <StatsCards userSettings={userSettings} from={dateRange.from} to={dateRange.to} />
        <CategoryStats userSettings={userSettings} from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  )
}

export default Overview