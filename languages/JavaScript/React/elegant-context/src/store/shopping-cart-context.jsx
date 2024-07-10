import { createContext, useReducer } from "react";

import { DUMMY_PRODUCTS } from '../dummy-products.js';

export const CartContext = createContext({
    items: [],
    addItemToCart: () => { }
});

function shoppingCartReducer(state, action) {
    // 해당 reducer함수가 다른 곳에서도 쓰일 수 있기 때문에 전역으로 둔다.
    const updatedItems = [...state.items];

    // add item
    if (action.type === 'ADD_ITEM') {
        const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.payload
        );
        const existingCartItem = updatedItems[existingCartItemIndex];

        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
            updatedItems.push({
                id: action.payload,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
        }
    }

    // update cart item quantity
    if(action.type==='UPDATE_ITEM'){        
        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.payload.productId
        );

        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };

        updatedItem.quantity += action.payload.amount;

        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }
    }

    // return updated state
    return {
        ...state,
        items: updatedItems,
    };
}
export default function CartContextProvider({ children }) {
    // useReducer함수 사용으로 삭제
    //      const [shoppingCart, setShoppingCart] = useState({
    //             items: [],
    //      });
    const [shoppingCartState, shoppingCartDispatch] = useReducer(
        shoppingCartReducer, {
        items: [],
    });

    function handleAddItemToCart(id) {
        shoppingCartDispatch({
            type: 'ADD_ITEM',
            payload: id
        });
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            type:'UPDATE_ITEM',
            payload: {
                productId: productId, 
                amount: amount
            }
        });
    }

    const ctxValue = {
        items: shoppingCartState.items,
        addItemToCart: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity
    }

    return <CartContext.Provider value={ctxValue}>
        {children}
    </CartContext.Provider>
}