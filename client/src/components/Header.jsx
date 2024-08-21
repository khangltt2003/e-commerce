import logo from "../assets/logo.png";
import path from "../utils/path";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <div className="w-main h-[100px] py-[10px] flex justify-between items-center">
      <Link to={`/${path.HOME}`}>
        <img className="w-[200px] object-contain" src={logo} alt="" />
      </Link>
      <div className="flex h-full">
        <div className="flex-col items-center justify-center p-4 border-r border-slate-300 ">
          <div className="flex items-center justify-center font-semibold">
            <i className="bx bx-phone pr-2 text-main text-xl" />
            (+123) 456 7890
          </div>
          <div className="font-light">Mon-Sat 9:00AM - 8:00PM</div>
        </div>

        <div className="flex-col items-center  justify-center p-4 border-r border-slate-300 ">
          <div className="flex items-center font-semibold ">
            <i className="bx bx-envelope  pr-2 text-main text-xl"></i>
            support@hitech.com
          </div>
          <div className="font-light flex justify-center">Online Support 24/7</div>
        </div>

        <div className="flex justify-center items-center p-8 h-full border-r border-slate-300 text-3xl text-main">
          <i className="bx bx-cart"></i>
        </div>

        <div className="flex justify-center items-center p-8 h-full text-3xl text-main">
          <i className="bx bx-user"></i>
        </div>
      </div>
    </div>
  );
};

export default Header;
