# Redux Store And Reducer Slice Example

## itemSlice.ts

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ItemState = {
  value: string;
};

const initialState: ItemState = {
  value: "",
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    clearValue: (state) => {
      state.value = "";
    },
  },
});

export const { setValue, clearValue } = itemSlice.actions;
export default itemSlice.reducer;
```

## store.ts

```ts
import { configureStore } from "@reduxjs/toolkit";
import itemReducer from "./itemSlice";

export function createAppStore() {
  return configureStore({
    reducer: {
      item: itemReducer,
    },
  });
}

export const store = createAppStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```
