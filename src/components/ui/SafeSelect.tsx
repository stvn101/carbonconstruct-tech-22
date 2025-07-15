import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface SafeSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const SafeSelect: React.FC<SafeSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select an option...",
  children,
  disabled = false,
  className
}) => {
  const handleValueChange = (newValue: string) => {
    if (newValue && newValue !== value) {
      onValueChange(newValue);
    }
  };

  return (
    <Select value={value || ""} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  );
};

export { SelectItem };