type Team = { id: number; name: string }

type House = {
  id: number
  teamId: number
  name: string
  latitude: number
  longitude: number
  altitude?: number
  createdAt: Date
}

type Position = { latitude: number; longitude: number }
