import { create } from 'zustand'
import { evaluate as mathEval } from 'mathjs'

export type Variable = {
  name: string
  value: string
}

export type HistoryItem = {
  expression: string
  result: string
}

interface CalculatorState {
  expression: string
  output: string
  variables: Variable[]
  varName: string
  varValue: string
  history: HistoryItem[]
  setExpression: (v: string) => void
  setOutput: (v: string) => void
  setVariables: (v: Variable[]) => void
  setVarName: (v: string) => void
  setVarValue: (v: string) => void
  setHistory: (v: HistoryItem[]) => void
  evaluate: () => void   // 👈 ye add karna hoga
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  expression: '',
  output: '',
  variables: [],
  varName: '',
  varValue: '',
  history: [],
  setExpression: (v) => set({ expression: v }),
  setOutput: (v) => set({ output: v }),
  setVariables: (v) => set({ variables: v }),
  setVarName: (v) => set({ varName: v }),
  setVarValue: (v) => set({ varValue: v }),
  setHistory: (v) => set({ history: v }),
  
evaluate: () => {
  try {
    const { expression, variables, history } = get();

    // create a scope object for mathjs
    const scope: Record<string, number> = {};
    variables.forEach(v => {
      scope[v.name] = Number(v.value);
    });

    const result = mathEval(expression, scope); // pass variables to mathjs
    set({ output: String(result) });
    set({ history: [...history, { expression, result: String(result) }] });
  } catch (err) {
    set({ output: 'Error' });
  }
}

}))
