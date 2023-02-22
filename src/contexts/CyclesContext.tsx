/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import {
  createContext,
  ReactElement,
  useState,
  useReducer,
  useEffect,
} from 'react'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentAction,
  restartCycleActiveAction,
} from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycles: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
  // restartTimeCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactElement
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timmer:cycles-state-1.0.0',
      )

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }
    },
  )

  const { cycles, activeCycleId } = cyclesState
  const activeCycles = cycles.find((cycle) => cycle.id === activeCycleId) // find -> retorna o vetor que atende a necessidade do problema

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycles) {
      return differenceInSeconds(new Date(), new Date(activeCycles.startDate))
    }

    return 0
  }) // estado criado para monitorar o tanto de segundos passados desde que o ciclo foi criado

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timmer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentAction())
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  // função criada para criar um novo ciclo
  // recebe nossos dados como informações
  function createNewCycle(data: CreateCycleData) {
    // criamos uma nova variável baseado nos dados do Ciclo
    const newCycle: Cycle = {
      id: String(new Date().getTime()), // id | getTime-> recebe uma data e o horário em milisegundos e converte para string
      task: data.task, // recebe uma tarefa do tipo string
      minutesAmount: data.minutesAmount, // recebe os minutos do tipo number
      startDate: new Date(), // recebe uma data inicial do tipo Date
    }
    // toda vez que um estado for ser alterado, e ele depende do valor anterior
    // passar a alteração em forma de função
    // setCycles((state) => [...state, newCycle])
    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
  }

  // function restartTimeCycle() {
  //   // [TODO] - RESETAR O CONTADOR ATUAL
  //   // [] 1 - Precisamos pegar o ciclo ativo atual
  //   // [] 2 - Precisamos pegar o tempo do contador atual
  //   // [] 3 - Precisamos resetar o tempo do contador atual

  //   dispatch(restartCycleActiveAction())
  //   setAmountSecondsPassed(0)
  // }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycles,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        // restartTimeCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
