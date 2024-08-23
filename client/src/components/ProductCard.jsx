import { useState } from "react";
import { formatMoney } from "../utils/helper";
import SelectionOption from "./SelectionOption";
import { NavLink } from "react-router-dom";
const ProductCard = ({ product }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div className="border-2 p-3 mx-2" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
      <NavLink className=" mb-2 font-medium  hover:text-main" to={`/product/${product._id}`}>
        <div className="mb-3 border-b-2 p-3 relative">
          <img className="h-full object-contain" src={product.thumb} alt="" />
          {isHover && <SelectionOption />}
        </div>
      </NavLink>

      <NavLink className=" mb-2 font-medium  hover:text-main" to={`/product/${product._id}`}>
        <span className="line-clamp-1">{product.title}</span>
      </NavLink>
      <div className="text-[15px]">
        <span>${formatMoney(product.price)}</span>
      </div>
    </div>
  );
};

export default ProductCard;
