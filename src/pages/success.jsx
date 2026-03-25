import {useEffect} from 'react'

export default function Success(){
    useEffect(() => {
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function () {
            window.location.href = "/shop";
        };
    }, []);
    document.addEventListener("click", () => {
        window.location.href = "/shop";

    })

    return(
        <div id='success' className='font'>
            <p>The payment was succesful. A receipt has been sent to your e-mail address.</p>
        </div>
    )
}