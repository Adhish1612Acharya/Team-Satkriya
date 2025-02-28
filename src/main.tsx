import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.js";

// Find the root element
const rootElement = document.getElementById("root");

// Check if the root element exists
if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure an element with ID "root" exists in your HTML.'
  );
}

// Create a root and render the app
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
