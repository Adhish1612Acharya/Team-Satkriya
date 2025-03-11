import { FC } from "react";
import InputProps from "./Input.types";

const Input: FC<InputProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm
          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          ${error ? "border-red-300" : "border-gray-300"}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
