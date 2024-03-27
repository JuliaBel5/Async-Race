/* eslint-disable max-lines-per-function */

import { createElement } from '../Utils/utils'
// import { svgImage } from '../model/svg'
import { GarageService } from '../services/garage'
import { removeButtonNameArr } from '../model/arrs'
import { Car } from './car'

export class TrackWrapper {
  public trackWrapper: HTMLElement

  public firstLineWrapper: HTMLElement

  public secondLineWrapper: HTMLElement

  public selectButton: HTMLElement

  public removeButton: HTMLElement

  public aButton: HTMLButtonElement

  public bButton: HTMLButtonElement

  public abWrapper: HTMLDivElement

  public carWrapper: HTMLDivElement

  public flag: HTMLDivElement

  public brand: HTMLDivElement

  public garageService: GarageService

  public newCar: Car

  flagImg: HTMLImageElement

  constructor() {
    this.garageService = new GarageService()

    this.trackWrapper = createElement({
      tag: 'div',
      classList: ['trackWrapper'],
    })

    this.firstLineWrapper = createElement({
      tag: 'div',
      classList: ['firstLineWrapper'],
    })

    this.secondLineWrapper = createElement({
      tag: 'div',
      classList: ['secondLineWrapper'],
    })

    this.selectButton = createElement({
      tag: 'button',
      classList: ['remove'],
      textContent: 'Select',
    })

    this.removeButton = createElement({
      tag: 'button',
      classList: ['remove'],
      textContent: 'Remove',
    })

    removeButtonNameArr.push(this.removeButton)

    this.aButton = createElement({
      tag: 'button',
      classList: ['aButton'],
      textContent: 'A',
    })

    this.bButton = createElement({
      tag: 'button',
      classList: ['aButton'],
      textContent: 'B',
    })

    this.abWrapper = createElement({
      tag: 'div',
      classList: ['smallButtonsWrapper'],
    })

    this.carWrapper = createElement({
      tag: 'div',
      classList: ['carWrapper'],
    })

    this.flag = createElement({
      tag: 'div',
      classList: ['flag'],
    })

    this.flagImg = createElement({
      tag: 'img',
      classList: ['flag-img'],
    })

    this.flagImg.src = 'flag.png'

    this.flag.append(this.flagImg)

    this.brand = createElement({
      tag: 'div',
      classList: ['brand'],
    })

    this.firstLineWrapper.append(
      this.selectButton,
      this.removeButton,
      this.brand
    )
    this.abWrapper.append(this.aButton, this.bButton)
    this.secondLineWrapper.append(this.abWrapper, this.carWrapper)
    this.trackWrapper.append(this.firstLineWrapper, this.secondLineWrapper)

    this.newCar = new Car()
  }

  public createCarEl(): HTMLElement {
    return this.newCar.createCarEl()
  }
}
