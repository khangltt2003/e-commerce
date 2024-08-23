const SelectionOption = () => {
  return (
    <div>
      <div className=" flex justify-center gap-10 absolute w-[60%] left-[20%] top-[80%]">
        <div
          className="flex items-center justify-center p-2 cursor-pointer shadow-md  rounded-full transition ease-in-out 
                        duration-400 bg-white text-3xl text-main hover:text-white hover:bg-main hover:shadow-main slide-top"
        >
          <i className="bx bx-cart"></i>
        </div>
        <div
          className="flex items-center justify-center p-2 cursor-pointer shadow-md  rounded-full transition ease-in-out 
                        duration-400 bg-white text-3xl text-main hover:text-white hover:bg-main hover:shadow-main slide-top"
        >
          <i className="bx bx-heart"></i>
        </div>
      </div>
    </div>
  );
};

export default SelectionOption;
