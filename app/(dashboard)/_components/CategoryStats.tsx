"use client";

import SkeletonWrapper from '@/components/SkeletonWrapper';
import { dateToUTCDate, GetCategoriesStatsResponseType, GetFormatterForCurrency } from '@/lib/helpers';
import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import CategoryCard from './CategoryCard';



interface CategoryStatsProps {
  userSettings: UserSettings
  from: Date
  to: Date
}
const CategoryStats = ({ userSettings, from, to }: CategoryStatsProps) => {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () => fetch(`/api/stats/categories?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`).then(res => res.json()),
  })


  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency)
  }, [userSettings.currency])




  return (
    <div className='flex w-full flex-wrap gap-2 md:flex-nowrap'>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoryCard formatter={formatter} type='income' data={statsQuery.data || []} />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoryCard formatter={formatter} type='expense' data={statsQuery.data || []} />
      </SkeletonWrapper>
    </div>
  )
}

export default CategoryStats