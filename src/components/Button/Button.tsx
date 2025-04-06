// import  { FC } from "react";
// import ButtonProps from "./Button.types";

// const Button: FC<ButtonProps> = ({
//   children,
//   variant = "primary",
//   icon: Icon,
//   fullWidth,
//   className = "",
//   ...props
// }) => {
//   const baseStyles =
//     "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50";
//   const variants = {
//     primary: "bg-indigo-600 text-white hover:bg-indigo-700",
//     secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
//     outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
//   };

//   return (
//     <button
//       className={`${baseStyles} ${variants[variant]} ${
//         fullWidth ? "w-full" : ""
//       } ${className}`}
//       {...props}
//     >
//       {Icon && <Icon className="w-5 h-5 mr-2" />}
//       {children}
//     </button>
//   );
// };

// export default Button;

import { forwardRef } from "react";
import ButtonProps from "./Button.types";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      icon: Icon,
      fullWidth,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2";

    const variants: Record<string, string> = {
      primary: "bg-indigo-600 text-white hover:bg-indigo-700",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
      ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant] || variants.primary} ${
          fullWidth ? "w-full" : ""
        } ${className}`}
        {...props}
      >
        {Icon && <Icon className="w-5 h-5 mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
