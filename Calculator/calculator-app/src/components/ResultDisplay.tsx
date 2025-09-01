import React from 'react';
import { useCalculatorStore } from '../store';

const ResultDisplay: React.FC = () => {
  const { output } = useCalculatorStore();
  return (
    <div className="w-full mb-3">
<div className="break-words max-h-24 overflow-auto ...">
    {output}
  </div>
</div>
  );
};

export default ResultDisplay;
