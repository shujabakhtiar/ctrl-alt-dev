import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import ToWebpPage from './pages/ToWebpPage';
import ToolWorkspacePage from './pages/ToolWorkspacePage';
import AboutPage from './pages/AboutPage';
import ResponsiveImageSetPage from './pages/ResponsiveImageSetPage';
import FaviconGeneratorPage from './pages/FaviconGeneratorPage';
import BackgroundRemoverPage from './pages/BackgroundRemoverPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/story" element={<AboutPage />} />

          {/* Standalone Tools */}
          <Route path="/convert-to-webp" element={<ToWebpPage />} />
          <Route path="/to-webp" element={<Navigate to="/convert-to-webp" replace />} />
          <Route path="/tools/to-webp" element={<Navigate to="/convert-to-webp" replace />} />
          <Route path="/tools/convert-to-webp" element={<ToWebpPage />} />

          <Route path="/responsive-images" element={<ResponsiveImageSetPage />} />
          <Route path="/tools/responsive-images" element={<ResponsiveImageSetPage />} />
          <Route path="/tools/responsive-image-set" element={<Navigate to="/responsive-images" replace />} />

          <Route path="/favicon-generator" element={<FaviconGeneratorPage />} />
          <Route path="/tools/favicon-generator" element={<FaviconGeneratorPage />} />

          <Route path="/background-remover" element={<BackgroundRemoverPage />} />
          <Route path="/tools/background-remover" element={<BackgroundRemoverPage />} />
          <Route path="/remove-background" element={<Navigate to="/background-remover" replace />} />
          <Route path="/tools/remove-background" element={<Navigate to="/background-remover" replace />} />

          {/* Legacy subclassification redirects */}
          <Route path="/image-convertor" element={<Navigate to="/tools" replace />} />
          <Route path="/image-converter" element={<Navigate to="/tools" replace />} />
          <Route path="/image-convertor/to-webp" element={<Navigate to="/convert-to-webp" replace />} />

          {/* Fallbacks */}
          <Route path="/tools/:toolId" element={<ToolWorkspacePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
