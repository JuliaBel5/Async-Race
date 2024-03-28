/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import { EngineInfo, EngineResult } from '../Utils/types'

export class EngineService {
  private readonly engineURL = '/engine'

  public async getEnginePrams(id: number, status: string, signal?: AbortSignal): Promise<EngineInfo> {
    const response: Response = await fetch(
      `http://localhost:3000${this.engineURL}?id=${id}&status=${status}`,
      {
        method: 'PATCH',
        signal: signal
      }
    )
    if (!response.ok) {
      if (response.status === 404) {
        console.error('Car with such id was not found in the garage.')
      }
      if (response.status === 400) {
        console.error(
          `Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"`
        )
      }
      throw Error('Failed to get the Engine info')
    }
    return response.json()
  }

  public async getEngineStatus(
    id: number,
    status: string, 
    signal?: AbortSignal
  ): Promise<EngineResult> {
    const response: Response = await fetch(
      `http://localhost:3000${this.engineURL}/?id=${id}&status=${status}`,
      {
        method: 'PATCH',
        signal: signal
      }
    )
    if (!response.ok) {
      if (response.status === 400) {
        console.error(
          `Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"`
        )
      }
      if (response.status === 429) {
        console.error(
          `Drive already in progress. You can't run drive for the same car twice while it's not stopped`
        )
      }
      if (response.status === 500) {
        console.error(
          "Car has been stopped suddenly. It's engine was broken down."
        )
      }
      throw Error('Failed to get the Engine info')
    }
    return response.json()
  }
}
