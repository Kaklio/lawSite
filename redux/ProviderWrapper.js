"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./store"; 
import { PersistGate } from "redux-persist/integration/react";

export default function ProviderWrapper({ children }) {


  // This useEffect Resests the useStates on server Shutdown 

  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     persistor.purge(); // Clears persisted Redux state on browser close
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
    
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
