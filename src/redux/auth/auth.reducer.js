import {SET_TOKEN} from './auth.types';

const INITIAL_STATE = {
    token: null
}

export const authReducer = (state=INITIAL_STATE, action) =>{
    const {type,payload} = action;
    switch(type){
        case SET_TOKEN:
            return {
                ...state,
                token: payload
            }
        default:
            return state;
    }
}