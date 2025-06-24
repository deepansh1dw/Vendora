import { useEffect } from 'react';
import Navbar from './components/navBar';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import { Routes, Route } from "react-router-dom";
import { useThemeStore } from './store/useThemeStore';

function App() {
  const { theme, setTheme } = useThemeStore();

  // ✅ Rehydrate from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme); // Ensures consistency
  }, [setTheme]);

  // ✅ Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </div>
  );
}

export default App;


