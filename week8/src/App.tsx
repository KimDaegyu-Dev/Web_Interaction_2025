import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intro from './Intro';
import MainStage from './MainStage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/main" element={<MainStage />} />
      </Routes>
    </Router>
  );
};

export default App;
