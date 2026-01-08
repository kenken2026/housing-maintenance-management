"use client"

import { useEffect, useState, type FC } from "react"
import { Card } from "components/elements"
import { Button } from "components/elements/form"
const MultiMarkerMap = dynamic(
  () => import("components/features/multi-maker-map"),
  { ssr: false }
)
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { houseModel } from "lib/models/house"

export const HouseList: FC<{ team: Team }> = ({ team }) => {
  const router = useRouter()
  const [houses, setHouses] = useState<House[]>([])

  useEffect(() => {
    const fetchHouses = async () => {
      const houses = await houseModel().index({ teamId: team.id })
      setHouses(houses)
    }
    fetchHouses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Card>
        <h2>{team.name}</h2>
        <div>
          <Button onClick={() => router.push("/house/new")}>新規作成</Button>
        </div>
        {houses.length > 0 && <MultiMarkerMap markers={houses} />}
        <table>
          <tbody>
            {houses.map((house) => (
              <tr key={house.id}>
                <td>
                  <Link href={`/house?id=${house.id}`}>{house.name}</Link>
                </td>
                <td>{new Date(house.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  )
}
