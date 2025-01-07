import { getDaysInMonth } from "date-fns"
import { Currencies } from "./currencies"
import prisma from "./prisma"
import { Period, Timeframe } from "./types"

export const dateToUTCDate = (date: Date) => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    )
  )
}


export type GetBalanceStatsResponseType = Awaited<ReturnType<typeof getBalanceStats>>

export const getBalanceStats = async (userId: string, from: Date, to: Date) => {
  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId: userId,
      date: {
        gte: from,
        lte: to
      }
    },
    _sum: {
      amount: true
    }
  })

  return {
    expense: totals.find(t => t.type === "expense")?._sum.amount || 0,
    income: totals.find(t => t.type === "income")?._sum.amount || 0,
  }
}


export const GetFormatterForCurrency = (currency: string) => {
  const locale = Currencies.find(c => c.value === currency)?.locale


  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency
  })
}


export type GetCategoriesStatsResponseType = Awaited<ReturnType<typeof getCategoriesStats>>

export const getCategoriesStats = async (userId: string, from: Date, to: Date) => {
  const stats = await prisma.transaction.groupBy({
    by: ["type","category", "categoryIcon"],
    where: {
      userId: userId,
      date:{
        gte: from,
        lte: to
      }
    },
    _sum: {
      amount: true
    },
    orderBy: {
      _sum: {
        amount: "desc"
      }
    }
  })

  return stats
}


export type GetHistoryPeriodsResponseType = Awaited<ReturnType<typeof getHistoryData>>

export const getHistoryData = async (userId: string, timeframe:Timeframe, periods: Period) => {
  switch (timeframe) {
    case "year":
      return await getYearHistoryData(userId, periods.year)
    case "month":
      return await getMonthHistoryData(userId, periods.year, periods.month)
  }
}


type HistoryData = {
  expense: number
  income: number
  year: number
  month: number
  day?: number
}


export const getYearHistoryData = async (userId: string, year: number) => {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"],
    where: {
      userId: userId,
      year: year
    },
    _sum: {
      expense: true,
      income: true
    }, 
    orderBy: [
      {
        month: "asc"
      }
    ]
  })

  if (!result || result.length === 0) {
    return []
  }

  const historyData: HistoryData[] = []

  for (let i = 0; i < 12; i++) {
    let expense = 0
    let income = 0

    const month = result.find((row) => row.month === i)

    if (month) {
      expense = month._sum.expense || 0
      income = month._sum.income || 0
    }

    historyData.push({
      year,
      month: i,
      expense,
      income
    })
  }

  return historyData
}


export const getMonthHistoryData = async (userId: string, year: number, month: number) => {
  const result = await prisma.monthHistory.groupBy({
    by: ["day"],
    where: {
      userId: userId,
      year: year,
      month: month
    },
    _sum: {
      expense: true,
      income: true
    },
    orderBy: [
      {
        day: "asc"
      }
    ]
  })

  if (!result || result.length === 0) {
    return []
  }

  const historyData: HistoryData[] = []
  const daysInMonth = getDaysInMonth(new Date(year, month))

  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0
    let income = 0 
    
    const day = result.find((row) => row.day === i)
    if (day) {
      expense = day._sum.expense || 0
      income = day._sum.income || 0
    }

    historyData.push({
      year,
      month,
      day: i,
      expense,
      income
    })
  }
  return historyData
}