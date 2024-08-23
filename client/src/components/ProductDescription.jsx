import { useState } from "react";
import { formatMoney } from "../utils/helper";

const ProductDescription = ({ title, price, description, variants }) => {
  const [quantity, setQuantity] = useState(1);

  const decrement = () => {
    if (quantity == 1) return;
    setQuantity(quantity - 1);
  };

  const increment = () => {
    if (quantity == 99) return;
    setQuantity(quantity + 1);
  };
  return (
    <div className="flex flex-col gap-4 w-[30%]">
      <div className="font-bold text-2xl">
        <p>{title}</p>
      </div>
      <div className="font-semibold text-2xl">
        <p>${formatMoney(price)}</p>
      </div>
      <div>
        <ul>
          {description.map((el) => {
            return (
              <li className="description-item" key={crypto.randomUUID()}>
                {el}
              </li>
            );
          })}
        </ul>
      </div>

      {variants.map((el, index) => {
        return (
          <div className="flex w-full" key={index}>
            <div className="w-[25%] flex items-center font-medium">
              <span>{el.label}</span>
            </div>
            <div className="flex gap-2 flex-wrap w-[75%]">
              {el.options.map((option, i) => {
                return (
                  <div className="border px-3 py-2" key={i}>
                    {option}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="flex w-full">
        <div className="w-[25%] flex items-center font-medium">
          <span>Quantity</span>
        </div>
        <div className="flex gap-2 flex-wrap w-[75%]">
          <div className="border w-[30px]  py-2 flex justify-center items-center" onClick={() => decrement()}>
            <i className="bx bx-minus"></i>
          </div>
          <div className="border w-[50px]  py-2 flex justify-center items-center">
            <p>{quantity}</p>
          </div>
          <div className="border w-[30px]  py-2 flex justify-center items-center" onClick={() => increment()}>
            <i className="bx bx-plus"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
