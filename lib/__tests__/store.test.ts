import { describe, it, expect, beforeEach } from "vitest"
import { useTeamState } from "../store"

describe("useTeamState", () => {
  beforeEach(() => {
    useTeamState.setState({ team: undefined })
  })

  it("初期状態ではteamがundefined", () => {
    const state = useTeamState.getState()
    expect(state.team).toBeUndefined()
  })

  it("setTeamでチームを設定できる", () => {
    const team: Team = {
      id: 1,
      name: "テストチーム",
      description: "テスト用",
      createdAt: "2024-01-01T00:00:00",
      updatedAt: "2024-01-01T00:00:00",
    }

    useTeamState.getState().setTeam(team)
    const state = useTeamState.getState()

    expect(state.team).toEqual(team)
  })

  it("setTeamでチームをundefinedにリセットできる", () => {
    const team: Team = {
      id: 1,
      name: "テストチーム",
      createdAt: "2024-01-01T00:00:00",
      updatedAt: "2024-01-01T00:00:00",
    }

    useTeamState.getState().setTeam(team)
    useTeamState.getState().setTeam(undefined)
    const state = useTeamState.getState()

    expect(state.team).toBeUndefined()
  })

  it("setTeamでチームを別のチームに切り替えできる", () => {
    const team1: Team = {
      id: 1,
      name: "チーム1",
      createdAt: "2024-01-01T00:00:00",
      updatedAt: "2024-01-01T00:00:00",
    }
    const team2: Team = {
      id: 2,
      name: "チーム2",
      createdAt: "2024-01-02T00:00:00",
      updatedAt: "2024-01-02T00:00:00",
    }

    useTeamState.getState().setTeam(team1)
    expect(useTeamState.getState().team).toEqual(team1)

    useTeamState.getState().setTeam(team2)
    expect(useTeamState.getState().team).toEqual(team2)
  })
})
