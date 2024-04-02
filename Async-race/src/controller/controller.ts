/* eslint-disable no-console */
/* eslint-disable max-lines-per-function */

import { View } from '../view/view'
import { findWinner, getRandomColor } from '../Utils/utils'
import { NewCar, RaceResults } from '../Utils/types'
import { GarageService } from '../services/garage'
import { WinnerService } from '../services/winners'
import { EngineService } from '../services/engine'
import { Toast } from '../view/toast'

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

  winsSortOrder: string

  timeSortOrder: string

  sortCriteria: string

  sortOrder: string

  raceController: AbortController = new AbortController()

  toast: Toast

  audio: HTMLAudioElement

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
    this.toast = new Toast()
    this.audio = new Audio()
    //  this.toast.bindConfirmButton(this.showToast)
    this.view.main.prevButton.addEventListener('click', async () => {
      const totalPages = await this.getPageNumber()
      const secondPage = 2
      if (this.currentPage >= secondPage) {
        const pageNum = this.currentPage - 1
        this.view.main.pageNum.textContent = `Page #${pageNum}`
        this.view.main.pageNumber.textContent = `${pageNum}/${totalPages}`
        this.view.main.pageNumber.style.width = `60px`
        this.currentPage -= 1
        this.view.currentPageNum = this.currentPage

        this.view.main.garageContainer.innerHTML = ''
        this.view.renderCars(
          this.view.garageService.getCarsList(this.currentPage)
        )
      }
    })

    this.view.main.nextButton.addEventListener('click', async () => {
      if (this.currentPage < (await this.getPageNumber())) {
        const pageNum = this.currentPage + 1
        const totalPages = await this.getPageNumber()
        this.view.main.pageNum.textContent = `Page #${pageNum}`
        this.view.main.pageNumber.textContent = `${pageNum}/${totalPages}`
                this.view.main.pageNumber.style.width = `60px`
        this.currentPage += 1
        this.view.currentPageNum = this.currentPage

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
        this.view.winnersPage.pageNumber.textContent = `${this.currentWinPage}`
        this.view.winnersPage.pageNum.textContent = `Page # ${this.currentWinPage}`
        this.getWinnersList(
          this.currentWinPage,
          this.sortCriteria,
          this.sortOrder
        )
      }
    })

    this.view.winnersPage.winNextButton.addEventListener('click', async () => {
      if (this.currentWinPage < (await this.totalWinPages)) {
        this.currentWinPage += 1
        this.view.winnersPage.pageNumber.textContent = `${this.currentWinPage}`
        this.view.winnersPage.pageNum.textContent = `Page # ${this.currentWinPage}`
        this.getWinnersList(
          this.currentWinPage,
          this.sortCriteria,
          this.sortOrder
        )
      }
    })

    this.view.main.winnersButton.addEventListener('click', () => {
      this.view.winnersPage.container.classList.toggle('active')
      this.view.main.container.classList.toggle('active')
      this.getWinnersList(
        this.currentWinPage,
        this.sortCriteria,
        this.sortOrder
      )
    })

    if (this.view.main.pageHeader.winnersButton && this.view.main.pageHeader) {
      this.view.main.pageHeader.winnersButton.addEventListener('click', () => {
        if (
          this.view.main.pageHeader.winnersButton &&
          this.view.main.pageHeader.garageButton
        ) {
          this.view.winnersPage.container.classList.toggle('active')
          this.view.main.container.classList.toggle('active')
          this.view.main.pageHeader.winnersButton.classList.add(
            'inactiveHeader'
          )
          this.view.main.pageHeader.winnersButton.disabled = true
          this.view.main.pageHeader.winnersButton?.classList.remove(
            'headerButton'
          )
          this.view.main.pageHeader.garageButton?.classList.add('headerButton')
          this.view.main.pageHeader.garageButton?.classList.remove(
            'inactiveHeader'
          )
          this.view.main.pageHeader.garageButton.disabled = false
          this.getWinnersList(
            this.currentWinPage,
            this.sortCriteria,
            this.sortOrder
          )
        }
      })
    }

    if (this.view.main.pageHeader.garageButton) {
      this.view.main.pageHeader.garageButton.addEventListener('click', () => {
        if (
          this.view.main.pageHeader.winnersButton &&
          this.view.main.pageHeader.garageButton
        ) {
          this.view.main.container.classList.toggle('active')
          this.view.winnersPage.container.classList.toggle('active')
          this.view.main.pageHeader.winnersButton?.classList.add('headerButton')
          this.view.main.pageHeader.garageButton?.classList.add(
            'inactiveHeader'
          )
          this.view.main.pageHeader.garageButton.disabled = true
          this.view.main.pageHeader.winnersButton?.classList.remove(
            'inactiveHeader'
          )
          this.view.main.pageHeader.garageButton?.classList.remove(
            'headerButton'
          )
          this.view.main.pageHeader.winnersButton.disabled = false
        }
      })
    }

    this.view.winnersPage.garageButton.addEventListener('click', () => {
      this.view.main.container.classList.toggle('active')
      this.view.winnersPage.container.classList.toggle('active')
    })

    this.view.main.raceButton.addEventListener('click', async () => {
      this.raceController = new AbortController()
      this.blockButtons()
      this.view.main.raceButton.disabled = true
      this.view.main.raceButton.classList.add('inactive2')
      this.view.main.resetButton.disabled = false
      this.view.main.resetButton.classList.remove('inactive2')
      this.view.main.resetButton.classList.add('race')
      const aButtons = Array.from(document.querySelectorAll('.aButton'))
      aButtons.forEach((el) => {
        el.classList.add('disabled-aButton')
        el.classList.add('temp')
        el.classList.remove('aButton')
        if (el instanceof HTMLButtonElement) {
          el.disabled = true
        }
      })
      const carIdList: number[] = []
      const carsList = await this.GarageService.getCarsList(this.currentPage)

      for (let i = 0; i < carsList.length; i += 1) {
        const { id } = carsList[i]
        carIdList.push(id)
      }
      this.raceController = new AbortController()
      try {
        const raceList = await Promise.all(
          carIdList.map((el) =>
            this.view.trackWrapper.raceCar(el, this.raceController.signal)
          )
        )
        
      //  const winner = raceList
       // console.log(raceList, 'raceList', winner, 'winner')
       const winner = findWinner(raceList)

        this.updateWinner(winner)
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.log('A race was aborted.')
        }
      }
    })

    this.view.main.resetButton.addEventListener('click', async () => {
      this.unblockButtons()
      this.raceController.abort()
      this.view.main.raceButton.disabled = false
      this.view.main.raceButton.classList.remove('inactive2')
      this.view.main.resetButton.classList.add('inactive2')
      this.view.main.resetButton.disabled = true
      const aButtons = Array.from(document.querySelectorAll('.temp'))
      aButtons.forEach((el) => {
        el.classList.remove('disabled-aButton')
        el.classList.remove('temp')
        el.classList.add('aButton')
        if (el instanceof HTMLButtonElement) {
          el.disabled = false
        }
      })
      const carIdList: number[] = []
      const carsList = await this.GarageService.getCarsList(this.currentPage)
      for (let i = 0; i < carsList.length; i += 1) {
        const { id } = carsList[i]
        carIdList.push(id)
      }
      await Promise.all(
        carIdList.map((el: number) => {
          return this.EngineService.getEnginePrams(el, 'stopped')
        })
      )
      this.view.carsArr.forEach((el) => {
        const newEl = el
        if (newEl.parentElement !== null) {
          newEl.style.transform = `translateX(0)`
          newEl.style.transitionDuration = '0.7s'
          newEl.style.backgroundImage = ''
        }
      })
    })

    this.view.main.generateCarsButton.addEventListener('click', () =>
      this.generateNewCars(100)
    )
    this.view.winnersPage.bindTimeSortButton(this.sortTime)
    this.view.winnersPage.bindWinsSortButton(this.sortWins)
    this.winsSortOrder = 'ASC'
    this.timeSortOrder = 'ASC'
    this.sortOrder = 'ASC'
    this.sortCriteria = 'time'

    document.addEventListener('raceStarted', (_event) => {
      this.view.main.raceButton.disabled = true
      this.view.main.raceButton.classList.add('inactive2')

      this.blockButtons()
      this.view.main.resetButton.classList.remove('race')
    })

    document.addEventListener('raceEnded', (_event) => {
      if (this.view.trackWrapper.allCarsAreStopped()) {
        this.view.main.raceButton.disabled = false
        this.view.main.raceButton.classList.remove('inactive2')
        this.view.main.resetButton.classList.add('race')
        this.unblockButtons()
      }
    })
  }

  private async getWinnersList(
    num: number,
    sort: string,
    order: string
  ): Promise<void> {
    try {
      const winsList = await this.WinnerService.getFullWinnersList()

      this.view.winnersPage.header.textContent = `Winners (${winsList.length})`

      const winnersList = await this.WinnerService.getWinnersList(
        num,
        sort,
        order
      )

      const carIdList = winnersList.map((el) => el.id)

      const winCars = await Promise.all(
        carIdList.map((el) => this.GarageService.getCar(el))
      )
      this.view.winnersPage.renderWinnersTable(
        winCars.length,
        winnersList,
        winCars,
        this.currentWinPage
      )
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
        color
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
      console.log('no winner')
      return
    }
    try {
      const winnerName = await this.GarageService.getCar(winner.id)
      this.audio.src = 'click.mp3'
      this.audio.play()
      this.toast.show(
        `The winner is ${winnerName.name} in ${winner.time / 1000} sec`
      )
    } catch (error) {
      console.error('Failed to get the winner name')
    }
    try {
      const updatedWinnerData = {
        wins: 0,
        time: 0
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

      await this.WinnerService.updateWinner(updatedWinnerData, winner.id)
    } catch {
      const newWinner = {
        id: winner.id,
        wins: 1,
        time: Math.ceil(winner.time / this.msecPerSec)
      }
      try {
        await this.WinnerService.createWinner(newWinner)
      } catch (error) {
        console.error('Failed to create a new winner', error)
      }
    }
  }

  sortTime = () => {
    this.sortCriteria = 'time'
    if (this.timeSortOrder === 'ASC') {
      this.timeSortOrder = 'DESC'
      this.sortOrder = 'DESC'
      this.view.winnersPage.timeSortButton.classList.add('active')
      this.view.winnersPage.timeSortButton.classList.add('visible')
      this.view.winnersPage.winSortButton.classList.remove('visible')
    } else if (this.timeSortOrder === 'DESC') {
      this.timeSortOrder = 'ASC'
      this.sortOrder = 'ASC'
      this.view.winnersPage.timeSortButton.classList.remove('active')
      this.view.winnersPage.timeSortButton.classList.add('visible')
      this.view.winnersPage.winSortButton.classList.remove('visible')
    }
    this.getWinnersList(this.currentWinPage, this.sortCriteria, this.sortOrder)
  }

  sortWins = () => {
    this.sortCriteria = 'wins'
    if (this.winsSortOrder === 'ASC') {
      this.winsSortOrder = 'DESC'
      this.sortOrder = 'DESC'
      this.view.winnersPage.winSortButton.classList.add('active')
      this.view.winnersPage.winSortButton.classList.add('visible')
      this.view.winnersPage.timeSortButton.classList.remove('visible')
    } else if (this.winsSortOrder === 'DESC') {
      this.winsSortOrder = 'ASC'
      this.sortOrder = 'ASC'
      this.view.winnersPage.winSortButton.classList.remove('active')
      this.view.winnersPage.winSortButton.classList.add('visible')
      this.view.winnersPage.timeSortButton.classList.remove('visible')
    }
    this.getWinnersList(this.currentWinPage, this.sortCriteria, this.sortOrder)
  }

  blockButtons = () => {
    this.view.main.prevButton.classList.add('inactivePage')
    this.view.main.nextButton.classList.add('inactivePage')
    this.view.main.nextButton.disabled = true
    this.view.main.prevButton.disabled = true
    this.view.main.updateButton.disabled = true
    this.view.main.updateButton.classList.add('inactive')
    this.view.main.createCar.classList.add('inactive')
    this.view.main.generateCarsButton.classList.add('inactiveGenerate')
    this.view.main.createCar.disabled = true
    this.view.main.generateCarsButton.disabled = true
    this.view.trackWrapper.selectButtonsArr.forEach((button) => {
      button.classList.add('inactive3')
      button.disabled = true
    })
    this.view.trackWrapper.removeButtonsArr.forEach((button) => {
      button.classList.add('inactive3')
      button.disabled = true
    })
  }

  unblockButtons = () => {
    this.view.main.prevButton.classList.remove('inactivePage')
    this.view.main.nextButton.classList.remove('inactivePage')
    this.view.main.nextButton.disabled = false
    this.view.main.prevButton.disabled = false
    this.view.main.updateButton.disabled = false
    this.view.main.createCar.disabled = false
    this.view.main.generateCarsButton.disabled = false
    this.view.main.updateButton.classList.remove('inactive')
    this.view.main.createCar.classList.remove('inactive')
    this.view.main.generateCarsButton.classList.remove('inactiveGenerate')
    this.view.trackWrapper.selectButtonsArr.forEach((button) => {
      button.classList.remove('inactive3')
      button.disabled = false
    })
    this.view.trackWrapper.removeButtonsArr.forEach((button) => {
      button.classList.remove('inactive3')
      button.disabled = false
    })
  }
}
