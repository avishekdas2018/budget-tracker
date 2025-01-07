"use client"
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { GetCategoriesStatsResponseType } from '@/lib/helpers'
import { TransactionType } from '@/lib/types'
import React from 'react'

interface CategoryCardProps {
  type: TransactionType
  data: GetCategoriesStatsResponseType
  formatter: Intl.NumberFormat
}
const CategoryCard = ({ type, data, formatter }: CategoryCardProps) => {
  const filteredData = data.filter((el) => el.type === type)
  const total = filteredData.reduce((acc, el) => acc + (el._sum.amount || 0), 0)


  return (
    <Card className='h-80 w-full col-span-6'>
      <CardHeader>
        <CardTitle className='grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col'>
          {type === "income" ? "Income" : "Expense"} by category
        </CardTitle>
      </CardHeader>
      <div className='flex items-center justify-center gap-2'>
        {filteredData.length === 0 && (
          <div className='flex h-60 w-full flex-col items-center justify-center gap-2'>
            No data available for selected period
            <p className='text-sm px-2 text-center text-muted-foreground'>
              Try selecting a different period or try adding new{" "}
              {type === "income" ? "income" : "expense"} transactions
            </p>
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className='h-60 w-full px-4'>
            <div className='flex w-full flex-col gap-4 p-4'>
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0
                const percentage = (amount * 100) / (total || amount)


                return (
                  <div className='flex flex-col gap-2' key={item.category}>
                    <div className='flex items-center justify-between'>
                      <span className='flex items-center text-gray-400'>
                        {item.categoryIcon} {item.category}
                        <span className='ml-2 text-xs text-muted-foreground'>
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span className='text-sm text-gray-400'>
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress value={percentage} indicator={type === "income" ? "bg-green-500" : "bg-rose-500"} />
                  </div>
                )
              })}            
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  )
}

export default CategoryCard