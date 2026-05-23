import {useState, useEffect} from 'react';

export default function MakeYours({cart, setCart}) {
    const [custom, setCustom] = useState([]);
    const [length, setLength] = useState(0);
    const [filtered, setFiltered] = useState([])
    const [showHidden, setShowHidden] = useState(true);
    const [item, setItem] = useState('');
    const API = import.meta.env.VITE_API_URL;
    const [isLoading, setIsLoading] = useState(false);
    const radius = length/ (2 * Math.PI);

    useEffect(() => {
        fetch(`${API}/products`)
            .then(res => res.json())
            .then(data => {
                setFiltered(data.filter(item => item.category === 'pieces'));
                setIsLoading(true);
            })
    }, [])

    function remove(i, piece){
        const updated = [...custom];
        updated.splice(i, 1)
        setCustom(updated);
        setLength(length - piece.length)
        setFiltered(prev =>
            prev.map(p =>
                p.id === piece.id
                    ? { ...p, stock: p.stock + 1 }
                    : p
            )
        );
    }

    function addToCart(){
        alert('Added to cart!')
        const customPrice = custom.map(piece => piece.price).reduce((acc, num) => acc + num, 0).toFixed(2);
        console.log(cart)
        
        
        const customItem = {
            key : `custom-${Date.now()}`,
            name : 'Custom',
            price: Number(customPrice),
            quantity: 1,
            img_url: "https://nnhlmalelpstnjqdenom.supabase.co/storage/v1/object/public/product-images/pieces/custom.jpg",
            items: custom,
            length: length,
        }

        const updatedStorage = [...cart, customItem];
        setCart(updatedStorage)
        setCustom([])
        console.log(cart)
    }


    function addLength(piece){
        const updated = [...custom, piece];
        const customLength = updated.map(piece => piece.length);
        return customLength.reduce((acc, num) => acc + num, 0)
    }

    function handleSelectPiece(piece){
        if(piece.stock === 0) return;
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
    const circumference = 2 * Math.PI * radius;
    function show(){
        let angle = 0;
        

        const positioned = custom.map((item, i) => {
            let posX = 100;
            let posY = 100 - radius;

            const next = custom[(i + 1) % custom.length];
            const currentAngle = angle;
            angle += ((item.length + next.length)/ 2)/ circumference * 360;
            return { item, posX, posY, angle: currentAngle, i };
        })


        return(
            <>
                {positioned.map(({ item, posX, posY, angle, i }) => (
                    <g key={i} transform={`rotate(${angle} 100 100)`}>
                        <image    
                            className='custom-pic'                        
                            width={item.length}
                            height={item.height}
                            x={posX - (item.length / 2)}
                            y={posY - (item.height / 2)}
                            href={item.img_url}
                            preserveAspectRatio="none"
                            className='custom-pic'
                            onClick={() => {remove(i, item)}}
                        />
                    </g>
                ))}
            </>
        )
    }

        return (
        <>  
            <h1 className='font '>Make your's</h1>


            <svg id='custom-container' width="250" height="250" viewBox="50 50 100 100">
                  {show()}
            </svg>

            <p className='center'>Your custom items length around {Math.round(length)}mm.</p>
            <div id='msg-btn'>
            {custom.length !== 0 
            ?   <div>
                    <button onClick={addToCart} className='add-btn' >Add to cart</button>
                </div>
                    : <p className='font'>Your custom item will be above</p> }
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
                    <p className='showitem-name'><div></div>{item.name}<button onClick={() => setShowHidden(true)} className='close-show-btn add-btn'>X</button></p>
                    <img className='showpieceimg' src={item.img_url} />
                    <p className='showitem-text'>Price:€{item.price}</p>
                    <p className='showitem-text'>{item.description}</p>
                </div>}
            </div>
            <section className='loading' hidden={isLoading}>
                <div className='font'>...Loading</div>
            </section>
        </>
    )
}