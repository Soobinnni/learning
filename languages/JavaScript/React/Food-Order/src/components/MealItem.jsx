import { useContext } from "react";
import { currencyFormatter } from "../utils/formatting";
import Button from "./UI/Button.jsx";
import CartContext from "../store/CartContext.jsx";
export default function MealItem({ meal }) {
    const cartCtx = useContext(CartContext);
    const { name, price, description, image } = meal;

    function handleAddMealToCart () {
        cartCtx.addItem(meal)
    }
    return (

        <li className="meal-item">
            <article>
                <img src={`http://localhost:3000/${image}`} alt="" />
                <div>
                    <h3>{name}</h3>
                    <p className="meal-item-price">{currencyFormatter.format(price)}</p>
                    <p className="meal-item-description">{description}</p>
                </div>
                <p className="meal-item-actions">
                    <Button onClick={handleAddMealToCart}>Add to Cart</Button>
                </p>
            </article>
        </li>
    )
}