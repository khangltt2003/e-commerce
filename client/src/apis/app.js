import axios from "../axios";

export const getProductCategories = () =>
  axios({
    url: `/productCategory/`,
    method: "get",
  });
