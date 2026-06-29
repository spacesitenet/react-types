# Redux Slice With Async Thunk Example

Basic typed example with normal reducers, an API call using `createAsyncThunk`, and `extraReducers` for loading, success, and error states.

## itemSlice.ts

```ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type Item = {
  id: string;
  name: string;
};

type ItemsState = {
  items: Item[];
  selectedItemId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: ItemsState = {
  items: [],
  selectedItemId: null,
  status: "idle",
  error: null,
};

export const fetchItems = createAsyncThunk<Item[]>(
  "items/fetchItems",
  async () => {
    const response = await fetch("/api/items");

    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }

    return response.json() as Promise<Item[]>;
  },
);

const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
    },
    selectItem: (state, action: PayloadAction<string>) => {
      state.selectedItemId = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItemId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export const { addItem, selectItem, clearSelectedItem } = itemSlice.actions;
export default itemSlice.reducer;
```

## store.ts

```ts
import { configureStore } from "@reduxjs/toolkit";
import itemReducer from "./itemSlice";

export const store = configureStore({
  reducer: {
    items: itemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Component Usage

```tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { fetchItems, selectItem } from "./itemSlice";

function ItemsList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error, selectedItemId } = useSelector(
    (state: RootState) => state.items,
  );

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "failed") {
    return <p>{error}</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <button type="button" onClick={() => dispatch(selectItem(item.id))}>
            {item.name}
            {selectedItemId === item.id ? " selected" : ""}
          </button>
        </li>
      ))}
    </ul>
  );
}
```
