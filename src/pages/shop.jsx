import './shop.css'
import {useState, useRef, useEffect} from 'react'
import Cart from './cart.jsx'
import MakeYours from './makeyours.jsx'

export default function Shop() {
    const [database, setDatabase] = useState([])
    const [category, setCategory] = useState('');
    const [isHidden, setIsHidden] = useState(true);
    const [isCartHidden, setIsCartHidden] = useState(true);
    const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem('cart')) || []);
    const categoryRef = useRef(null);
    const cartRef = useRef(null);
    const [makeYoursHidden, setMakeYoursHidden] = useState(true);
    const [item, setItem] = useState('')
    const [wristSize, setWristSize] = useState('0');
    const [showHidden, setShowHidden] = useState(true);
    const [alert, setAlert] = useState('')
    const [isAlertHidden, setIsAlertHidden] = useState(true);
    const API = import.meta.env.VITE_API_URL;
    const [isLoading, setIsLoading] = useState(false);

    
    useEffect(() => {
        fetch(`${API}/products`)
            .then(res => res.json())
            .then(data => 
                {
                    setDatabase(data)
                    setIsLoading(true)
                }
        )
    }, [API])

    function fill(cat){
        const filtered = database.filter(item => item.category === cat)
        setCategory(
            filtered.map((item) => (
                <div className='card' key={item.id}>
                    <div className='img-container'>
                        <img className='img' src={item.img_url} alt={item.name}/>
                    </div>
                    <p className='card-text'>{item.name}</p>
                    <p className='card-text'>€{item.price * item.quantity}</p>
                    <button className='add-btn' onClick={() => { addToCart(item); alert(`${item.name} added to cart`) }}>Add to cart</button>
                </div>
            ))
        )
    }

    function addToCart(newItem){
        if(newItem.stock === 0){
            return;
        }            
        if(wristSize === '0'){
            setIsAlertHidden(false);
            setAlert('Please set your wrist radius in millimeters.')
            setTimeout(() => {
                document.getElementById('alert').classList.add('fade-out');
            }, 3000);
            setTimeout(() => {
                setIsAlertHidden(true);
            }, 4000)
            return;
        }
        const store = JSON.parse(sessionStorage.getItem('cart')) || [];
        const updated = [...store];
        const existing = updated.find(item => newItem.id === item.id);
        
        if(existing){
            existing.quantity += 1;
            setCart(updated);
            sessionStorage.setItem('cart', JSON.stringify(updated));
            return;
        }

        setCart(prev => {
            newItem.length = wristSize;
            const newCart = [...prev, newItem];
            sessionStorage.setItem('cart', JSON.stringify(newCart));
            
            return newCart;
        });
        setDatabase(prev =>
            prev.map(p =>
                p.id === newItem.id
                    ? { ...p, stock: p.stock + 1 }
                    : p
            )
        );
        
    }

    useEffect(() => {
        function handleClickOutside(e) {
            if(categoryRef.current && !categoryRef.current.contains(e.target)){
                setIsHidden(true)
            }
            if (cartRef.current && !cartRef.current.contains(e.target)){
                setIsCartHidden(true)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    },[])

    const shopItems = database.filter(item => item.category !== 'pieces');
    
    function close(){
        setMakeYoursHidden(true)
        setCart(JSON.parse(sessionStorage.getItem('cart')))
    }



    return (
        <section id="shop">
            <div id='showitem' hidden={showHidden}>
                {<div className='showitem-container'>
                    <p>{item.name}<button onClick={() => setShowHidden(true)} className='add-btn'>X</button></p>
                    <img className='showimg' src={item.img_url} />
                    <p className='showitem-text'>Price:€{item.price}</p>
                    <p className='showitem-text'>{item.description}</p>
                    <label className='showitem-text'>Please add your wrist radius in milimeter. 
                        <input type='number' min='0' className='card-input' required value={wristSize} onChange={(e) => setWristSize(e.target.value)} placeholder='Length in mm' />
                    </label>
                    <button className='add-btn' onClick={() => { addToCart(item); alert('Added to cart') }}>Add to cart</button>
                    
                </div>}
            </div>
            <div id="makeyours" hidden={makeYoursHidden}>
            <MakeYours/>
                <button className='add-btn close-btn'onClick={close}>X</button>
            </div>
            <div id='btn-container'>
                <button className='add-btn' onClick={() => setIsHidden(false)}>Categories</button>
                <button className='add-btn' onClick={() => setIsCartHidden(false)}>🛒<span id='cart-btn-num'>{cart ? cart.length : 0}</span></button>
            </div>
            <nav id='nav' ref={categoryRef} hidden={isHidden}>
                <ul>
                {shopItems.map((cat, index) => (<li key={`${cat.category}-${index}`} className='nav-li' onClick={() => (fill(cat.category))}>{cat.category[0].toUpperCase()}{cat.category.slice(1)}</li>))}
                    
                </ul>
            </nav>
            <div ref={cartRef} hidden={isCartHidden} id='cart-container'>                
                <Cart cart={cart} setCart={setCart} />
            </div>
            <section>
                <h1 className='font'>This is the webshop area</h1>
                <p>Please select from categories or <a className='add-btn' onClick={() => setMakeYoursHidden(false)}>make your's</a>.</p>
                <div className='items-container'>
                    {category || 
                        shopItems.map((item) => (
                            <div className='card' key={item.id} onClick={() => setItem(item)}>
                                <div className='img-container' onClick={() => setShowHidden(false)}>
                                    <img className='img' src={item.img_url} alt={item.name} />
                                </div>
                                <p className='card-text'>{item.name} ${shopItems.stock} left</p>
                                <p className='card-text'>€{item.price * item.quantity}</p>
                                <label className='card-input-label' >Wrist radius: 
                                    <input className='card-input' min='0' type='number' required  value={wristSize} onChange={(e) => setWristSize(e.target.value)}/>mm
                                </label>    
                                <button className='add-btn' onClick={() => { addToCart(item); }}>{item.stock > 0 ? "Add to cart" : "Out of stock"}</button>
                            </div>
                        ))
                    }
                </div>
            </section>
            <section id='alert' hidden={isAlertHidden}>
                <div id='alert-container'>
                    <p className='font'>{alert}</p>
                </div>
            </section>
            <section className='loading' hidden={isLoading}>
                <div className='font'>...Loading</div>
                <div>Can be 50 seconds or more.</div>
            </section>
        </section>
    )
}