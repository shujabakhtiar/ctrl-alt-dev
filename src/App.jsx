import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import ImageConverterPage from './pages/ImageConverterPage';
import ToWebpPage from './pages/ToWebpPage';
import ToolWorkspacePage from './pages/ToolWorkspacePage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/image-convertor" element={<ImageConverterPage />} />
          <Route path="/image-converter" element={<Navigate to="/image-convertor" replace />} />
          <Route path="/image-convertor/to-webp" element={<ToWebpPage />} />
          <Route path="/image-converter/to-webp" element={<Navigate to="/image-convertor/to-webp" replace />} />
          <Route path="/tools/:toolId" element={<ToolWorkspacePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
