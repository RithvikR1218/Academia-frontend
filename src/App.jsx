// App.jsx
import { AppShell, AppShellHeader, AppShellMain, AppShellFooter, AppShellNavbar, Text } from '@mantine/core';
import { Routes, Route, Link } from 'react-router-dom';
import Search from './pages/Search';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

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
        <Link to="/dashboard">Dashboard</Link>
      </AppShellNavbar>

      <AppShellMain>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
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