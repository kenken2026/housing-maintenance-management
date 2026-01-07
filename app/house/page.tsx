"use client"

import { Card } from "components/elements"
import { useSearchParams, notFound } from "next/navigation"
import { useTeamState } from "lib/store"
import { FC, useEffect, useState } from "react"
import { houseModel } from "lib/models"

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
  return (
    <>
      {house && (
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
      )}
    </>
  )
}

export default Page
