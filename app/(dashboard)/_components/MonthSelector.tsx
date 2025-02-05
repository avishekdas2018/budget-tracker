"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Period } from '@/lib/types'

import React from 'react'


interface YearSelectorProps {
  period: Period
  setPeriod: (period: Period) => void
}
const MonthSelector = ({ period, setPeriod }: YearSelectorProps) => {
  return (
    <Select value={period.month.toString()} onValueChange={(value) => setPeriod({
      year: period.year,
      month: parseInt(value)
    }) }>
      <SelectTrigger className='w-[120px]'>
        <SelectValue/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {[0,1,2,3,4,5,6,7,8,9,10,11].map((month) => {
            const monthStr = new Date(period.year, month, 1).toLocaleString(
              "default",
              { month: "long" }
            ) 
            return (
            <SelectItem key={month} value={month.toString()}>
              {monthStr}
            </SelectItem>
          )})}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default MonthSelector