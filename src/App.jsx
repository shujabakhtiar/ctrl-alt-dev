import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AssetReducerWidget from './components/AssetReducerWidget';
import ToolkitGrid from './components/ToolkitGrid';
import FormatComparison from './components/FormatComparison';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('reducer');

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <Hero />
        <AssetReducerWidget />
        <ToolkitGrid />
        <FormatComparison />
      </main>

      <Footer />
    </div>
  );
}
