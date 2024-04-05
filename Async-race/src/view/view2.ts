/* eslint-disable max-lines-per-function */
import { colorCar, createElement } from '../Utils/utils'
import { svgImage } from '../model/svg'
import { GarageService } from '../services/garage'
import { Header } from './header'

export class Main {
  public trackArr: HTMLElement[] = []

  public carsArr: HTMLElement[] = []

  public brandNameArr: HTMLElement[] = []

  public garageButton: HTMLElement

  public winnersButton: HTMLElement

  public raceButton: HTMLButtonElement

  public resetButton: HTMLButtonElement

  public generateCarsButton: HTMLButtonElement

  public root: Element | null

  public colorInput: HTMLInputElement

  public updateInput: HTMLInputElement

  public colorInput2: HTMLInputElement

  public textInput: HTMLInputElement

  public container: HTMLElement

  public createCar: HTMLButtonElement

  public updateButton: HTMLButtonElement

  public buttonsWrapper: HTMLElement

  public buttonsWrapper1: HTMLElement

  public buttonsWrapper2: HTMLElement

  public garageService: GarageService

  public garageContainer: HTMLDivElement

  public prevButton: HTMLButtonElement

  public pageNumber: HTMLDivElement

  public nextButton: HTMLButtonElement

  public pagesButtonWrapper: HTMLDivElement

  public header: HTMLDivElement

  public pageHeader: Header

  public pageNum: HTMLDivElement
  svgCar: string
  preview: HTMLDivElement
  color: string
  preview2: HTMLDivElement
  svgCar2: string | undefined
  color2: string

  constructor() {
    this.garageService = new GarageService()
    this.root = document.body
    this.pageHeader = new Header()
    this.pageHeader.init()
    this.container = createElement({
      tag: 'div',
      classList: ['container']
    })
    this.garageContainer = createElement({
      tag: 'div',
      classList: ['container1']
    })
    this.garageButton = createElement({
      tag: 'button',
      classList: ['button'],
      textContent: 'To Garage'
    })

    this.winnersButton = createElement({
      tag: 'button',
      classList: ['button'],
      textContent: 'To Winners'
    })

    this.createCar = createElement({
      tag: 'button',
      classList: ['button'],
      textContent: 'Create'
    })

    this.updateButton = createElement({
      tag: 'button',
      classList: ['button'],
      textContent: 'Update'
    })

    this.buttonsWrapper = createElement({
      tag: 'div',
      classList: ['buttonsWrapper']
    })

    this.buttonsWrapper1 = createElement({
      tag: 'div',
      classList: ['buttonsWrapper']
    })

    this.buttonsWrapper2 = createElement({
      tag: 'div',
      classList: ['longbuttonsWrappe']
    })

    this.raceButton = createElement({
      tag: 'button',
      classList: ['race'],
      textContent: 'Race'
    })

    this.resetButton = createElement({
      tag: 'button',
      classList: ['inactive2'],
      textContent: 'Reset'
    })

    this.generateCarsButton = createElement({
      tag: 'button',
      classList: ['longbutton'],
      textContent: 'Generate Cars'
    })

    this.colorInput = createElement({
      tag: 'input',
      classList: ['colorInput']
    })

    this.colorInput.setAttribute('type', 'color')
    this.colorInput.value = '#ECE4D3'
    
    this.textInput = createElement({
      tag: 'input',
      classList: ['input']
    })
    this.textInput.setAttribute('type', 'text')

    this.updateInput = createElement({
      tag: 'input',
      classList: ['input']
    })

    this.updateInput.setAttribute('type', 'text')

    this.colorInput2 = createElement({
      tag: 'input',
      classList: ['colorInput']
    })
    this.colorInput2.value = '#ECE4D3'
    this.svgCar = svgImage
    this.colorInput2.setAttribute('type', 'color')
    this.preview = createElement({
      tag: 'div',
      classList: ['preview'],
      innerHTML: this.svgCar
    })
    this.color = `rgba(255, 255, 255, 0.1)`
    colorCar(this.preview, this.color)
    this.colorInput.addEventListener('input', () => {
      colorCar(this.preview, this.colorInput.value)
    })

    this.svgCar2 = svgImage
    this.colorInput2.setAttribute('type', 'color')
    this.preview2 = createElement({
      tag: 'div',
      classList: ['preview'],
      innerHTML: this.svgCar2
    })
    this.color2 = `rgba(255, 255, 255, 0.1)`
    colorCar(this.preview2, this.color2)
    this.colorInput2.addEventListener('input', () => {
      colorCar(this.preview2, this.colorInput2.value)
    })

    this.header = createElement({
      tag: 'div',
      classList: ['headerGarage'],
      textContent: 'Garage'
    })

    this.pageNum = createElement({
      tag: 'div',
      classList: ['subheader'],
      textContent: 'Page #1'
    })

    this.prevButton = createElement({
      tag: 'button',
      classList: ['page-button'],
      textContent: 'Prev'
    })

    this.pageNumber = createElement({
      tag: 'div',
      classList: ['title'],
      textContent: '1/1'
    })

    this.nextButton = createElement({
      tag: 'button',
      classList: ['page-button'],
      textContent: 'Next'
    })

    this.pagesButtonWrapper = createElement({
      tag: 'div',
      classList: ['smallButtonsWrapper']
    })
    this.pagesButtonWrapper.append(
      this.prevButton,
      this.pageNumber,
      this.nextButton
    )

    this.container.append(
      this.buttonsWrapper1,
      this.buttonsWrapper2,
      this.header,
      this.pageNum,
      this.garageContainer,
      this.pagesButtonWrapper
    )
    this.buttonsWrapper.append(this.garageButton, this.winnersButton)

    this.buttonsWrapper1.append(
      this.textInput,
      this.colorInput,
      this.createCar,
      this.preview,
      this.updateInput,
      this.colorInput2,
      this.updateButton,
      this.preview2
    )

    this.buttonsWrapper2.append(
      this.raceButton,
      this.resetButton,
      this.generateCarsButton
    )

    if (this.root) {
      this.root.append(this.container)
    }
  }
}
