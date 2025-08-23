"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./store"; 
import { PersistGate } from "redux-persist/integration/react";

export default function ProviderWrapper({ children }) {

  // This useEffect Resests the useStates on server Shutdown 

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
