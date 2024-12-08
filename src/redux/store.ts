import {configureStore} from "@reduxjs/toolkit"
import { UserSlice } from "./current_user"


import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';


const persistConfig = {
    key: 'root',
    storage,
  }

const persistedUserReducer = persistReducer(persistConfig, UserSlice.reducer)

export const store = configureStore({
    reducer: {
        user: persistedUserReducer,

       
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
//kpham: use middleware above to avoid error message: non-serializable object being saved to redux store...

//user: UserSlice.reducer, 
export const persistore = persistStore(store)
export const useAppDispatch:()=>typeof store.dispatch=useDispatch;
export const useAppSelector:TypedUseSelectorHook<ReturnType<typeof store.getState>>=useSelector;
