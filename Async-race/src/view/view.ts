/* eslint-disable no-console */

import { colorCar, getRandomColor } from '../Utils/utils'
import { Garage, NewCar } from '../Utils/types'
import { GarageService } from '../services/garage'
import { EngineService } from '../services/engine'
import { WinnerService } from '../services/winners'
import { Main } from './view2'
import { TrackWrapper } from './track'
import { WinnersPage } from './winnersPage'
import { carBrands, carModels } from '../model/arrs'
import { Toast } from './toast'

export class View {
  public id: string

  public carsArr: HTMLElement[] = []

  public carBrands: string[]

  public carModels: string[]

  public garageService: GarageService

  public main: Main

  public winnersPage: WinnersPage

  public engineService: EngineService

  public winnerService: WinnerService

  public currentPageNum: number

  toast: Toast

  audio: HTMLAudioElement

  trackWrapper: TrackWrapper

  constructor() {
    this.main = new Main()
    this.winnersPage = new WinnersPage()
    this.garageService = new GarageService()
    this.winnerService = new WinnerService()
    this.engineService = new EngineService()
    this.trackWrapper = new TrackWrapper()
    this.currentPageNum = 1
    this.toast = new Toast()
    this.main.createCar.addEventListener('click', () => this.createNewCar())
    this.id = ''
    this.audio = new Audio()

    this.main.updateButton.addEventListener('click', async () => {
      this.audio.src = 'click.mp3'
      this.audio.play()
      if (!this.main.updateInput.value) {
        this.toast.show('Please, first select a car to update')
        return
      }
      const newColor = this.main.colorInput2.value
      const newBrandName = this.main.updateInput.value
      const carToUpdate = document.getElementById(this.id)
      if (carToUpdate && carToUpdate instanceof HTMLElement) {
        colorCar(carToUpdate, newColor)
      }

      const newCarItem: NewCar = {
        name: newBrandName,
        color: newColor
      }
      this.main.colorInput2.value = '#ECE4D3'
      this.main.updateInput.value = ''
      colorCar(this.main.preview2, `rgba(255, 255, 255, 0.1)`)
      try {
        await this.garageService.updateCar(newCarItem, Number(this.id))
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

    let brandName = this.main.textInput.value
    if (!this.main.textInput.value) {
      brandName = this.getRandomName()
    }
    let color = this.main.colorInput.value

    if (!this.main.colorInput.value) {
      color = getRandomColor()
    }
    const newCarItem: NewCar = {
      name: brandName,
      color
    }
    this.main.colorInput.value = '#ECE4D3'
    this.main.textInput.value = ''
    colorCar(this.main.preview, `rgba(255, 255, 255, 0.1)`)
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
    this.trackWrapper.selectButtonsArr = []
    this.trackWrapper.removeButtonsArr = []
    this.trackWrapper.aButtonsArr = []
    this.trackWrapper.bButtonsArr = []
    try {
      const fullCarsList = await this.garageService.getFullCarsList()
      this.main.header.textContent = `Garage (${fullCarsList.length})`

      for (let i = 0; i < num; i += 1) {
        this.trackWrapper.createCar(carsList[i])
        const ind: string = carsList[i].id.toString()
        this.id = ind
        if (this.trackWrapper.removeButton) {
          this.trackWrapper.removeButton.addEventListener('click', async () => {
            if (this.trackWrapper.carData) {
              this.id = this.trackWrapper.carData.id.toString()
              try {
                await this.garageService.deleteCar(Number(this.id))
                try {
                  const winnersList =
                    await this.winnerService.getFullWinnersList()
                  const hasWinnerWithSameId = winnersList.some(
                    (winner) => winner.id === Number(this.id)
                  )
                  if (hasWinnerWithSameId) {
                    try {
                      await this.winnerService.deleteWinner(Number(this.id))
                    } catch (error) {
                      console.error('Failed to delete your winner', error)
                    }
                  }
                } catch (error) {
                  console.error('Failed to get the winners list', error)
                }
              } catch (error) {
                console.error('Failed to delete your car, try again', error)
              }
            }
            this.main.garageContainer.innerHTML = ''
            await this.renderCars(
              this.garageService.getCarsList(this.currentPageNum)
            )
          })
        }
        if (this.trackWrapper.selectButton) {
          this.trackWrapper.selectButton.addEventListener('click', () => {
            if (this.trackWrapper.carData) {
              this.id = this.trackWrapper.carData.id.toString()
              this.main.colorInput2.value = this.trackWrapper.carData.color
              this.main.updateInput.value = this.trackWrapper.carData.name
            }
          })
        }

        if (this.trackWrapper.newCar && this.trackWrapper.trackWrapper) {
          this.carsArr.push(this.trackWrapper.newCar.car)
          this.main.garageContainer.append(this.trackWrapper.trackWrapper)
        }
      }
    } catch (error) {
      console.error('failed to get the full cars list')
    }
  }

  public async renderCars(carsListPromise: Promise<Garage[]>): Promise<void> {
    const carList = await carsListPromise
    this.createNewCars(carList.length, carList)
  }

  /* public async stop(id: number) {
    await this.engineService.getEnginePrams(id, 'stopped');
    
   } */

  /* private async getCarId(): Promise<string> {
    const carList = await this.garageService.carList
    const num = carList.length - 1
    return carList[num].id.toString()
  }

  private async getCarList(): Promise<Garage[]> {
    const carList = await this.garageService.carList
    return carList
  } */

  /* public async launchAll(): Promise<void> {
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
*/
}
