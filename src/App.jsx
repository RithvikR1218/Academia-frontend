import { lazy, Suspense } from 'react';
import { Routes, Route, Link, Router } from 'react-router-dom';
import { Loader } from '@mantine/core';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
const SynonymAdminPanel = lazy(() => import('./pages/SynonymAdminPanel'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
      <Suspense fallback={<Loader />}>
        <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/synonyms" element={<SynonymAdminPanel />} />
            </Routes>
        <Footer />
    </Suspense>
  );
}

export default App;
