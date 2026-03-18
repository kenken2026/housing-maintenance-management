import ky from "ky"

export const fetchAltitude = async ({
  longitude,
  latitude,
}: {
  longitude: number
  latitude: number
}): Promise<number | undefined> => {
  const response = await ky.get(
    `https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${longitude}&lat=${latitude}`
  )
  if (response.ok) {
    const { elevation } = await response.json<{
      elevation: number
      hsrc: string
    }>()
    return elevation
  }
}

export const fetchPositionByAddress = async ({
  address,
}: {
  address: string
}): Promise<{ longitude: number; latitude: number } | undefined> => {
  const response = await ky.get(
    `https://nominatim.openstreetmap.org/search?q=${address}&format=json`,
    {}
  )
  if (response.ok) {
    const results = await response.json<
      {
        place_id: number
        licence: string
        osm_type: string
        osm_id: number
        lat: number
        lon: number
        class: string
        type: string
        place_rank: number
        importance: number
        addresstype: string
        name: string
        display_name: string
        boundingbox: string[]
      }[]
    >()

    if (results.length > 0) {
      const result = results[0]
      return { latitude: result.lat, longitude: result.lon }
    }
  }
}
