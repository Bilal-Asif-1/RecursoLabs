import React from 'react';
import { useCalculatorStore } from '../store';

const VariablesSection: React.FC = () => {
  const {
    variables, varName, varValue,
    setVarName, setVarValue, setVariables, setOutput
  } = useCalculatorStore();

  const CONSTANTS = { pi: 3.1415, e: 2.7182 };

  const handleAddVariable = () => {
    const name = varName.trim();
    if (!name || !/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(name)) {
      setOutput('Invalid variable name');
      return;
    }
    if (Object.prototype.hasOwnProperty.call(CONSTANTS, name)) {
      setOutput('Cannot use constant name');
      return;
    }
    if (variables.some(v => v.name === name)) {
      setOutput('Variable already exists');
      return;
    }
    if (isNaN(Number(varValue))) {
      setOutput('Variable value must be a number');
      return;
    }
    setVariables([...variables, { name, value: varValue }]);
    setVarName('');
    setVarValue('');
    setOutput('');
  };

  const handleDeleteVariable = (idx: number) => {
    setVariables(variables.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full mt-4 text-left">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">Variables</h3>
      <div className="flex gap-2 mb-2 flex-wrap">
        <input
          className="p-1 rounded border border-gray-300 bg-gray-50 text-gray-800 flex-1 min-w-[80px]"
          type="text"
          value={varName}
          onChange={e => setVarName(e.target.value)}
          placeholder="Name"
        />
        <input
          className="p-1 rounded border border-gray-300 bg-gray-50 text-gray-800 flex-1 min-w-[80px]"
          type="text"
          value={varValue}
          onChange={e => setVarValue(e.target.value)}
          placeholder="Value"
        />
        <button className="px-3 rounded bg-green-700 text-white font-bold min-w-[48px]" onClick={handleAddVariable}>Add</button>
      </div>
      <ul className="mb-1">
        {variables.map((v, i) => (
          <li key={i} className="flex items-center gap-2 text-gray-800 mb-1">
            {v.name} = {v.value}
            <button className="bg-red-500 text-white rounded px-2 py-0.5 text-sm font-bold" onClick={() => handleDeleteVariable(i)}>x</button>
          </li>
        ))}
      </ul>
      <div className="text-sm text-gray-500">
        <strong>Constants:</strong> pi = 3.1415, e = 2.7182
      </div>
    </div>
  );
};

export default VariablesSection;
