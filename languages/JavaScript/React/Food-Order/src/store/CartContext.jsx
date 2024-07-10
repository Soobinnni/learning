import { createContext, useReducer } from "react";

const CartContext = createContext({
    items: [],
    addItem: (item) => { },
    removeItem: (id) => { },
    clearCart: () => { }
});

function cartReducer(state, action) {
    const { type, item, id } = action;

    const updatedItems = [...state.items];

    // ======================================================================
    if (type === 'ADD_ITEM') {
        const existingCartItemIndex = state.items.findIndex((target) =>
            target.id === item.id
        )

        if (existingCartItemIndex > -1) {
            const existingItme = state.items[existingCartItemIndex]
            const updatedItem = {
                ...existingItme,
                quantity: existingItme.quantity + 1
            }
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            updatedItems.push({ ...item, quantity: 1 });
        }

        return { ...state, items: updatedItems };
    }
    // ======================================================================
    if (type === 'REMOVE_ITEM') {
        const existingCartItemIndex = state.items.findIndex((target) =>
            target.id === id
        )
        const existingCartItem = state.items[existingCartItemIndex];

        if (existingCartItem.quantity <= 1) {
            updatedItems.splice(existingCartItemIndex, 1);
        } else {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity - 1
            }
            updatedItems[existingCartItemIndex] = updatedItem;
        }
        return { ...state, items: updatedItems };
    }

    // ======================================================================
    if (type === 'CLEAR_CART') {
        return { ...state, items: [] };
    }

    return state;
}

export function CartContextProvider({ children }) {
    const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

    function addItem(item) {
        dispatchCartAction({
            type: 'ADD_ITEM',
            item
        })
    }
    function removeItem(id) {
        dispatchCartAction({
            type: 'REMOVE_ITEM',
            id
        })
    }
    function clearCart() {
        dispatchCartAction({ type: 'CLEAR_CART' });
    }
    const cartContext = {
        items: cart.items,
        addItem,
        removeItem,
        clearCart
    }
    console.log(cartContext)
    return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
}

export default CartContext;