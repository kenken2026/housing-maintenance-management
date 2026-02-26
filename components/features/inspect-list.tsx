import { Button } from "components/elements/form"
import { Modal } from "components/elements/modal"
import { FC, useEffect, useState } from "react"
import { InspectForm } from "./inspect-form"
import { inspectModel } from "lib/models/inspect"
import { isTauri } from "@tauri-apps/api/core"
import { ask } from "@tauri-apps/plugin-dialog"

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
