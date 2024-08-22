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
