import { Button } from "components/elements/form"
import { Modal } from "components/elements/modal"
import { FC, useEffect, useState } from "react"
import { InspectForm } from "./inspect-form"
import { inspectModel } from "lib/models/inspect"
import { isTauri } from "@tauri-apps/api/core"
import { ask } from "@tauri-apps/plugin-dialog"
import { OuteriorUnits, ResidenceUnits } from "lib/constants"

const escapeCSV = (value: string | undefined): string => {
  const s = value ?? ""
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

const getUnitName = (uid: string): string => {
  const exterior = OuteriorUnits.find((u) => u.uid === uid)
  if (exterior) return exterior.name
  const residence = ResidenceUnits.find((u) => u.uid === uid)
  if (residence) return residence.name
  const roomMatch = uid.match(/^f(\d+)r(\d+)$/)
  if (roomMatch)
    return `${parseInt(roomMatch[1]) + 1}階 部屋${parseInt(roomMatch[2]) + 1}`
  const stairMatch = uid.match(/^f(\d+)s(\d+)$/)
  if (stairMatch)
    return `${parseInt(stairMatch[1]) + 1}階 階段${parseInt(stairMatch[2]) + 1}`
  return uid
}

const buildCSV = (house: House, inspect: Inspect): string => {
  const headers = [
    "棟名",
    "点検日",
    "ステータス",
    "説明",
    "ユニット",
    "大項目",
    "中項目",
    "小項目",
    "部位",
    "詳細",
    "ランク",
  ]
  const status = inspect.status === "in_progress" ? "点検中" : "点検済み"
  const baseRow = [
    house.name,
    new Date(inspect.createdAt).toLocaleDateString(),
    status,
    inspect.description ?? "",
  ]

  const rows: string[][] = []
  const payload = inspect.payload ?? []

  if (payload.length === 0) {
    rows.push([...baseRow, "", "", "", "", "", "", ""])
  } else {
    for (const unitCheck of payload) {
      const unitName = getUnitName(unitCheck.uid)
      if (unitCheck.checkList.length === 0) {
        rows.push([...baseRow, unitName, "", "", "", "", "", ""])
      } else {
        for (const check of unitCheck.checkList) {
          rows.push([
            ...baseRow,
            unitName,
            check.largeCategory,
            check.mediumCategory,
            check.smallCategory,
            check.part,
            check.detail,
            check.rank ?? "",
          ])
        }
      }
    }
  }

  const csvRows = [
    headers.map(escapeCSV).join(","),
    ...rows.map((r) => r.map(escapeCSV).join(",")),
  ]
  return "\uFEFF" + csvRows.join("\r\n")
}

export const InspectList: FC<{
  house: House
}> = ({ house }) => {
  const [editingInspect, setEditingInspect] = useState<Inspect>()
  const [isOpenInspectModal, setIsOpenInspectModal] = useState<boolean>(false)
  const [inspects, setInspects] = useState<Inspect[]>()
  useEffect(() => {
    const fetchInspects = async () => {
      const inspects = await inspectModel().index({ houseId: house.id })
      setInspects(inspects)
    }
    fetchInspects()
  }, [house.id])

  const handleCSVExport = (inspect: Inspect) => async () => {
    const csv = buildCSV(house, inspect)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${house.name}_${new Date(inspect.createdAt).toLocaleDateString("sv")}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <>
      {inspects && (
        <div>
          <h3>点検履歴</h3>
          <div style={{ padding: ".5rem" }}>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
              }}
            >
              <thead>
                <tr>
                  <td>点検日</td>
                  <td>ステータス</td>
                  <td>説明</td>
                  <td>最終更新</td>
                </tr>
              </thead>
              <tbody>
                {inspects.map((inspect) => (
                  <tr
                    key={inspect.id}
                    style={{
                      borderTop: "solid 2px #eee",
                      padding: ".25rem",
                    }}
                  >
                    <td>{new Date(inspect.createdAt).toLocaleDateString()}</td>
                    <td>
                      {inspect.status == "in_progress" ? "点検中" : "点検済み"}
                    </td>
                    <td>{inspect.description}</td>
                    <td>{new Date(inspect.updatedAt).toLocaleString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: ".5rem" }}>
                        <div
                          aria-hidden={true}
                          style={{
                            color: "#393",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={handleCSVExport(inspect)}
                        >
                          CSV出力
                        </div>
                        <div
                          aria-hidden={true}
                          style={{
                            color: "#339",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => {
                            setEditingInspect(inspect)
                            setIsOpenInspectModal(true)
                          }}
                        >
                          修正
                        </div>
                        <div
                          aria-hidden={true}
                          style={{
                            color: "#933",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={async () => {
                            if (isTauri()) {
                              if (await ask("点検を削除してもよろしいですか？"))
                                return
                            } else {
                              if (!confirm("点検を削除してもよろしいですか？"))
                                return
                            }
                            await inspectModel().delete(inspect.id)
                            const inspects = await inspectModel().index({
                              houseId: house.id,
                            })
                            setInspects(inspects)
                          }}
                        >
                          削除
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button onClick={() => setIsOpenInspectModal(true)}>
            新たに点検する
          </Button>
          <Modal
            isOpen={isOpenInspectModal}
            onClose={() => {
              setEditingInspect(undefined)
              setIsOpenInspectModal(false)
            }}
          >
            <InspectForm
              house={house}
              inspect={editingInspect}
              onSave={async () => {
                const inspects = await inspectModel().index({
                  houseId: house.id,
                })
                setInspects(inspects)
                setIsOpenInspectModal(false)
              }}
            />
          </Modal>
        </div>
      )}
    </>
  )
}
