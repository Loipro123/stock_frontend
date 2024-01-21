import {createSelector} from 'reselect';

const auth = state => state.auth;


export const getToken = createSelector(
    [auth],
    auth => auth.token
);