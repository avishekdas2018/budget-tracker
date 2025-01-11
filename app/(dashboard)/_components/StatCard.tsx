"use client" 

import { Card } from '@/components/ui/card'
import CountUp from 'react-countup'
import React, { ReactNode, useCallback } from 'react'


interface StatCardProps {
  title: string
  value: number
  icon: ReactNode
  formatter: Intl.NumberFormat
}
const StatCard = ({ title, value, icon, formatter }: StatCardProps) => {
  const formatFn = useCallback((value:number) => {
    return formatter.format(value)
  }, [formatter])

  return (
    <Card className='flex h-24 w-full items-center gap-2 p-4'>
        {icon}
      <div className='flex flex-col items-start justify-center'>
        <p className='text-muted-foreground'>{title}</p>
        <CountUp preserveValue redraw={false} end={value} decimals={2} className='text-2xl' formattingFn={formatFn} />
      </div>
    </Card>
  )
}

export default StatCard