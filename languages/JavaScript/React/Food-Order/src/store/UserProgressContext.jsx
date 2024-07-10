import { createContext, useState } from "react";

// 장바구니를 확인하고 결제창으로 넘어가는 과정은
// 각각의 단계가 결국에는 사용자가 웹사이트에서 경험하는
// 연속적인 것이므로 사용자의 과정에 대한 컨텍스트(UserProgressContext)라 정의.


const UserProgressContext = createContext({
    progress: '', // 'cart', 'checkout'
    showCart: () => { },
    hideCart: () => { },
    showCheckout: () => { },
    hideCheckout: () => { },
})
export default UserProgressContext;

export function UserProgressContextProvider({ children }) {
    const [userProgress, setUserProgress] = useState('');
    const statusText = { cart:'cart', checkout:'checkout', none: '' }

    function showCart() { setUserProgress(statusText.cart) }
    function hideCart() { setUserProgress(statusText.none) }
    function showCheckout() { setUserProgress(statusText.checkout) }
    function hideCheckout() { setUserProgress(statusText.none) }

    const userProgressCtx = {
        progress: userProgress,
        showCart,
        hideCart,
        showCheckout,
        hideCheckout
    }
    return (
        <UserProgressContext.Provider value={userProgressCtx}>
            {children}
        </UserProgressContext.Provider>
    )
}