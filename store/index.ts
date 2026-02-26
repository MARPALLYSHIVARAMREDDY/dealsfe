import { configureStore } from "@reduxjs/toolkit";

import newAuthReducer from "./auth-store";
import catalogueReducer from "./catalogue-store";
import previewReducer from "./preview-store";

export const store = configureStore({
  reducer: {
    // auth: authReducer, // Old auth store (to be removed in Phase 5)
    newAuth: newAuthReducer, // New clean auth store
    catalogue: catalogueReducer,
    preview: previewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
