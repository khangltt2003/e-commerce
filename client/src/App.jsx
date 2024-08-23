import { Route, Routes } from "react-router-dom";
import { Home, Public, Login, ProductDetail } from "./pages/public";
import path from "./utils/path.js";
import { getCategories } from "./redux/asyncAction.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function App() {
  //get categories
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return (
    <div className="min-h-screen font-main">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.PRODUCT_DETAIL} element={<ProductDetail />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
