'use client';

import { Listbox } from '@headlessui/react';
import { Fragment } from 'react';

type Priority = "Low" | "Medium" | "High";
type Status = "Open" | "In Progress" | "Closed";

interface SelectProps<T extends Priority | Status> {
  name: "priority" | "status";
  value: T;
  onChange: (value: T) => void;
  required?: boolean;
}

const optionsMap = {
  priority: ["Low", "Medium", "High"] as Priority[],
  status: ["Open", "In Progress", "Closed"] as Status[],
};

export default function Select<T extends Priority | Status>({
  name,
  value,
  onChange,
}: SelectProps<T>) {
  const options = optionsMap[name] as T[];

  let textColorClass = "";
  if (name === "status") {
    textColorClass =
      value === "Open"
        ? "text-blue-700"
        : value === "In Progress"
        ? "text-yellow-700"
        : "text-green-700"; 
  } else if (name === "priority") {
    textColorClass =
      value === "High"
        ? "text-red-700"
        : value === "Medium"
        ? "text-orange-700"
        : "text-gray-700"; 
  }

  return (
    <div className="w-full">
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className={`w-full p-2 border border-gray-300 rounded bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${textColorClass}`}
          >
            {value}
          </Listbox.Button>

          <Listbox.Options className="absolute mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 z-10 max-h-60 overflow-y-auto text-sm">
            {options.map((option) => {
              const optionColorClass =
                name === "status"
                  ? option === "Open"
                    ? "text-blue-700"
                    : option === "In Progress"
                    ? "text-yellow-700"
                    : "text-green-700"
                  : option === "High"
                  ? "text-red-700"
                  : option === "Medium"
                  ? "text-yellow-700"
                  : "text-gray-700";

              return (
                <Listbox.Option key={option} value={option} as={Fragment}>
                  {({ active }) => (
                    <li
                      className={`cursor-pointer select-none px-4 py-2 ${active ? 'bg-blue-100' : ''} ${optionColorClass}`}
                    >
                      {option}
                    </li>
                  )}
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
