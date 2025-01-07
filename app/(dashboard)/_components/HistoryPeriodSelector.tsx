"use client"
import { GetHistoryPeriodsResponseType } from '@/app/api/history-periods/route'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Period, Timeframe } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import YearSelector from './YearSelector'
import MonthSelector from './MonthSelector'


interface HistoryPeriodSelectorProps {
  period: Period
  setPeriod: (period: Period) => void
  timeframe: Timeframe
  setTimeframe: (timeframe: Timeframe) => void
}
const HistoryPeriodSelector = ({ period, setPeriod, timeframe, setTimeframe }: HistoryPeriodSelectorProps) => {
  const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
    queryKey: ["overview", "history", "periods"],
    queryFn: () => fetch(`/api/history-periods`).then(res => res.json()),
  })

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
        <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as Timeframe)}>
          <TabsList>
            <TabsTrigger value='year'>Year</TabsTrigger>
            <TabsTrigger value='month'>Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className='flex flew-wrap items-center gap-2'>
        <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
          <YearSelector period={period} setPeriod={setPeriod} year={historyPeriods.data || []} />  
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
            <MonthSelector period={period} setPeriod={setPeriod} /> 
          </SkeletonWrapper>
        )}
      </div>
    </div>
  )
}

export default HistoryPeriodSelector