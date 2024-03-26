/* eslint-disable no-console */
import { Garage, NewCar } from '../Utils/types'

export class GarageService {
  public carList: Promise<Garage[]>

  private readonly garageURL = '/garage'

  constructor() {
    this.carList = this.getCarsList(1)
  }

  public async getCarsList(pageNumber: number | null): Promise<Garage[]> {
    const response: Response = await fetch(
      `http://localhost:3000${this.garageURL}?_page=${pageNumber}&_limit=7`,
      {
        method: 'GET',
      }
    )
    if (!response.ok) {
      throw Error('Failed to get cars list')
    }
    return response.json()
  }

  public async getFullCarsList(): Promise<Garage[]> {
    const response = await fetch(`http://localhost:3000${this.garageURL}`, {
      method: 'GET',
    })
    if (!response.ok) {
      throw Error('Failed to get cars list')
    }
    return response.json()
  }

  public async getCar(id: number): Promise<Garage> {
    const response: Response = await fetch(
      `http://localhost:3000${this.garageURL}/${id}`,
      {
        method: 'GET',
      }
    )
    if (!response.ok) {
      if (response.status === 404) {
        console.error(' Car not found')
      }
      throw Error('Failed to find the car')
    }
    return response.json()
  }

  public async createCar(newCarItem: NewCar): Promise<void> {
    const response: Response = await fetch(
      `http://localhost:3000${this.garageURL}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCarItem),
      }
    )

    if (!response.ok) {
      throw Error('Failed to create a car')
    }
    return response.json()
  }

  public async updateCar(newCarItem: NewCar, id: number): Promise<void> {
    const response: Response = await fetch(
      `http://localhost:3000${this.garageURL}/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCarItem),
      }
    )
    if (!response.ok) {
      if (response.status === 404) {
        console.error(' Car not found')
      }
      throw Error('Failed to update the car')
    }
    return response.json()
  }

  public async deleteCar(id: number): Promise<void> {
    const response: Response = await fetch(
      `http://localhost:3000${this.garageURL}/${id}`,
      {
        method: 'DELETE',
      }
    )
    if (!response.ok) {
      if (response.status === 404) {
        console.error(' Car not found')
      }
      throw Error('Failed to delete the car')
    }
    return response.json()
  }
}
