import { createContext } from "react";

// Context 생성
export const CartContext = createContext({
    items: [],
    addItemToCart: () => {}
});

// CartContext 값에 접근하는 컴포넌트를 CartContext.Provider로 묶기