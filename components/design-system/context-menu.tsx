"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

/* -------------------------------------------------------------------------------------------------
 * Item types
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuItemDef = {
  type: "item"
  label: string
  shortcut?: string
  icon?: React.ElementType
  disabled?: boolean
  onSelect?: () => void
}

type ContextMenuSeparatorDef = {
  type: "separator"
}

type ContextMenuLabelDef = {
  type: "label"
  label: string
}

export type ContextMenuGroupDef = {
  heading?: string
  items: ContextMenuItemDef[]
}

export type BaseContextMenuItemDef =
  | ContextMenuItemDef
  | ContextMenuSeparatorDef
  | ContextMenuLabelDef

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

type BaseContextMenuProps = {
  /** The element that triggers the context menu on right-click */
  children: React.ReactNode
  /** Flat list of items, separators and labels */
  items: BaseContextMenuItemDef[]
  contentClassName?: string
}

/* -------------------------------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------------------------*/

export function BaseContextMenu({
  children,
  items,
  contentClassName,
}: BaseContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>

      <ContextMenuContent className={cn("w-52", contentClassName)}>
        {items.map((item, i) => {
          if (item.type === "separator") {
            return <ContextMenuSeparator key={i} />
          }

          if (item.type === "label") {
            return (
              <ContextMenuLabel key={i}>
                {item.label}
              </ContextMenuLabel>
            )
          }

          const Icon = item.icon

          return (
            <ContextMenuItem
              key={i}
              disabled={item.disabled}
              onSelect={item.onSelect}
            >
              {Icon && (
                <Icon className="mr-2 size-4 text-muted-foreground" />
              )}
              {item.label}
              {item.shortcut && (
                <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
              )}
            </ContextMenuItem>
          )
        })}
      </ContextMenuContent>
    </ContextMenu>
  )
}

BaseContextMenu.displayName = "BaseContextMenu"
