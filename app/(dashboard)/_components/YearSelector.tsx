"use client"
import { GetHistoryPeriodsResponseType } from '@/app/api/history-periods/route'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Period } from '@/lib/types'

import React from 'react'


interface YearSelectorProps {
  period: Period
  setPeriod: (period: Period) => void
  year: GetHistoryPeriodsResponseType
}
const YearSelector = ({ period, setPeriod, year }: YearSelectorProps) => {
  return (
    <Select value={period.year.toString()} onValueChange={(value) => setPeriod({
      month: period.month,
      year: parseInt(value)
    }) }>
      <SelectTrigger className='w-[100px]'>
        <SelectValue/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {year.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default YearSelector