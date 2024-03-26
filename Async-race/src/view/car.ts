import { createElement } from '../Utils/utils'
import { svgImage } from '../model/svg'

export class Car {
  newCar: HTMLDivElement | undefined

  car: HTMLDivElement

  constructor() {
    this.car = createElement({
      tag: 'div',
      classList: ['car'],
      innerHTML: svgImage,
    })
  }

  public createCarEl(): HTMLElement {
    this.newCar = createElement({
      tag: 'div',
      classList: ['car'],
      innerHTML: svgImage,
    })

    return this.newCar
  }
}
