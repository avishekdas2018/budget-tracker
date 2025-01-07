"use client"

import { CurrencyBox } from '@/components/CurrencyBox'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TransactionType } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'
import CreateCategoryDialog from '../_components/CreateCategoryDialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Category } from '@prisma/client'
import DeleteCategoryDialog from '../_components/DeleteCategoryDialog'
import { useAuth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const ManagePage = () => {
  const { userId } = useAuth()

  if (!userId) {
    redirect("/sign-in")
  }
  return (
    <>
      <div className='border-b bg-card'>
        <div className='flex flex-wrap items-center justify-between gap-6 py-8 px-6'>
          <div>
            <p className='text-3xl font-bold'>Manage</p>
            <p className='text-muted-foreground text-sm lg:text-base'>Manage your account settings and categories</p>
          </div>
        </div>
      </div>

    <div className='flex flex-col gap-4 p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription className='text-sm lg:text-base'>Set your default currency for your transactions</CardDescription>
        </CardHeader>
        <CardContent className='sm:w-1/4'>
          <CurrencyBox/>
        </CardContent>
      </Card>
      <CategoryList type='income'/>
      <CategoryList type='expense'/>
    </div>
    </>
  )
}

export default ManagePage


const CategoryList = ({ type }: { type: TransactionType }) => {
  const categoriesQuery = useQuery({
    queryKey: ['categories', type],
    queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json())
  })

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0
  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              {type === "expense" ? (
                <TrendingDown className='h-12 w-12 items-center p-2 rounded-lg bg-rose-400/10 text-rose-500'/>
              ) : (
                <TrendingUp className='h-12 w-12 items-center p-2 rounded-lg bg-emerald-400/10 text-emerald-500'/>
              )}
              <div className='lg:text-2xl text-base'>
                {type === "expense" ? "Expense" : "Income"} Categories
                <div className='text-muted-foreground text-sm'>
                  Sorted by name
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>

                <CreateCategoryDialog type={type} successCallback={() => categoriesQuery.refetch()} trigger={
                  <Button size={'sm'} className='gap-2 text-sm font-semibold'>
                    <Plus className='h-5 w-5 mr-0 ml-0' />
                  </Button>
                }/>
            </div>
          </CardTitle>
        </CardHeader>
        <Separator/>
        {!dataAvailable && (
          <div className='flex flex-col w-full h-40 items-center justify-center'>
            <p>No{" "} <span className={cn("m-1", type === "income" ? "text-emerald-500" : "text-rose-500")}>{type}</span>{" "}categories yet</p>
            <p className='text-sm text-muted-foreground'>Click + button to get started</p>
          </div>
        )}
        {dataAvailable && (
          <div className='grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {categoriesQuery.data.map((category: Category) => (
              <CategoryItemCard category={category} key={category.name}/>
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  )
}


const CategoryItemCard = ({ category }: { category: Category }) => {
  return (
    <div className='flex flex-col justify-between border-separate rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]'>
      <div className='flex flex-col items-center gap-2 p-4'>
        <span className='text-3xl' role='img'>{category.icon}</span>
        <span className=''>{category.name}</span>
      </div>
      <DeleteCategoryDialog category={category} trigger={
        <Button className='w-full flex border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-rose-500/20 transition duration-300 ease-in-out' variant={"secondary"}>
          <Trash2 className='h-4 w-4' />
          <span>Remove</span>
        </Button>
      }/>
    </div>
  )
}