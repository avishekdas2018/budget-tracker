"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'
import { DeleteTransaction } from '../_actions/deleteTransaction'

interface DeleteTransactionDialogProps {
  transactionId: string
  open: boolean
  setOpen: (open: boolean) => void

}

const DeleteTransactionDialog = ({ transactionId, open, setOpen }: DeleteTransactionDialogProps) => {
  const queryClient = useQueryClient()
  const deleteCategoryMutation = useMutation({
    mutationFn: DeleteTransaction,
    onSuccess: async () => {
      toast.success(`Transaction deleted successfully 🎉`, {
        id: transactionId,
      })

      await queryClient.invalidateQueries({
        queryKey: ["transactions"],
      })
    },
    onError: () => {
      toast.error(`Transaction deletion failed 🥲`, {
        id: transactionId,
      })
    }
  })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete your category.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            toast.loading(`Deleting transaction...`, {
              id: transactionId,
            })
            deleteCategoryMutation.mutate(transactionId)
          }}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteTransactionDialog