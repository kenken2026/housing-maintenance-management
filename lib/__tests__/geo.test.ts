import { describe, it, expect, vi, beforeEach } from "vitest"
import { fetchAltitude, fetchPositionByAddress } from "../geo"

vi.mock("ky", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import ky from "ky"

describe("fetchAltitude", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("正常なレスポンスから標高を返す", async () => {
    vi.mocked(ky.get).mockResolvedValue({
      ok: true,
      json: async () => ({ elevation: 35.5, hsrc: "5m" }),
    } as unknown as Response)

    const result = await fetchAltitude({
      longitude: 139.6917,
      latitude: 35.6895,
    })
    expect(result).toBe(35.5)
    expect(ky.get).toHaveBeenCalledWith(
      expect.stringContaining("lon=139.6917&lat=35.6895")
    )
  })

  it("レスポンスがokでない場合undefinedを返す", async () => {
    vi.mocked(ky.get).mockResolvedValue({
      ok: false,
    } as unknown as Response)

    const result = await fetchAltitude({
      longitude: 139.6917,
      latitude: 35.6895,
    })
    expect(result).toBeUndefined()
  })
})

describe("fetchPositionByAddress", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("住所から座標を返す", async () => {
    vi.mocked(ky.post).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        jsonrpc: "2.0",
        result: {
          candidates: [
            {
              fullname: ["東京都", "千代田区"],
              id: 1,
              level: 3,
              name: "千代田区",
              note: "",
              priority: 1,
              x: 139.7536,
              y: 35.6938,
            },
          ],
          matched: "東京都千代田区",
        },
      }),
    } as unknown as Response)

    const result = await fetchPositionByAddress({
      address: "東京都千代田区",
    })
    expect(result).toEqual({
      latitude: 35.6938,
      longitude: 139.7536,
    })
  })

  it("候補がない場合undefinedを返す", async () => {
    vi.mocked(ky.post).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        jsonrpc: "2.0",
        result: {
          candidates: [],
          matched: "",
        },
      }),
    } as unknown as Response)

    const result = await fetchPositionByAddress({
      address: "存在しない住所",
    })
    expect(result).toBeUndefined()
  })

  it("レスポンスがokでない場合undefinedを返す", async () => {
    vi.mocked(ky.post).mockResolvedValue({
      ok: false,
    } as unknown as Response)

    const result = await fetchPositionByAddress({
      address: "東京都千代田区",
    })
    expect(result).toBeUndefined()
  })
})
