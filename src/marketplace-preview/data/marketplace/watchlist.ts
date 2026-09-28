import { useCallback, useSyncExternalStore } from 'react'
import { mockListings } from './domains'

// STATIC MOCK DATA — the marketplace's shared watchlist (domain-overview plan
// §6.4). Module level, so a heart toggled in the listings table and one on a
// domain's overview page agree, and survive client side navigation between
// the two (a hard reload resets it, fine for a preview). Real version:
// useGetUserWatchlistQuery + useSetWatchlistMutation behind the same hook
// shape (plan §8.3 item 4).

let watchedIds: ReadonlySet<string> = new Set(mockListings.filter((listing) => listing.isFavorited).map((listing) => listing.id))
const listeners = new Set<() => void>()

// Replaced (never mutated) on every change, so useSyncExternalStore sees a
// new snapshot and re-renders subscribers.
const commit = (next: Set<string>) => {
  watchedIds = next
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => watchedIds

export interface MockWatchlist {
  /** Listing ids, as LiveListingsTable's favoritedIds expects. */
  ids: ReadonlySet<string>
  isWatched: (id: string) => boolean
  toggle: (id: string) => void
  add: (id: string) => void
}

export function useMockWatchlist(): MockWatchlist {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const isWatched = useCallback((id: string) => ids.has(id), [ids])
  const toggle = useCallback((id: string) => {
    const next = new Set(watchedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    commit(next)
  }, [])
  const add = useCallback((id: string) => {
    if (watchedIds.has(id)) return
    commit(new Set(watchedIds).add(id))
  }, [])

  return { ids, isWatched, toggle, add }
}
