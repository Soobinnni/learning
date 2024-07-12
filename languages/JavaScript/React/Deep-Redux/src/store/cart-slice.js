import { createSlice } from "@reduxjs/toolkit";

import { uiActions } from "./ui-slice";
import backendUrl from "../backend.js";

const initialState = {
    items: [],
    totalQuantity: 0,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart(state, action) {
            state.totalQuantity++;
            const newItem = action.payload;
            // existingItem는 프록시 객체가 되어 마치 상태처럼 취급, 이후 업데이트 상태가 된다.
            const existingItem = state.items.find(item => item.id === newItem.id)

            if (!existingItem) /* if undefined */ {
                state.items.push({
                    id: newItem.id,
                    name: newItem.title,
                    price: newItem.price,
                    description: newItem.description,
                    quantity: 1
                });
            } else {
                // 상태 업데이트. 내부적으로 복사함.
                existingItem.quantity++;
                existingItem.totalPrice += newItem.price;
            }
        },
        removeItemToCart(state, action) {
            state.totalQuantity--;
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem.quantity === 1) {
                state.items = state.items.filter((item) => (item.id !== id));
            } else {
                existingItem.quantity--;
                existingItem.totalPrice -= existingItem.price;
            }
        },
    }
});

const { reducer: cartReducer, actions: cartActions } = cartSlice;

// 원래 action객체를 생성하는 action creater의 역할로 액션 객체를 생성할 필요가 없었음
export const sendCartData = (cart) => {
    return async (dispatch) => {
        dispatch(uiActions.showNotification({
            title: 'Sending...',
            status: 'pending',
            message: 'Sending cart data!'
        }));

        const sendRequest = async () => {
            const response = await fetch(`${backendUrl}cart.json`, {
                method: 'PUT',
                body: JSON.stringify(cart)
            });
            if (!response.ok) {
                throw new Error('Sending cart data failed.');
            }
        }

        try {
            await sendRequest();
            dispatch(uiActions.showNotification({
                title: 'Success!',
                status: 'success',
                message: 'Sent cart data successfully!'
            }));
        } catch (error) {
            sendCartData().catch(error => {
                dispatch(uiActions.showNotification({
                    title: 'Error!',
                    status: 'error',
                    message: 'Sending cart data failed!'
                }));
            });

        }

    }
}

export { cartActions };
export default cartReducer;