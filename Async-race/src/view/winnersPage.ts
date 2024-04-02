import { svgImage } from '../model/svg'
import { createElement, colorCar } from '../Utils/utils'
import { Garage, WinnerType } from '../Utils/types'
import { GarageService } from '../services/garage'

type HandlerFunction = () => void

export class WinnersPage {
  public titleArr: HTMLElement[] = []

  public titlesArr: string[] = [
    'Number',
    'Car',
    'Name',
    'Wins',
    'Best time (sec)'
  ]

  public linesArr: HTMLElement[] = []

  public root: HTMLElement | null

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

  timeSortButton: HTMLDivElement

  winSortButton: HTMLDivElement

  pageNumber: HTMLDivElement

  // winCarsArr: WinnerType[]

  constructor() {
    this.garageService = new GarageService()
    this.root = document.body

    this.container = createElement({
      tag: 'div',
      classList: ['winnersContainer']
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

    this.buttonsWrapper = createElement({
      tag: 'div',
      classList: ['buttonsWrapper']
    })

    this.header = createElement({
      tag: 'div',
      classList: ['headerGarage'],
      textContent: 'Winners'
    })

    this.pageNum = createElement({
      tag: 'div',
      classList: ['subheader'],
      textContent: 'Page #1'
    })

    this.table = createElement({
      tag: 'td',
      classList: ['table']
    })

    for (let i = 0; i < 5; i += 1) {
      const title = createElement({
        tag: 'th',
        classList: ['tabTitle'],
        textContent: this.titlesArr[i]
      })
      this.titleArr.push(title)
      this.table.append(title)
    }

    this.timeSortButton = createElement({
      tag: 'div',
      classList: ['sort-button'],
      textContent: ''
    })

    this.winSortButton = createElement({
      tag: 'div',
      classList: ['sort-button'],
      textContent: ''
    })
    this.titleArr[4].append(this.timeSortButton)
    this.titleArr[4].classList.add('with-sort')
    this.titleArr[4].style.cursor = 'pointer'
    this.titleArr[3].append(this.winSortButton)
    this.titleArr[3].classList.add('with-sort-wins')
    this.titleArr[3].style.cursor = 'pointer'

    this.winPrevButton = createElement({
      tag: 'button',
      classList: ['page-button'],
      textContent: 'Prev'
    })
    this.pageNumber = createElement({
      tag: 'div',
      classList: ['title'],
      textContent: '1'
    })

    this.winNextButton = createElement({
      tag: 'button',
      classList: ['page-button'],
      textContent: 'Next'
    })

    this.winPagesButtonWrapper = createElement({
      tag: 'div',
      classList: ['pagesButtonsWrapper']
    })
    this.winPagesButtonWrapper.append(
      this.winPrevButton,
      this.pageNumber,
      this.winNextButton
    )

    if (this.root) {
      this.root.append(this.container)
    }
    this.container.append(
      //    this.garageButton,
      //     this.winnersButton,
      this.buttonsWrapper,
      this.header,
      this.pageNum,
      this.table,
      this.winPagesButtonWrapper
    )
    // this.winCarsArr = []
  }

  public async renderWinnersTable(
    num: number,
    winnersList: WinnerType[],
    winCars: Garage[],
    winPageNum: number
  ): Promise<void> {
    while (this.table.children[5]) {
      this.table.removeChild(this.table.children[5])
    }
    for (let i = 0; i < num; i += 1) {
      const row = createElement({
        tag: 'tr'
      })

      const td1 = createElement({
        tag: 'td',
        classList: ['tableData'],
        textContent: `${i + 1 + 10 * (winPageNum - 1)}`
      })
      const td2 = createElement({
        tag: 'td',
        classList: ['tableData', 'minicar'],
        innerHTML: ''
      })
      const svg = createElement({
        tag: 'div',
        classList: ['svg'],
        innerHTML: svgImage
      })
      td2.append(svg)
      let carName = ''
      let color = ''
      for (let j = 0; j < winCars.length; j += 1) {
        if (winCars[j].id === winnersList[i].id) {
          carName = winCars[j].name
          color = winCars[j].color
        }
      }

      const td3 = createElement({
        tag: 'td',
        classList: ['tableData'],
        textContent: carName // winCars[i].name
      })

      const td4 = createElement({
        tag: 'td',
        classList: ['tableData', 'with-sort-wins'],
        textContent: winnersList[i].wins.toString()
      })

      const td5 = createElement({
        tag: 'td',
        classList: ['tableData', 'with-sort'],
        textContent: winnersList[i].time.toString()
      })
      colorCar(svg, color)
      row.append(td1, td2, td3, td4, td5)
      this.table.append(row)
    }
  }

  bindTimeSortButton = (handler: HandlerFunction) => {
    if (this.titleArr[4]) {
      this.titleArr[4].addEventListener('click', () => {
        handler()
      })
    }
  }

  bindWinsSortButton = (handler: HandlerFunction) => {
    if (this.titleArr[3]) {
      this.titleArr[3].addEventListener('click', () => {
        handler()
      })
    }
  }
}
