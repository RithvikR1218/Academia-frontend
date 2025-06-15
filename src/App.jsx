// App.jsx
import { Container, Title } from '@mantine/core';
import { Routes, Route } from 'react-router-dom';
import Search from './pages/Search'; // ✅ from pages, not components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Container>
      <Title align="center" mt="md">Vite + React + Mantine</Title>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add more routes here if needed */}
      </Routes>
    </Container>
  );
}

export default App;