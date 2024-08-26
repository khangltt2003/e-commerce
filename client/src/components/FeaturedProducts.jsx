import { useEffect, useState } from "react";
import { getProducts } from "../apis";
import { NavLink } from "react-router-dom";
import { formatMoney } from "../utils/helper";

const FeaturedProducts = () => {
  const [products, setProducts] = useState(null);
  const fetchProducts = async () => {
    const response = await getProducts({ limit: 9, fields: "title,price,thumb" });
    setProducts(response.response);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  if (!products) return <>Loading...</>;
  return (
    <div>
      <div className="border-b-2 border-main mb-4">
        <p className="font-medium  text-2xl text-main pb-2">Featured Products</p>
      </div>
      <div className="grid grid-cols-3 grid-rows-3 gap-4">
        {products.map((product) => {
          return (
            <NavLink to={`/product/${product._id}`} key={product._id}>
              <div className={`border flex`}>
                <img className=" p-2 mr-4 h-[100px] " src={product.thumb} alt="" />
                <div className="flex flex-col justify-center h-full p-4">
                  <p className=" font-medium hover:text-main">{product.title}</p>
                  <p>${formatMoney(product.price)}</p>
                </div>
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedProducts;
