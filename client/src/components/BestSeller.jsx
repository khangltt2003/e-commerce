import { useEffect, useState } from "react";
import { getProducts } from "../apis";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
const tabs = [
  { id: 0, value: "Best Seller" },
  { id: 1, value: "New Arrival" },
];

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const BestSeller = () => {
  const [bestSeller, setBestSeller] = useState([]);
  const [newArrival, setNewArrival] = useState([]);
  const [isActive, setIsActive] = useState(0);
  const fetchItems = async () => {
    const response = await Promise.all([
      getProducts({ sort: "-sold", limit: "5", fields: "title,price,thumb" }),
      getProducts({ sort: "-createdAt", limit: "5", fields: "title,price,thumb" }),
    ]);
    if (response[0]?.success) setBestSeller(response[0].response);
    if (response[1]?.success) setNewArrival(response[1].response);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="w-[75%]">
      <div className="flex w-full gap-10 border-b-[3px] pb-2 mb-3 border-main ">
        {tabs.map((el) => {
          return (
            <span
              className={`font-medium cursor-pointer text-2xl ${isActive == el.id ? "text-main" : "text-gray-400"}`}
              key={el.id}
              onClick={() => setIsActive(el.id)}
            >
              {el.value}
            </span>
          );
        })}
      </div>
      <div className="slider-container">
        {isActive == 0 ? (
          <Slider {...settings}>
            {bestSeller.map((el) => {
              return <ProductCard key={el._id} product={el} />;
            })}
          </Slider>
        ) : (
          <Slider {...settings}>
            {newArrival.map((el) => {
              return <ProductCard key={el._id} product={el} />;
            })}
          </Slider>
        )}
      </div>
    </div>
  );
};
export default BestSeller;
