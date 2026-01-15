"use client"
import { ask } from "@tauri-apps/plugin-dialog"
import { Card } from "components/elements"
import { useSearchParams, notFound } from "next/navigation"
import { useTeamState } from "lib/store"
import { FC, useEffect, useState } from "react"
import { houseModel } from "lib/models/house"
import { Button } from "components/elements/form"
import { UnitList } from "components/features/unit-list"
import { inspectModel } from "lib/models/inspect"
import { Modal } from "components/elements/modal"
import { InspectForm } from "components/features/inspect-form"

const Page: FC = () => {
  const { team } = useTeamState()
  const searchParams = useSearchParams()
  const id = Number(searchParams.get("id"))
  const [house, setHouse] = useState<House>()
  const [inspects, setInspects] = useState<Inspect[]>()
  const [editingInspect, setEditingInspect] = useState<Inspect>()
  const [isOpenInspectModal, setIsOpenInspectModal] = useState<boolean>(false)
  useEffect(() => {
    const fetch = async () => {
      const house = await houseModel().show(id)
      if (!team || house.teamId !== team.id) {
        return notFound()
      }
      setHouse(house)
      const inspects = await inspectModel().index({ houseId: house.id })
      setInspects(inspects)
    }
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleDelete = async () => {
    const asked = await ask(
      `「${house.name}」を削除してもよろしいでしょうか`,
      "確認"
    )
    if (!asked) return
    await houseModel().delete(id)
    window.history.back()
  }
  return (
    <>
      {house && (
        <Card>
          <h2>{house.name}</h2>
          <p style={{ fontSize: ".75rem" }}>UID: {house.uid}</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <table>
              <tbody>
                <tr>
                  <td>緯度</td>
                  <td style={{ textAlign: "right" }}>{house.latitude}</td>
                </tr>
                <tr>
                  <td>経度</td>
                  <td style={{ textAlign: "right" }}>{house.longitude}</td>
                </tr>
                <tr>
                  <td>標高</td>
                  <td style={{ textAlign: "right" }}>{house.altitude}</td>
                </tr>
                <tr>
                  <td>階数</td>
                  <td style={{ textAlign: "right" }}>{house.floorCount}</td>
                </tr>
                <tr>
                  <td>部屋数</td>
                  <td style={{ textAlign: "right" }}>{house.roomCount}</td>
                </tr>
                <tr>
                  <td>階段数</td>
                  <td style={{ textAlign: "right" }}>{house.stepCount}</td>
                </tr>
              </tbody>
            </table>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".5rem",
                justifyContent: "flex-end",
              }}
            >
              <table>
                <tbody>
                  <tr>
                    <td>作成</td>
                    <td style={{ textAlign: "right" }}>
                      {new Date(house.createdAt).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td>更新</td>
                    <td style={{ textAlign: "right" }}>
                      {new Date(house.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ textAlign: "right" }}>
                <Button onClick={handleDelete}>削除</Button>
              </div>
            </div>
          </div>
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
                        <td>
                          {new Date(inspect.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          {inspect.status == "in_progress"
                            ? "点検中"
                            : "点検済み"}
                        </td>
                        <td>{new Date(inspect.updatedAt).toLocaleString()}</td>
                        <td>
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
                            修正する
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
          <h3>ユニット一覧</h3>
          <UnitList house={house} />
        </Card>
      )}
    </>
  )
}

export default Page
