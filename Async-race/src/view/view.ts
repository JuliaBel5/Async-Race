/* eslint-disable no-console */
/* eslint-disable max-lines-per-function */

import { colorCar } from '../Utils/utils'
import { Garage, NewCar, RaceResults } from '../Utils/types'
import { GarageService } from '../services/garage'
import { EngineService } from '../services/engine'
import { WinnerService } from '../services/winners'
import { Main } from './main'
import { TrackWrapper } from './track'
import { WinnersPage } from './winnersPage'
import { carBrands, carModels } from '../model/arrs'
import { Toast } from './toast'

export class View {
  public removeButtonNameArr: HTMLElement[] = []

  public ind: string

  public carsArr: HTMLElement[] = []

  public brandNameArr: HTMLElement[] = []

  public carBrands: string[]

  public carModels: string[]

  public garageService: GarageService

  public main: Main

  public winnersPage: WinnersPage

  public engineService: EngineService

  public winnerService: WinnerService

  public currentPageNum: null | number

  toast: Toast

  audio: HTMLAudioElement

  constructor() {
    this.main = new Main()
    this.winnersPage = new WinnersPage()
    this.garageService = new GarageService()
    this.winnerService = new WinnerService()
    this.engineService = new EngineService()
    this.currentPageNum = null
    this.toast = new Toast()
    this.toast.bindConfirmButton(this.showToast)
    this.main.createCar.addEventListener('click', () => this.createNewCar())
    this.ind = ''
    this.audio = new Audio()

    this.main.updateButton.addEventListener('click', async () => {
      const newColor = this.main.colorInput2.value
      this.audio.src = 'click.mp3'
      this.audio.play()
      if (!this.main.updateInput.value) {
        this.toast.show('Please, first select a car to update')
        return
      }
      if (document.getElementById(this.ind)) {
        colorCar(document.getElementById(this.ind) as HTMLElement, newColor)
      }
      const newBrandName = this.main.updateInput.value
      const index = Number(this.ind)
      this.brandNameArr[index - 1].textContent = newBrandName

      const newCarItem: NewCar = {
        name: newBrandName,
        color: newColor,
      }
      try {
        await this.garageService.updateCar(newCarItem, index)
        this.main.garageContainer.innerHTML = ''
        this.renderCars(this.garageService.getCarsList(this.currentPageNum))
      } catch (error) {
        console.error('Failed to get the winners list', error)
      }
    })

    this.carBrands = carBrands
    this.carModels = carModels
  }

  public getRandomName(): string {
    const carBrand =
      this.carBrands[Math.floor(Math.random() * this.carBrands.length)]
    const carModel =
      this.carModels[Math.floor(Math.random() * this.carModels.length)]
    return `${carBrand} ${carModel}`
  }

  private async createNewCar(): Promise<void> {
    // создает одну машинку

    const brandName = this.main.textInput.value
    const color = this.main.colorInput.value
    const newCarItem: NewCar = {
      name: brandName,
      color,
    }
    try {
      await this.garageService.createCar(newCarItem)
      this.main.garageContainer.innerHTML = ''
      this.renderCars(this.garageService.getCarsList(this.currentPageNum))
    } catch (error) {
      console.error('Failed to create the car')
    }
  }

  private async createNewCars(num: number, carsList: Garage[]): Promise<void> {
    // рендер страницы
    try {
      const fullCarsList = await this.garageService.getFullCarsList()
      this.main.header.textContent = `Garage (${fullCarsList.length})`

      for (let i = 0; i < num; i += 1) {
        const trackWrapper = new TrackWrapper()
        const brandName = carsList[i].name
        trackWrapper.brand.textContent = brandName
        this.brandNameArr.push(trackWrapper.brand)

        const { color } = carsList[i]
        const ind: string = carsList[i].id.toString()
        this.ind = ind

        trackWrapper.newCar.car.id = ind

        trackWrapper.removeButton.addEventListener('click', async () => {
          try {
            await this.garageService.deleteCar(Number(ind))

            this.brandNameArr.splice(Number(ind) - 1, 1)

            this.main.garageContainer.innerHTML = ''
            this.renderCars(this.garageService.getCarsList(this.currentPageNum))
            try {
              await this.winnerService.deleteWinner(Number(ind))
            } catch (error) {
              console.error('Failed to delete your winner, try again', error)
            }
          } catch (error) {
            console.error('Failed to delete your car, try again', error)
          }
        })

        trackWrapper.selectButton.addEventListener('click', () => {
          this.ind = ind
          this.audio.src = 'click.mp3'
          this.audio.play()
          this.main.colorInput2.value = color
          this.main.updateInput.value = brandName
          this.ind = carsList[i].id.toString()
        })
        trackWrapper.aButton.addEventListener('click', async () => {
          const engineInfo = await this.engineService.getEnginePrams(
            carsList[i].id,
            'started'
          )

          const width = trackWrapper.carWrapper.offsetWidth * 0.93
          const time = Math.round(engineInfo.distance / engineInfo.velocity)
          const animationTime = time

          let startTimestamp: number | null
          let animationId: number
          let currentPosition = 0

          function updatePosition(timestamp: number): void {
            if (!startTimestamp) startTimestamp = timestamp

            const elapsedTime = timestamp - startTimestamp
            const progress = Math.min(elapsedTime / animationTime, 1)
            currentPosition = progress * width
            trackWrapper.newCar.car.style.transform = `translateX(${currentPosition}px)`

            if (progress < 1) {
              // Keep animating until the end
              animationId = requestAnimationFrame(updatePosition)
            } else {
              startTimestamp = null
            }
          }

          animationId = requestAnimationFrame(updatePosition)

          trackWrapper.bButton.addEventListener('click', async () => {
            cancelAnimationFrame(animationId)
            startTimestamp = null
            trackWrapper.newCar.car.style.transform = `translateX(0)`
            trackWrapper.newCar.car.style.transitionDuration = '0.7s'
            await this.engineService.getEnginePrams(carsList[i].id, 'stopped')
          })
          try {
            await this.engineService.getEngineStatus(carsList[i].id, 'drive')
          } catch (error) {
            cancelAnimationFrame(animationId)
          }
        })
        colorCar(trackWrapper.newCar.car, color)
        trackWrapper.carWrapper.append(
          trackWrapper.newCar.car,
          trackWrapper.flag
        )
        //  this.trackArr.push(trackWrapper.trackWrapper);
        this.carsArr.push(trackWrapper.newCar.car)
        this.main.garageContainer.append(trackWrapper.trackWrapper)
      }
    } catch (error) {
      console.error('failed to get hte full cars list')
    }
  }

  public async renderCars(carsListPromise: Promise<Garage[]>): Promise<void> {
    const carList = await carsListPromise
    console.log(carList)
    this.createNewCars(carList.length, carList)
  }

  private async getCarId(): Promise<string> {
    const carList = await this.garageService.carList
    const num = carList.length - 1
    return carList[num].id.toString()
  }

  private async getCarList(): Promise<Garage[]> {
    const carList = await this.garageService.carList
    return carList
  }

  public async raceCar(id: number): Promise<void | RaceResults> {
    //  объект с id и временем || undefined
    const engineInfo = await this.engineService.getEnginePrams(id, 'started')
    const car: HTMLElement | null = document.getElementById(`${id}`)
    if (!car) {
      throw Error("Sorry dude, you don't have any car")
    }
    const carWrapper: HTMLElement | null = car.parentElement
    if (!carWrapper) {
      throw Error('There is no track')
    }

    const width = carWrapper.offsetWidth * 0.93
    const time = Math.round(engineInfo.distance / engineInfo.velocity)
    const animationTime = time
    let startTimestamp: number | null
    let animationId: number
    let currentPosition = 0

    function updatePosition(timestamp: number): void {
      if (!startTimestamp) startTimestamp = timestamp

      const elapsedTime = timestamp - startTimestamp
      const progress = Math.min(elapsedTime / animationTime, 1)
      currentPosition = progress * width
      if (!car) {
        throw Error("Sorry dude, you don't have any car")
      }
      car.style.transform = `translateX(${currentPosition}px)`

      if (progress < 1) {
        animationId = requestAnimationFrame(updatePosition)
      } else {
        startTimestamp = null
      }
    }
    animationId = requestAnimationFrame(updatePosition)

    try {
      await this.engineService.getEngineStatus(id, 'drive')
      const carResult = { id, time: animationTime }
      return carResult
    } catch (error) {
      cancelAnimationFrame(animationId)
      startTimestamp = null
      return undefined
    }
  }

  public async launchAll(): Promise<void> {
    const idArr: number[] = []
    try {
      const carsList = await this.garageService.getCarsList(this.currentPageNum)
      for (let i = 0; i < carsList.length; i += 1) {
        const { id } = carsList[i]
        idArr.push(id)
      }
      await Promise.all(idArr.map((el) => this.raceCar(el)))
    } catch (error) {
      console.error('Failed to get the cars list')
    }
  }

  showToast = () => {
    this.toast.toastContainer.classList.remove('show')
    this.toast.audio.src = 'click.mp3'
    this.toast.audio.play()
    clearTimeout(this.toast.timeoutId)
  }
}
