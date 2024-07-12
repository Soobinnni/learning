import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "./ui-slice.js";
import cartReducer from "./cart-slice.js";

const store = configureStore ({
    reducer: {
        ui: uiReducer,
        cart: cartReducer
    }
})

export default store;