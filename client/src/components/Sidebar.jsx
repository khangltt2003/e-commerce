import { slugify } from "../utils/helper.js";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
const Sidebar = () => {
  const { categories } = useSelector((state) => state.categories);
  // console.log(categories);
  return (
    <div className="flex flex-col border w-[25%] h-[433px]">
      <p className="py-3 px-4 bg-main text-white">All Collections</p>
      {categories.map((el) => {
        return (
          <NavLink className={"py-3 px-4 text-[#1C1D1D] hover:text-main hover:border"} key={el._id} to={`/category/${slugify(el.title)}`}>
            {el.title}
          </NavLink>
        );
      })}
    </div>
  );
};

export default Sidebar;
