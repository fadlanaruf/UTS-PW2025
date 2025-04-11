import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import ListSurah from './components/ListSurah';
import DetailSurah from './components/DetailSurah.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50">
        <header className="bg-cyan-100 backdrop-blur-md shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto py-5 px-4">
            <h1 className="text-3xl font-bold text-center text-blue-500">
            بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْمِ
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ListSurah />} />
            <Route path="/surah/:id" element={<DetailSurah />} />
          </Routes>
        </main>

        <footer className="text-center py-6 text-gray-500 text-sm">
          UTS Pemograman Web Fadlan Amar Maruf 12350111058 4A 2025
        </footer>
      </div>
    </Router>
  );
}

export default App;