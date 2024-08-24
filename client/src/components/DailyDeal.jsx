import { useEffect, useState } from "react";
import { getProducts } from "../apis";
import { formatMoney } from "../utils/helper";
import { NavLink } from "react-router-dom";

const DailyDeal = () => {
  const [product, setProduct] = useState(null);

  const fetchProduct = async () => {
    const response = await getProducts({ _id: "66c7b73b32eef5947bb710fb", fields: "title price thumb" });
    setProduct(response.response[0]);
  };
  useEffect(() => {
    fetchProduct();
  }, []);
  if (!product) return <>Loading...</>;
  return (
    <div className="w-[25%] flex flex-col items-center border py-3 gap-2 relative">
      <i className="bx bxs-star absolute top-[12px] left-[12px] text-main text-2xl font-medium"></i>
      <p className="text-main font-medium text-2xl">DAILY DEAL</p>
      <NavLink to={`/product/${product._id}`}>
        <img src={product.thumb} alt="" />
      </NavLink>
      <NavLink to={`/product/${product._id}`} className="font-medium hover:text-main">
        {product.title}
      </NavLink>
      <p>${formatMoney(product.price)}</p>
      <div className="flex gap-1">
        <div className="flex flex-col justify-center items-center p-2 bg-slate-100">
          <p className="font-semibold">0</p>
          <p className="font-light text-sm">Hours</p>
        </div>
        <div className="flex flex-col justify-center items-center p-2 bg-slate-100">
          <p className="font-semibold">0</p>
          <p className="font-light text-sm">Minutes</p>
        </div>
        <div className="flex flex-col justify-center items-center p-2 bg-slate-100">
          <p className="font-semibold">0</p>
          <p className="font-light text-sm">Seconds</p>
        </div>
      </div>
    </div>
  );
};

export default DailyDeal;
