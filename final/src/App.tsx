import { Router } from "./Router";

import setupLocatorUI from "@locator/runtime";
import { useDebugMode } from "./utils";
function App() {
  const debugMode = useDebugMode();
  if (process.env.NODE_ENV === "development" && debugMode) {
    setupLocatorUI();
  }

  return <Router />;
}

export default App;
