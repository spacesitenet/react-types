import mainReference from "../README.md?raw";
import asyncThunkSlice from "../README.async-thunk-slice.md?raw";
import databricksMedallion from "../README.databricks-medallion.md?raw";
import muiColors from "../README.mui-colors.md?raw";
import reactStateUpdates from "../README.react-state-updates.md?raw";
import reducerSlice from "../README.reducer-slice.md?raw";
import testing from "../README.testing.md?raw";
import testingReducer from "../README.testing-reducer.md?raw";

export type Doc = {
  slug: string;
  title: string;
  description: string;
  category: string;
  content: string;
};

export const docs: Doc[] = [
  {
    slug: "react-typescript-reference",
    title: "React TypeScript Reference",
    description: "Core React, TypeScript, event, hook, and Redux syntax patterns.",
    category: "React + TypeScript",
    content: mainReference,
  },
  {
    slug: "react-state-update-patterns",
    title: "React State Update Patterns",
    description: "Common useState update patterns for values, arrays, objects, forms, and nested state.",
    category: "React + TypeScript",
    content: reactStateUpdates,
  },
  {
    slug: "redux-store-slice",
    title: "Redux Store And Slice",
    description: "Basic typed Redux Toolkit store and reducer slice setup.",
    category: "Redux Toolkit",
    content: reducerSlice,
  },
  {
    slug: "redux-async-thunk-slice",
    title: "Redux Async Thunk Slice",
    description: "Typed createAsyncThunk example with extraReducers.",
    category: "Redux Toolkit",
    content: asyncThunkSlice,
  },
  {
    slug: "mui-colors",
    title: "Material UI Colors",
    description: "Useful MUI palette tokens sorted by practical frequency.",
    category: "Material UI",
    content: muiColors,
  },
  {
    slug: "databricks-etl-medallion",
    title: "Databricks ETL Medallion Pipeline",
    description: "A simplified, interview-focused Bronze, Silver, and Gold Delta Lake pipeline.",
    category: "Databricks",
    content: databricksMedallion,
  },
  {
    slug: "react-testing",
    title: "React Testing Example",
    description: "Basic React Testing Library example with Vitest mocks.",
    category: "Testing",
    content: testing,
  },
  {
    slug: "react-testing-redux",
    title: "React Testing With Redux",
    description: "Testing Library example with a Redux Provider and app store.",
    category: "Testing",
    content: testingReducer,
  },
];
