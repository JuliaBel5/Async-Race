import { createElement } from '../Utils/utils'
import { GarageService } from '../services/garage'
import { removeButtonNameArr } from '../model/arrs'
import { Car } from './car'
import { Garage, RaceResults } from '../Utils/types'
import { EngineService } from '../services/engine'


export class TrackWrapper {
  public trackWrapper: HTMLElement | undefined

  public firstLineWrapper: HTMLElement | undefined

  public secondLineWrapper: HTMLElement | undefined

  public selectButton: HTMLElement | undefined

  public removeButton: HTMLElement | undefined

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
 
 

  constructor() {
    this.garageService = new GarageService()
    this.engineService = new EngineService()
    this.audio = new Audio()
    
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

    this.selectButton = createElement({
      tag: 'button',
      classList: ['remove'],
      textContent: 'Select'
    })

    this.removeButton = createElement({
      tag: 'button',
      classList: ['remove'],
      textContent: 'Remove'
    })

    removeButtonNameArr.push(this.removeButton)

    const aButton = createElement({
      tag: 'button',
      classList: ['aButton'],
      textContent: 'A'
    })

    const bButton = createElement({
      tag: 'button',
      classList: ['disabled-aButton'],
      textContent: 'B'
    })

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

    this.flagImg.src = 'flag.png'

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
      raceController = new AbortController()
      if (bButton && aButton) {
        bButton.classList.remove('disabled-aButton')
        bButton.disabled = false
        aButton.classList.add('disabled-aButton')
        aButton.disabled = true
        bButton.classList.add('bButton')
        aButton.classList.remove('aButton')
        const raceStartedEvent = new CustomEvent('raceStarted');
         document.dispatchEvent(raceStartedEvent);
        if (this.newCar) {
          this.raceCar(carData.id, raceController.signal)
        }
      }
    })
    bButton.addEventListener('click', async () => {
      if (bButton && aButton) {
        bButton.classList.add('disabled-aButton')
        bButton.disabled = true
        bButton.classList.remove('bButton')
        aButton.classList.remove('disabled-aButton')
        aButton.disabled = false
        aButton.classList.add('aButton')
        raceController.abort()
        const raceEndedEvent = new CustomEvent('raceEnded');
        document.dispatchEvent(raceEndedEvent);
        const car = document.getElementById(carData.id.toString())
        if (car) {
          car.style.backgroundImage = '';
          car.style.transform = `translateX(0)`
          car.style.transitionDuration = '0.7s'
          await this.engineService.getEnginePrams(carData.id, 'stopped')
          car.style.backgroundImage = '';
        }
      }
    })

    this.selectButton.addEventListener('click', () => {
      this.audio.src = 'click.mp3'
      this.audio.play()
      this.carData = carData
    })
    this.removeButton.addEventListener('click', async () => {
      this.carData = carData
    })
  }

  public async raceCar(
    id: number,
    signal: AbortSignal
  ): Promise<void | RaceResults> {
    const engineInfo = await this.engineService.getEnginePrams(
      id,
      'started',
      signal
    )
    const car = document.getElementById(id.toString())
    if (car) {
      const carWrapper: HTMLElement | null = car.parentElement
      if (!carWrapper) {
        throw Error('There is no track')
      }
      const carWrapperRect = carWrapper.getBoundingClientRect()
      const width = carWrapperRect.width * 0.93
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
        car.style.transform = `translateX(${currentPositionInPercent * 9}%)`
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
        console.log(error)
        if (error instanceof Error) {
           if (error.message === 'Car engine broken down') {
            car.style.backgroundImage = `url('fire.png')`;
          }
      }
         return undefined
      }
    }
  }
  getCurrentCarData() {
    return this.carData
  }

}
