import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Intro from "./Intro";
import DescriptionStage from "./DescriptionStage";
import MainStage from "./MainStage";

const App: React.FC = () => {
  return (
    <Router basename="/Web_Interaction_2025/week8">
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/description" element={<DescriptionStage />} />
        <Route path="/main" element={<MainStage />} />
      </Routes>
    </Router>
  );
};

export default App;
