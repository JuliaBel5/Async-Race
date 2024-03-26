export type Garage = {
  name: string
  color: string
  id: number
}

export type NewCar = {
  name: string
  color: string
}

export type WinnerType = {
  id: number
  wins: number
  time: number
}
export type NewWinner = {
  wins: number
  time: number
}

export type EngineStatus = {
  id: number
  status: string
}

export type EngineInfo = {
  velocity: number
  distance: number
}

export type EngineResult = {
  success: boolean
}

export type RaceResults = void | { id: number; time: number }

export type UpdatedWinner = {
  id: number
  wins: number
  time: number
}

export type CreateElementPropsType<K> = {
  tag: K
  classList?: string[]
  textContent?: string
  innerHTML?: string
}
