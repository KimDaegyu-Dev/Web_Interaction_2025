import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import WithMockServer from "./mocks/WithMockServer.tsx";
import "./index.css";
import setupLocatorUI from "@locator/runtime";
import { useDebugMode } from "./utils";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WithMockServer />
    <App />
  </React.StrictMode>,
);
