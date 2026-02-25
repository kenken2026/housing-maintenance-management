import { create } from "zustand"

export const useTeamState = create<{
  team?: Team
  setTeam: (team?: Team) => void
}>((set) => ({
  team: undefined,
  setTeam: (team?: Team) => set({ team }),
}))

export const useLoadinfState = create<{
  isLoading: boolean
  loagingMessage?: string
  setLoadingMessage: (mesasge?: string) => void
}>((set) => ({
  isLoading: false,
  loagingMessage: undefined,
  setLoadingMessage: (message?: string) =>
    set({ loagingMessage: message, isLoading: !!message }),
}))
