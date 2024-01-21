import {SET_TOKEN} from './auth.types';


export const setToken = (token) => {
    return{
        type: SET_TOKEN,
        payload:token
    }
}