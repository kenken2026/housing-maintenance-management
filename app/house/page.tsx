"use client"

import { Card } from "components/elements"
import { useSearchParams, notFound } from "next/navigation"
import { useTeamState } from "lib/store"
import { FC } from "react"

const Page: FC = () => {
  const { team } = useTeamState()
  const searchParams = useSearchParams()
  const id = Number(searchParams.get("id"))
  const house: House = {
    id: 2,
    name: "山茂登ビル",
    latitude: 35.6975756,
    longitude: 139.7781256,
    createdAt: new Date(),
  }
  if (!team || !id || id != house.id) return notFound()
  return (
    <>
      <Card>
        <h2>{house.name}</h2>
        <div>
          <dl>
            <dt>緯度</dt>
            <dd>{house.latitude}</dd>
            <dt>経度</dt>
            <dd>{house.longitude}</dd>
          </dl>
        </div>
      </Card>
    </>
  )
}

export default Page
