"use client"

import { Card } from "components/elements"
import { notFound } from "next/navigation"
import { useLoadinfState, useTeamState } from "lib/store"
import { FC, FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Form, Input, Label } from "components/elements/form"
import { MarkingMap } from "components/features/marking-map"
import { houseModel } from "lib/models/house"
import { fetchAltitude, fetchPositionByAddress } from "lib/geo"
import { HouseSchematic } from "components/features/house-schematic"
import { CSVFileForm } from "components/modules/csv-file-form"
import { hash } from "lib/text"

type NewHouseInput = {
  name: string
  altitude?: number
  latitude: number
  longitude: number
  floorCount: number
  roomCount: number
  stepCount: number
  floorInformation: FloorInformation
  checkListTemplate?: CheckTemplate[]
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
    latitude: 35.6809591,
    longitude: 139.7673068,
    floorCount: 3,
    roomCount: 3,
    stepCount: 1,
    floorInformation: buildFloorInformation(3, 3, 1),
  })
  const [address, setAddress] = useState<string>("")
  const [isShownDetail, setIsShownDetail] = useState<boolean>(false)

  useEffect(() => {
    const fetch = async () => {
      if (newHouse.latitude && newHouse.longitude) {
        const altitude = await fetchAltitude({ ...newHouse })
        if (altitude)
          setNewHouse((prev) => ({
            ...prev,
            altitude,
          }))
      }
    }
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      uid: `${Math.floor(newHouse.latitude)}${
        newHouse.latitude.toPrecision(8).split(".")[1]
      }${Math.floor(newHouse.longitude)}${
        newHouse.longitude.toPrecision(9).split(".")[1]
      }${("000" + Math.floor(newHouse.altitude)).slice(-4)}${(
        newHouse.altitude.toPrecision(6) + "00"
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
              initialPosition={{
                latitude: newHouse.latitude,
                longitude: newHouse.longitude,
              }}
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
              value={newHouse.latitude}
              onChange={({ target: { value } }) =>
                setNewHouse({ ...newHouse, latitude: Number(value) })
              }
              required
            />
            <Label>経度</Label>
            <Input
              type="number"
              placeholder="経度"
              value={newHouse.longitude}
              onChange={({ target: { value } }) =>
                setNewHouse({ ...newHouse, longitude: Number(value) })
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
            <div />
            {isShownDetail ? (
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
            ) : (
              <div>
                <Button type="button" onClick={() => setIsShownDetail(true)}>
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
