import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api"
import { clearErrorMessage, onChecking, onLogin, onLogout, OnLogoutCalendar } from "../store";

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const startLogin = async ({ email, password }) => {
        dispatch(onChecking());
        try {
            const { data } = await calendarApi.post('/auth', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLogin({ name: data.name, uid: data.uid }));
        } catch (error) {
            dispatch(onLogout('Credenciales incorrectas'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }

    //startRegister

    const startRegister = async ({ email, password, name }) => {
        dispatch(onChecking());
        try {
            const { data } = await calendarApi.post('/auth/new', { name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLogin({ name: data.name, uid: data.uid }));
        } catch (error) {
            dispatch(onLogout(error.response.data?.msg || 'Error en el registro takataka'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }

    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) return dispatch(onLogout('No hay token'));

        try {
            const { data } = await calendarApi.get('/auth/renew');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLogin({ name: data.name, uid: data.uid }));
        } catch (error) {
            localStorage.clear();
            dispatch(onLogout('Token no válido'));
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(OnLogoutCalendar())
        // dispatch({ type: 'calendar/OnLogoutCalendar' });
        dispatch(onLogout());
    }

    return {
        //*Properties
        errorMessage,
        status,
        user,
        //*Methods
        checkAuthToken,
        startLogin,
        startLogout,
        startRegister,
    }
}