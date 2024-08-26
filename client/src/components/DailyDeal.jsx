import { useEffect, useState } from "react";
import { getProducts } from "../apis";
import { formatMoney } from "../utils/helper";
import { NavLink } from "react-router-dom";
let intervalId;

const DailyDeal = () => {
  const [product, setProduct] = useState(null);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [dealExpired, setDealExpired] = useState(false);

  const fetchProduct = async () => {
    const response = await getProducts({ page: Math.floor(Math.random() * 20), limit: 1, fields: "title price thumb" });
    if (response.success) {
      setProduct(response.response[0]);
      setHour(2);
      setMinute(2);
      setSecond(2);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    intervalId && clearInterval(intervalId);
    fetchProduct();
  }, [dealExpired]);

  useEffect(() => {
    intervalId = setInterval(() => {
      if (second > 0) {
        setSecond(second - 1);
      } else if (minute > 0) {
        setSecond(2);
        setMinute(minute - 1);
      } else if (hour > 0) {
        setSecond(2);
        setMinute(2);
        setHour(hour - 1);
      } else {
        setDealExpired(!dealExpired);
        clearInterval(intervalId);
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [hour, minute, second]);

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
          <p className="font-semibold">{hour}</p>
          <p className="font-light text-sm">Hours</p>
        </div>
        <div className="flex flex-col justify-center items-center p-2 bg-slate-100">
          <p className="font-semibold">{minute}</p>
          <p className="font-light text-sm">Minutes</p>
        </div>
        <div className="flex flex-col justify-center items-center p-2 bg-slate-100">
          <p className="font-semibold">{second}</p>
          <p className="font-light text-sm">Seconds</p>
        </div>
      </div>
    </div>
  );
};

export default DailyDeal;
