import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AttributeChipInputProps {
  label: string;
  values: string[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
}

export function AttributeChipInput({
  label,
  values,
  onValuesChange,
  placeholder = 'Add value',
}: AttributeChipInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addValue = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      onValuesChange([...values, trimmed]);
      setInputValue('');
    }
  };

  const removeValue = (valueToRemove: string) => {
    onValuesChange(values.filter(v => v !== valueToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addValue();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-warm-white font-body font-medium">{label}</span>
        <span className="text-warm-gray text-sm">({values.length})</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {values.map(value => (
          <span
            key={value}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark-elevated text-warm-white rounded-lg text-sm font-body"
          >
            {value}
            <button
              type="button"
              onClick={() => removeValue(value)}
              className="text-warm-gray hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 bg-dark-base border border-white/10 rounded-lg text-warm-white text-sm font-body placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all"
        />
        <button
          type="button"
          onClick={addValue}
          disabled={!inputValue.trim()}
          className="px-3 py-2 bg-gold text-dark-base rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
