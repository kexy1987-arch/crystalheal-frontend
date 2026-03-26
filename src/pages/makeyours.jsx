import {useState, useEffect} from 'react';

export default function MakeYours() {
    const [custom, setCustom] = useState([]);
    const [database, setDatabase] = useState([]);
    const [length, setLength] = useState(0);
    const [filtered, setFiltered] = useState(database.filter(item => item.category === 'pieces'))
    const [showHidden, setShowHidden] = useState(true);
    const [item, setItem] = useState('');
    const API = import.meta.env.VITE_API_URL;
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetch(`${API}/products`)
            .then(res => res.json())
            .then(data => {
                setDatabase(data)
                setIsLoading(true)
            })
    }, [])

    function remove(i, piece){
        const updated = [...custom];
        updated.splice(i, 1)
        setCustom(updated);
        setLength(length - piece.length)
    }

    function addToCart(){
        alert('Added to cart!')
        const customPrice = custom.map(piece => piece.price).reduce((acc, num) => acc + num, 0).toFixed(2);
        
        
        console.log(customPrice)
        const customItem = {
            key : `custom-${Date.now()}`,
            name : 'Custom',
            price: Number(customPrice),
            quantity: 1,
            img_url: "https://nnhlmalelpstnjqdenom.supabase.co/storage/v1/object/public/product-images/pieces/custom.jpg",
            items: custom,
            length: length,
        }
        if(!sessionStorage.getItem('cart')){
            sessionStorage.setItem('cart', JSON.stringify([customItem]))
            return;
        }
        const storageItems = JSON.parse(sessionStorage.getItem('cart'));
        const updatedStorage = [...storageItems, customItem];
        sessionStorage.setItem('cart', JSON.stringify(updatedStorage));
        setCustom([])
    }
    function addLength(piece){
        const updated = [...custom, piece]
        console.log(custom)
        const customLength = updated.map(piece => piece.length);
        console.log(custom.length)
        return customLength.reduce((acc, num) => acc + num, 0)
    }

    function handleSelectPiece(piece){
        setCustom([...custom, piece]);
        setLength(addLength(piece));
        setFiltered(prev => 
            prev.map(p =>
                p.id === piece.id
                ? {...p, stock: p.stock -1}
                : p
            )
        );
    }

    return (
        <>  
            <h1 className='font '>Make your's</h1>
            <div id='custom-container'>
                {custom.map((piece, i)=> (
                    <img className='custom-pic' key={i} src={piece.img_url} style={{width:(piece.length * 4)}}onClick={() =>remove(i, piece)}/>
                ))}
                <p>Your custom items length will be {length}mm.</p>
            </div>
            <div id='msg-btn'>
            {custom.length !== 0 
            ?   <div>
                    <button onClick={addToCart} className='add-btn' >Add to cart</button>
                </div>
                    : <p className='font'>Your custom item will be here</p> }
            </div>
            <div id='piece-container'>
                {filtered 
                ? filtered.map((piece) => (
                    <div key={piece.id} className='piece-card' >
                        <div onClick={() => handleSelectPiece(piece)}>    
                            <img className='piece-img' src={piece.img_url} />
                            <p>{piece.name}</p>
                            <p>{piece.stock} available.</p>
                        </div>
                        <button className='small' onClick={() => (setItem(piece), setShowHidden(false))}>Description</button>
                    </div>
                ))
                :<p className='font'>Something went wrong</p>}
            </div>
            <div id='showitem' hidden={showHidden}>
                {<div className='showitem-container'>
                    <p>{item.name}<button onClick={() => setShowHidden(true)} className='close-btn add-btn'>X</button></p>
                    <img className='showpieceimg' src={item.img_url} />
                    <p className='showitem-text'>Price:€{item.price}</p>
                    <p className='showitem-text'>{item.description}</p>
                </div>}
            </div>
            <section className='loading' hidden={isLoading}>
                <div className='font'>...Loading</div>
                <div>Can be 50 seconds or more.</div>
            </section>
        </>
    )
}