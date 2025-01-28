import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Detection from "./pages/Detection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detection" element={<Detection />} />
      </Routes>
    </Router>
  );
}

export default App;
