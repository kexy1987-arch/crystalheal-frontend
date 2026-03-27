import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";


const stripePromise = loadStripe("pk_test_51T9hlzJ8fuYdHTKZT00SyR4iFu8jwBLkg0Oy93UYHBtaAzdHYotjh6h7JfafKbJTlEYVlWwC3DjlRcn7XrsjGStQ00mYCnhmOB");

function Checkout({wristSize}) {
    const stripe = useStripe();
    const elements = useElements();
    const [name, setName] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressCity, setAddressCity] = useState('');
    const [addressPostalCode, setAddressPostalCode] = useState('');
    const [county, setCounty] = useState('');
    const [email, setEmail] = useState('');
    const cartItems = JSON.parse(sessionStorage.getItem('cart'));
    const prices = cartItems.map(item => item.price);
    const total = prices.reduce((acc, num) => acc + num, 0).toFixed(2) * 100;
    const API = import.meta.env.VITE_API_URL;
    
    console.log(cartItems)
    const handleSubmit = async (e) => {
        e.preventDefault();

        

        const res = await fetch(`${ API }/create-payment-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: total,
                items: cartItems, 
                customer: {
                    name: name,
                    email: email,
                    address: {
                        line1: addressLine1,
                        line2: county,
                        city: addressCity,
                        postal_code: addressPostalCode,
                        country: "IE",
                    }
                }
            }),
        });

        const { clientSecret } = await res.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: name,
                    email: email,
                    address: {
                        line1: addressLine1,
                        line2: county,
                        city: addressCity,
                        postal_code: addressPostalCode,
                        country: 'IE',
                    }
                }
            },
        });

        if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
            await fetch(`${API}/send-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer: {
                        name: name,
                        email: email,
                        address: {
                            line1: addressLine1,
                            line2: county,
                            city: addressCity,
                            postal_code: addressPostalCode,
                            country: "IE",
                        }
                    },
                    items: cartItems,
                    amount: total,
                    wrist: wristSize
                })
            });
            await fetch(`${API}/update-stock`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: cartItems })
            });

            sessionStorage.removeItem('cart')
            window.location.href = "/success"
        } else {
            alert('Please check your balance or try another card.')
        }

        if (result.error) {
            console.log(result.error.message);
        } else {
            console.log("Payment successful");
        }
    };

    function resetBtn(){
        setName('');
        setAddressCity('');
        setAddressLine1('');
        setAddressPostalCode('');
        setCounty('');
        setEmail('');
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <fieldset id='customer-details'>
                    <legend>Personal details:</legend>
                    <label className='customer-details-label'>Full name:
                        <input className='customer-inputs' type='text' required onChange={(e) => setName(e.target.value)}/>
                    </label>
                    <label className='customer-details-label'>E-mail:
                        <input className='customer-inputs' type='email' pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" required onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <fieldset id='address'>
                        <legend>Address</legend>
                        <label className='customer-details-label'>Line 1:
                            <input className='customer-inputs' type='text' required onChange={(e) => setAddressLine1(e.target.value)} />
                        </label>
                        <label className='customer-details-label'>City:
                            <input className='customer-inputs' type='text' required onChange={(e) => setAddressCity(e.target.value)} />
                        </label>
                        <label className='customer-details-label'>County:
                            <input className='customer-inputs' type='text' required onChange={(e) => setCounty(e.target.value)} />
                        </label>
                        <label className='customer-details-label'>Post code:
                            <input className='customer-inputs' type='text' required onChange={(e) => setAddressPostalCode(e.target.value)} />
                        </label>    
                    </fieldset>
                    <button id='reset-btn' onClick={resetBtn}>Reset form</button>
                </fieldset>
                <fieldset id='payment-info'>
                    <legend>Payment Info</legend>
                    <p>Price: €{total / 100}</p>
                    <p>Delivery price: €8.00</p>
                    <p>Total with delivery: €{((total / 100) + 8.00).toFixed(2)}</p>
                </fieldset>
                <div  id='card-nums'>
                    <CardElement options={{hidePostalCode: true}}/>
                    <button id='pay-btn' disabled={!stripe}>Pay</button>
                    <p>Payments are handled by Stripe</p>
                </div>
            </form>
        </>
    );
}

export default function App() {
    return (
        <>

            <div id='card-details'>
                <Elements stripe={stripePromise}>
                    <Checkout />
                </Elements>
            </div>
        </>
    );
}
