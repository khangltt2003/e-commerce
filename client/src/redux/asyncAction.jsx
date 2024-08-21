import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../apis";

export const getCategories = createAsyncThunk("categories/get", async (data, { rejectWithValue }) => {
  const response = await apis.getProductCategories();
  if (!response.success) rejectWithValue(response);
  return response.response;
});
