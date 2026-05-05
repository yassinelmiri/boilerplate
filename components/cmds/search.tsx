"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import { useSearch } from "@/providers/system/search-provider"
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { BaseCmd } from "@/components/design-system/cmd"

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

type SearchItem = {
  label: string
  path: string
  icon: React.ElementType
}

type SearchGroup = {
  heading: string
  items: SearchItem[]
}

/* -------------------------------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------------------------*/

export function SearchCmd() {
  const t = useTranslations()
  const router = useRouter()
  const { open, setOpen } = useSearch()

  const handleSelect = (path: string) => {
    setOpen(false)
    router.push(path)
  }

  const groups: SearchGroup[] = [
  ]

  return (
    <BaseCmd
      title={t("search.title")}
      placeholder={t("search.placeholder")}
      open={open}
      onOpenChange={setOpen}
      navigateLabel={t("cmd.navigate")}
      openLabel={t("cmd.open")}
      closeLabel={t("cmd.close")}
    >
      <CommandEmpty>{t("search.empty")}</CommandEmpty>

      {groups.map((group) => (
        <CommandGroup key={group.heading} heading={group.heading}>
          {group.items.map((item) => {
            const Icon = item.icon

            return (
              <CommandItem
                key={item.path}
                value={item.label}
                onSelect={() => handleSelect(item.path)}
                className="flex items-center gap-2"
              >
                <Icon className="size-4 text-muted-foreground" />
                <span>{item.label}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
      ))}
    </BaseCmd>
  )
}