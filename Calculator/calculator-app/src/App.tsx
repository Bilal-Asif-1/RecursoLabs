import { useCalculatorStore } from './store';
import CalculatorButtons from './components/CalculatorButtons';
import VariablesSection from './components/VariablesSection';
import HistoryList from './components/HistoryList';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const { expression, setExpression, evaluate } = useCalculatorStore();

  return (
<div className="fixed inset-0 flex items-center justify-center bg-gray-100 p-2 overflow-auto">
  <div className="w-full max-w-md max-h-[95vh] p-4 rounded-xl bg-white shadow flex flex-col items-center">
    <h2 className="text-xl font-bold mb-3 text-gray-800">Calculator</h2>

    <div className="w-full flex gap-2 mb-3 flex-wrap">
      <input
        className="flex-1 text-lg p-2 rounded border border-gray-300 bg-gray-50 text-gray-800 outline-none min-w-[80px]"
        type="text"
        value={expression}
        onChange={e => setExpression(e.target.value)}
        placeholder="0"
      />
      <button
        className="text-lg px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600"
        onClick={evaluate}
      >=</button>
    </div>

    <ResultDisplay />
    <CalculatorButtons />
    <VariablesSection />
    <HistoryList />
  </div>
</div>

  );
}

export default App;
