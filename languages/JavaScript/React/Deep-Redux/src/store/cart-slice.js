import { createSlice } from "@reduxjs/toolkit";

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
                state.items=state.items.filter((item) => (item.id !== id));
            } else {
                existingItem.quantity--;
                existingItem.totalPrice -= existingItem.price;
            }
        },
    }
});

const { reducer: cartReducer, actions: cartActions } = cartSlice;

export { cartActions };
export default cartReducer;