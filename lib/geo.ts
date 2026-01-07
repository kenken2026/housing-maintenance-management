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
