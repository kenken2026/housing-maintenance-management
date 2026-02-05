import { describe, it, expect } from "vitest"
import { defaultCheckList } from "../constants/check-list"
import { generateIdFromCheck } from "../text"

describe("defaultCheckList", () => {
  it("空でないチェックリストを持つ", () => {
    expect(defaultCheckList.length).toBeGreaterThan(0)
  })

  it("全ての項目が必須フィールドを持つ", () => {
    for (const item of defaultCheckList) {
      expect(item).toHaveProperty("id")
      expect(item).toHaveProperty("largeCategory")
      expect(item).toHaveProperty("mediumCategory")
      expect(item).toHaveProperty("smallCategory")
      expect(item).toHaveProperty("part")
      expect(item).toHaveProperty("detail")
    }
  })

  it("全てのIDがユニークである", () => {
    const ids = defaultCheckList.map((item) => item.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it("IDがgenerateIdFromCheckと一致する", () => {
    for (const item of defaultCheckList) {
      const expectedId = generateIdFromCheck({
        largeCategory: item.largeCategory,
        mediumCategory: item.mediumCategory,
        smallCategory: item.smallCategory,
        part: item.part,
        detail: item.detail,
      })
      expect(item.id).toBe(expectedId)
    }
  })

  it("日常点検カテゴリの項目が含まれている", () => {
    const dailyChecks = defaultCheckList.filter(
      (item) => item.largeCategory === "日常点検"
    )
    expect(dailyChecks.length).toBeGreaterThan(0)
  })

  it("外壁等カテゴリの項目が含まれている", () => {
    const wallChecks = defaultCheckList.filter(
      (item) => item.largeCategory === "外壁等"
    )
    expect(wallChecks.length).toBeGreaterThan(0)
  })

  it("設備カテゴリの項目が含まれている", () => {
    const equipmentChecks = defaultCheckList.filter(
      (item) => item.largeCategory === "設備"
    )
    expect(equipmentChecks.length).toBeGreaterThan(0)
  })
})
