/* eslint-disable prefer-const */
import { HandPalm, Play } from 'phosphor-react'
import {
  BoxIncludeButtons,
  HomeContainer,
  // RestartCountdownButton,
  StartCoutdownButton,
  StopCountdownButton,
} from './styles'

import { useContext } from 'react'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewCycleForm } from './components/NewCycleForm'
import { FormProvider, useForm } from 'react-hook-form'
import { Countdown } from './components/Countdown'
import { CyclesContext } from '../../contexts/CyclesContext'

// variável criada para armazenar a validação de formulário
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5)
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

// tipagem baseada nas informações da validação
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const {
    activeCycles,
    createNewCycle,
    interruptCurrentCycle,
    // restartTimeCycle,
  } = useContext(CyclesContext)

  // variável criada para receber as funções do hook - useForm
  // e também para decidirmos valores iniciais "padrão" dos nossos dados
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '', // task - começa como uma string vazia, ou seja, nada
      minutesAmount: 0, // começar com 0, pois é o tempo inicial
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />

        {activeCycles ? (
          <BoxIncludeButtons>
            <StopCountdownButton onClick={interruptCurrentCycle} type="button">
              <HandPalm size={24} />
              Interromper
            </StopCountdownButton>

            {/* <RestartCountdownButton onClick={restartTimeCycle} type="button">
              <ClockClockwise size={24} />
              Reiniciar
            </RestartCountdownButton> */}
          </BoxIncludeButtons>
        ) : (
          <StartCoutdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCoutdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
