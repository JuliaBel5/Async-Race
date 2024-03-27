import { createElementNew } from '../Utils/utils'

type HandlerFunction = () => void

export class Header {
  element: HTMLElement

  header: HTMLElement

  catElement: HTMLImageElement | undefined

  audio: HTMLAudioElement

  garageIcon: HTMLImageElement | undefined

  winnersIcon: any

  garageButton: HTMLButtonElement | undefined

  winnersButton: HTMLButtonElement | undefined

  garageContainer: HTMLDivElement | undefined

  winnersContainer: HTMLDivElement | undefined

  constructor() {
    this.element = document.body
    this.header = createElementNew('header', 'header')
    this.audio = new Audio()
  }

  init(): void {
    this.garageContainer = createElementNew('div', 'icon-container')
    this.winnersContainer = createElementNew('div', 'icon-container')
    this.winnersIcon = createElementNew('img', 'icon1')
    this.winnersIcon.src = 'winners.png'
    this.winnersIcon.style.height = '100%'

    this.winnersIcon.style.display = 'inline-block'
    this.winnersIcon.addEventListener('click', () => {
      if (this.audio) {
        this.audio.src = 'winners.mp3'
        this.audio.volume = 0.3
        this.audio.play()
      }
    })

    const title = createElementNew(
      'div',
      'welcomeTitle',
      'Welcome to our Race!'
    )

    this.garageIcon = createElementNew('img', 'icon')
    this.garageIcon.src = 'garage.png'
    this.garageIcon.style.height = '100%'

    this.garageIcon.style.display = 'inline-block'
    this.garageIcon.addEventListener('click', () => {
      if (this.audio) {
        this.audio.src = 'garage1.mp3'
        this.audio.volume = 0.3
        this.audio.play()
      }
    })

    this.garageButton = createElementNew('button', 'inactive', 'To Garage')
    this.winnersButton = createElementNew('button', 'button', 'To Winners')
    this.garageContainer.append(this.garageButton, this.garageIcon)
    this.winnersContainer.append(this.winnersButton, this.winnersIcon)
    this.header.style.justifyContent = 'space-between'
    this.header.append(this.garageContainer, title, this.winnersContainer)
    this.element.append(this.header)
  }

  remove() {
    if (this.header) {
      this.header.remove()
    }
  }

  bindGarageButton = (handler: HandlerFunction) => {
    if (this.garageButton) {
      this.garageButton.addEventListener('click', () => {
        handler()
      })
    }
  }

  bindWinnersButton = (handler: HandlerFunction) => {
    if (this.winnersButton) {
      this.winnersButton.addEventListener('click', () => {
        handler()
      })
    }
  }
}
