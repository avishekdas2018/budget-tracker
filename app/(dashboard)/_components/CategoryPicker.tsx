"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TransactionType } from "@/lib/types";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Check, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";


interface CategoryPickerProps {
  type: TransactionType,
  onChange: (value: string) => void
}

const CategoryPicker = ({ type, onChange }: CategoryPickerProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string>("")

  useEffect(() => {
    if (!value) {
      return
    }
    onChange(value)
  }, [onChange, value])
  const categoryQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      const response = await fetch(`/api/categories?type=${type}`)
      const data = await response.json()
      return data
    }
  })

  const selectCategory = categoryQuery.data?.find((category: Category) => category.name === value)

  const successCallback = useCallback((category: Category) => {
    setValue(category.name)
    setOpen((prev) => !prev)
  }, [setValue, setOpen])
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"outline"} role="combobox" aria-expanded={open} size={"default"} className="truncate justify-between">
          {selectCategory ? (

            <CategoryRow category={selectCategory}/>
          ) : (
            "Select category"
          )}
          <ChevronsUpDownIcon className="ml-1 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command onSubmit={e => {
          e.preventDefault()
        }}>
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog type={type} successCallback={successCallback} />
          <CommandEmpty>
            <p>No category found.</p>
            <p className="text-xs text-muted-foreground">Tip: Create a new category</p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoryQuery.data && categoryQuery.data.map((category: Category) => 
              <CommandItem key={category.name} onSelect={() => {
                setValue(category.name)
                setOpen((prev) => !prev)
              }}>
                <CategoryRow category={category} />
                <Check className={cn(
                  "mr-2 h-4 w-4 opacity-0",
                  value === category.name && "opacity-100" 
                )}/>
              </CommandItem>
            )}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CategoryPicker



const CategoryRow = ({ category }: { category: Category }) => {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span className="text-pretty">{category.name}</span>
    </div>
  )
}