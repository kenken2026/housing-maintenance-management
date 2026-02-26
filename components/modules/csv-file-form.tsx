import { isTauri } from "@tauri-apps/api/core"
import { message } from "@tauri-apps/plugin-dialog"
import { ChangeEvent, FC, useRef, useState } from "react"

const parseCSV = (text: string): string[][] => {
  const normalized = text
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")

  const rows: string[][] = []
  for (const line of normalized.split("\n")) {
    if (!line.trim()) continue
    const cells: string[] = []
    let i = 0
    while (i < line.length) {
      if (line[i] === '"') {
        let val = ""
        i++
        while (i < line.length) {
          if (line[i] === '"' && line[i + 1] === '"') {
            val += '"'
            i += 2
          } else if (line[i] === '"') {
            i++
            break
          } else {
            val += line[i++]
          }
        }
        cells.push(val)
        if (line[i] === ",") i++
      } else {
        const end = line.indexOf(",", i)
        if (end === -1) {
          cells.push(line.slice(i))
          break
        } else {
          cells.push(line.slice(i, end))
          i = end + 1
        }
      }
    }
    rows.push(cells)
  }
  return rows
}

export const CSVFileForm: FC<{
  onChange?: (text: string) => boolean
}> = ({ onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<string[][]>([])

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      if (typeof result !== "string") return
      setRows(parseCSV(result))
      const isValid = onChange?.(result)
      if (isValid === false) {
        if (isTauri()) {
          message("CSVの内容が不正です。", "エラー")
        } else {
          alert("CSVの内容が不正です。")
        }
        setRows([])
      }
    }
    reader.readAsText(file)
  }

  const headers = rows[0] ?? []
  const dataRows = rows.slice(1)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        aria-hidden={true}
        style={{
          background: "#e9e9e9",
          borderRadius: ".25rem",
          cursor: "pointer",
          display: "inline-block",
          fontSize: ".75rem",
          fontWeight: "bold",
          padding: ".375rem .75rem",
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        CSVファイルを選択
      </div>
      <input
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleChange}
      />
      {rows.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              borderCollapse: "collapse",
              fontSize: ".75rem",
              minWidth: "100%",
            }}
          >
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    style={{
                      background: "#555",
                      color: "#fff",
                      padding: ".375rem .75rem",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => (
                <tr
                  key={ri}
                  style={{ background: ri % 2 === 0 ? "#fff" : "#f5f5f5" }}
                >
                  {headers.map((_, ci) => (
                    <td
                      key={ci}
                      style={{
                        borderTop: "1px solid #eee",
                        padding: ".375rem .75rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row[ci] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
