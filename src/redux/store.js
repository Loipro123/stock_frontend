import {createStore,applyMiddleware} from 'redux';
import {persistStore} from 'redux-persist';
import rootReducer from './root';


const middleware = [];

export const store = createStore(rootReducer,applyMiddleware(...middleware));
export const persistor = persistStore(store);