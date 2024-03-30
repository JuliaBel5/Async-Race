import chroma from 'chroma-js'
import { RaceResults } from '../Utils/types'
import { createElement } from '../Utils/utils'
import { svgImage } from '../model/svg'
import { EngineService } from '../services/engine'

export class Car {
  newCar: HTMLDivElement | undefined

  car: HTMLDivElement
  engineService: EngineService
  animationId: number

  constructor() {
    this.engineService = new EngineService()
    this.animationId = 0

    this.car = createElement({
      tag: 'div',
      classList: ['car'],
      innerHTML: svgImage
    })
  }

  public createCarEl(): HTMLElement {
    this.newCar = createElement({
      tag: 'div',
      classList: ['car'],
      innerHTML: svgImage
    })

    return this.newCar
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
    const car: HTMLElement | null = document.getElementById(`${id}`)
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
      this.animationId = animationId
      try {
        await this.engineService.getEngineStatus(id, 'drive', signal)
        const carResult = { id, time: animationTime }
        return carResult
      } catch (error) {
        cancelAnimationFrame(animationId)
        startTimestamp = null
        return undefined
      }
    }
  }
  colorCar(el: HTMLElement, color: string): void {
    const paths1 = el.querySelectorAll('path')
    paths1[28].style.fill = chroma(color).saturate().hex()

    paths1[29].style.fill = color
    paths1[30].style.fill = chroma(color).darken().hex()
    // полоса
    paths1[48].setAttribute('style', 'fill:white')
    paths1[47].setAttribute('style', 'fill:white')
    paths1[49].setAttribute('style', 'fill:white')
  }
}
