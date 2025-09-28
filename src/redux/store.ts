import {configureStore} from "@reduxjs/toolkit"
import { UserSlice } from "./current_user"
import { RootPathSlice } from "./rootpath";
import { AssignmentSlice } from "./assignments";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';


const persistConfig = {
    key: 'root',
    storage,
  }

const persistedUserReducer = persistReducer(persistConfig, UserSlice.reducer)
const persistedAssignmentReducer = persistReducer(persistConfig, AssignmentSlice.reducer)
const persistedRootPathReducer = persistReducer(persistConfig, RootPathSlice.reducer)

export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        assignments: persistedAssignmentReducer,
        rootpath: persistedRootPathReducer,

    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
//kpham: use middleware above to avoid error message: non-serializable object being saved to redux store...


export const persistore = persistStore(store)
export const useAppDispatch:()=>typeof store.dispatch=useDispatch;
export const useAppSelector:TypedUseSelectorHook<ReturnType<typeof store.getState>>=useSelector;

export type RootState = ReturnType<typeof store.getState>;
