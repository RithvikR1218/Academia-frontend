import { lazy, Suspense } from 'react';
import { Routes, Route, Link, Router } from 'react-router-dom';
import { Loader } from '@mantine/core';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import SignUp from './pages/SignUp/SignUp';
import Login from './pages/Login/Login';
import VerifyOTP from './pages/VerifyOTP/VerifyOTP';
import Dashboard from './pages/Dashboard/Dashboard';
// import AdminPanel from './pages/Admin/AdminPanel';
// import SynonymAdminPanel from './pages/Admin/SynonymAdminPanel';
import './App.css';

function App() {
  return (
      <div className="app-container">
      <Suspense fallback={<Loader />}>
        <Navbar />
        <main className="content-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/synonyms" element={<SynonymAdminPanel />} /> */}
          </Routes>
        </main>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
