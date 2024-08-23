import { useState } from "react";
const ProductImageSlide = ({ images }) => {
  const [isActive, setIsActive] = useState(0);

  const prev = () => {
    if (isActive == 0) setIsActive(images.length - 1);
    else {
      setIsActive(isActive - 1);
    }
  };

  const next = () => {
    if (isActive == images.length - 1) setIsActive(0);
    else {
      setIsActive(isActive + 1);
    }
  };

  return (
    <div className="flex flex-col w-[50%] justify-center items-center gap-5">
      <div className="flex items-center justify-center  object-contain relative w-full ">
        <img className="h-[400px]" src={images[isActive]} alt="" />
        <div
          className="absolute h-[30%] top-[35%]  text-[90px] left-[0px] text-main bg-slate-50 opacity-50 hover:opacity-100 ease-in-out"
          onClick={() => prev()}
        >
          <i className="bx bx-chevron-left"></i>
        </div>
        <div
          className="absolute h-[30%] top-[35%] text-[90px] right-[0px] text-main bg-slate-50 opacity-50 hover:opacity-100 ease-in-out"
          onClick={() => next()}
        >
          <i className="bx bx-chevron-right"></i>
        </div>
      </div>
      <div className="flex justify-center gap-5">
        {images.map((el, index) => {
          return (
            <div
              className={`flex items-center justify-center  object-contain ${isActive == index && "border-main border-2"}`}
              key={index}
              onClick={() => setIsActive(index)}
            >
              <img className="h-[100px]" src={el} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImageSlide;
