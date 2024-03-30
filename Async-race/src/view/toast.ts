import { createElementNew } from '../Utils/utils'

//type HandlerFunction = () => void

export class Toast {
  toastContainer: HTMLElement

  confirmButton: HTMLButtonElement

  cancelButton: HTMLButtonElement

  toast: HTMLDivElement

  buttonContainer: HTMLDivElement

  timeoutId: number | undefined

  audio: HTMLAudioElement

  constructor() {
    this.toastContainer = createElementNew('div', 'toast-container', '')
    document.body.append(this.toastContainer)
    this.buttonContainer = createElementNew('div', 'toast-button-container')
    this.confirmButton = createElementNew(
      'button',
      'toast-confirm-button',
      'Ok'
    )
    this.cancelButton = createElementNew(
      'button',
      'toast-cancel-button',
      'Close'
    )
    this.toast = createElementNew('div', 'toast', '')
    this.buttonContainer.append(this.confirmButton)
    this.toastContainer.append(this.toast, this.buttonContainer)
    this.audio = new Audio()
    this.cancelButton.addEventListener('click', () => {
      this.toastContainer.classList.remove('show')
      this.audio.src = 'click.mp3'
      this.audio.play()
      clearTimeout(this.timeoutId)
    })
    this.confirmButton.addEventListener('click', () => {
      this.toastContainer.classList.remove('show')
      this.audio.src = 'click.mp3'
      this.audio.play()
      clearTimeout(this.timeoutId)
    })
  }

  public show = (message: string, duration = 3000): void => {
    this.toastContainer.classList.add('show')
    this.toast.textContent = message

    this.timeoutId = setTimeout(() => {
      this.toastContainer.classList.remove('show')
    }, duration)
  }

  //  bindConfirmButton = (handler: HandlerFunction) =>
  // this.confirmButton.addEventListener('click', () => {
  //    this.audio.src = 'click.mp3'
  //    this.audio.play()
  //  handler()
  //this.toastContainer.remove()
  //  })
}
