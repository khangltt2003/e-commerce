import { useEffect, useState } from "react";
import { getProductCategories } from "../apis/app";

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    const res = await getProductCategories();
    if (res.success) setCategories(res.response);
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  console.log(categories);

  return <div>Sidebar</div>;
};

export default Sidebar;
