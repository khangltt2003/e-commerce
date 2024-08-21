import { useEffect, useState } from "react";
import { getProductCategories } from "../apis/app";
import { slugify } from "../utils/helper.js";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await getProductCategories();
    if (res.success) {
      setCategories(res.response);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  // console.log(categories);
  return (
    <div className="flex flex-col border">
      <p className="py-3 px-4 bg-main text-white">All Collections</p>
      {categories.map((el) => {
        return (
          <NavLink className={"py-3 px-4 text-[#1C1D1D] hover:text-main hover:border"} key={el._id} to={slugify(el.title)}>
            {el.title}
          </NavLink>
        );
      })}
    </div>
  );
};

export default Sidebar;
