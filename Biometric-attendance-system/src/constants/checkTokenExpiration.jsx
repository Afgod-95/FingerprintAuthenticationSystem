import { store } from '../redux/store';
import { refreshAccessToken, updateTokens } from '../redux/reducers'; 

export const checkTokenExpiration = () => {
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    const currentTime = Date.now();

    // If the token is expiring in less than 5 minutes (300000 milliseconds)
    if (tokenExpiration && currentTime >= tokenExpiration - 300000) {
        store.dispatch(refreshAccessToken()).then((action) => {
            if (action.type === 'admin/refreshAccessToken/fulfilled') {
                store.dispatch(updateTokens(action.payload));
            }
        });
    }
};
