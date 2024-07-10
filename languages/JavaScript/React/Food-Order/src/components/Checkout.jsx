import { useContext } from "react";

import useHttp from '../hooks/useHttp.js'

import Modal from "./UI/Modal.jsx";
import CartContext from "../store/CartContext.jsx";
import { currencyFormatter } from "../utils/formatting";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import Error from "./Error.jsx";

import UserProgressContext from "../store/UserProgressContext.jsx";


const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
};
export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
        return totalPrice + item.quantity * item.price
    }, 0)

    const {
        data,
        isLoading: isSending,
        error,
        sendRequest,
        clearData
    } = useHttp('http://localhost:3000/orders', requestConfig);

    function handleFinish() {
        // context에 새 함수 추가. 
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }
    function handleSubmit(event) {
        event.preventDefault();

        const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());

        sendRequest(
            JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            })
        );
    }

    let actions =
        <>
            <Button type="button" textOnly onClick={userProgressCtx.hideCheckout}>Close</Button>
            <Button>Submit Order</Button>
        </>;

    if (isSending) {
        actions = <span>Sending order data...</span>
    }

    if (data && !error) {
        // 데이터가 잘 도착했고 오류가 없다면 다음 모달을 리턴한다.
        return (
            <Modal
                open={userProgressCtx.progress === 'checkout'}
                onClose={handleFinish}
            >
                <h2>Success!</h2>
                <p>Your order was submitted successfully.</p>
                <p>
                    We will get back to you with more details via email within the next
                    few minutes.
                </p>
                <p className="modal-actions">
                    <Button onClick={handleFinish}>Okay</Button>
                </p>
            </Modal>
        );
    }
    return (
        <Modal
            open={userProgressCtx.progress === 'checkout'}
            onClose={userProgressCtx.progress === 'checkout' ? userProgressCtx.hideCheckout : null}
        >
            <form onSubmit={handleSubmit}>
                <h2>Checkout</h2>
                <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
                <Input label='Full Name' type='text' id="name" />
                <Input label='E-Mail Address' type='email' id="email" />
                <Input label='Street' type='text' id="street" />
                <div className="control-row">
                    <Input label='Postal Code' type='text' id="postal-code" />
                    <Input label='City' type='text' id="city" />
                </div>
                {
                    error && <Error title='Failed to submit order' message={error} />
                }
                <p className="modal-actions">
                    {
                        actions
                    }
                </p>
            </form>
        </Modal>
    )
}