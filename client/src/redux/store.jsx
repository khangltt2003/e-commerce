import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./slice";
export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
  },
});
