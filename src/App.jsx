import { useState } from 'react'
import { Route, Routes, Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import { Art } from './pages/Art'
import { BubbleSpace } from './pages/BubbleSpace'

function App() {

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Main Page</Link>
          </li>
          <li>
            <Link to="/Art">Art Page</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<BubbleSpace />} />
        <Route path="/Art" element={<Art />} />
      </Routes>
    </>
    )
}

export default App
