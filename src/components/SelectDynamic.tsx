'use client';

import React from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectDynamicProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
  includeEmptyOption?: boolean; // e.g. "Unassigned"
}

const SelectDynamic: React.FC<SelectDynamicProps> = ({
  name,
  value,
  onChange,
  options,
  required = false,
  includeEmptyOption = false,
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
    >
      {includeEmptyOption && <option value="">Unassigned</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default SelectDynamic;
