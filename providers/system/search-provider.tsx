"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react"

type SearchContextValue = {
  open: boolean
  triggerKey: string
  setOpen: (open: boolean) => void
  openSearch: () => void
  closeSearch: () => void
}

type SearchProviderProps = {
  children: ReactNode
  triggerKey: string
}

const SearchContext = createContext<SearchContextValue | null>(null)

function SearchProvider({
  children,
  triggerKey,
}: SearchProviderProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === triggerKey) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [triggerKey])

  const openSearch = useCallback(() => setOpen(true), [])
  const closeSearch = useCallback(() => setOpen(false), [])

  const value = useMemo<SearchContextValue>(
    () => ({ open, triggerKey, setOpen, openSearch, closeSearch }),
    [open, triggerKey, openSearch, closeSearch],
  )

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error("useSearch must be used within <SearchProvider>")
  return ctx
}

function useSearchOptional(): SearchContextValue | null {
  return useContext(SearchContext)
}

export { SearchProvider, useSearch, useSearchOptional }
export type { SearchContextValue, SearchProviderProps }