import React from 'react';

const buttons = [
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '+', '(',
  ')', '^', 'sqrt(', 'sin(',
  'cos(', 'tan(', 'pi', 'e',
];

import { useCalculatorStore } from '../store';

const CalculatorButtons: React.FC = () => {
  const { expression, setExpression } = useCalculatorStore();

  const handleButtonClick = (val: string) => {
    setExpression(expression + val);
  };

  return (
    <div className="w-full grid grid-cols-4 gap-2 mb-4">
      {buttons.map((b, i) => (
        <button key={i} className="text-lg py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400" onClick={() => handleButtonClick(b)}>{b}</button>
      ))}
      <button className="col-span-2 py-2 rounded bg-red-400 text-white hover:bg-red-500" onClick={() => setExpression('')}>C</button>
      <button className="col-span-2 py-2 rounded bg-yellow-400 text-white hover:bg-yellow-500" onClick={() => setExpression(expression.slice(0, -1))}> {"\u232B"}</button>
    </div>
  );
};

export default CalculatorButtons;
