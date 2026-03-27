import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {useState} from 'react'

import Home from './pages/home.jsx'
import Shop from './pages/shop.jsx'
import About from './pages/about.jsx'
import Contact from './pages/contact.jsx'
import Navbar from './components/navbar.jsx'
import MakeYours from './pages/makeyours.jsx'
import Footer from './components/footer.jsx'
import Checkout from './pages/checkout.jsx'
import Success from './pages/success.jsx'

function App() {

  const [wristSize, setWristSize] = useState('0');

  return(
    <div className='page'>
      <BrowserRouter>
        <Navbar />
        <main className='content'>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/shop" element={<Shop wristSize={wristSize} setWristSize={setWristSize}/>}/>
            <Route path="makeyours" element={<MakeYours />} />
            <Route path="/contact" element={<Contact/>}/>
            <Route path="checkout" element={<Checkout wristSize={wristSize}/>}/>
            <Route path="success" element={<Success/>}/>
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
