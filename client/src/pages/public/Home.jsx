import { Banner, Sidebar, BestSeller, DailyDeal, FeaturedProducts } from "../../components";

const Home = () => {
  return (
    <>
      <div className="flex flex-col w-main gap-5 h-[2000px]">
        <div className="flex gap-5  w-main">
          <Sidebar />
          <Banner />
        </div>
        <div className="flex gap-5 w-main ">
          <DailyDeal />
          <BestSeller />
        </div>
        <FeaturedProducts />
      </div>
    </>
  );
};

export default Home;
