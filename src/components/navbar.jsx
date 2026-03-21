import './navbar.css'

import { Link } from 'react-router-dom'

export default function Navbar(){
    
    return(
        <div id='main'>
            <div id='title'>Crystal Heal</div>
            <div id='btn-container'>
                <Link to="/" className='nav-btn'>Home</Link>
                <Link to="/shop"className='nav-btn'>Shop</Link>
                <Link to="/about"className='nav-btn'>About</Link>
            </div>
        </div>
    )
}