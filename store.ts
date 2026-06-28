import { configureStore } from "@reduxjs/toolkit";
import aiFormReducer from "./aiFormSlice";

export const store = configureStore({
  reducer: {
    aiForm: aiFormReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
