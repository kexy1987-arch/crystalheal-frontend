import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {useState} from 'react'
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement } from "@stripe/react-stripe-js";

import Home from './pages/home.jsx'
import Shop from './pages/shop.jsx'
import About from './pages/about.jsx'
import Contact from './pages/contact.jsx'
import Navbar from './components/navbar.jsx'
import MakeYours from './pages/makeyours.jsx'
import Footer from './components/footer.jsx'
import Checkout from './pages/checkout.jsx'
import Success from './pages/success.jsx'

const stripePromise = loadStripe("pk_test_51T9hlzJ8fuYdHTKZT00SyR4iFu8jwBLkg0Oy93UYHBtaAzdHYotjh6h7JfafKbJTlEYVlWwC3DjlRcn7XrsjGStQ00mYCnhmOB");

function App() {

  const [wristSize, setWristSize] = useState('0');
  const [cart, setCart] = useState([]);

  return(
    <div className='page'>
      <BrowserRouter>
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={
              <Shop
                wristSize={wristSize}
                setWristSize={setWristSize}
                cart={cart}
                setCart={setCart}
              />
            } />
            <Route path="/makeyours" element={
              <MakeYours cart={cart} setCart={setCart} />
            } />
            <Route path="/contact" element={<Contact />} />

            <Route path="/checkout" element={
              <Elements stripe={stripePromise}>
                <Checkout
                  wristSize={wristSize}
                  cart={cart}
                  setCart={setCart}
                />
              </Elements>
            } />

            <Route path="/success" element={<Success />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
