/* eslint-disable no-console */
/* eslint-disable max-lines-per-function */

import { View } from '../view/view'
import { findWinner, getRandomColor } from '../Utils/utils'
import { NewCar, UpdatedWinner, RaceResults } from '../Utils/types'
import { GarageService } from '../services/garage'
import { WinnerService } from '../services/winners'
import { EngineService } from '../services/engine'

export class Controller {
  public view: View

  public GarageService = new GarageService()

  public WinnerService = new WinnerService()

  public EngineService = new EngineService()

  public carsView: Promise<void>

  public currentPage: number

  public totalPages: Promise<number>

  public currentWinPage: number

  public totalWinPages: Promise<number>

  private readonly msecPerSec: number

  private readonly carsPerPage: number

  private readonly winnersPerPage: number

  constructor(view: View) {
    this.view = view

    this.msecPerSec = 1000
    this.carsPerPage = 7
    this.winnersPerPage = 10
    this.currentPage = 1
    this.currentWinPage = 1
    this.totalPages = this.getPageNumber()
    this.totalWinPages = this.getWinPageNumber()
    this.carsView = this.view.renderCars(
      this.GarageService.getCarsList(this.currentPage)
    )

    this.view.main.prevButton.addEventListener('click', async () => {
      this.getPageNumber()
      const secondPage = 2
      if (this.currentPage >= secondPage) {
        const pageNum = this.currentPage - 1
        this.view.main.pageNum.textContent = `Page #${pageNum}`
        this.currentPage -= 1

        this.view.main.garageContainer.innerHTML = ''
        this.view.renderCars(
          this.view.garageService.getCarsList(this.currentPage)
        )
      }
    })

    this.view.main.nextButton.addEventListener('click', async () => {
      if (this.currentPage < (await this.getPageNumber())) {
        const pageNum = this.currentPage + 1
        this.view.main.pageNum.textContent = `Page #${pageNum}`
        this.currentPage += 1

        this.view.main.garageContainer.innerHTML = ''
        this.view.renderCars(
          this.view.garageService.getCarsList(this.currentPage)
        )
      }
    })

    this.view.winnersPage.winPrevButton.addEventListener('click', async () => {
      const secondPage = 2
      if (this.currentWinPage >= secondPage) {
        this.currentWinPage -= 1
        this.view.winnersPage.pageNum.textContent = `Page # ${this.currentWinPage}`
        this.getWinnersList(this.currentWinPage)
      }
    })

    this.view.winnersPage.winNextButton.addEventListener('click', async () => {
      if (this.currentWinPage < (await this.totalWinPages)) {
        this.currentWinPage += 1
        this.view.winnersPage.pageNum.textContent = `Page # ${this.currentWinPage}`
        this.getWinnersList(this.currentWinPage)
      }
    })

    this.view.main.winnersButton.addEventListener('click', () => {
      this.view.winnersPage.container.classList.toggle('active')
      this.view.main.container.classList.toggle('active')
      this.getWinnersList(this.currentWinPage)
    })

    this.view.winnersPage.garageButton.addEventListener('click', () => {
      this.view.main.container.classList.toggle('active')
      this.view.winnersPage.container.classList.toggle('active')
    })

    this.view.main.raceButton.addEventListener('click', async () => {
      this.view.main.raceButton.disabled = true
      this.view.main.raceButton.classList.add('inactive')
      this.view.main.resetButton.disabled = true
      this.view.main.resetButton.classList.add('inactive')
      const carIdList: number[] = []
      const carsList = await this.GarageService.getCarsList(this.currentPage)
      for (let i = 0; i < carsList.length; i += 1) {
        const { id } = carsList[i]
        carIdList.push(id)
      }
      const raceList = await Promise.all(
        carIdList.map((el) => this.view.raceCar(el))
      )

      const winner = findWinner(raceList)

      this.updateWinner(winner)
      this.view.main.resetButton.disabled = false
      this.view.main.resetButton.classList.remove('inactive')
    })

    this.view.main.resetButton.addEventListener('click', async () => {
      this.view.main.raceButton.disabled = false
      this.view.main.raceButton.classList.remove('inactive')
      const carIdList: number[] = []
      const carsList = await this.GarageService.getCarsList(this.currentPage)
      for (let i = 0; i < carsList.length; i += 1) {
        const { id } = carsList[i]
        carIdList.push(id)
      }
      /*  const stoppedCars = await Promise.all(
        carIdList.map((el: number) => {
          return this.EngineService.getEnginePrams(el, 'stopped')
        })
      ) */
      this.view.carsArr.forEach((el) => {
        const newEl = el
        if (newEl.parentElement !== null) {
          newEl.style.transform = `translateX(0)`
          newEl.style.transitionDuration = '0.7s'
        }
      })
    })

    this.view.main.generateCarsButton.addEventListener('click', () =>
      this.generateNewCars(100)
    )
  }

  private async getWinnersList(num: number): Promise<void> {
    try {
      const winsList = await this.WinnerService.getFullWinnersList()

      this.view.winnersPage.header.textContent = `Winners (${winsList.length})`

      try {
        const winnersList = await this.WinnerService.getWinnersList(num)

        const carIdList = winnersList.map((el) => el.id)

        const winCars = await Promise.all(
          carIdList.map((el) => this.GarageService.getCar(el))
        )
        this.view.winnersPage.renderWinnersTable(
          winCars.length,
          winnersList,
          winCars
        )
      } catch (error) {
        console.error('Failed to get the winners list', error)
      }
    } catch (error) {
      console.error('Failed to get the full winners list', error)
    }
  }

  public async getPageNumber(): Promise<number> {
    try {
      const carsList = await this.GarageService.getFullCarsList()
      this.view.main.header.textContent = `Garage (${carsList.length})`
      let pageNumber: number
      if (!(carsList.length % this.carsPerPage)) {
        pageNumber = carsList.length / this.carsPerPage
      } else {
        pageNumber = Math.ceil(carsList.length / this.carsPerPage)
      }
      return pageNumber
    } catch (error) {
      throw Error('Failed to get cars list')
    }
  }

  private async generateNewCars(num: number): Promise<void> {
    for (let i = 0; i < num; i += 1) {
      const brandName = this.view.getRandomName()

      const color = getRandomColor()

      const newCarItem: NewCar = {
        name: brandName,
        color,
      }
      this.view.garageService.createCar(newCarItem)
    }
    this.view.main.garageContainer.innerHTML = ''
    this.view.renderCars(this.view.garageService.getCarsList(this.currentPage))
    this.totalPages = this.getPageNumber()
  }

  private async getWinPageNumber(): Promise<number> {
    const winsList = await this.WinnerService.getFullWinnersList()
    this.view.winnersPage.header.textContent = `Winners (${winsList.length})`

    let pageWinNumber: number
    if (!(winsList.length % this.winnersPerPage)) {
      pageWinNumber = winsList.length / this.winnersPerPage
    } else {
      pageWinNumber = Math.ceil(winsList.length / this.winnersPerPage)
    }
    return pageWinNumber
  }

  public importData(): void {
    this.view.currentPageNum = this.currentPage
  }

  public async updateWinner(winner: null | RaceResults): Promise<void> {
    if (!winner) {
      throw Error(
        'There is no winner in this bloody race, all the cars have crashed'
      )
    }
    try {
      const winnerName = await this.GarageService.getCar(winner.id)

      // eslint-disable-next-line no-alert
      alert(`The winner is ${winnerName.name}`)
    } catch (error) {
      console.error('Failed to get the winner name')
    }
    try {
      const updatedWinnerData = {
        wins: 0,
        time: 0,
      }
      const existingWinner = await this.WinnerService.getWinner(winner.id)

      if (existingWinner.time > winner.time) {
        updatedWinnerData.time = Math.ceil(winner.time / this.msecPerSec)
        updatedWinnerData.wins = existingWinner.wins + 1
      } else {
        updatedWinnerData.time = Math.ceil(
          existingWinner.time / this.msecPerSec
        )
        updatedWinnerData.wins = existingWinner.wins + 1
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updatedWinner: UpdatedWinner =
        await this.WinnerService.updateWinner(updatedWinnerData, winner.id)
    } catch {
      const newWinner = {
        id: winner.id,
        wins: 1,
        time: Math.ceil(winner.time / this.msecPerSec),
      }
      try {
        await this.WinnerService.createWinner(newWinner)
      } catch (error) {
        console.error('Failed to create a new winner', error)
      }
    }
  }
}
