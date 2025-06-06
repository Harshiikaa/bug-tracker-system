"use client";

import React from "react";

interface ButtonProps {
  label: string;                     
  // onClick?: () => void;       
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
       
  color?: "blue" | "red" | "green";  
  type?: "button" | "submit";        
  isSubmitting?: boolean;          
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  color = "blue",
  type = "button",
  isSubmitting = false,
}) => {

    const colorClasses: Record<string, string> = {
    blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    red: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    green: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
  };

  const finalColor = colorClasses[color] || colorClasses.blue;

  return (
    <button
      type={type}
      
      onClick={onClick}
      disabled={isSubmitting}
      className={`w-full py-2 px-4 text-white rounded-md focus:outline-none focus:ring-2 ${finalColor} ${
        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isSubmitting ? `${label}...` : label}
    </button>
  );
};

export default Button;
