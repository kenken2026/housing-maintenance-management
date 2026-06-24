"use client"

import { Card } from "components/elements"
import { notFound } from "next/navigation"
import { useLoadinfState, useTeamState } from "lib/store"
import { FC, FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Form, Input, Label } from "components/elements/form"
import { MarkingMap } from "components/features/marking-map"
import { houseModel } from "lib/models/house"
import { DEFAULT_CENTER } from "lib/map"
import { fetchAltitude, fetchPositionByAddress, offsetPosition } from "lib/geo"
import { HouseSchematic } from "components/features/house-schematic"
import { CSVFileForm } from "components/modules/csv-file-form"
import { hash } from "lib/text"
import { OuteriorUnits, ResidenceUnits } from "lib/constants"

const ORIENTATIONS = [
  { label: "北 (0°)", value: 0 },
  { label: "北東 (45°)", value: 45 },
  { label: "東 (90°)", value: 90 },
  { label: "南東 (135°)", value: 135 },
  { label: "南 (180°)", value: 180 },
  { label: "南西 (225°)", value: 225 },
  { label: "西 (270°)", value: 270 },
  { label: "北西 (315°)", value: 315 },
]

type NewHouseInput = {
  name: string
  altitude?: number
  latitude?: number
  longitude?: number
  floorCount: number
  roomCount: number
  stepCount: number
  floorInformation: FloorInformation
  exteriorInformation?: ExteriorInformation
  residenceInformation?: ResidenceInformation
  checkListTemplate?: CheckTemplate[]
  orientation?: number
  roomWidth?: number
  roomDepth?: number
}

const csvToCheckTemplates = (text: string): CheckTemplate[] => {
  const lines = text
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((l) => l.trim())
    .slice(1) // skip header
  return lines.map((line) => {
    const [largeCategory, mediumCategory, smallCategory, part, detail] =
      line.split(",")
    return {
      id: hash(`${largeCategory}${mediumCategory}${smallCategory}${part}${detail}`),
      largeCategory,
      mediumCategory,
      smallCategory,
      part,
      detail,
    }
  })
}

const buildUnitPositions = (
  floorInformation: FloorInformation,
  latitude: number,
  longitude: number,
  orientation: number,
  roomWidth: number,
  roomDepth: number
): Record<string, Position> => {
  const depthOffset = roomDepth / 2
  const positions: Record<string, Position> = {}
  for (const fi of floorInformation) {
    for (let roomIdx = 0; roomIdx < fi.roomCount; roomIdx++) {
      const alongWidth = offsetPosition(
        { latitude, longitude },
        roomIdx * roomWidth,
        orientation
      )
      positions[`f${fi.floor - 1}r${roomIdx}`] = offsetPosition(
        alongWidth,
        depthOffset,
        orientation + 90
      )
    }
  }
  return positions
}

const buildFloorInformation = (
  floorCount: number,
  roomCount: number,
  stepCount: number
): FloorInformation =>
  Array.from({ length: floorCount }, (_, i) => ({
    floor: i + 1,
    roomCount,
    stepCount,
  }))

const Page: FC = () => {
  const router = useRouter()
  const { team } = useTeamState()
  const { setLoadingMessage } = useLoadinfState()
  const [newHouse, setNewHouse] = useState<NewHouseInput>({
    name: "",
    floorCount: 3,
    roomCount: 3,
    stepCount: 1,
    floorInformation: buildFloorInformation(3, 3, 1),
    roomWidth: 6,
    roomDepth: 10,
  })
  const [address, setAddress] = useState<string>("")
  const [isShownDetail, setIsShownDetail] = useState<boolean>(false)

  useEffect(() => {
    const fetch = async () => {
      if (newHouse.latitude && newHouse.longitude) {
        const altitude = await fetchAltitude({ latitude: newHouse.latitude!, longitude: newHouse.longitude! })
        if (altitude)
          setNewHouse((prev) => ({
            ...prev,
            altitude,
          }))
      }
    }
    fetch()
  }, [newHouse.latitude, newHouse.longitude])

  const handleFloorCount = (count: number) => {
    const fi = newHouse.floorInformation
    const newFi: FloorInformation =
      count > fi.length
        ? [
            ...fi,
            ...Array.from({ length: count - fi.length }, (_, i) => ({
              floor: fi.length + i + 1,
              roomCount: newHouse.roomCount,
              stepCount: newHouse.stepCount,
            })),
          ]
        : fi.slice(0, count)
    setNewHouse({ ...newHouse, floorCount: count, floorInformation: newFi })
  }

  const handleRoomCount = (count: number) => {
    setNewHouse({
      ...newHouse,
      roomCount: count,
      floorInformation: newHouse.floorInformation.map((f) => ({
        ...f,
        roomCount: count,
      })),
    })
  }

  const handleStepCount = (count: number) => {
    setNewHouse({
      ...newHouse,
      stepCount: count,
      floorInformation: newHouse.floorInformation.map((f) => ({
        ...f,
        stepCount: count,
      })),
    })
  }

  const handleFloorField = (
    floor: number,
    field: "roomCount" | "stepCount",
    value: number
  ) => {
    setNewHouse({
      ...newHouse,
      floorInformation: newHouse.floorInformation.map((f) =>
        f.floor === floor ? { ...f, [field]: value } : f
      ),
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoadingMessage("建物を作成しています...")

    const newHouseId = await houseModel().create({
      ...newHouse,
      latitude: newHouse.latitude!,
      longitude: newHouse.longitude!,
      exteriorInformation: newHouse.exteriorInformation,
      residenceInformation: newHouse.residenceInformation,
      orientation: newHouse.orientation,
      roomWidth: newHouse.roomWidth,
      roomDepth: newHouse.roomDepth,
      unitPositions:
        newHouse.orientation !== undefined && newHouse.roomWidth !== undefined
          ? buildUnitPositions(
              newHouse.floorInformation,
              newHouse.latitude!,
              newHouse.longitude!,
              newHouse.orientation,
              newHouse.roomWidth,
              newHouse.roomDepth ?? 0
            )
          : undefined,
      uid: `${Math.floor(newHouse.latitude!)}${
        newHouse.latitude!.toPrecision(8).split(".")[1]
      }${Math.floor(newHouse.longitude!)}${
        newHouse.longitude!.toPrecision(9).split(".")[1]
      }${("000" + Math.floor(newHouse.altitude!)).slice(-4)}${(
        newHouse.altitude!.toPrecision(6) + "00"
      )
        .split(".")[1]
        .slice(0, 2)}`,
      teamId: team.id,
    })
    setLoadingMessage(undefined)
    router.push(`/house?id=${newHouseId}`)
  }

  const validateCheckListCSV = (text: string): boolean => {
    const normalized = text
      .replace(/^\uFEFF/, "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
    const lines = normalized.split("\n").filter((l) => l.trim())
    if (lines.length < 2) return false

    const expectedHeaders = ["大項目", "中項目", "小項目", "各部位", "部所"]
    const headers = lines[0].split(",")
    if (
      headers.length !== expectedHeaders.length ||
      !expectedHeaders.every((h, i) => headers[i] === h)
    )
      return false

    return lines
      .slice(1)
      .every((line) => line.split(",").length === expectedHeaders.length)
  }

  if (!team) return notFound()
  return (
    <>
      <Card>
        <h2>新規作成</h2>
        <div>
          <Form onSubmit={handleSubmit}>
            <Label>名称</Label>
            <Input
              placeholder="建物名称"
              value={newHouse.name}
              onChange={({ target: { value } }) =>
                setNewHouse({ ...newHouse, name: value })
              }
              required
            />
            <Label>階数</Label>
            <Input
              type="number"
              placeholder="階数"
              value={newHouse.floorCount}
              onChange={({ target: { value } }) =>
                handleFloorCount(Number(value))
              }
              required
            />
            <Label>部屋数（全階共通）</Label>
            <Input
              type="number"
              placeholder="階ごとの部屋の数"
              value={newHouse.roomCount}
              onChange={({ target: { value } }) =>
                handleRoomCount(Number(value))
              }
              required
            />
            <Label>階段数（全階共通）</Label>
            <Input
              type="number"
              placeholder="階ごとの階段の数"
              value={newHouse.stepCount}
              onChange={({ target: { value } }) =>
                handleStepCount(Number(value))
              }
              required
            />
            <Label>各階の設定</Label>
            <div style={{ display: "flex", flexFlow: "column", gap: ".25rem" }}>
              {[...newHouse.floorInformation]
                .sort((a, b) => b.floor - a.floor)
                .map((fi) => (
                  <div
                    key={fi.floor}
                    style={{
                      display: "flex",
                      gap: ".5rem",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ minWidth: "3rem", fontSize: ".875rem" }}>
                      {fi.floor}階
                    </span>
                    <span style={{ fontSize: ".875rem" }}>部屋</span>
                    <Input
                      type="number"
                      value={fi.roomCount}
                      onChange={({ target: { value } }) =>
                        handleFloorField(fi.floor, "roomCount", Number(value))
                      }
                      style={{ width: "4rem" }}
                    />
                    <span style={{ fontSize: ".875rem" }}>階段</span>
                    <Input
                      type="number"
                      value={fi.stepCount}
                      onChange={({ target: { value } }) =>
                        handleFloorField(fi.floor, "stepCount", Number(value))
                      }
                      style={{ width: "4rem" }}
                    />
                  </div>
                ))}
            </div>
            <HouseSchematic
              {...newHouse}
              floorInformation={newHouse.floorInformation}
            />
            <MarkingMap
              initialPosition={
                newHouse.latitude && newHouse.longitude
                  ? { latitude: newHouse.latitude, longitude: newHouse.longitude }
                  : DEFAULT_CENTER
              }
              onChangePosition={(position) =>
                setNewHouse({
                  ...newHouse,
                  latitude: position.latitude,
                  longitude: position.longitude,
                })
              }
            />
            <div style={{ display: "flex", gap: ".5rem" }}>
              <Input
                placeholder="住所で調べる"
                value={address}
                onChange={({ target: { value } }) => setAddress(value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault()
                }}
              />
              <Button
                type="button"
                disabled={address.length == 0}
                onClick={async () => {
                  const position = await fetchPositionByAddress({ address })
                  if (position) setNewHouse({ ...newHouse, ...position })
                }}
              >
                検索
              </Button>
            </div>
            <Label>緯度</Label>
            <Input
              type="number"
              placeholder="緯度"
              value={newHouse.latitude ?? ""}
              onChange={({ target: { value } }) =>
                setNewHouse({ ...newHouse, latitude: value ? Number(value) : undefined })
              }
              required
            />
            <Label>経度</Label>
            <Input
              type="number"
              placeholder="経度"
              value={newHouse.longitude ?? ""}
              onChange={({ target: { value } }) =>
                setNewHouse({ ...newHouse, longitude: value ? Number(value) : undefined })
              }
              required
            />
            <Label>標高</Label>
            <Input
              type="number"
              placeholder="標高"
              value={newHouse.altitude ?? ""}
              onChange={({ target: { value } }) =>
                setNewHouse({ ...newHouse, altitude: Number(value) })
              }
              required
            />
            <Label>建物の向き</Label>
            <select
              value={newHouse.orientation ?? ""}
              onChange={({ target: { value } }) =>
                setNewHouse({
                  ...newHouse,
                  orientation: value !== "" ? Number(value) : undefined,
                })
              }
              style={{ padding: ".375rem .5rem", borderRadius: ".25rem", border: "1px solid #ccc", fontSize: "1rem" }}
            >
              <option value="">未設定</option>
              {ORIENTATIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <Label>部屋の幅 (m)</Label>
            <Input
              type="number"
              placeholder="例: 3.6"
              step="0.1"
              min="0"
              value={newHouse.roomWidth ?? ""}
              onChange={({ target: { value } }) =>
                setNewHouse({ ...newHouse, roomWidth: value ? Number(value) : undefined })
              }
            />
            <Label>部屋の奥行き (m)</Label>
            <Input
              type="number"
              placeholder="例: 4.5"
              step="0.1"
              min="0"
              value={newHouse.roomDepth ?? ""}
              onChange={({ target: { value } }) =>
                setNewHouse({ ...newHouse, roomDepth: value ? Number(value) : undefined })
              }
            />
            <div />
            {isShownDetail ? (
              <div style={{ display: "flex", flexFlow: "column", gap: "1rem" }}>
                <div>
                  <Label>外構ユニット（カスタム設定時のみ）</Label>
                  <div style={{ display: "flex", flexFlow: "column", gap: ".25rem" }}>
                    {(newHouse.exteriorInformation ?? []).map((unit, i) => (
                      <div key={unit.uid} style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                        <Input
                          value={unit.name}
                          onChange={({ target: { value } }) =>
                            setNewHouse({
                              ...newHouse,
                              exteriorInformation: newHouse.exteriorInformation!.map((u, j) =>
                                j === i ? { ...u, name: value } : u
                              ),
                            })
                          }
                          style={{ flex: 1 }}
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            setNewHouse({
                              ...newHouse,
                              exteriorInformation: newHouse.exteriorInformation!.filter((_, j) => j !== i),
                            })
                          }
                        >
                          削除
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        const current = newHouse.exteriorInformation ?? []
                        setNewHouse({
                          ...newHouse,
                          exteriorInformation: [
                            ...current,
                            { uid: `e${current.length + 1}`, name: "" },
                          ],
                        })
                      }}
                    >
                      外構ユニット追加
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>住棟ユニット</Label>
                  <div style={{ display: "flex", flexFlow: "column", gap: ".25rem" }}>
                    {(newHouse.residenceInformation ?? []).map((unit, i) => (
                      <div key={unit.uid} style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                        <Input
                          value={unit.name}
                          onChange={({ target: { value } }) =>
                            setNewHouse({
                              ...newHouse,
                              residenceInformation: newHouse.residenceInformation!.map((u, j) =>
                                j === i ? { ...u, name: value } : u
                              ),
                            })
                          }
                          style={{ flex: 1 }}
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            setNewHouse({
                              ...newHouse,
                              residenceInformation: newHouse.residenceInformation!.filter((_, j) => j !== i),
                            })
                          }
                        >
                          削除
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        const current = newHouse.residenceInformation ?? []
                        setNewHouse({
                          ...newHouse,
                          residenceInformation: [
                            ...current,
                            { uid: `r${current.length + 1}`, name: "" },
                          ],
                        })
                      }}
                    >
                      住棟ユニット追加
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>点検項目</Label>
                  <CSVFileForm
                    onChange={(text) => {
                      const isValid = validateCheckListCSV(text)
                      if (!isValid) return false
                      setNewHouse({
                        ...newHouse,
                        checkListTemplate: csvToCheckTemplates(text),
                      })
                      return true
                    }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <Button
                  type="button"
                  onClick={() => {
                    setIsShownDetail(true)
                    setNewHouse((prev) => ({
                      ...prev,
                      exteriorInformation: prev.exteriorInformation ?? OuteriorUnits.map((u) => ({ ...u })),
                      residenceInformation: prev.residenceInformation ?? ResidenceUnits.map((u) => ({ ...u })),
                    }))
                  }}
                >
                  詳細設定
                </Button>
              </div>
            )}

            <div />
            <Button>作成</Button>
          </Form>
        </div>
      </Card>
    </>
  )
}

export default Page
