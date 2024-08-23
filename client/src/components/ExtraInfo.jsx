const tags = [
  {
    id: 0,
    logo: "bx bx-shield-quarter",
    title: "Guarantee",
    info: "Quality Checked",
  },
  {
    id: 1,
    logo: "bx bxs-truck",
    title: "Free Shipping",
    info: "Free On All Products",
  },
  {
    id: 2,
    logo: "bx bxs-gift",
    title: "Special Gift Cards",
    info: "Gifts, Coupons, etc",
  },
  {
    id: 3,
    logo: "bx bxs-share",
    title: "Free Return",
    info: "Within 7 Days",
  },
  {
    id: 4,
    logo: "bx bxs-phone-call",
    title: "Consultancy",
    info: "Lifetime 24/7/356",
  },
];

const ExtraInfo = () => {
  return (
    <div className="w-[20%] flex flex-col gap-2">
      {tags.map((el) => {
        return (
          <div className="border px-2 py-2 flex gap-2" key={el.id}>
            <div className="flex justify-center items-center rounded-full p-3 text-[25px] text-white bg-cyan-900">
              <i className={el.logo}></i>
            </div>
            <div>
              <p className="text-base font-semibold">{el.title}</p>
              <p className="text-sm font-light">{el.info}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExtraInfo;
