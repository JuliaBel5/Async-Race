import { createElement } from '../Utils/utils'
import { GarageService } from '../services/garage'
import { Car } from './car'
import { Garage, RaceResults } from '../Utils/types'
import { EngineService } from '../services/engine'

export class TrackWrapper {
  public trackWrapper: HTMLElement | undefined

  public firstLineWrapper: HTMLElement | undefined

  public secondLineWrapper: HTMLElement | undefined

  public selectButton: HTMLButtonElement | undefined

  public removeButton: HTMLButtonElement | undefined

  public abWrapper: HTMLDivElement | undefined

  public carWrapper: HTMLDivElement | undefined

  public flag: HTMLDivElement | undefined

  public brand: HTMLDivElement | undefined

  public garageService: GarageService

  public newCar: Car | undefined

  public flagImg: HTMLImageElement | undefined

  public raceController: AbortController | undefined

  public audio: HTMLAudioElement

  public carData: Garage | undefined

  engineService: EngineService

  counter: number

  selectButtonsArr: HTMLButtonElement[]

  removeButtonsArr: HTMLButtonElement[]

  aButtonsArr: HTMLButtonElement[]

  bButtonsArr: HTMLButtonElement[]

  constructor() {
    this.garageService = new GarageService()
    this.engineService = new EngineService()
    this.audio = new Audio()
    this.counter = 0
    this.selectButtonsArr = []
    this.removeButtonsArr = []
    this.aButtonsArr = []
    this.bButtonsArr = []
  }

  public createCar(carData: Garage) {
    this.carData = carData
    this.trackWrapper = createElement({
      tag: 'div',
      classList: ['trackWrapper']
    })

    this.firstLineWrapper = createElement({
      tag: 'div',
      classList: ['firstLineWrapper']
    })

    this.secondLineWrapper = createElement({
      tag: 'div',
      classList: ['secondLineWrapper']
    })

    const selectButton = createElement({
      tag: 'button',
      classList: ['remove'],
      textContent: 'Select'
    })

    this.selectButton = selectButton
    this.selectButtonsArr.push(this.selectButton)
    const removeButton = createElement({
      tag: 'button',
      classList: ['remove'],
      textContent: 'Remove'
    })
    this.removeButton = removeButton

    this.removeButtonsArr.push(this.removeButton)

    const aButton = createElement({
      tag: 'button',
      classList: ['aButton'],
      textContent: 'A'
    })
    this.aButtonsArr.push(aButton)

    const bButton = createElement({
      tag: 'button',
      classList: ['disabled-aButton'],
      textContent: 'B'
    })
    this.bButtonsArr.push(bButton)

    bButton.disabled = true

    this.abWrapper = createElement({
      tag: 'div',
      classList: ['smallButtonsWrapper']
    })

    this.carWrapper = createElement({
      tag: 'div',
      classList: ['carWrapper']
    })

    this.flag = createElement({
      tag: 'div',
      classList: ['flag']
    })

    this.flagImg = createElement({
      tag: 'img',
      classList: ['flag-img']
    })

    this.flagImg.src = 'reverbere.png'
    // 'flag.png'

    this.flag.append(this.flagImg)

    this.brand = createElement({
      tag: 'div',
      textContent: carData.name,
      classList: ['brand']
    })

    this.firstLineWrapper.append(
      this.selectButton,
      this.removeButton,
      this.brand
    )
    this.abWrapper.append(aButton, bButton)
    this.secondLineWrapper.append(this.abWrapper, this.carWrapper)
    this.trackWrapper.append(this.firstLineWrapper, this.secondLineWrapper)

    this.newCar = new Car()
    this.newCar.colorCar(this.newCar.car, carData.color)
    this.newCar.car.id = carData.id.toString()
    this.carWrapper.append(this.newCar.car, this.flag)

    let raceController: AbortController
    aButton.addEventListener('click', async () => {
      this.counter += 1
      const raceStartedEvent = new CustomEvent('raceStarted')
      document.dispatchEvent(raceStartedEvent)
      raceController = new AbortController()

      this.selectButtonsArr.forEach((button) => {
        button.classList.add('inactive3')
        button.disabled = true
      })

      this.removeButtonsArr.forEach((button) => {
        button.classList.add('inactive3')
        button.disabled = true
      })
      if (bButton && aButton) {
        aButton.classList.add('disabled-aButton')
        aButton.disabled = true
        aButton.classList.remove('aButton')

        if (this.newCar) {
          this.raceCar(carData.id, raceController.signal)
        }

        bButton.classList.remove('disabled-aButton')
        bButton.disabled = false
        bButton.classList.add('bButton')
      }
    })
    bButton.addEventListener('click', async () => {
      this.counter -= 1
      if (this.allCarsAreStopped()) {
        this.selectButtonsArr.forEach((button) => {
          button.classList.remove('inactive3')
          button.disabled = false
        })
        this.removeButtonsArr.forEach((button) => {
          button.classList.remove('inactive3')
          button.disabled = false
        })
      }
      if (bButton && aButton) {
        bButton.classList.add('disabled-aButton')
        bButton.disabled = true
        bButton.classList.remove('bButton')
        aButton.classList.remove('disabled-aButton')
        aButton.disabled = false
        aButton.classList.add('aButton')
        raceController.abort()
        const raceEndedEvent = new CustomEvent('raceEnded')
        document.dispatchEvent(raceEndedEvent)
        const car = document.getElementById(carData.id.toString())
        if (car) {
          car.style.backgroundImage = ''
          car.style.transform = `translateX(0)`
          car.style.transitionDuration = '0.7s'
          await this.engineService.getEnginePrams(carData.id, 'stopped')
          car.style.backgroundImage = ''
        }
      }
    })

    this.selectButton.addEventListener('click', () => {
      this.audio.src = 'click.mp3'
      this.audio.play()
      this.carData = carData
    })

    this.removeButton.addEventListener('click', async () => {
      this.selectButtonsArr = this.selectButtonsArr.filter(
        (button) => button !== selectButton
      )
      this.removeButtonsArr = this.removeButtonsArr.filter(
        (button) => button !== removeButton
      )
      this.aButtonsArr = this.aButtonsArr.filter((button) => button !== aButton)
      this.bButtonsArr = this.bButtonsArr.filter((button) => button !== bButton)
      console.log(
        this.selectButtonsArr,
        this.removeButtonsArr,
        this.aButtonsArr,
        this.bButtonsArr
      )
      this.carData = carData
    })
  }

  public async raceCar(
    id: number,
    signal: AbortSignal
  ): Promise<void | RaceResults> {
    try {
      const engineInfo = await this.engineService.getEnginePrams(
        id,
        'started',
        signal
      )

      const car = document.getElementById(id.toString())
      if (car && this.flag) {
        const carWrapper: HTMLElement | null = car.parentElement
        if (!carWrapper) {
          throw Error('There is no track')
        }
        const carWrapperRect = carWrapper.getBoundingClientRect()
        // const flagRect = this.flag.getBoundingClientRect()
        //   const flagRatio = flagRect.width * 100 / carWrapperRect.width
        const width = carWrapperRect.width * 0.83 //100%
        //    const carRect = car.getBoundingClientRect()

        //   const ratio:number = width / carRect.width

        const time = Math.round(engineInfo.distance / engineInfo.velocity)
        const animationTime = time
        let startTimestamp: number | null
        let animationId: number
        let currentPosition = 0
        let currentPositionInPercent = 0

        const updatePosition = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp
          const elapsedTime = timestamp - startTimestamp
          const progress = Math.min(elapsedTime / animationTime, 1)
          currentPosition = progress * width
          currentPositionInPercent = (currentPosition * 100) / width
          car.style.transform = `translateX(${currentPositionInPercent * 5.53}%)`
          if (progress < 1) {
            animationId = requestAnimationFrame(updatePosition)
          } else {
            startTimestamp = null
          }
        }
        animationId = requestAnimationFrame(updatePosition)

        try {
          await this.engineService.getEngineStatus(id, 'drive', signal)
          const carResult = { id, time: animationTime }
          return carResult
        } catch (error: unknown) {
          cancelAnimationFrame(animationId)
          startTimestamp = null
          if (error instanceof Error) {
            if (error.message === 'Car engine broken down') {
              car.style.backgroundImage = `url('fire.png')`
            }
            if (error instanceof DOMException) {
              console.log('A race was aborted by user.')
            }
          }
          return undefined
        }
      }
    } catch (error: unknown) {
      if (error instanceof DOMException) {
        console.log('A race was aborted by user.')
      } else {
        console.log('A race was aborted by user.')
      }
    }
    return undefined
  }

  getCurrentCarData() {
    return this.carData
  }

  allCarsAreStopped = () => {
    if (this.counter === 0) {
      return true
    }
  }
}
