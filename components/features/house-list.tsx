"use client"

import { type FC } from "react"
import { Card } from "components/elements"
import { Button } from "components/elements/form"
const MultiMarkerMap = dynamic(
  () => import("components/features/multi-maker-map"),
  { ssr: false }
)
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"

const houses: House[] = [
  {
    id: 1,
    name: "千代田テラス",
    latitude: 35.6977788,
    longitude: 139.775336,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "山茂登ビル",
    latitude: 35.6975756,
    longitude: 139.7781256,
    createdAt: new Date(),
  },
]

export const HouseList: FC<{ team: Team }> = ({ team }) => {
  const router = useRouter()
  return (
    <>
      <Card>
        <h2>{team.name}</h2>
        <div>
          <Button onClick={() => router.push("/house/new")}>新規作成</Button>
        </div>
        <MultiMarkerMap markers={houses} />
        <table>
          <tbody>
            {houses.map((house) => (
              <tr key={house.id}>
                <td>
                  <Link href={`/house?id=${house.id}`}>{house.name}</Link>
                </td>
                <td>{house.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  )
}
