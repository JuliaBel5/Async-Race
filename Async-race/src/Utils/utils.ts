import chroma from 'chroma-js'
import { RaceResults } from './types'

export function createElement<K extends keyof HTMLElementTagNameMap>({
  tag,
  classList,
  textContent,
  innerHTML
}: CreateElementPropsType<K>): HTMLElementTagNameMap[K] {
  const element: HTMLElementTagNameMap[K] = document.createElement(tag)

  if (classList) {
    element.classList.add(...classList)
  }

  if (textContent) {
    element.textContent = textContent
  }

  if (innerHTML) {
    element.innerHTML = innerHTML
  }
  return element
}

export type CreateElementPropsType<K> = {
  tag: K
  classList?: string[]
  textContent?: string
  innerHTML?: string
}

export function createElementNew<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  className = '',
  content = '',
  id?: string
): HTMLElementTagNameMap[T] {
  const element = document.createElement(tag)

  if (className) {
    element.className = className
  }

  if (content) {
    element.textContent = content
  }

  if (id) {
    element.id = id
  }

  return element
}

export function findWinner(arr: RaceResults[]): null | RaceResults {
  return arr.reduce<null | RaceResults>((acc, raceResult) => {
    if (!raceResult) {
      return acc
    }

    if (!acc) {
      return raceResult
    }

    if (raceResult.time < acc.time) {
      return raceResult
    }
    return acc
  }, null)
}

export function colorCar(el: HTMLElement, color: string): void {
  const paths1 = el.querySelectorAll('path')
  paths1[28].style.fill = chroma(color).saturate().hex()

  paths1[29].style.fill = color
  paths1[30].style.fill = chroma(color).darken().hex()
  // полоса
  paths1[48].setAttribute('style', 'fill:white')
  paths1[47].setAttribute('style', 'fill:white')
  paths1[49].setAttribute('style', 'fill:white')
}

export function getRandomColor(): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
