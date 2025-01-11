/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { GetTransactionHistoryResponseType } from '@/app/api/transaction-history/route'
import { DataTableColumnHeader } from '@/components/datatable/ColumnHeader'
import { DataTableViewOptions } from '@/components/datatable/ColumnToggle'
import { DataTableFacetedFilter } from '@/components/datatable/FacedDataFilter'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
//import { dateToUTCDate } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import { useMemo, useState } from 'react'
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { Download, MoreHorizontal, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import DeleteTransactionDialog from './DeleteTransactionDialog'
import { endOfDay, startOfDay } from 'date-fns'


interface TransactionTableProps {
  from: Date
  to: Date
}

const emptyData: TransactionHistoryRow[] = []

type TransactionHistoryRow = GetTransactionHistoryResponseType[0]
export const columns: ColumnDef<TransactionHistoryRow>[] = [
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader className='ml-1' column={column} title='Category' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    cell: ({ row }) => (
      <div className='flex capitalize gap-2'>
        {row.original.categoryIcon}
        <div className='capitalize'>{row.original.category}
        </div>
      </div>
    )
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
      <div className='capitalize'>
        {row.original.description}
      </div>
    )
  },
  {
    accessorKey: 'date',
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date)
      const formattedDate = date.toLocaleDateString('default', {
        timeZone: 'UTC',
        year: 'numeric',
        month: "2-digit",
        day: "2-digit"
      })
      return (
        <div className='text-muted-foreground'>
          {formattedDate}
        </div>
      )
    }
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader className='ml-1' column={column} title='Type' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    cell: ({ row }) => (
      <div className={cn("capitalize rounded-lg text-center p-2",
        row.original.type === "income" && "bg-emerald-400/10 text-emerald-500",
        row.original.type === "expense" && "bg-rose-400/10 text-rose-500"
      )}>
        {row.original.type}
      </div>
    )
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader className='ml-1' column={column} title='Amount' />
    ),
    cell: ({ row }) => (
      <p className='text-md rounded-lg p-2 bg-gray-400/5 text-center font-medium'>
        {row.original.formattedAmount}
      </p>
    )
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <RowActions transactions={row.original} />
    )
  }
]


const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
})

const TransactionTable = ({ from, to }: TransactionTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])


  const historyQuery = useQuery<GetTransactionHistoryResponseType>({
    queryKey: ["transactions", "history", from, to],
    queryFn: async () => {
      const fromDate = startOfDay(from)
      const toDate = endOfDay(to)

      return fetch(`/api/transaction-history?from=${fromDate.toISOString()}&to=${toDate.toISOString()}`).then((res) => res.json())
    }
  })

  const handleExportCSV = (data: any[]) => {
    const csv = generateCsv(csvConfig)(data)
    download(csvConfig)(csv)
  }

  const table = useReactTable({
    data: historyQuery.data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })


  const categoriesOptions = useMemo(() => {
    const categoriesMap = new Map()
    historyQuery.data?.forEach((transaction) => {
      categoriesMap.set(transaction.category, {
        value: transaction.category,
        label: `${transaction.categoryIcon} ${transaction.category}`
      })
    })
    const uniqueCategories = new Set(categoriesMap.values())
    return Array.from(uniqueCategories)
  }, [historyQuery.data])

  return (
    <div className='w-full'>
      <div className='flex flex-wrap items-end justify-between py-4 gap-2'>
        <div className='flex gap-2'>
          {table.getColumn("category") && (
            <DataTableFacetedFilter title='Category' options={categoriesOptions} column={table.getColumn("category")} />
          )}
          {table.getColumn("type") && (
            <DataTableFacetedFilter title='Type' options={[
              {
                label: "Income",
                value: "income",
              },
              {
                label: "Expense",
                value: "expense",
              }
            ]} column={table.getColumn("type")} />
          )}
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button variant="outline" size={'sm'} className='ml-auto h-8 lg:flex' onClick={() => {
            const data = table.getFilteredRowModel().rows.map((row) => ({
              category: row.original.category,
              categoryIcon: row.original.categoryIcon,
              description: row.original.description,
              type: row.original.type,
              amount: row.original.amount,
              formattedAmount: row.original.formattedAmount,
              date: row.original.date,
            }))
            handleExportCSV(data)
          }}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <SkeletonWrapper isLoading={historyQuery.isFetching}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4 pb-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      </SkeletonWrapper>
    </div>
  )
}

export default TransactionTable


const RowActions = ({transactions}: {transactions: TransactionHistoryRow}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
    <DeleteTransactionDialog transactionId={transactions.id} open={showDeleteDialog} setOpen={setShowDeleteDialog} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='flex items-center gap-2' onSelect={() => {
            setShowDeleteDialog(prev => !prev)
          }}>
            <Trash2 className='h-4 w-4 text-muted-foreground' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}