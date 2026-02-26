type Team = {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

type FloorInformation = {
  floor: number
  roomCount: number
  stepCount: number
}[]

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

  floorInformation?: FloorInformation
  exteriorInformation?: object
  checkListTemplate?: CheckTemplate[]
}

type HouseComment = {
  id: number
  houseId: number
  latitude: number
  longitude: number
  altitude?: number
  body?: string
  image?: string
  uid?: string
  uname?: string
  inspectId?: number
  createdAt: string
  updatedAt: string
}

type Inspect = {
  id: number
  houseId: number
  description?: string
  payload?: UnitCheck[]
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

type Marker = { id: name; latitude: number; longitude: number; name: string }

// Common

type MaybePromise<T> = T | Promise<T>
type Handler<T, R> = (arg: T) => MaybePromise<R>
