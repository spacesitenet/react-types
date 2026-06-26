# Redux Reducer Slice Example

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PromptState = {
  userPrompt: string;
};

const initialState: PromptState = {
  userPrompt: "",
};

const promptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    setUserPrompt: (state, action: PayloadAction<string>) => {
      state.userPrompt = action.payload;
    },
  },
});

export const { setUserPrompt } = promptSlice.actions;
export default promptSlice.reducer;
```
