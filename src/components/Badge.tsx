'use client';

import React from "react";

interface BadgeProps {
  value: string;
  type: "status" | "priority";
}

const Badge: React.FC<BadgeProps> = ({ value, type }) => {
  let className = "";

  if (type === "status") {
    className =
      value === "Open"
        ? "bg-blue-100 text-blue-700"
        : value === "In Progress"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700"; 
  } else if (type === "priority") {
    className =
      value === "High"
        ? "bg-red-100 text-red-700"
        : value === "Medium"
        ? "bg-orange-100 text-orange-700"
        : "bg-gray-100 text-gray-700";
  }

  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${className}`}>
      {value}
    </span>
  );
};

export default Badge;
