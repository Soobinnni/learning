import { useContext } from "react";
import Modal from "./UI/Modal.jsx";
import Button from "./UI/Button.jsx";
import CartContext from "../store/CartContext.jsx";
import { currencyFormatter } from "../utils/formatting";
import UserProgressContext from "../store/UserProgressContext.jsx";
import CartItem from "./CartItem.jsx";

export default function Cart() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
        return totalPrice + item.quantity * item.price
    }, 0)
    return (
        <Modal 
            className="cart" 
            open={userProgressCtx.progress === 'cart'}
            onClose={userProgressCtx.progress === 'cart' ? userProgressCtx.hideCart : null}
        >
            <h2>Your Cart</h2>
            <ul>
                {
                    cartCtx.items.map(item =>
                        <CartItem
                            key={item.id}
                            item={item}
                            onDecrease={()=>cartCtx.removeItem(item.id)}
                            onIncrease={()=>cartCtx.addItem(item)}
                        />
                    )
                }
            </ul>
            <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
            <p className="modal-actions">
                <Button textOnly onClick={userProgressCtx.hideCart}>Close</Button>
                {
                    cartCtx.items.length > 0 && <Button onClick={userProgressCtx.showCheckout}>Go to Checkout</Button>
                }
            </p>
        </Modal>
    )
}