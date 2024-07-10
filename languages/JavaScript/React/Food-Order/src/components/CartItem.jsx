import { currencyFormatter } from "../utils/formatting"
export default function CartItem({ 
    item,
    onDecrease,
    onIncrease
}) {
    const {name, quantity, price} = item;
    return (
        <li className="cart-item">
            <p>
                {name} - {quantity} x {currencyFormatter.format(price)}
            </p>
            <p className="cart-item-actions">
                <button onClick={onDecrease}>-</button>
                <span>{quantity}</span>
                <button onClick={onIncrease}>+</button>
            </p>
        </li>
    )
}