import { describe, it, expect } from "vitest"
import { hash, generateIdFromCheck } from "../text"

describe("hash", () => {
  it("同じ文字列から同じハッシュを生成する", () => {
    const result1 = hash("test")
    const result2 = hash("test")
    expect(result1).toBe(result2)
  })

  it("異なる文字列から異なるハッシュを生成する", () => {
    const result1 = hash("test1")
    const result2 = hash("test2")
    expect(result1).not.toBe(result2)
  })

  it("MD5ハッシュ形式（32文字の16進数）を返す", () => {
    const result = hash("test")
    expect(result).toMatch(/^[0-9a-f]{32}$/)
  })

  it("空文字列でもハッシュを返す", () => {
    const result = hash("")
    expect(result).toMatch(/^[0-9a-f]{32}$/)
  })
})

describe("generateIdFromCheck", () => {
  it("チェック項目からIDを生成する", () => {
    const check = {
      largeCategory: "日常点検",
      mediumCategory: "建物",
      smallCategory: "",
      part: "",
      detail: "クラック・爆裂、タイルの浮き･ふくらみ箇所はないか",
    }
    const id = generateIdFromCheck(check)
    expect(id).toMatch(/^[0-9a-f]{32}$/)
  })

  it("同じチェック項目から同じIDを生成する", () => {
    const check = {
      largeCategory: "日常点検",
      mediumCategory: "建物",
      smallCategory: "",
      part: "ベランダ",
      detail: "ゴミ屋敷はないか",
    }
    const id1 = generateIdFromCheck(check)
    const id2 = generateIdFromCheck(check)
    expect(id1).toBe(id2)
  })

  it("異なるチェック項目から異なるIDを生成する", () => {
    const check1 = {
      largeCategory: "日常点検",
      mediumCategory: "建物",
      smallCategory: "",
      part: "ベランダ",
      detail: "ゴミ屋敷はないか",
    }
    const check2 = {
      largeCategory: "日常点検",
      mediumCategory: "建物",
      smallCategory: "",
      part: "階段・廊下",
      detail: "汚れ・放置物はないか",
    }
    expect(generateIdFromCheck(check1)).not.toBe(generateIdFromCheck(check2))
  })

  it("デフォルトチェックリストのIDと一致する", () => {
    // 最初のチェック項目のIDが正しく生成されることを確認
    const check = {
      largeCategory: "日常点検",
      mediumCategory: "建物",
      smallCategory: "",
      part: "",
      detail: "クラック・爆裂、タイルの浮き･ふくらみ箇所はないか",
    }
    const id = generateIdFromCheck(check)
    expect(id).toBe("92ab2cf4353a75a548a55ec5a60025d7")
  })
})
