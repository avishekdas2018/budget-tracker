"use client";

import SkeletonWrapper from "@/components/SkeletonWrapper";
import { dateToUTCDate, GetBalanceStatsResponseType, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useMemo } from "react";
import StatCard from "./StatCard";


interface StatsCardsProps {
  userSettings: UserSettings
  from: Date
  to: Date
}
const StatsCards = ({ userSettings, from, to }: StatsCardsProps) => {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () => fetch(`/api/stats/balance?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`).then(res => res.json()),
  })

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency)
  }, [userSettings.currency])



  const income = statsQuery.data?.income || 0
  const expense = statsQuery.data?.expense || 0

  const balance = income - expense




  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard formatter={formatter} title="Income" value={income} icon={<TrendingUp className="w-12 h-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10"/>}/>
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard formatter={formatter} title="Expense" value={expense} icon={<TrendingDown className="w-12 h-12 items-center rounded-lg p-2 text-rose-500 bg-rose-400/10"/>}/>
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard formatter={formatter} title="Balance" value={balance} icon={<Wallet className="w-12 h-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10"/>}/>
      </SkeletonWrapper>
    </div>
  )
}

export default StatsCards