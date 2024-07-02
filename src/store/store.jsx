import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './reducers/auth';
import { createLogger } from 'redux-logger';


const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
      //ui: uiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware().concat(createLogger())
    ]
  });
  
  export default store;
  