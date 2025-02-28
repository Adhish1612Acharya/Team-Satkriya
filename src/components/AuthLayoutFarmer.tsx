import React from "react";

export function AuthLayoutFarmer({ children, title, subtitle }) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4`}>
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-green-600 p-12 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-6">{title}</h2>
            <p className="text-green-200 mb-8">{subtitle}</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-12">{children}</div>
      </div>
    </div>
  );
}
