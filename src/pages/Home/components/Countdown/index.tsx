import { differenceInSeconds } from 'date-fns'
import { useCallback, useContext, useEffect } from 'react'
import { CyclesContext } from '../../../../contexts/CyclesContext'

import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycles,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext)

  // convertendo minutos para segundos, cada minuto = 60 segundos
  const totalSeconds = activeCycles ? activeCycles.minutesAmount * 60 : 0 // se tiver um ciclo ativo, então pegue o número de minutos do ciclo, e multiplique por 60, senão tiver ciclo ativo, retorne 0

  const startCountTime = useCallback(() => {
    let interval: number

    if (activeCycles) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycles.startDate),
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          // setCycles((state) =>
          //   state.map((cycle) => {
          //     if (cycle.id === activeCycleId) {
          //       return { ...cycle, finishedDate: new Date() }
          //     } else {
          //       return cycle
          //     }
          //   }),
          // )

          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycles, totalSeconds, markCurrentCycleAsFinished, setSecondsPassed])

  useEffect(() => {
    if (activeCycleId) {
      startCountTime()
    }
  }, [activeCycleId, startCountTime])

  const currentSeconds = activeCycles ? totalSeconds - amountSecondsPassed : 0 // se tiver um ciclo ativo, vai ser o total de segundos passados, senão tiver ciclo retorne 0

  // convertendo para ser exibido em tela
  // método Math.floor -> arredonda o número pra baixo, 25.9 = 25===

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60 // resto de segundos da divisão acima

  // método padStart -> preenche uma string até um tamanho específico, caso a mesma não tenha, com um caracter
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycles) {
      document.title = `${minutes}:${seconds}`
    }
  }, [activeCycles, minutes, seconds])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
