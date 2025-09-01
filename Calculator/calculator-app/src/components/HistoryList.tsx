import React from 'react';
import { useCalculatorStore } from '../store';

const HistoryList: React.FC = () => {
  const { history, setExpression, setHistory } = useCalculatorStore();

  const handleHistoryClick = (item: { expression: string; result: string }) => {
    setExpression(item.expression);
  };

  const handleDeleteHistory = (idx: number) => {
    setHistory(history.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full mt-4 text-left">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">History</h3>
      <ul>
        {history.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-gray-800 mb-1">
            <span className="underline cursor-pointer text-blue-500 hover:text-green-600" onClick={() => handleHistoryClick(item)}>
              {item.expression} = {item.result}
            </span>
            <button className="bg-red-500 text-white rounded px-2 py-0.5 text-sm font-bold" onClick={() => handleDeleteHistory(i)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryList;
