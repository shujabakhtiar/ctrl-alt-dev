import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ImageConverterPage from './pages/ImageConverterPage';
import ToWebpPage from './pages/ToWebpPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/image-convertor" element={<ImageConverterPage />} />
            <Route path="/image-converter" element={<Navigate to="/image-convertor" replace />} />
            <Route path="/image-convertor/to-webp" element={<ToWebpPage />} />
            <Route path="/image-converter/to-webp" element={<Navigate to="/image-convertor/to-webp" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
