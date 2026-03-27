import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

export default function Cart({cart, setCart, database, setDatabase}){
    const [balance, setBalance] = useState(0);
    function remove(index, item){
        console.log(item)
        setBalance(balance - item.price);
        const newArray = cart.filter((_, i) => i !== index);
        setCart(newArray);
        sessionStorage.setItem('cart', JSON.stringify(newArray));
    }

    useEffect(() =>{
        function calcBalance(){
            if(!cart){
                return;
            }
            const priceArr = cart.map(item => item.price)
            const balance = priceArr.reduce((acc, num) => {
                return acc + num;
            }, 0)
            setBalance(balance.toFixed(2));}
            calcBalance();
        }, [cart]
    )

    function addQuantity(item){
        const dbItem = database.find(p => p.id === item.id);
        if (!dbItem || dbItem.stock <= 0) return;
        console.log(item)
        const newItem = item;
        const store = JSON.parse(sessionStorage.getItem('cart')) || [];
        const updated = [...store];
        const existing = updated.find(item => newItem.key === item.key);
        console.log(store)

        if (existing) {
            const basePrice = existing.price / existing.quantity;
            existing.quantity += 1;
            existing.price += basePrice;
            setCart(updated);
            sessionStorage.setItem('cart', JSON.stringify(updated));
            return;
        }
    }

    function removeQuantity(item, index) {
        console.log(item)
        if(item.quantity === 1) {
            remove(index, item)
            return;
        }

        const newItem = item;
        const store = JSON.parse(sessionStorage.getItem('cart')) || [];
        const updated = [...store];
        const existing = updated.find(item => newItem.key === item.key);
        console.log(store)

        if (existing) {
            const basePrice = existing.price / existing.quantity 
            existing.quantity -= 1;
            existing.price -= basePrice;
            setCart(updated);
            sessionStorage.setItem('cart', JSON.stringify(updated));
            return;
        }
    }

    return(
        <>
            <h2>Your Cart</h2>
            {(!cart || cart.length === 0) && (
                <p>Your list is empty</p>
            )}
            {cart && cart.length > 0 && (
        <>            
            <p id='balance'>Total: €{balance}<button className='add-btn'><Link to='/checkout'>Checkout</Link></button></p>
            <ul>
                {cart.map((item, index) => (
                    <li key={`${item.name}-${index}`} className='cart-items'>
                        <img className='cart-img' src={item.img_url} />
                        <div className='cart-p'>
                            <p>{item.name} {item.length}mm</p>
                            <p>Quantity: <span><button className='quantity-btn' onClick={() => addQuantity(item)}>+</button>{item.quantity}<button onClick={() => removeQuantity(item, index)}className='quantity-btn'>-</button></span></p>
                            <p>€{item.price.toFixed(2)}</p>
                        </div>
                        <button onClick={() => remove(index, item)} className='remove-btn'>X</button>
                    </li>
                ))}
            </ul>
        </>)}</>
    )
}
