import { createElementNew } from '../Utils/utils'

export class Header {
  element: HTMLElement

  header: HTMLElement

  catElement: HTMLImageElement | undefined

  audio: HTMLAudioElement

  constructor() {
    this.element = document.body
    this.header = createElementNew('header', 'header')
    this.audio = new Audio()
  }

  init(): void {
    this.catElement = createElementNew('img', 'mini-cat')
    this.catElement.src = 'cat5a.png'
    this.catElement.style.height = '100%'

    this.catElement.style.display = 'inline-block'
    this.catElement.addEventListener('click', () => {
      if (this.audio) {
        this.audio.src = 'meow.mp3'
        this.audio.volume = 0.3
        this.audio.play()
      }
    })

    const iconContainer = createElementNew('div', 'icon-container')
    this.header.style.justifyContent = 'space-between'
    this.header.append(this.catElement, iconContainer)
    this.element.append(this.header)
  }

  remove() {
    if (this.header) {
      this.header.remove()
    }
  }
}
