import { WinnerType } from './types'

export function sortWinnersByTime(winnersList: WinnerType[]): WinnerType[] {
  return winnersList.sort((a, b) => a.time - b.time)
}

export function sortWinnersByTimeDescending(
  winnersList: WinnerType[]
): WinnerType[] {
  return winnersList.sort((a, b) => b.time - a.time)
}
export function sortWinnersByWins(winnersList: WinnerType[]): WinnerType[] {
  return winnersList.sort((a, b) => a.wins - b.wins)
}
export function sortWinnersByWinsDescending(
  winnersList: WinnerType[]
): WinnerType[] {
  return winnersList.sort((a, b) => b.wins - a.wins)
}
