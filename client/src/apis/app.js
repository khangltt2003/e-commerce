import axios from "../axios";

export const getProductCategories = () =>
  axios({
    url: `/productCategory/`,
    method: "get",
  });

export const getProducts = (params) =>
  axios({
    url: `/product/`,
    method: "get",
    params,
  });

export const getProductById = (id) =>
  axios({
    url: `/product/${id}`,
    method: "get",
  });
