
import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";
import backendUrl from "../backend.js";


// 원래 action객체를 생성하는 action creater의 역할로 액션 객체를 생성할 필요가 없었음
// 중간 함수를 정의하고 반환

// ============= get =============
export const fetchCartdata = () => {
    return async (dispatch) => {

        const fetchData = async () => {
            const response = await fetch(`${backendUrl}cart.json`);

            if (!response.ok) {
                throw new Error('Could not fetch cart data.');
            }

            const data = await response.json();

            return data;
        }

        try {
            const cartData = await fetchData();
            // 우리의 상태에 업데이트 한다.
            dispatch(cartActions.replaceCart({
                items: cartData.items || [] ,
                totalQuantity: cartData.totalQuantity || 0
            }))
        } catch (error) {
            dispatch(uiActions.showNotification({
                title: 'Error!',
                status: 'error',
                message: 'Fetching cart data failed!'
            }));

        }


    }
}

// ============= update =============
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
                body: JSON.stringify({
                    items: cart.items,
                    totalQuantity: cart.totalQuantity
                })
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