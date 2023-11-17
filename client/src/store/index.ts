import { configureStore, combineReducers } from "@reduxjs/toolkit";
import reducerAuth from "./authSlice";
import reducerTheme from "./themeSlice";
import {postApi} from '../services/PostService';
import {userApi} from '../services/UserService';
import {commentApi} from '../services/CommentService';
import {storyApi} from '../services/StoryService';


import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const rootReducer = combineReducers({
  reducerAuth: reducerAuth,
  reducerTheme: reducerTheme,
  [userApi.reducerPath]: userApi.reducer,
  [postApi.reducerPath]: postApi.reducer,
  [commentApi.reducerPath]: commentApi.reducer,
  [storyApi.reducerPath]: storyApi.reducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["reducerAuth", "reducerTheme"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(postApi.middleware)
    .concat(userApi.middleware)
    .concat(commentApi.middleware)
    .concat(storyApi.middleware)
});

export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;