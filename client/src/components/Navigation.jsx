import { navigation } from "../utils/constants";
import { NavLink } from "react-router-dom";
const Navigation = () => {
  return (
    <div className="w-main border-y h-[50px]  flex items-center  text-base">
      {navigation.map((el) => {
        return (
          <div className="flex items-center justify-center h-full px-5  hover:text-white hover:bg-main" key={el.id}>
            <NavLink to={el.path} key={el.id}>
              {el.value}
              <i className="bx bxs-down-arrow text-xs text-thin ml-[5px]"></i>
            </NavLink>
          </div>
        );
      })}
    </div>
  );
};

export default Navigation;
