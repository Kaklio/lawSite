

import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "../states/signUpSlice";
import userReducer from "../states/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const signupPersistConfig = { key: "signUpBox", storage };
const userPersistConfig = { key: "user", storage };

const persistedSignUpReducer = persistReducer(signupPersistConfig, signupReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    signUpBox: persistedSignUpReducer,
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REGISTER"],
      },
    }),
});

export const persistor = persistStore(store);
