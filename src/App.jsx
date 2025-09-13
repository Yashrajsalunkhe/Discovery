import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import Layout from './components/Layout'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import EventRules from './pages/EventRules'
import Registration from './pages/Registration'
import Committee from './pages/Committee'
import Contact from './pages/Contact'

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/rules" element={<EventRules />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/registration/:eventId" element={<Registration />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default App