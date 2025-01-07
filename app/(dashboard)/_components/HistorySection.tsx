"use client"

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GetFormatterForCurrency } from '@/lib/helpers'
import { Period, Timeframe } from '@/lib/types'
import { UserSettings } from '@prisma/client'
import React, { useMemo, useState } from 'react'
import HistoryPeriodSelector from './HistoryPeriodSelector'
import { useQuery } from '@tanstack/react-query'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import CustomTooltip from './CustomTooltip'


interface HistorySectionProps {
  userSettings: UserSettings
}
const HistorySection = ({ userSettings }: HistorySectionProps) => {
  const [timeframe, setTimeframe] = useState<Timeframe>("month")
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  })

  const formatter = useMemo<Intl.NumberFormat>(() => {
    return GetFormatterForCurrency(userSettings.currency)
  }, [userSettings.currency])

  const historyDataQuery = useQuery({
    queryKey: ["overview", "history", timeframe, period],
    queryFn: () => fetch(`/api/history-data?timeframe=${timeframe}&year=${period.year}&month=${period.month}`).then(res => res.json()),
  })

  const dataAvailable = historyDataQuery.data && historyDataQuery.data.length > 0

  return (
    <div className='flex flex-col gap-2 px-6 lg:px-12'>
      <h2 className='mt-12 text-3xl font-bold'>History</h2>
      <Card className='col-span-12 mt-2 w-full'>
        <CardHeader className='gap-2'>
          <CardTitle className='grid grid-flow-row justify-between gap-2 md:grid-flow-col md:justify-between'>
            <HistoryPeriodSelector period={period} setPeriod={setPeriod} timeframe={timeframe} setTimeframe={setTimeframe} />
            <div className='flex h-10 gap-2'>
              <Badge variant={'outline'} className='flex items-center gap-2 text-sm'>
                <div className='h-4 w-4 rounded-full bg-emerald-500'></div>
                <span>Income</span>
              </Badge>
              <Badge variant={'outline'} className='flex items-center gap-2 text-sm'>
                <div className='h-4 w-4 rounded-full bg-rose-500'></div>
                <span>Expense</span>
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
            {dataAvailable && (
              <ResponsiveContainer width={'100%'} height={300}>
                <BarChart height={300} data={historyDataQuery.data} barCategoryGap={5}>
                  <defs>
                    <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={"0"} stopColor='#10b981' stopOpacity={"1"} />
                      <stop offset={"1"} stopColor='#10b981' stopOpacity={"0"} />
                    </linearGradient>
                    <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={"0"} stopColor='#ef4444' stopOpacity={"1"} />
                      <stop offset={"1"} stopColor='#ef4444' stopOpacity={"0"} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray={"5 5"} stopOpacity={"0.2"} vertical={false} />
                  <XAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} padding={{ left: 5, right: 5 }} dataKey={(data) => {
                    const { year, month, day } = data
                    const date = new Date(year, month, day || 1)
                    if (timeframe === "year") {
                      return date.toLocaleDateString("default", {
                        month: "long"
                      })
                    }
                    return date.toLocaleDateString("default", {
                      day: '2-digit'
                    })
                  }} />
                  <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
                  <Bar dataKey={"income"} label="Income" fill="url(#incomeBar)" radius={4} className='cursor-pointer' />
                  <Bar dataKey={"expense"} label="Expense" fill="url(#expenseBar)" radius={4} className='cursor-pointer' />
                  <Tooltip cursor={{ opacity: 0.1 }} content={props => (
                    <CustomTooltip formatter={formatter} {...props} />
                  )}/>
                </BarChart>
              </ResponsiveContainer>
            )}
            {!dataAvailable && (
              <Card className='flex px-2 text-center flex-col items-center justify-center h-[300px] bg-background gap-2'>
                No data available for the selected period
                <p className='text-muted-foreground  text-sm'>
                  Try selecting a different period or adding a new transactions
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  )
}



export default HistorySection