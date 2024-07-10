import { useContext } from "react";
import Modal from "./UI/Modal.jsx";
import CartContext from "../store/CartContext.jsx";
import { currencyFormatter } from "../utils/formatting";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
        return totalPrice + item.quantity * item.price
    }, 0)
    return (
        <Modal 
            open={userProgressCtx.progress==='checkout'} 
            onClose={userProgressCtx.progress==='checkout'?userProgressCtx.hideCheckout:null}
        >
            <form>
                <h2>Checkout</h2>
                <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
                <Input label='Full Name' type='text' id="full-name" />
                <Input label='E-Mail Address' type='email id="email"' />
                <Input label='Street' type='text' id="full-name" />
                <div className="control-row">
                    <Input label='Postal Code' type='text' id="postal-code" />
                    <Input label='City' type='text' id="city" />
                </div>
                <p className="modal-actions">
                    <Button type="button" textOnly onClick={userProgressCtx.hideCheckout}>Close</Button>
                    <Button>Submit Order</Button>
                </p>
            </form>
        </Modal>
    )
}