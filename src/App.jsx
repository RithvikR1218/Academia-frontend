// App.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppShell, AppShellHeader, AppShellMain, AppShellFooter, AppShellNavbar, Text, Loader } from '@mantine/core';
import Search from './pages/Search';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
const SynonymAdminPanel = lazy(() => import('./pages/SynonymAdminPanel'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      footer={{ height: 40 }}
      navbar={{ width: 200, breakpoint: 'sm' }}
    >
      <AppShellHeader>
        <Text p="md" fw={700}>My App Header</Text>
      </AppShellHeader>

      <AppShellNavbar p="md">
        <Link to="/">Search</Link><br />
        <Link to="/login">Login</Link><br />
        <Link to="/dashboard">Dashboard</Link><br />
        <Link to="/admin">Admin Panel</Link>
        <Link to="/admin/synonyms">Synonym Admin Panel</Link>
      </AppShellNavbar>

      <AppShellMain>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/synonyms" element={<SynonymAdminPanel />} />
          </Routes>
        </Suspense>
      </AppShellMain>

      <AppShellFooter>
        <Text ta="center" p="md" size="sm" c="dimmed">
          © 2025 My App. All rights reserved.
        </Text>
      </AppShellFooter>
    </AppShell>
  );
}

export default App;
