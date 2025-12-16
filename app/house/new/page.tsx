"use client"

import { Card } from "components/elements"
import { notFound } from "next/navigation"
import { useTeamState } from "lib/store"
import { FC, FormEvent, useState } from "react"
import { Button, Form, Input, Label } from "components/elements/form"
import { MarkingMap } from "components/features/marking-map"

type NewHouseInput = {
  name: string
  latitude: number
  longitude: number
  floorCount: number
  roomCount: number
  stepCount: number
}

const Page: FC = () => {
  const { team } = useTeamState()
  const [newHouse, setNewHouse] = useState<NewHouseInput>({
    name: "",
    latitude: 135.6809591,
    longitude: 139.7673068,
    floorCount: 3,
    roomCount: 3,
    stepCount: 1,
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
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
                setNewHouse({ ...newHouse, floorCount: Number(value) })
              }
              required
            />
            <Label>部屋数</Label>
            <Input
              type="number"
              placeholder="階ごとの部屋の数"
              value={newHouse.roomCount}
              onChange={({ target: { value } }) =>
                setNewHouse({ ...newHouse, roomCount: Number(value) })
              }
              required
            />
            <Label>階段数</Label>
            <Input
              type="number"
              placeholder="階ごとの階段の数"
              value={newHouse.stepCount}
              onChange={({ target: { value } }) =>
                setNewHouse({ ...newHouse, stepCount: Number(value) })
              }
              required
            />
            <MarkingMap
              onChangePosition={(position) =>
                setNewHouse({
                  ...newHouse,
                  latitude: position.latitude,
                  longitude: position.longitude,
                })
              }
            />
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
            <div />
            <div>
              <Button type="button">詳細設定</Button>
            </div>
            <div />
            <Button>作成</Button>
          </Form>
        </div>
      </Card>
    </>
  )
}

export default Page
