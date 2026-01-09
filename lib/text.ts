import { md5 } from "js-md5"

export const hash = (text: string) => md5(text)

export const generateIdFromCheck = (check: Omit<CheckTemplate, "id">) =>
  hash(
    [
      check.largeCategory,
      check.mediumCategory,
      check.smallCategory,
      check.part,
      check.detail,
    ].join("-")
  )
