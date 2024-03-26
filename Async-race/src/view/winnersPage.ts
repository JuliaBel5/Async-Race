/* eslint-disable max-lines-per-function */

import { svgImage } from '../model/svg'
import { createElement, colorCar } from '../Utils/utils'
import { Garage, WinnerType } from '../Utils/types'
import { GarageService } from '../services/garage'

export class WinnersPage {
  public titleArr: HTMLElement[] = []

  public titlesArr: string[] = [
    'Number',
    'Car',
    'Name',
    'Wins',
    'Best time(seconds)',
  ]

  public linesArr: HTMLElement[] = []

  public root: HTMLBodyElement | null

  public container: HTMLDivElement

  public garageButton: HTMLButtonElement

  public winnersButton: HTMLButtonElement

  public buttonsWrapper: HTMLDivElement

  public header: HTMLDivElement

  public pageNum: HTMLDivElement

  public table: HTMLTableCellElement

  public garageService: GarageService

  public winPrevButton: HTMLButtonElement

  public winNextButton: HTMLButtonElement

  public winPagesButtonWrapper: HTMLDivElement

  constructor() {
    this.garageService = new GarageService()
    this.root = document.querySelector('body')

    this.container = createElement({
      tag: 'div',
      classList: ['winnersContainer'],
    })

    this.garageButton = createElement({
      tag: 'button',
      classList: ['button'],
      textContent: 'To Garage',
    })

    this.winnersButton = createElement({
      tag: 'button',
      classList: ['button'],
      textContent: 'To Winners',
    })

    this.buttonsWrapper = createElement({
      tag: 'div',
      classList: ['buttonsWrapper'],
    })

    this.header = createElement({
      tag: 'div',
      classList: ['header'],
      textContent: 'Winners',
    })

    this.pageNum = createElement({
      tag: 'div',
      classList: ['subheader'],
      textContent: 'Page #1',
    })

    this.table = createElement({
      tag: 'td',
      classList: ['table'],
    })

    for (let i = 0; i < 5; i += 1) {
      const title = createElement({
        tag: 'th',
        classList: ['title'],
        textContent: this.titlesArr[i],
      })
      this.titleArr.push(title)
      this.table.append(title)
    }
    this.winPrevButton = createElement({
      tag: 'button',
      classList: ['aButton'],
      textContent: 'Prev',
    })

    this.winNextButton = createElement({
      tag: 'button',
      classList: ['aButton'],
      textContent: 'Next',
    })

    this.winPagesButtonWrapper = createElement({
      tag: 'div',
      classList: ['smallButtonsWrapper'],
    })
    this.winPagesButtonWrapper.append(this.winPrevButton, this.winNextButton)

    if (this.root) {
      this.root.append(this.container)
    }
    this.container.append(
      this.garageButton,
      this.winnersButton,
      this.buttonsWrapper,
      this.header,
      this.pageNum,
      this.table,
      this.winPagesButtonWrapper
    )
  }

  public async renderWinnersTable(
    num: number,
    winnersList: WinnerType[],
    winCars: Garage[]
  ): Promise<void> {
    // const winCarsArr = []
    while (this.table.children[5]) {
      this.table.removeChild(this.table.children[5])
    }
    for (let i = 0; i < num; i += 1) {
      const row = createElement({
        tag: 'tr',
      })

      const td1 = createElement({
        tag: 'td',
        classList: ['tableData'],
        textContent: `${i + 1}`,
      })
      const td2 = createElement({
        tag: 'td',
        classList: ['tableData', 'minicar'],
        innerHTML: svgImage,
      })
      const td3 = createElement({
        tag: 'td',
        classList: ['tableData'],
        textContent: winCars[i].name,
      })

      const td4 = createElement({
        tag: 'td',
        classList: ['tableData'],
        textContent: winnersList[i].wins.toString(),
      })

      const td5 = createElement({
        tag: 'td',
        classList: ['tableData'],
        textContent: winnersList[i].time.toString(),
      })

      colorCar(td2, winCars[i].color)
      row.append(td1, td2, td3, td4, td5)
      this.table.append(row)
    }
  }
}
