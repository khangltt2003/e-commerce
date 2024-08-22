import { useEffect, useState } from "react";
import { getProducts } from "../apis";
import Slider from "react-slick";
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
    const response = await Promise.all([getProducts({ sort: "-sold", limit: "5" }), getProducts({ sort: "-createdAt", limit: "5" })]);
    if (response[0]?.success) setBestSeller(response[0].response);
    if (response[1]?.success) setNewArrival(response[1].response);
  };

  useEffect(() => {
    fetchItems();
  }, []);
  console.log(bestSeller);
  console.log(newArrival);

  return (
    <div className="border">
      <div className="flex w-full gap-10 border-b-[3px] pb-2 border-main ">
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
        <Slider {...settings}>
          {bestSeller.map((el) => {
            return (
              <div className="" key={el._id}>
                <img src={el.imgURL} alt="" />
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};
export default BestSeller;
