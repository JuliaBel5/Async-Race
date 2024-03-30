import { WinnerType, NewWinner, UpdatedWinner } from '../Utils/types'

export class WinnerService {
  private readonly winnersURL = '/winners'

  public async getWinnersList(
    pageNumber: number,
    sort: string = 'time',
    order: string = 'ASC'
  ): Promise<WinnerType[]> {
    const response: Response = await fetch(
      `http://localhost:3000${this.winnersURL}?_page=${pageNumber}&_limit=10&_sort=${sort}&_order=${order}`,
      {
        method: 'GET'
      }
    )

    if (!response.ok) {
      throw Error('Failed to get winners list')
    }
    return response.json()
  }

  public async getFullWinnersList(): Promise<WinnerType[]> {
    const response: Response = await fetch(
      `http://localhost:3000${this.winnersURL}`,
      {
        method: 'GET'
      }
    )

    if (!response.ok) {
      throw Error('Failed to get full winners list')
    }
    return response.json()
  }

  public async getWinner(id: number): Promise<WinnerType> {
    const response: Response = await fetch(
      `http://localhost:3000${this.winnersURL}/${id}`,
      {
        method: 'GET'
      }
    )
    if (!response.ok) {
      throw Error('Failed to get winners list')
    }
    return response.json()
  }

  public async createWinner(newWinnerItem: WinnerType): Promise<WinnerType> {
    const response: Response = await fetch(
      `http://localhost:3000${this.winnersURL}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newWinnerItem)
      }
    )

    if (!response.ok) {
      if (response.status === 500) {
        console.error(' Insert failed, duplicate id')
      }
      throw Error('Failed to create a new winner')
    }
    return response.json()
  }

  public async deleteWinner(id: number): Promise<void> {
    const response: Response = await fetch(
      `http://localhost:3000${this.winnersURL}/${id}`,
      {
        method: 'DELETE'
      }
    )
    if (!response.ok) {
      throw Error('Failed to delete your winner, try again')
    }
    return response.json()
  }

  public async updateWinner(
    newWinnerItem: NewWinner,
    id: number
  ): Promise<UpdatedWinner> {
    const response: Response = await fetch(
      `http://localhost:3000${this.winnersURL}/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newWinnerItem)
      }
    )
    if (!response.ok) {
      throw Error('Failed to update your winner, try again')
    }
    return response.json()
  }
}
