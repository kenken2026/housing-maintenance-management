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
  uid?: string

  floorInformation?: object
  exteriorInformation?: object
  checkListTemplate?: object
}

type Comment = {
  id: number
  houseId: number
  latitude: number
  longitude: number
  altitude?: number
  body?: string
  image?: string
  unitName?: string
  createdAt: string
  updatedAt: string
}

type Inspect = {
  id: number
  houseId: number
  description?: string
  payload?: object
  status: string
  createdAt: string
  updatedAt: string
}

type Position = { latitude: number; longitude: number }

type Unit = {
  uid: string
  name: string
}

type CheckTemplate = {
  id: number | string
  largeCategory: string
  mediumCategory: string
  smallCategory: string
  part: string
  detail: string
}

type Check = CheckTemplate & {
  rank?: string
}

type UnitCheck = { uid: string; checkList: Check[] }
