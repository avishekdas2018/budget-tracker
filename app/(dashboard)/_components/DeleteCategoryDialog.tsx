"use client"

import { Category } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { DeleteCategory } from '../_actions/categories'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { TransactionType } from '@/lib/types'

interface DeleteCategoryDialogProps {
  trigger: ReactNode
  category: Category
}

const DeleteCategoryDialog = ({ trigger, category }: DeleteCategoryDialogProps) => {
  const categoryIdentifier = `${category.name}-${category.type}`
  const queryClient = useQueryClient()
  const deleteCategoryMutation = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: async () => {
      toast.success(`Category ${category.name} deleted successfully 🎉`, {
        id: categoryIdentifier,
      })

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      })
    },
    onError: () => {
      toast.error(`Category ${category.name} deletion failed 🥲`, {
        id: categoryIdentifier,
      })
    }
  })
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle aria-label='title'>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete your category.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            toast.loading(`Deleting category ${category.name}...`, {
              id: categoryIdentifier,
            })
            deleteCategoryMutation.mutate({
              name: category.name,
              type: category.type as TransactionType,
            })
          }}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCategoryDialog