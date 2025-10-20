import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AuthModal from "./components/AuthModal";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./App.css";

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(true);

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="App">
      <Dashboard />
      {showAuthModal && <AuthModal onClose={handleCloseModal} />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="*" element={<AppContent />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
