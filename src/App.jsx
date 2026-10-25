import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import ImageConverterPage from './pages/ImageConverterPage';
import ToWebpPage from './pages/ToWebpPage';
import ToolWorkspacePage from './pages/ToolWorkspacePage';
import AboutPage from './pages/AboutPage';
import ResponsiveImageSetPage from './pages/ResponsiveImageSetPage';
import FaviconGeneratorPage from './pages/FaviconGeneratorPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/story" element={<AboutPage />} />
          <Route path="/image-convertor" element={<ImageConverterPage />} />
          <Route path="/image-converter" element={<Navigate to="/image-convertor" replace />} />
          <Route path="/image-convertor/to-webp" element={<ToWebpPage />} />
          <Route path="/responsive-images" element={<ResponsiveImageSetPage />} />
          <Route path="/tools/responsive-image-set" element={<ResponsiveImageSetPage />} />
          <Route path="/favicon-generator" element={<FaviconGeneratorPage />} />
          <Route path="/tools/favicon-generator" element={<FaviconGeneratorPage />} />
          <Route path="/tools/:toolId" element={<ToolWorkspacePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
