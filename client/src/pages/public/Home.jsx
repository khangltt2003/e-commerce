import { Banner, Sidebar } from "../../components";

const Home = () => {
  return (
    <>
      <div className="flex w-main gap-5">
        <div className="flex flex-col gap-5 w-[25%] border">
          <Sidebar />
        </div>
        <div className="flex flex-col gap-5 w-[75%] border">
          <Banner />
          best seller
        </div>
      </div>
    </>
  );
};

export default Home;
