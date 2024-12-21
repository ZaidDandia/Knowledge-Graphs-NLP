import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot";
import Analytics from "./pages/Analytics";
import KnowledgeGraph from "./pages/KnowledgeGraph";
import Dataset from "./pages/Dataset";
import Navbar from "./pages/Navbar"; // Navbar component
import CypherQueryPage from "./pages/CypherQuery";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/kg-display" element={<KnowledgeGraph />} />
        <Route path="/dataset" element={<Dataset />} />
        <Route path="/cypher" element={<CypherQueryPage />} />

      </Routes>
    </>
  );
};

export default App;
