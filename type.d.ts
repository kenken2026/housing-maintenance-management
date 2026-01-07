type Team = {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

type House = {
  id: number
  teamId: number
  name: string
  description?: string
  latitude: number
  longitude: number
  altitude?: number
  floorCount: number
  roomCount: number
  stepCount: number
  createdAt: string
  updatedAt: string
  udid?: string

  floorInformation?: object
  exteriorInformation?: object
  checkListTemplate?: object
}

type Position = { latitude: number; longitude: number }
