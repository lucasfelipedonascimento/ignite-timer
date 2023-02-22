```ts
import { createContext, useContext, useState } from "react";

const CyclesContext = createContext({} as any);

function NewCycleForm() {
  const { activeCycle, setActiveCyle } = useContext(CyclesContext);

  return (
    <h1>
      NewCycleForm: {activeCycle}
      <button
        onClick={() => {
          setActiveCyle(2);
        }}
      >
        Alterar o ciclo ativo
      </button>
    </h1>
  );
}

function Coutdown() {
  const { newActiveCyle, setNewActiveCycle } = useContext(CyclesContext);

  return (
    <h1>
      Countdown: {newActiveCyle}
      <button
        onClick={() => {
          setNewActiveCycle(3);
        }}
      >
        Alterar o contador do ciclo
      </button>
    </h1>
  );
}

export function Home() {
  const [activeCycle, setActiveCyle] = useState(0);
  const [newActiveCyle, setNewActiveCycle] = useState(0);

  return (
    <CyclesContext.Provider
      value={{ activeCycle, setActiveCyle, newActiveCyle, setNewActiveCycle }}
    >
      <div>
        <NewCycleForm />
        <Coutdown />
      </div>
    </CyclesContext.Provider>
  );
}
```
