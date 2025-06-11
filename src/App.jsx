import './App.css'
import { Title, Container } from '@mantine/core'
import {  Search } from './components/Search'

function App() {

  return (
    <Container>

      <Title align="center" mt="md">Vite + React + Mantine</Title>
      <Search></Search>

    </Container>
  )
}

export default App
