import { Banner, Sidebar, BestSeller } from "../../components";

const Home = () => {
  return (
    <>
      <div className="flex w-main gap-5 h-[2000px]">
        <div className="flex flex-col gap-5 w-[25%] border">
          <Sidebar />
        </div>
        <div className="flex flex-col gap-5 w-[75%] border">
          <Banner />
          <BestSeller />
        </div>
      </div>
    </>
  );
};

export default Home;
