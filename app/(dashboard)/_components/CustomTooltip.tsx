/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { cn } from '@/lib/utils'
import React, { useCallback } from 'react'
import CountUp from 'react-countup'



interface CustomTooltipProps {
  formatter: any,
  active?: boolean | undefined,
  payload?: any,
}
const CustomTooltip = ({ formatter, active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0].payload
  const {income, expense} = data

  return (
    <div className='min-w-[300px] rounded border bg-background p-4'>
      <TooltipRow formatter={formatter} label="Expense" value={expense} bgColor="bg-rose-500" textColor="text-rose-500" />
      <TooltipRow formatter={formatter} label="Income" value={income} bgColor="bg-emerald-500" textColor="text-emerald-500" />
      <TooltipRow formatter={formatter} label="Balance" value={income - expense} bgColor="bg-gray-100" textColor="text-foreground" />
    </div>
  )
}


interface TooltipRowProps {
  label: string
  value: number
  bgColor: string
  textColor: string
  formatter: Intl.NumberFormat
}

const TooltipRow = ({ label, value, bgColor, textColor, formatter }: TooltipRowProps) => {
  const formatterFn = useCallback((value: number) => {
    return formatter.format(value)
  }, [formatter])
  return (
    <div className='flex items-center gap-2'>
      <div className={cn("h-4 w-4 rounded-full",bgColor)}></div>
      <div className='flex w-full justify-between'>
        <p className='text-sm text-muted-foreground'>{label}</p>
        <div className={cn("text-sm font-bold", textColor)}>
          <CountUp duration={0.5} preserveValue end={value} decimals={0} formattingFn={formatterFn} className='text-sm' />
        </div>
      </div>
    </div>
  )
}

export default CustomTooltip