import { navigation } from "../utils/constants";
import { NavLink } from "react-router-dom";
const Navigation = () => {
  return (
    <div className="w-main border h-[50px] py-[8px] flex  items-center  text-base">
      {navigation.map((el) => {
        return (
          <NavLink className="pr-10 hover:text-main" to={el.path} key={el.id}>
            {el.value}
            <i className="bx bxs-down-arrow text-xs text-thin ml-[5px]"></i>
          </NavLink>
        );
      })}
    </div>
  );
};

export default Navigation;
