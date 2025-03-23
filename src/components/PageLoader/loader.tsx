import React from "react";
import { LoaderProps } from "./loader.types";
import Logo from "../../assets/logo.svg";

const Loader: React.FC<LoaderProps> = ({ isLoading = true }) => {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="relative">
        <div className="w-100 h-100 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={Logo} alt="GoPushti Logo" className="h-80 w-80 text-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Loader;