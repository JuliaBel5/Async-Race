import { createElementNew } from '../Utils/utils'
// import { Music } from '../utils/Music'
const button = 'button.mp3'

export class Modal {
  overlay: HTMLElement | null

  section: HTMLElement

  modal: HTMLElement | null

  isShown: boolean

  modalContent: HTMLDivElement | undefined

  title: HTMLDivElement | undefined

  message: HTMLDivElement | undefined

  modalButton: HTMLButtonElement | undefined

  audio: HTMLAudioElement

  constructor(section: HTMLElement) {
    this.overlay = null
    this.section = section
    this.modal = null
    this.isShown = false
    this.audio = new Audio()
  }

  handleEnter = (event: KeyboardEvent) => {
    if (!event.code.endsWith('Enter')) return

    this.remove()
  }

  create(title: string, message: string) {
    this.overlay = createElementNew('div', 'overlay')
    this.overlay.addEventListener('click', () => {})
    this.section.append(this.overlay)
    this.modal = createElementNew('div', 'modal')
    this.modalContent = createElementNew('div', 'modal-content1')
    this.title = createElementNew('div', 'title', title)
    this.message = createElementNew('div', 'rules1', message)
    this.modalButton = createElementNew(
      'button',
      'modal-button',
      'Return to the game'
    )
    this.modalButton.addEventListener('click', () => {
      this.audio.src = button
      this.audio.play()
      this.remove()
    })

    this.modal.append(this.modalContent)
    this.modalContent.append(this.title, this.message, this.modalButton)
    this.section.append(this.modal)
  }

  showModal(title: string, message: string) {
    this.isShown = true
    this.create(title, message)
    document.addEventListener('keydown', this.handleEnter)
  }

  remove() {
    if (this.modal) {
      this.isShown = false
      this.modal.remove()
      if (this.overlay) {
        this.overlay.remove()
      }

      document.removeEventListener('keydown', this.handleEnter)
    }
  }
}
