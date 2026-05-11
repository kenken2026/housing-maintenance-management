"use client"

import { FC, useRef, useState } from "react"
import { Button } from "components/elements/form"
import { exportDB, importDB } from "lib/db-backup"

export const DBBackup: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<"idle" | "importing" | "done" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleExport = async () => {
    try {
      await exportDB()
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e))
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const confirmed = window.confirm(
      "現在のデータをすべて削除してバックアップから復元します。よろしいですか？"
    )
    if (!confirmed) {
      e.target.value = ""
      return
    }

    setStatus("importing")
    setErrorMessage("")
    try {
      await importDB(file)
      setStatus("done")
      window.location.reload()
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : String(err))
    } finally {
      e.target.value = ""
    }
  }

  return (
    <div style={{ display: "flex", flexFlow: "column", gap: ".25rem" }}>
      <p style={{ fontSize: ".75rem", fontWeight: "bold" }}>データバックアップ</p>
      <div style={{ display: "flex", gap: ".5rem" }}>
        <Button type="button" onClick={handleExport}>
          エクスポート
        </Button>
        <Button
          type="button"
          onClick={handleImportClick}
          disabled={status === "importing"}
        >
          {status === "importing" ? "インポート中..." : "インポート"}
        </Button>
      </div>
      {status === "error" && (
        <p style={{ color: "red", fontSize: ".75rem" }}>{errorMessage}</p>
      )}
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  )
}
