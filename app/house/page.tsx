"use client"
import { ask } from "@tauri-apps/plugin-dialog"
import { Card } from "components/elements"
import { useSearchParams, notFound } from "next/navigation"
import { useTeamState } from "lib/store"
import { FC, useEffect, useState } from "react"
import { houseModel } from "lib/models/house"
import { Button } from "components/elements/form"
import { UnitList } from "components/features/unit-list"

const Page: FC = () => {
  const { team } = useTeamState()
  const searchParams = useSearchParams()
  const id = Number(searchParams.get("id"))
  const [house, setHouse] = useState<House>()
  useEffect(() => {
    const fetch = async () => {
      const house = await houseModel().show(id)
      if (!team || house.teamId !== team.id) {
        return notFound()
      }
      setHouse(house)
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
          <UnitList house={house} />
        </Card>
      )}
    </>
  )
}

export default Page
